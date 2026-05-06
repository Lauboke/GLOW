import React, { useState } from "react";
import toast from "react-hot-toast";
import GlowCameraModal from "./GlowCameraModal";

const GlowAI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Welcome to Glow AI! Tell me what event you are attending, upload a photo for analysis, or ask me to generate a full look for you!",
    },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pendingImage, setPendingImage] = useState(null);

  const API_BASE =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

  const CLOUD_NAME = "drp3nfd83";
  const UPLOAD_PRESET = "glow_ai_uploads";
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const [previewImage, setPreviewImage] = useState(null);

  const handleTextSearch = async () => {
    if (!inputVal.trim() && !pendingImage) return;

    const userText = inputVal;
    const imageUrl = pendingImage;

    setMessages((prev) => [
      ...prev,
      { role: "user", text: userText, image: imageUrl },
    ]);

    setInputVal("");
    setPendingImage(null);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText, imageUrl: imageUrl }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text:
            data.reply ||
            data.text ||
            "Here are my recommendations for you. ✨",
          images: data.images || [],
          analysis: data.analysis || null,
          recommendations: data.recommendations || null,
          services: data.services || [],
          image: null,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Glow AI is taking a quick break. Try again soon! ✨",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCameraCapture = async (imageDataUrl) => {
    setIsLoading(true);

    try {
      const blob = await fetch(imageDataUrl).then((r) => r.blob());

      const formData = new FormData();
      formData.append("file", blob, "camera-capture.jpg");
      formData.append("upload_preset", UPLOAD_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await res.json();
      setPendingImage(data.secure_url);
      toast.success("Photo captured successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to capture and upload image.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );
      const data = await res.json();
      setPendingImage(data.secure_url);
    } catch (error) {
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

const buildRecommendedLook = (imgUrl, idx) => ({
  id: `AI-LOOK-${idx + 1}`,
  title: `Glow AI Recommendation ${idx + 1}`,
  category: "AI Recommendation",
  price: "500",
  url: imgUrl,
});

const handleBookRecommendation = (imgUrl, idx) => {
  const look = buildRecommendedLook(imgUrl, idx);

  localStorage.setItem("selectedLookID", look.id);
  localStorage.setItem("selectedLookTitle", look.title);
  localStorage.setItem("selectedLookPrice", look.price);
  localStorage.setItem("selectedCategory", look.category);
  localStorage.setItem("selectedLookImage", look.url);

  window.location.href = "/booking";
};

const handleSaveRecommendation = async (imgUrl, idx) => {
  const token = localStorage.getItem("userToken");

  if (!token) {
    toast.error("Please sign in to save this look.");
    window.location.href = "/login";
    return;
  }

  const look = buildRecommendedLook(imgUrl, idx);

  try {
    const res = await fetch(`${API_BASE}/profile/save-look`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: look.title,
        imageUrl: look.url,
        serviceCategory: look.category,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      toast.success(data.message || "Look saved to your profile.");
    } else {
      toast.error(data.message || "Could not save this look.");
    }
  } catch (error) {
    toast.error("Server error. Could not save this look.");
  }
};

  return (
    <>
      {!isOpen && (
        <div className="fixed bottom-24 right-10 z-[100] bg-white text-black px-4 py-2 rounded-2xl rounded-br-none shadow-2xl border border-gray-100 animate-bounce">
          <p className="text-[10px] font-black uppercase tracking-tight">
            Need a recommendation?
          </p>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-[100] flex items-center bg-black hover:bg-neutral-900 text-white pl-2 pr-6 py-2 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-500 hover:scale-105 group border border-white/10"
      >
        <div className="relative flex items-center justify-center w-12 h-12 bg-white rounded-full mr-3 overflow-hidden border-2 border-pink-500 shadow-sm group-hover:rotate-6 transition-transform">
          <img
            src="https://res.cloudinary.com/drp3nfd83/image/upload/v1773242302/Untitled_design-removebg-preview_lp3u5h.png"
            alt="Boke Glow Logo"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex flex-col items-start text-left">
          <span className="text-[9px] font-black uppercase tracking-[0.3em] leading-none text-pink-500">
            AI Consultant
          </span>
          <span className="text-[11px] font-bold uppercase tracking-widest mt-1 text-white/90">
            Ask GlowAI
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="fixed bottom-24 left-4 right-4 z-[100] h-[min(78vh,680px)] bg-white/95 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white/20 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-500 sm:left-auto sm:right-8 sm:w-[620px]">
          <div className="bg-black p-6 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img
                src="https://res.cloudinary.com/drp3nfd83/image/upload/v1773242302/Untitled_design-removebg-preview_lp3u5h.png"
                className="w-8 h-8 bg-white rounded-full p-1"
                alt="Logo"
              />
              <span className="font-black italic uppercase tracking-tighter text-lg">
                Glow AI
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white text-xl p-2"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
              >
                {msg.image && (
                  <img
                    src={msg.image}
                    className="rounded-xl mb-2 w-[60%] object-cover shadow-sm border border-gray-200"
                    alt="user upload"
                  />
                )}

                <div
                  className={`max-w-[85%] p-4 rounded-3xl text-xs font-medium leading-relaxed shadow-sm whitespace-pre-wrap ${msg.role === "user" ? "bg-pink-500 text-white rounded-tr-none" : "bg-gray-100 text-black rounded-tl-none"}`}
                >
                  {msg.text}
                </div>

                {/* {msg.analysis && (
                  <div className="mt-2 w-[85%] bg-white border border-pink-100 rounded-2xl p-4 shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-widest text-pink-500 mb-2">
                      Analysis
                    </p>
                    <div className="space-y-1 text-[11px] text-gray-600">
                      {msg.analysis.event && (
                        <p>
                          <span className="font-bold">Event:</span>{" "}
                          {msg.analysis.event}
                        </p>
                      )}
                      {msg.analysis.vibe && (
                        <p>
                          <span className="font-bold">Vibe:</span>{" "}
                          {msg.analysis.vibe}
                        </p>
                      )}
                      {msg.analysis.skin_tone && (
                        <p>
                          <span className="font-bold">Skin tone:</span>{" "}
                          {msg.analysis.skin_tone}
                        </p>
                      )}
                      {msg.analysis.undertone && (
                        <p>
                          <span className="font-bold">Undertone:</span>{" "}
                          {msg.analysis.undertone}
                        </p>
                      )}
                      {msg.analysis.features?.length > 0 && (
                        <p>
                          <span className="font-bold">Features:</span>{" "}
                          {msg.analysis.features.join(", ")}
                        </p>
                      )}
                      {msg.analysis.focus_areas?.length > 0 && (
                        <p>
                          <span className="font-bold">Focus:</span>{" "}
                          {msg.analysis.focus_areas.join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                )} */}

                {/* {msg.recommendations && (
                  <div className="mt-2 w-[85%] bg-white border border-pink-100 rounded-2xl p-4 shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-widest text-pink-500 mb-3">
                      Recommended Looks
                    </p>

                    <div className="space-y-3 text-[11px] text-gray-700">
                      {["makeup", "hair", "nails", "lashes"].map((category) =>
                        msg.recommendations?.[category]?.length > 0 ? (
                          <div key={category}>
                            <p className="font-black uppercase text-[10px] text-gray-400 mb-1">
                              {category}
                            </p>
                            {msg.recommendations[category].map((item, idx) => (
                              <div key={idx} className="mb-2">
                                <p className="font-bold">{item.title}</p>
                                <p className="text-gray-500">{item.reason}</p>
                              </div>
                            ))}
                          </div>
                        ) : null,
                      )}
                    </div>
                  </div>
                )} */}

                {/* {msg.services && msg.services.length > 0 && (
                  <div className="mt-2 w-[85%] bg-black text-white rounded-2xl p-4 shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-widest text-pink-400 mb-2">
                      Recommended Services
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {msg.services.map((service, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-full bg-white/10 text-[10px] font-black uppercase tracking-widest"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                )} */}

                {msg.images && msg.images.length > 0 && (
  <div className="mt-3 w-[95%]">
    <p className="mb-3 text-[10px] font-black uppercase tracking-[0.25em] text-pink-500">
      Recommended Looks
    </p>

    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {msg.images.map((imgUrl, idx) => (
        <div
          key={idx}
          className="w-[150px] flex-shrink-0 rounded-2xl border border-pink-100 bg-white p-2 shadow-sm"
        >
          <img
            src={imgUrl}
            className="h-24 w-full object-cover rounded-xl border border-gray-100"
            alt={`AI Recommendation ${idx + 1}`}
          />

          <div className="mt-2 space-y-2">
            <button
              type="button"
              onClick={() => setPreviewImage(imgUrl)}
              className="w-full rounded-full bg-gray-100 px-3 py-2 text-[8px] font-black uppercase tracking-widest text-gray-700 transition hover:bg-gray-200"
            >
              View
            </button>

            <button
              type="button"
              onClick={() => handleBookRecommendation(imgUrl, idx)}
              className="w-full rounded-full bg-black px-3 py-2 text-[8px] font-black uppercase tracking-widest text-white transition hover:bg-pink-500"
            >
              Book This
            </button>

            <button
              type="button"
              onClick={() => handleSaveRecommendation(imgUrl, idx)}
              className="w-full rounded-full border border-pink-200 bg-pink-50 px-3 py-2 text-[8px] font-black uppercase tracking-widest text-pink-600 transition hover:bg-pink-500 hover:text-white"
            >
              Save This
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
)}
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-500 p-4 rounded-3xl rounded-tl-none text-xs font-bold animate-pulse">
                  Analyzing your glow... ✨
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-100 bg-white flex flex-col gap-3">
            {pendingImage && (
              <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-pink-500">
                <img
                  src={pendingImage}
                  alt="pending"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setPendingImage(null)}
                  className="absolute top-0 right-0 bg-black/50 text-white text-[8px] p-1 rounded-bl-lg"
                >
                  ✕
                </button>
              </div>
            )}

            <div className="relative flex items-center group">
              <input
                type="text"
                placeholder="Ask about a style..."
                className="w-full bg-gray-100 border-none px-6 py-4 pr-14 rounded-full text-[11px] outline-none focus:ring-2 focus:ring-pink-500 transition-all text-black shadow-inner"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleTextSearch()}
                disabled={isLoading}
              />
              <button
                onClick={handleTextSearch}
                disabled={isLoading}
                className="absolute right-2 p-3 bg-black text-white rounded-full hover:bg-pink-500 transition-all shadow-md active:scale-90 disabled:opacity-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="w-3 h-3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                  />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsCameraOpen(true)}
                disabled={isLoading}
                className="cursor-pointer bg-pink-500 text-white text-center py-4 rounded-2xl font-black uppercase text-[9px] tracking-[0.1em] hover:bg-pink-600 transition-all shadow-lg flex flex-col items-center justify-center gap-1 disabled:opacity-50"
              >
                <span>📸 Camera</span>
              </button>
              <label className="cursor-pointer bg-black text-white text-center py-4 rounded-2xl font-black uppercase text-[9px] tracking-[0.1em] hover:bg-neutral-800 transition-all shadow-lg flex flex-col items-center justify-center gap-1">
                <span>📁 Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={isLoading}
                />
              </label>
            </div>
          </div>
        </div>
      )}

{previewImage && (
  <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/80 px-4">
    <div className="relative w-full max-w-3xl overflow-hidden rounded-[2rem] bg-white shadow-2xl">
      <button
        type="button"
        onClick={() => setPreviewImage(null)}
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-pink-500"
      >
        ✕
      </button>

      <img
        src={previewImage}
        alt="AI recommendation preview"
        className="max-h-[80vh] w-full object-contain bg-black"
      />
    </div>
  </div>
)}

      <GlowCameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
      />
    </>
  );
};

export default GlowAI;
