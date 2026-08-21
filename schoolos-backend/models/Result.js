const mongoose = require("mongoose");

// One document per student + subject + exam. Normalized this way
// (unlike Attendance) because the main query pattern here is
// "get one student's results" (REQ-RES-02/03/04), not "get one class's results".
const resultSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    examName: {
      type: String,
      required: true,
      trim: true,
    },
    marks: {
      type: Number,
      required: true,
      min: 0,
    },
    grade: {
      type: String,
      trim: true,
    },
    enteredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
  },
  { timestamps: true }
);

// prevents duplicate marks entry for the same student+subject+exam
resultSchema.index({ studentId: 1, subjectId: 1, examName: 1 }, { unique: true });

module.exports = mongoose.model("Result", resultSchema);
