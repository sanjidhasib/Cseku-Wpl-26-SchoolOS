const mongoose = require("mongoose");

// e.g. { name: "Class 6", sections: ["A", "B", "C"] }
const classSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    sections: {
      type: [String],
      default: ["A"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Class", classSchema);
