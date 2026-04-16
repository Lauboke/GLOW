const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');
const Booking = require('../models/Booking'); 

const DAILY_LIMIT = 5;

// 1. GET ALL (Admin Dashboard)
router.get('/all', verifyToken, authorizeRoles('admin'), async (req, res) => {
    try {
        // Populate pulls basic user info linked to this booking
        const appointments = await Booking.find().populate('user', 'name email').sort({ date: 1, time: 1 });
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch bookings" });
    }
});

// 2. CHECK AVAILABILITY (User Side)
// CHECK AVAILABILITY (With 2-hour window logic)
router.get('/check', async (req, res) => {
    try {
        const { date } = req.query;
        const bookings = await Booking.find({ date });
        
        let blockedSlots = [];
        
        bookings.forEach(b => {
            // Get the hour (e.g., "10" from "10:00")
            const startHour = parseInt(b.time.split(':')[0]);
            
            // Block the start hour (10:00)
            blockedSlots.push(`${startHour.toString().padStart(2, '0')}:00`);
            
            // Block the next hour (11:00) because the service takes 2 hours
            const nextHour = startHour + 1;
            blockedSlots.push(`${nextHour.toString().padStart(2, '0')}:00`);
        });

        res.json({
            slotsRemaining: 5 - bookings.length,
            isFull: bookings.length >= 5,
            takenTimes: blockedSlots 
        });
    } catch (err) {
        console.error("Check error:", err);
        res.status(500).json({ error: "Database check failed" });
    }
});

// 3. RESERVE (User Side)
router.post('/reserve', verifyToken, async (req, res) => {
    try {
        console.log("Backend received data:", req.body);
        
        // Attach the authenticated user's ID to the booking payload
        const bookingData = {
  user: req.user.id,
  name: req.body.name,
  email: req.body.email,
  phone: req.body.phone,
  service: req.body.service,
  price: req.body.price,
  date: req.body.date,
  time: req.body.time,
  employeeName: req.body.stylist || req.body.employeeName || "Unassigned",
  paymentMethod: req.body.paymentMethod || "cash",
  mpesaCode: req.body.paymentMethod === "mpesa" ? req.body.mpesaCode || "" : "",
  paymentStatus: req.body.paymentMethod === "mpesa" ? "pending_verification" : "confirmed",
  completed: req.body.completed ?? false,
};

        const newBooking = new Booking(bookingData);
        const savedBooking = await newBooking.save();
        res.status(201).json(newBooking);
    } catch (err) {
        console.error("SAVE ERROR:", err.message);
        res.status(400).json({ error: err.message });
    }
});

// 4. GET OWN BOOKINGS (User Side) - PROTECTED: ANY AUTHENTICATED USER
router.get('/my-bookings', verifyToken, async (req, res) => {
    try {
        // Filter bookings by the user ID embedded in their JWT
        const userBookings = await Booking.find({ user: req.user.id }).sort({ date: 1, time: 1 });
        res.json(userBookings);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch your bookings" });
    }
});

// 4. UPDATE (Admin "Complete" button)
router.patch('/update/:id', verifyToken, authorizeRoles('admin'), async (req, res) => {
    try {
        await Booking.findByIdAndUpdate(req.params.id, { completed: req.body.completed });
        res.json({ success: true });
    } catch (err) {
        res.status(400).json({ error: "Update failed" });
    }
});

// 5. DELETE (Admin Dashboard)
router.delete('/delete/:id', verifyToken, authorizeRoles('admin'), async (req, res) => {
    try {
        await Booking.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(400).json({ error: "Delete failed" });
    }
});

// --- GET SUMMARY COUNTS FOR THE OVERVIEW TAB ---
router.get("/stats/employees-weekly", async (req, res) => {
  try {
    // 1. Use your EXACT date math from before (Monday to Sunday)
    const today = new Date();
    const dayOfWeek = today.getDay() || 7; 
    const monday = new Date(today);
    monday.setDate(today.getDate() - dayOfWeek + 1);
    const startOfWeek = monday.toISOString().split('T')[0];

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    const endOfWeek = sunday.toISOString().split('T')[0];

    // 2. The "Aggregation" Magic: Group everyone and count them
    const stats = await Booking.aggregate([
      {
        // Filter for this week only
        $match: {
          date: { $gte: startOfWeek, $lte: endOfWeek }
        }
      },
      {
        // Group by employee name and sum up the number of bookings
        $group: {
          _id: "$employeeName",
          count: { $sum: 1 }
        }
      },
      {
        // Sort by most bookings first
        $sort: { count: -1 }
      }
    ]);

    res.json(stats);
  } catch (error) {
    console.error("Stats Error:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

router.get("/employee/:name/weekly", async (req, res) => {
  try {
    const { name } = req.params;

    const today = new Date();
    const dayOfWeek = today.getDay() || 7;

    const monday = new Date(today);
    monday.setDate(today.getDate() - dayOfWeek + 1);
    const startOfWeek = monday.toISOString().split("T")[0];

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    const endOfWeek = sunday.toISOString().split("T")[0];

    const appointments = await Booking.find({
      employeeName: name,
      date: { $gte: startOfWeek, $lte: endOfWeek },
    }).sort({ date: 1, time: 1 });

    res.json({
      employeeName: name,
      weekRange: `${startOfWeek} to ${endOfWeek}`,
      totalAppointments: appointments.length,
      appointments,
    });
  } catch (error) {
    console.error("Weekly schedule error:", error);
    res.status(500).json({ error: "Failed to fetch weekly schedule" });
  }
});

module.exports = router;