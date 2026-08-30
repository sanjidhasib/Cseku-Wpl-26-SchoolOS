const mongoose = require("mongoose");

// One message within an AI session (either the student's question
// or the AI's reply). Kept as a sub-document so the whole
// conversation stays together for context (REQ-AI-04, REQ-AI-05).
const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["student", "ai"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

// One document per AI Learning Agent session. A session is scoped to
// a student + class + subject (REQ-AI-01), and holds the full
// back-and-forth so follow-up questions have context (REQ-AI-04/05).
const aiSessionSchema = new mongoose.Schema(
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
    messages: {
      type: [messageSchema],
      default: [],
    },
    // language the student is asking in, e.g. "bn" or "en" (REQ-AI-02)
    language: {
      type: String,
      enum: ["bn", "en"],
      default: "en",
    },
  },
  { timestamps: true }
);

// speeds up "get this student's past sessions" queries
aiSessionSchema.index({ studentId: 1, createdAt: -1 });

module.exports = mongoose.model("AISession", aiSessionSchema);
