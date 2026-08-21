const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    studentId: {
      // school-issued roll/ID number, not the Mongo _id
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    section: {
      type: String,
      required: true,
      trim: true,
    },
    // reverse reference to Guardian (see Guardian.js comment for why)
    guardianId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guardian",
      default: null,
    },
    contact: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// speeds up "find all children of this guardian" queries
studentSchema.index({ guardianId: 1 });
// speeds up "find all students in this class/section" queries
studentSchema.index({ classId: 1, section: 1 });

module.exports = mongoose.model("Student", studentSchema);
