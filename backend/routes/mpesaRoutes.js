const express = require("express");
const axios = require("axios");
const Payment = require("../models/Payment");

const router = express.Router();

const BASE_URL = "https://sandbox.safaricom.co.ke";

function generateTimestamp() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hour = String(now.getHours()).padStart(2, "0");
  const minute = String(now.getMinutes()).padStart(2, "0");
  const second = String(now.getSeconds()).padStart(2, "0");

  return `${year}${month}${day}${hour}${minute}${second}`;
}

async function getAccessToken() {
  const auth = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString("base64");

  const response = await axios.get(
    `${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
    {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    }
  );

  return response.data.access_token;
}

router.post("/stk-push", async (req, res) => {
  try {
    const { phone, amount } = req.body;

    if (!phone || !amount) {
      return res.status(400).json({
        success: false,
        message: "Phone and amount are required",
      });
    }

    const accessToken = await getAccessToken();
    const timestamp = generateTimestamp();

    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString("base64");

    const payload = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.round(Number(amount)),
      PartyA: phone,
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: phone,
      CallBackURL: process.env.MPESA_CALLBACK_URL,
      AccountReference: "GlowBooking",
      TransactionDesc: "Glow Beauty Booking Payment",
    };

    const response = await axios.post(
      `${BASE_URL}/mpesa/stkpush/v1/processrequest`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const payment = await Payment.create({
      phone,
      amount: Math.round(Number(amount)),
      merchantRequestId: response.data.MerchantRequestID,
      checkoutRequestId: response.data.CheckoutRequestID,
      status: "pending",
      resultDesc: response.data.ResponseDescription,
    });

    res.status(200).json({
      success: true,
      message: "STK Push request sent successfully",
      paymentId: payment._id,
      checkoutRequestId: payment.checkoutRequestId,
      data: response.data,
    });
  } catch (error) {
    console.error("M-Pesa STK Error:", error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message: "Failed to send STK Push",
      error: error.response?.data || error.message,
    });
  }
});

router.post("/callback", async (req, res) => {
  try {
    console.log("M-Pesa Callback:", JSON.stringify(req.body, null, 2));

    const callback = req.body.Body?.stkCallback;

    if (!callback) {
      return res.status(200).json({
        success: true,
        message: "Callback received but no stkCallback found",
      });
    }

    const {
      MerchantRequestID,
      CheckoutRequestID,
      ResultCode,
      ResultDesc,
      CallbackMetadata,
    } = callback;

    const metadata = CallbackMetadata?.Item || [];

    const getMetadataValue = (name) => {
      const item = metadata.find((entry) => entry.Name === name);
      return item?.Value;
    };

    const mpesaReceiptNumber = getMetadataValue("MpesaReceiptNumber");
    const transactionDate = getMetadataValue("TransactionDate");

    let status = "failed";

    if (ResultCode === 0) {
      status = "paid";
    } else if (ResultCode === 1032) {
      status = "cancelled";
    }

    await Payment.findOneAndUpdate(
      { checkoutRequestId: CheckoutRequestID },
      {
        merchantRequestId: MerchantRequestID,
        resultCode: ResultCode,
        resultDesc: ResultDesc,
        mpesaReceiptNumber,
        transactionDate,
        status,
        rawCallback: req.body,
      },
      { returnDocument: "after" }
    );

    res.status(200).json({
      success: true,
      message: "Callback processed successfully",
    });
  } catch (error) {
    console.error("M-Pesa Callback Error:", error.message);

    res.status(200).json({
      success: true,
      message: "Callback received but processing failed",
    });
  }
});

router.get("/status/:paymentId", async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    res.status(200).json({
      success: true,
      status: payment.status,
      receipt: payment.mpesaReceiptNumber,
      resultCode: payment.resultCode,
      resultDesc: payment.resultDesc,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to check payment status",
    });
  }
});

module.exports = router;