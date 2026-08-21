const mongoose = require("mongoose");

// One attendance document = one class + section + date.
// The teacher marks the whole class in a single save (REQ-ATT-01/02).
const attendanceRecordSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    status: {
      type: String,
      enum: ["present", "absent"],
      required: true,
    },
  },
  { _id: false }
);

const attendanceSchema = new mongoose.Schema(
  {
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
    date: {
      type: Date,
      required: true,
    },
    records: {
      type: [attendanceRecordSchema],
      default: [],
    },
    takenBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
  },
  { timestamps: true }
);

// one attendance doc per class+section+date (prevents duplicate submissions)
attendanceSchema.index({ classId: 1, section: 1, date: 1 }, { unique: true });
// speeds up "find this student's attendance history" queries
attendanceSchema.index({ "records.studentId": 1 });

module.exports = mongoose.model("Attendance", attendanceSchema);
