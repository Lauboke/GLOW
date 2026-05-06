const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    phone: {
      type: String,
      required: [true, 'Please add a phone number']
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
      select: false, // SECURITY: Never return password by default in queries
    },
    role: {
  type: String,
  enum: ["user", "staff", "admin"],
  default: "user",
},
    // --- NEW: DASHBOARD FEATURES ---
    // 1. Saved Looks (From Services/Recommendations)
    savedLooks: [{
      title: { type: String, required: true },
      imageUrl: { type: String, required: true },
      serviceCategory: { type: String, default: "General" },
      savedAt: { type: Date, default: Date.now }
    }],
    // 2. Giveaways & Promos (Tracks what they entered)
    giveaways: [
  {
    giveawayId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Giveaway",
    },
    giveawayName: {
      type: String,
    },
    type: {
      type: String,
      enum: ["giveaway", "promo"],
      default: "giveaway",
    },
    promoCode: {
      type: String,
      default: "",
    },
    enteredAt: {
      type: Date,
      default: Date.now,
    },
  },
],
  },
  { timestamps: true } // This automatically handles createdAt and updatedAt!
);

// Hash password before saving (KEPT FROM YOUR CODE)
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare incoming password (KEPT FROM YOUR CODE)
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// SECURITY: Remove password from response (KEPT FROM YOUR CODE)
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

module.exports = mongoose.model("User", userSchema);