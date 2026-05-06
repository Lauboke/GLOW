require("dotenv").config({ quiet: true });

const { GoogleGenerativeAI } = require("@google/generative-ai");

const cloudinary = require("cloudinary").v2;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const GLOW_GALLERY = [
  {
    url: "https://res.cloudinary.com/drp3nfd83/image/upload/v1773234744/photo_2026-03-11_16-07-17_o0ao1x.jpg",
    tags: ["nails", "square", "light-skin", "classic"],
  },
  {
    url: "https://res.cloudinary.com/drp3nfd83/image/upload/v1773234818/photo_2026-03-11_16-07-15_lwugwz.jpg",
    tags: ["nails", "stiletto", "dark-skin", "baddie"],
  },
  {
    url: "https://res.cloudinary.com/drp3nfd83/image/upload/v1773226406/photo_2026-03-11_13-30-46_keptqb.jpg",
    tags: ["hair", "braids", "protective"],
  },
  {
    url: "https://res.cloudinary.com/drp3nfd83/image/upload/v1773235668/photo_2026-03-11_16-26-25_sm4xrg.jpg",
    tags: ["makeup", "soft-glam", "wedding"],
  },
];

const SYSTEM_PROMPT = `
You are GlowAI, the visual beauty recommendation assistant for Boke Glow Salon.

Your purpose is to reduce decision fatigue.
Do NOT give long explanations.
Do NOT overwhelm the client with too many options.

Your job:
- analyze the user's request and image if provided
- choose the most suitable beauty direction
- recommend only the best 2 to 3 visual ideas
- keep text minimal, elegant, and client-friendly
- prioritize visual recommendations over long written advice

Allowed service categories:
- makeup
- hair
- nails
- lashes

Always return valid JSON in this exact format:
{
  "reply": "A very short client-facing sentence, maximum 2 sentences",
  "analysis": {
    "event": "",
    "vibe": "",
    "skin_tone": "",
    "undertone": "",
    "features": [],
    "focus_areas": []
  },
  "recommendations": {
    "makeup": [],
    "hair": [],
    "nails": [],
    "lashes": []
  },
  "services": [],
  "search_tags": []
}

Rules:
- Keep "reply" short
- Recommend only the strongest options
- "services" must be short bookable service names
- "search_tags" must be highly specific for matching gallery images
- Prefer fewer better matches over many weak matches
`;

const normalizeGalleryTags = (searchTags = [], message = "") => {
  const raw = [...searchTags, message].join(" ").toLowerCase();

  const tags = new Set();

  if (raw.includes("nail")) tags.add("nails");
  if (raw.includes("makeup")) tags.add("makeup");
  if (raw.includes("hair")) tags.add("hair");
  if (raw.includes("lash")) tags.add("lashes");

  if (raw.includes("almond")) tags.add("almond");
  if (raw.includes("stiletto")) tags.add("stiletto");
  if (raw.includes("square")) tags.add("square");
  if (raw.includes("coffin")) tags.add("coffin");

  if (raw.includes("nude")) tags.add("nude");
  if (raw.includes("white")) tags.add("white");
  if (raw.includes("pink")) tags.add("pink");
  if (raw.includes("red")) tags.add("red");
  if (raw.includes("glazed")) tags.add("glazed");
  if (raw.includes("french")) tags.add("french");
  if (raw.includes("minimal")) tags.add("minimalist");
  if (raw.includes("soft glam")) tags.add("soft-glam");
  if (raw.includes("full glam")) tags.add("full-glam");
  if (raw.includes("natural")) tags.add("natural");

  if (raw.includes("wedding")) tags.add("wedding");
  if (raw.includes("graduation")) tags.add("graduation");
  if (raw.includes("birthday")) tags.add("birthday");
  if (raw.includes("bridal")) tags.add("bridal");

  if (
    raw.includes("dark skin") ||
    raw.includes("deep skin") ||
    raw.includes("brown skin")
  ) {
    tags.add("dark-skin");
  }

  if (raw.includes("light skin") || raw.includes("fair skin")) {
    tags.add("light-skin");
  }

  return [...tags];
};

const searchCloudinaryGallery = async (searchTags = []) => {
  try {
    if (!Array.isArray(searchTags) || searchTags.length === 0) return [];

    const normalizedTags = searchTags
      .map((tag) => String(tag).toLowerCase().trim())
      .filter(Boolean);

    const allMatches = [];

    for (const tag of normalizedTags) {
      try {
        const result = await cloudinary.api.resources_by_tag(tag, {
          max_results: 20,
        });

        for (const item of result.resources || []) {
          allMatches.push({
            url: item.secure_url,
            matchedBy: tag,
          });
        }
      } catch (err) {
        // ignore missing tag
      }
    }

    const grouped = {};

    for (const item of allMatches) {
      if (!grouped[item.url]) {
        grouped[item.url] = {
          url: item.url,
          matchedBy: new Set(),
        };
      }
      grouped[item.url].matchedBy.add(item.matchedBy);
    }

    const scoredMatches = Object.values(grouped)
      .map((item) => ({
        url: item.url,
        matchedBy: [...item.matchedBy],
        score: item.matchedBy.size,
      }))
      .sort((a, b) => b.score - a.score);

    console.log("Cloudinary scored matches:", scoredMatches);

    return scoredMatches;
  } catch (error) {
    console.error("Cloudinary gallery search failed:", error.message);
    return [];
  }
};

