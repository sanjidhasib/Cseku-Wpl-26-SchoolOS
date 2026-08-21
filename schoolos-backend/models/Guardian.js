const mongoose = require("mongoose");

// Guardian profile. NOTE: we do NOT store child references here.
// Student documents hold `guardianId` (reverse reference), so a
// guardian's children are found via: Student.find({ guardianId })
// This handles multiple children automatically without array syncing.
const guardianSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    contact: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Guardian", guardianSchema);
