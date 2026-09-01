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
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: { type: String, required: true, trim: true },
    // classNum stores "3" through "10" as a string
    classNum: { type: String, required: true, trim: true, default: "3" },
    section: { type: String, required: true, trim: true, default: "A" },
    roll: { type: String, trim: true, default: "" },
    gender: { type: String, trim: true, default: "" },
    dob: { type: Date, default: null },
    address: { type: String, trim: true, default: "" },
    bloodGroup: { type: String, trim: true, default: "" },
    religion: { type: String, trim: true, default: "" },
    contact: { type: String, trim: true, default: "" },
    guardianName: { type: String, trim: true, default: "" },
    guardianContact: { type: String, trim: true, default: "" },
    // legacy ObjectId references kept for backward compatibility
    classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", default: null },
    guardianId: { type: mongoose.Schema.Types.ObjectId, ref: "Guardian", default: null },
  },
  { timestamps: true }
);

studentSchema.index({ classNum: 1, section: 1 });
studentSchema.index({ guardianId: 1 });

module.exports = mongoose.model("Student", studentSchema);
