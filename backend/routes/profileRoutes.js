const express = require("express");
const router = express.Router();
const User = require("../models/User");
// Assuming you have models named Booking and Contact.
// If your Booking model is named differently, update this!
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

module.exports = router;
