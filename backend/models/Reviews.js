const mongoose = require("mongoose");

const ReviewsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  message: { type: String, required: true },
  rating: { type: Number, required: true },
  staffName: { type: String, default: "N/A" },
  service: { type: String, default: "N/A" },
  photoUrl: { type: String, default: "" },
  status: { type: String, default: "pending" },
  showOnHome: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Reviews", ReviewsSchema);