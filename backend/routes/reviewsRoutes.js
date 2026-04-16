const express = require("express");
const router = express.Router();
const Reviews = require("../models/Reviews");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "glow-reviews",
        resource_type: "image",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(fileBuffer);
  });
};

// 1. GET ALL REVIEWS
router.get("/", async (req, res) => {
  try {
    const reviews = await Reviews.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

// 2. SAVE NEW REVIEW WITH OPTIONAL PHOTO
router.post("/", upload.single("photo"), async (req, res) => {
  try {
    const { name, email, message, rating, staffName, service, status } = req.body;

    let photoUrl = "";

    if (req.file) {
      const uploadedImage = await uploadToCloudinary(req.file.buffer);
      photoUrl = uploadedImage.secure_url;
    }

    const newReview = new Reviews({
      name,
      email,
      message,
      rating: Number(rating),
      staffName,
      service,
      photoUrl,
      status: status || "pending",
    });

    await newReview.save();
    res.status(201).json(newReview);
  } catch (err) {
    console.error("Could not post review:", err);
    res.status(500).json({ error: "Could not post review." });
  }
});

// 3. UPDATE REVIEW STATUS
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedReview = await Reviews.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json(updatedReview);
  } catch (err) {
    res.status(400).json({ message: "Update failed" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedReview = await Reviews.findByIdAndDelete(req.params.id);

    if (!deletedReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json({ success: true, message: "Review deleted successfully" });
  } catch (err) {
    console.error("Delete review error:", err);
    res.status(400).json({ message: "Delete failed" });
  }
});

module.exports = router;