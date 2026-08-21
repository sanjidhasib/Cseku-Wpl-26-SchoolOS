const mongoose = require("mongoose");

// Connects to MongoDB using the URI from .env
// Call this once when the server starts (see server.js)
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1); // stop the server if DB connection fails
  }
};

module.exports = connectDB;
