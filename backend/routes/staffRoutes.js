const express = require("express");
const router = express.Router();
const Staff = require("../models/Staff");
const { verifyToken, authorizeRoles } = require("../middleware/authMiddleware");

// GET all staff
router.get("/", async (req, res) => {
  try {
    const staff = await Staff.find({ isActive: true }).sort({ name: 1 });
    res.json(staff);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch staff" });
  }
});

// POST create staff (admin only)
router.post("/", verifyToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const { name, role, services, phone, isActive } = req.body;

    const trimmedName = name.trim();

    const existingStaff = await Staff.findOne({ name: trimmedName });

    if (existingStaff) {
      existingStaff.role = role;
      existingStaff.services = services || [];
      existingStaff.phone = phone || "";
      existingStaff.isActive = isActive ?? true;

      const restoredStaff = await existingStaff.save();
      return res.status(200).json(restoredStaff);
    }

    const staff = await Staff.create({
      name: trimmedName,
      role,
      services: services || [],
      phone: phone || "",
      isActive: isActive ?? true,
    });

    res.status(201).json(staff);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PATCH update staff (admin only)
router.patch("/:id", verifyToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const updated = await Staff.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ error: "Staff member not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE staff (admin only) - soft delete
router.delete("/:id", verifyToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const deleted = await Staff.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!deleted) {
      return res.status(404).json({ error: "Staff member not found" });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: "Delete failed" });
  }
});

module.exports = router;