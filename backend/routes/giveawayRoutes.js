const express = require("express");
const router = express.Router();

const Giveaway = require("../models/Giveaway");

const User = require("../models/User");

// GET active giveaways/promos for clients
router.get("/", async (req, res) => {
  try {
    const now = new Date();

    const giveaways = await Giveaway.find({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: giveaways,
    });
  } catch (error) {
    console.error("Get Giveaways Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load giveaways and promos.",
    });
  }
});

// GET all giveaways/promos for admin
router.get("/admin", async (req, res) => {
  try {
    const giveaways = await Giveaway.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: giveaways,
    });
  } catch (error) {
    console.error("Get Admin Giveaways Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load admin giveaways.",
    });
  }
});

// CREATE giveaway/promo
router.post("/admin", async (req, res) => {
  try {
    const giveaway = await Giveaway.create(req.body);

    res.status(201).json({
      success: true,
      message: "Giveaway or promo created successfully.",
      data: giveaway,
    });
  } catch (error) {
    console.error("Create Giveaway Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create giveaway or promo.",
      error: error.message,
    });
  }
});

// GET users who claimed/entered a specific giveaway or promo
router.get("/admin/:id/entries", async (req, res) => {
  try {
    const giveaway = await Giveaway.findById(req.params.id);

    if (!giveaway) {
      return res.status(404).json({
        success: false,
        message: "Giveaway or promo not found.",
      });
    }

    const users = await User.find({
      $or: [
        { "giveaways.giveawayId": giveaway._id },
        { "giveaways.giveawayName": giveaway.title },
      ],
    }).select("name email phone giveaways");

    const entries = users
      .map((user) => {
        const matchedEntry = user.giveaways.find(
          (entry) =>
            String(entry.giveawayId) === String(giveaway._id) ||
            entry.giveawayName === giveaway.title
        );

        if (!matchedEntry) return null;

        return {
          userId: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          giveawayName: matchedEntry.giveawayName,
          type: matchedEntry.type,
          promoCode: matchedEntry.promoCode,
          enteredAt: matchedEntry.enteredAt,
        };
      })
      .filter(Boolean);

    res.status(200).json({
      success: true,
      giveaway: {
        id: giveaway._id,
        title: giveaway.title,
        type: giveaway.type,
        promoCode: giveaway.promoCode,
        entriesCount: giveaway.entriesCount,
      },
      data: entries,
    });
  } catch (error) {
    console.error("Get Giveaway Entries Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load giveaway entries.",
    });
  }
});

// UPDATE giveaway/promo
router.put("/admin/:id", async (req, res) => {
  try {
    const giveaway = await Giveaway.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!giveaway) {
      return res.status(404).json({
        success: false,
        message: "Giveaway or promo not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Giveaway or promo updated successfully.",
      data: giveaway,
    });
  } catch (error) {
    console.error("Update Giveaway Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update giveaway or promo.",
      error: error.message,
    });
  }
});

// DELETE giveaway/promo
router.delete("/admin/:id", async (req, res) => {
  try {
    const giveaway = await Giveaway.findByIdAndDelete(req.params.id);

    if (!giveaway) {
      return res.status(404).json({
        success: false,
        message: "Giveaway or promo not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Giveaway or promo deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Giveaway Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete giveaway or promo.",
    });
  }
});

module.exports = router;