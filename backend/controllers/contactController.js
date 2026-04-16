const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

const sendInquiry = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // 1. Basic Validation
    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // 2. Save to Database
    const newInquiry = await Contact.create({ name, email, message });

    // 3. Setup Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS // Use an "App Password", not your real password
      }
    });

    const mailOptions = {
      from: email,
      to: process.env.EMAIL_USER,
      subject: `New Boke Glow Inquiry from ${name}`,
      text: `You have a new message:\n\nFrom: ${name} (${email})\n\nMessage: ${message}`
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: "Inquiry sent successfully!" });
  } catch (error) {
    console.error("Contact Error:", error);
    res.status(500).json({ message: "Failed to send message." });
  }
};

// Admin function to view inquiries
const getInquiries = async (req, res) => {
  try {
    const inquiries = await Contact.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: "Error fetching inquiries" });
  }
};

module.exports = { sendInquiry, getInquiries };