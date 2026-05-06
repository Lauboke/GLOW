const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Helper function to generate JWT
const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role: role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }, // Token expires in 7 days
  );
};

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use." });
    }

    // 2. Create new user (password is hashed automatically by Mongoose hook)
    const user = await User.create({
      name,
      email,
      password,
      role: "user", // Default role
    });

    // 3. Generate Token
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user,
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Server error during registration." });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const normalizedEmail = email.toLowerCase().trim();

    if (!normalizedEmail || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password." });
    }

    // 1. Find user and explicitly select the password field (since select: false in schema)
    const user = await User.findOne({ email: normalizedEmail }).select(
      "+password",
    );
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // 2. Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // 3. Generate Token
    const token = generateToken(user._id, user.role);

    // 4. Remove password from user object before sending response
    const userResponse = user.toJSON();

    res.status(200).json({
      message: "Login successful",
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error during login." });
  }
};

// POST /api/auth/staff-login
const staffLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password." });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail }).select(
      "+password",
    );

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Important: only staff and admin can use this portal
    if (!["staff", "admin"].includes(user.role)) {
      return res.status(403).json({
        message: "This portal is for staff members only.",
      });
    }

    const token = generateToken(user._id, user.role);
    const userResponse = user.toJSON();

    res.status(200).json({
      message: "Staff login successful",
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error("Staff Login Error:", error);
    res.status(500).json({ message: "Server error during staff login." });
  }
};

// GET /api/auth/me
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get Current User Error:", error);
    res.status(500).json({ message: "Failed to load account profile." });
  }
};

// PATCH /api/auth/me
const updateCurrentUser = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (email && email !== user.email) {
      const normalizedEmail = email.toLowerCase().trim();

      const existingUser = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: user._id },
      });

      if (existingUser) {
        return res.status(400).json({
          message: "This email is already used by another account.",
        });
      }

      user.email = normalizedEmail;
    }

    if (name) user.name = name.trim();
    if (phone) user.phone = phone.trim();

    await user.save();

    const userResponse = user.toJSON();

    res.status(200).json({
      success: true,
      message: "Account profile updated successfully.",
      user: userResponse,
    });
  } catch (error) {
    console.error("Update Current User Error:", error);
    res.status(500).json({ message: "Failed to update account profile." });
  }
};

module.exports = {
  register,
  login,
  staffLogin,
  getCurrentUser,
  updateCurrentUser,
};
