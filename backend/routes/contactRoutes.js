const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact'); 
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');
const apiLimiter = require('../middleware/rateLimiter');
const nodemailer = require('nodemailer');
const User = require('../models/User');

// 1. UPDATED PUBLIC ROUTE (Includes 'subject' now)
router.post('/', apiLimiter, async (req, res) => {
  try {
    // Added 'subject' here
    const { name, email, phone, subject, message } = req.body; 
    
    if (!name || !email || !phone || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    
    const newInquiry = new Contact({ name, email, phone, subject, message });
    await newInquiry.save();
    res.status(201).json({ message: "Inquiry sent successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error sending inquiry" });
  }
});

// 2. ADMIN ROUTE (No changes needed)
router.get('/all', verifyToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const inquiries = await Contact.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: "Error fetching inquiries" });
  }
});

router.post('/reply/:id', verifyToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { replyText } = req.body;
    const inquiry = await Contact.findById(req.params.id);

    if (!inquiry) return res.status(404).json({ message: "Inquiry not found" });

    // 1. SAVE TO DATABASE (The In-App Part)
    // We do this first so the user definitely gets the message on their dashboard.
    inquiry.reply = replyText;
    inquiry.replied = true;
    await inquiry.save();

    // 2. SEND EMAIL (The Background Part)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { 
          user: process.env.EMAIL_USER, 
          pass: process.env.EMAIL_PASS 
        }
      });

      // We wrap the mailer in its own try/catch so an email error 
      // doesn't crash the whole reply process.
      try {
        await transporter.sendMail({
          from: `"Glow" <${process.env.EMAIL_USER}>`,
          to: inquiry.email,
          subject: `Re: Your Inquiry to Glow`,
          text: `Hi ${inquiry.name},\n\n${replyText}\n\nWarm regards,\nThe Glow Team`
        });
        console.log("Email sent successfully!");
      } catch (mailError) {
        console.error("Email failed, but dashboard reply was saved:", mailError.message);
        // We don't return an error to the frontend here because the DB part worked!
      }
    }

    res.json({ message: "Reply saved to Dashboard successfully!" });

  } catch (error) {
    console.error("Reply System Error:", error);
    res.status(500).json({ message: "Failed to process reply." });
  }
});

module.exports = router;