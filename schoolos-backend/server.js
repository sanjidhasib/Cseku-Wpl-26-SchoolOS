const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "SchoolOS Backend is running!"
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  console.log("Starting SchoolOS Backend...");
  console.log("MONGO_URI:", process.env.MONGO_URI ? "FOUND" : "NOT FOUND");

  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();