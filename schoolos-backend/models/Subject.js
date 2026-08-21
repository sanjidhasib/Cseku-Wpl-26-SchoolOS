const mongoose = require("mongoose");

// A subject belongs to a specific class (e.g. "Mathematics" for "Class 6")
const subjectSchema = new mongoose.Schema(
  {
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
  },
  { timestamps: true }
);

// prevents the same subject name being added twice to the same class
subjectSchema.index({ name: 1, classId: 1 }, { unique: true });

module.exports = mongoose.model("Subject", subjectSchema);
