const express = require('express');
const router = express.Router();
const {
  register,
  login,
  staffLogin,
  getCurrentUser,
  updateCurrentUser,
} = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post('/register', register);
router.post('/login', login);
router.post('/staff-login', staffLogin);

router.get("/me", verifyToken, getCurrentUser);
router.patch("/me", verifyToken, updateCurrentUser);

module.exports = router;