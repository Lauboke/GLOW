const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    merchantRequestId: {
      type: String,
    },

    checkoutRequestId: {
      type: String,
      required: true,
      unique: true,
    },

    mpesaReceiptNumber: {
      type: String,
    },

    transactionDate: {
      type: String,
    },

    resultCode: {
      type: Number,
    },

    resultDesc: {
      type: String,
    },

    status: {
      type: String,
      enum: ["pending", "paid", "failed", "cancelled"],
      default: "pending",
    },

    rawCallback: {
      type: Object,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);