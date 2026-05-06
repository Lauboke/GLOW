const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

const Service = require("../models/Service");

const storage = multer.memoryStorage();
const upload = multer({ storage });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "glow/services",
        resource_type: "image",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    uploadStream.end(fileBuffer);
  });
};

// GET all active services for public gallery/homepage
router.get("/", async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: services,
    });
  } catch (error) {
    console.error("Get Services Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load services.",
    });
  }
});

// GET all services for admin, including inactive ones
router.get("/admin", async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: services,
    });
  } catch (error) {
    console.error("Get Admin Services Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load admin services.",
    });
  }
});

// CREATE service with optional Cloudinary image upload
router.post("/admin", upload.single("image"), async (req, res) => {
  try {
    const {
      title,
      category,
      price,
      description,
      isActive,
      isFeatured,
      imageUrl,
    } = req.body;

    let finalImageUrl = imageUrl || "";
    let cloudinaryPublicId = "";

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer);
      finalImageUrl = uploadResult.secure_url;
      cloudinaryPublicId = uploadResult.public_id;
    }

    if (!finalImageUrl) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image or provide an image URL.",
      });
    }

    const service = await Service.create({
      title,
      category,
      price: Number(price),
      imageUrl: finalImageUrl,
      cloudinaryPublicId,
      description,
      isActive: isActive === "true" || isActive === true,
      isFeatured: isFeatured === "true" || isFeatured === true,
    });

    res.status(201).json({
      success: true,
      message: "Service created successfully.",
      data: service,
    });
  } catch (error) {
    console.error("Create Service Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create service.",
      error: error.message,
    });
  }
});

// UPDATE service
router.put("/admin/:id", async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Service updated successfully.",
      data: service,
    });
  } catch (error) {
    console.error("Update Service Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update service.",
    });
  }
});

// DELETE service
router.delete("/admin/:id", async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Service deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Service Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete service.",
    });
  }
});

module.exports = router;