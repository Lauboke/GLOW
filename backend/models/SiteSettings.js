const mongoose = require("mongoose");

const siteSettingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: "main",
      unique: true,
    },

    businessName: {
      type: String,
      default: "Glow Beauty",
      trim: true,
    },

    businessEmail: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },

    businessPhone: {
      type: String,
      default: "",
      trim: true,
    },

    whatsappNumber: {
      type: String,
      default: "",
      trim: true,
    },

    instagramUrl: {
      type: String,
      default: "https://instagram.com/twinkle_glowbeauty",
      trim: true,
    },

    location: {
      type: String,
      default: "Nakuru, Kenya",
      trim: true,
    },

    addressLine: {
      type: String,
      default: "Luxury Suites, 2nd Floor",
      trim: true,
    },

    mpesaPaybill: {
      type: String,
      default: "",
      trim: true,
    },

    openingTime: {
      type: String,
      default: "08:00",
    },

    closingTime: {
      type: String,
      default: "17:00",
    },

    saturdayOpeningTime: {
      type: String,
      default: "09:00",
    },

    saturdayClosingTime: {
      type: String,
      default: "15:00",
    },

    footerTagline: {
      type: String,
      default:
        "Redefining beauty standards through luxury artistry and a passion for the glow.",
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SiteSettings", siteSettingsSchema);