const searchPexelsImages = async (query) => {
  try {
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=4`;

    const response = await fetch(url, {
      headers: {
        Authorization: process.env.PEXELS_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`Pexels error: ${response.status}`);
    }

    const data = await response.json();

    return (data.photos || [])
      .map((photo) => photo.src?.medium)
      .filter(Boolean);
  } catch (error) {
    console.error("Pexels search failed:", error.message);
    return [];
  }
};

const buildPexelsQuery = (aiData) => {
  const tones = [];
  const vibes = [];
  const focus = [];

  if (aiData?.analysis?.skin_tone) tones.push(aiData.analysis.skin_tone);
  if (aiData?.analysis?.undertone) tones.push(aiData.analysis.undertone);
  if (aiData?.analysis?.vibe) vibes.push(aiData.analysis.vibe);
  if (Array.isArray(aiData?.analysis?.focus_areas)) {
    focus.push(...aiData.analysis.focus_areas);
  }

  if (Array.isArray(aiData?.search_tags) && aiData.search_tags.length > 0) {
    return aiData.search_tags.join(" ");
  }

  return [...tones, ...vibes, ...focus, "beauty look"]
    .filter(Boolean)
    .join(" ");
};

const generateWithRetry = async (model, promptArr, maxAttempts = 3) => {
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const result = await model.generateContent(promptArr);
      return result;
    } catch (error) {
      lastError = error;

      const message = String(error?.message || "");
      const isRetryable =
        message.includes("503") ||
        message.toLowerCase().includes("service unavailable") ||
        message.toLowerCase().includes("high demand");

      if (!isRetryable || attempt === maxAttempts) {
        throw error;
      }

      const delay = attempt * 1500;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
};

const buildFallbackAIData = (message = "") => {
  const text = String(message || "").toLowerCase();

  const search_tags = [];
  const services = [];
  const analysis = {
    event: "",
    vibe: "",
    skin_tone: "",
    undertone: "",
    features: [],
    focus_areas: [],
  };

  if (text.includes("nail")) {
    search_tags.push("nails");
    analysis.focus_areas.push("nails");
  }
  if (text.includes("makeup")) {
    search_tags.push("makeup");
    analysis.focus_areas.push("makeup");
  }
  if (text.includes("hair")) {
    search_tags.push("hair");
    analysis.focus_areas.push("hair");
  }
  if (text.includes("lash")) {
    search_tags.push("lashes");
    analysis.focus_areas.push("lashes");
  }

  if (text.includes("almond")) search_tags.push("almond");
  if (text.includes("stiletto")) search_tags.push("stiletto");
  if (text.includes("square")) search_tags.push("square");
  if (text.includes("coffin")) search_tags.push("coffin");

  if (text.includes("nude")) search_tags.push("nude");
  if (text.includes("white")) search_tags.push("white");
  if (text.includes("pink")) search_tags.push("pink");
  if (text.includes("red")) search_tags.push("red");

  if (text.includes("soft glam")) search_tags.push("soft-glam");
  if (text.includes("full glam")) search_tags.push("full-glam");
  if (text.includes("natural")) search_tags.push("natural");

  if (text.includes("braids")) search_tags.push("braids");
  if (text.includes("boho")) search_tags.push("boho-braids");
  if (text.includes("curls")) search_tags.push("curls");
  if (text.includes("sleek")) search_tags.push("sleek");

  if (text.includes("wedding")) {
    search_tags.push("wedding");
    analysis.event = "wedding";
  }
  if (text.includes("graduation")) {
    search_tags.push("graduation");
    analysis.event = "graduation";
  }
  if (text.includes("birthday")) {
    search_tags.push("birthday");
    analysis.event = "birthday";
  }
  if (text.includes("bridal")) {
    search_tags.push("bridal");
    analysis.event = "bridal";
  }

  if (
    text.includes("dark skin") ||
    text.includes("deep skin") ||
    text.includes("brown skin")
  ) {
    search_tags.push("dark-skin");
    analysis.skin_tone = "dark-skin";
  }

  if (text.includes("light skin") || text.includes("fair skin")) {
    search_tags.push("light-skin");
    analysis.skin_tone = "light-skin";
  }

  let reply = "Here are some beauty ideas tailored for you. ✨";

  if (search_tags.includes("nails") && search_tags.includes("almond")) {
    reply = "Here are some almond nail ideas tailored for you.";
  } else if (search_tags.includes("nails") && search_tags.includes("stiletto")) {
    reply = "Here are some stiletto nail ideas tailored for you.";
  } else if (search_tags.includes("makeup") && search_tags.includes("soft-glam")) {
    reply = "Here are some soft glam makeup ideas tailored for you.";
  } else if (search_tags.includes("hair")) {
    reply = "Here are some hairstyle ideas tailored for you.";
  }

  if (search_tags.includes("nails")) services.push("Luxury Nail Set");
  if (search_tags.includes("makeup")) services.push("Signature Makeup");
  if (search_tags.includes("hair")) services.push("Hair Styling");
  if (search_tags.includes("lashes")) services.push("Lash Set");

  return {
    reply,
    analysis,
    recommendations: {
      makeup: [],
      hair: [],
      nails: [],
      lashes: [],
    },
    services,
    search_tags: [...new Set(search_tags)],
  };
};

const chatWithGlowAI = async (req, res) => {
  try {
    const { message, imageUrl } = req.body;

    // Use the fast, multimodal Gemini 1.5 Flash model
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" }, // Forces JSON output
    });

    let promptArr = [
      SYSTEM_PROMPT,
      message || "What beauty service do you recommend for me?",
    ];

    // This grabs the Cloudinary image and turns it into pixels Gemini can see
    if (imageUrl) {
      const imageResp = await fetch(imageUrl);
      const imageBuffer = await imageResp.arrayBuffer();
      const base64Image = Buffer.from(imageBuffer).toString("base64");

      promptArr.push({
        inlineData: {
          data: base64Image,
          mimeType: imageResp.headers.get("content-type") || "image/jpeg",
        },
      });
      promptArr.push(
        "Please analyze this image and recommend a style based on my features.",
      );
    }

    // Call Gemini
    let aiData;

try {
  const result = await generateWithRetry(model, promptArr);
  const rawText = result.response.text();

  try {
    aiData = JSON.parse(rawText);
  } catch (parseError) {
    console.error("Gemini raw response was not valid JSON:", rawText);
    aiData = buildFallbackAIData(message);
  }
} catch (geminiError) {
  const msg = String(geminiError?.message || "");
  const isQuotaOrRetryError =
    msg.includes("429") ||
    msg.toLowerCase().includes("quota") ||
    msg.toLowerCase().includes("too many requests") ||
    msg.includes("503") ||
    msg.toLowerCase().includes("service unavailable");

  if (isQuotaOrRetryError) {
    console.warn("Gemini unavailable. Using fallback recommender.");
    aiData = buildFallbackAIData(message);
  } else {
    throw geminiError;
  }
}

    const matchedImages = [];

    // 1. get only 1 image from your gallery
    let galleryImage = null;

    if (aiData.search_tags && aiData.search_tags.length > 0) {
      const galleryTags = normalizeGalleryTags(aiData.search_tags, message);
console.log("Normalized gallery tags:", galleryTags);

const cloudinaryMatches = await searchCloudinaryGallery(galleryTags);

      console.log("Cloudinary matches:", cloudinaryMatches);

      const lowerMessage = String(message || "").toLowerCase();

let filteredCloudinaryMatches = cloudinaryMatches;

if (lowerMessage.includes("almond")) {
  filteredCloudinaryMatches = cloudinaryMatches.filter((item) =>
    (item.matchedBy || []).includes("almond")
  );
}

if (lowerMessage.includes("stiletto")) {
  filteredCloudinaryMatches = cloudinaryMatches.filter((item) =>
    (item.matchedBy || []).includes("stiletto")
  );
}

if (lowerMessage.includes("square")) {
  filteredCloudinaryMatches = cloudinaryMatches.filter((item) =>
    (item.matchedBy || []).includes("square")
  );
}

      if (filteredCloudinaryMatches.length > 0) {
        const randomIndex = Math.floor(
          Math.random() * Math.min(filteredCloudinaryMatches.length, 3),
        );
        galleryImage = filteredCloudinaryMatches[randomIndex].url;
      }
    }

    if (galleryImage) {
      matchedImages.push(galleryImage);
    }

    // 2. get only 1 image from Pexels
    const pexelsQuery = buildPexelsQuery(aiData);
    const pexelsImages = await searchPexelsImages(pexelsQuery);

    const pexelsImage = pexelsImages.find(
      (url) => !matchedImages.includes(url),
    );
    if (pexelsImage) {
      matchedImages.push(pexelsImage);
    }

    console.log("AI search tags:", aiData.search_tags);
    console.log("Matched images being returned:", matchedImages);

    return res.status(200).json({
      reply:
        aiData.reply ||
        aiData.advice ||
        "Here are my recommendations for you. ✨",
      analysis: aiData.analysis || null,
      recommendations: aiData.recommendations || {
        makeup: [],
        hair: [],
        nails: [],
        lashes: [],
      },
      services: aiData.services || [],
      images: matchedImages,
      generatedImage: matchedImages[0] || null,
      text:
        aiData.reply ||
        aiData.advice ||
        "Here are my recommendations for you. ✨",
    });
  } catch (error) {
    console.error("--- AI BACKEND ERROR ---");
    console.error(error);
    console.error("-------------------------");

    res.status(500).json({
      text: error.message || "AI error",
    });
  }
};

module.exports = { chatWithGlowAI };
