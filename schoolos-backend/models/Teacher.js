const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    classNum: { type: String, required: true, trim: true },
    section: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    // legacy ObjectId refs kept for backward compat
    classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", default: null },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", default: null },
  },
  { _id: false }
);

const teacherSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    teacherId: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    contact: { type: String, trim: true, default: "" },
    gender: { type: String, trim: true, default: "" },
    dob: { type: Date, default: null },
    address: { type: String, trim: true, default: "" },
    qualification: { type: String, trim: true, default: "" },
    joinDate: { type: Date, default: Date.now },
    assignments: { type: [assignmentSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Teacher", teacherSchema);
