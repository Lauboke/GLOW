const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: String,
    email: String,
    phone: String,
    service: String,
    price: Number,
    date: String,
    time: String,

    employeeName: {
      type: String,
      required: true,
      default: "Unassigned",
    },

    paymentMethod: {
      type: String,
      enum: ["cash", "mpesa"],
      default: "cash",
    },

    mpesaCode: {
      type: String,
      default: "",
    },

    paymentStatus: {
      type: String,
      enum: ["unpaid", "pending_verification", "confirmed"],
      default: "pending_verification",
    },

    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);