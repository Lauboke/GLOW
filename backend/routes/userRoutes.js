const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUsers,
  deleteUser,
} = require("../controllers/userController");
const { verifyToken, authorizeRoles } = require("../middleware/authMiddleware");

// Public
router.post("/register", registerUser);
router.post("/login", loginUser);

// Admin only
router.get("/", verifyToken, authorizeRoles("admin"), getUsers);
router.delete("/:id", verifyToken, authorizeRoles("admin"), deleteUser);

module.exports = router;