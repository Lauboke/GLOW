const express = require("express");
const router = express.Router();

const SiteSettings = require("../models/SiteSettings");

// GET public site settings
router.get("/", async (req, res) => {
  try {
    let settings = await SiteSettings.findOne({ key: "main" });

    if (!settings) {
      settings = await SiteSettings.create({ key: "main" });
    }

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("Get Settings Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load settings.",
    });
  }
});

// UPDATE site settings
router.put("/", async (req, res) => {
  try {
    const settings = await SiteSettings.findOneAndUpdate(
      { key: "main" },
      {
        ...req.body,
        key: "main",
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Settings updated successfully.",
      data: settings,
    });
  } catch (error) {
    console.error("Update Settings Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update settings.",
    });
  }
});

module.exports = router;