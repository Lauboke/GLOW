const mongoose = require("mongoose");

const giveawaySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["giveaway", "promo"],
      default: "giveaway",
    },

applicableCategory: {
  type: String,
  enum: ["All", "Hair", "Nails", "Skin", "Makeup", "Lashes", "Other"],
  default: "All",
},

    description: {
      type: String,
      required: true,
      trim: true,
    },

    prize: {
      type: String,
      default: "",
      trim: true,
    },

    promoCode: {
      type: String,
      default: "",
      trim: true,
      uppercase: true,
    },

    imageUrl: {
      type: String,
      default: "",
      trim: true,
    },

    startDate: {
      type: Date,
      default: Date.now,
    },

    endDate: {
      type: Date,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    entriesCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Giveaway", giveawaySchema);