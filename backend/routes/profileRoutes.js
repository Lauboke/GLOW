const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Giveaway = require("../models/Giveaway");
const Booking = require("../models/Booking");
const Contact = require("../models/Contact");
const { verifyToken } = require("../middleware/authMiddleware");


// GET: /api/profile/dashboard
// This fetches EVERYTHING a user needs for their dashboard in one single request.
router.get("/dashboard", verifyToken, async (req, res) => {
  try {
    // 1. Get the user (verifyToken should put the user ID in req.user.id)
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2. Get their Bookings (Split into upcoming and past)
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Ensures today's appointments stay in "Upcoming"

    // FIX: Look for bookings by BOTH userId or Email to ensure we find them
    const allBookings = await Booking.find({
      $or: [{ userId: req.user.id }, { email: user.email }],
    }).sort({ date: 1 });

    const upcomingBookings = allBookings.filter(
      (b) => b.completed !== true && new Date(b.date) >= now,
    );

    const pastBookings = allBookings
      .filter((b) => b.completed === true || new Date(b.date) < now)
      .reverse();

    // 3. UPDATED: Get their Messages (Matches by ID or Email for maximum accuracy)
    const messages = await Contact.find({
      $or: [{ userId: req.user.id }, { email: user.email }],
    }).sort({ createdAt: -1 });

    // 4. Send the ultimate dashboard package to the frontend
    res.json({
      profile: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        savedLooks: user.savedLooks,
        giveaways: user.giveaways,
        memberSince: user.createdAt,
      },
      upcomingBookings,
      pastBookings,
      messages,
    });
  } catch (error) {
    console.error("Dashboard Fetch Error:", error);
    res.status(500).json({ message: "Failed to load dashboard data" });
  }
});

// PATCH: /api/profile/read-messages
// Marks all messages as read so the badge disappears permanently
router.patch("/read-messages", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    // Finds all messages for this user and sets 'read' to true
    await Contact.updateMany(
      { email: user.email, read: false },
      { $set: { read: true } },
    );
    res.status(200).json({ message: "Messages marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Error updating message status" });
  }
});

router.post("/save-look", verifyToken, async (req, res) => {
  try {
    const { title, imageUrl, serviceCategory } = req.body;

    if (!title || !imageUrl) {
      return res.status(400).json({ message: "Missing look data" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const alreadySaved = user.savedLooks.some(
      (look) => look.imageUrl === imageUrl,
    );

    if (alreadySaved) {
      return res.status(400).json({ message: "You already saved this look!" });
    }

    user.savedLooks.push({
      title,
      imageUrl,
      serviceCategory: serviceCategory || "General",
    });

    await user.save();

    res.status(201).json({ message: "Look saved successfully!" });
  } catch (error) {
    console.error("Save Look Error:", error);
    res.status(500).json({ message: "Failed to save look" });
  }
});

router.post("/enter-giveaway", verifyToken, async (req, res) => {
  try {
    const { giveawayId } = req.body;

    if (!giveawayId) {
      return res.status(400).json({ message: "Missing giveaway or promo ID." });
    }

    const giveaway = await Giveaway.findById(giveawayId);

    if (!giveaway) {
      return res.status(404).json({ message: "Giveaway or promo not found." });
    }

    const now = new Date();

    if (
      !giveaway.isActive ||
      new Date(giveaway.startDate) > now ||
      new Date(giveaway.endDate) < now
    ) {
      return res.status(400).json({
        message: "This giveaway or promo is no longer active.",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const alreadyEntered = user.giveaways.some(
      (entry) =>
        String(entry.giveawayId) === String(giveaway._id) ||
        entry.giveawayName === giveaway.title,
    );

    if (alreadyEntered) {
      return res.status(400).json({
        message: "You have already claimed or entered this promo.",
      });
    }

    user.giveaways.push({
      giveawayId: giveaway._id,
      giveawayName: giveaway.title,
      type: giveaway.type,
      promoCode: giveaway.promoCode || "",
    });

    giveaway.entriesCount += 1;

    await user.save();
    await giveaway.save();

    res.status(201).json({
      message:
        giveaway.type === "promo"
          ? "Promo claimed successfully!"
          : "Giveaway entry submitted successfully!",
      entry: {
        giveawayId: giveaway._id,
        giveawayName: giveaway.title,
        type: giveaway.type,
        promoCode: giveaway.promoCode || "",
      },
    });
  } catch (error) {
    console.error("Enter Giveaway Error:", error);
    res.status(500).json({ message: "Failed to enter giveaway or promo." });
  }
});

module.exports = router;
