const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();

//db connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/boke_glow"; 

mongoose.connect(MONGO_URI)
  .then(() => console.log("🚀 MongoDB Connected: Boke Glow Database Active"))
  .catch(err => console.error("Database connection error:", err));

  //middleware
app.use(cors()); 
app.use(express.json());

//booking routes
const bookingRoutes = require('./routes/bookingRoutes');
app.use('/api/bookings', bookingRoutes);

// GLOW AI
const aiRoutes = require('./routes/aiRoutes');
app.use('/api/ai', aiRoutes);

//auth routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

//contact routes
const contactRoutes = require('./routes/contactRoutes');
app.use('/api/contact', contactRoutes);

//reviews route
const reviewsRoutes = require('./routes/reviewsRoutes');
app.use('/api/reviews', reviewsRoutes);

// user routes (registration and login)
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const profileRoutes = require('./routes/profileRoutes');
app.use('/api/profile', profileRoutes);

const staffRoutes = require("./routes/staffRoutes");
app.use("/api/staff", staffRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✨ Boke Glow Backend shining on port ${PORT}`);
});