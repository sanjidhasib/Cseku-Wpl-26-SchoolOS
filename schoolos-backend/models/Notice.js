const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // who should see this notice: "all", "students", "guardians",
    // "teachers", or a specific classId as a string
    audience: {
      type: String,
      default: "all",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notice", noticeSchema);
