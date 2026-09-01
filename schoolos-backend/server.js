const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const app = express();

app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "SchoolOS Backend is running!" });
});

// API Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notices", require("./routes/notices"));
app.use("/api/students", require("./routes/students"));
app.use("/api/teachers", require("./routes/teachers"));
app.use("/api/attendance", require("./routes/attendance"));
app.use("/api/results", require("./routes/results"));

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  console.log("Starting SchoolOS Backend...");
  console.log("MONGO_URI:", process.env.MONGO_URI ? "FOUND" : "NOT FOUND");
  console.log("JWT_SECRET:", process.env.JWT_SECRET ? "FOUND" : "NOT FOUND");

  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Routes:`);
    console.log(`  POST /api/auth/login`);
    console.log(`  POST /api/auth/register`);
    console.log(`  GET  /api/auth/me`);
    console.log(`  GET/POST /api/students`);
    console.log(`  GET/POST /api/teachers`);
    console.log(`  PUT  /api/teachers/:id/assign`);
    console.log(`  GET/POST /api/notices`);
    console.log(`  GET/POST /api/attendance`);
    console.log(`  GET/POST /api/results`);
  });
};

startServer();