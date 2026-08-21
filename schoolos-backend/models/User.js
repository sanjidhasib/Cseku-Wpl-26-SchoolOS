const mongoose = require("mongoose");

// User = ONLY authentication data. Role-specific profile details
// (name, contact, class, etc.) live in Student/Teacher/Guardian models,
// which each hold a `userId` reference back to this document.
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "teacher", "student", "guardian"],
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "deactivated"],
      default: "active",
    },
  },
  { timestamps: true } // adds createdAt, updatedAt automatically
);

module.exports = mongoose.model("User", userSchema);
