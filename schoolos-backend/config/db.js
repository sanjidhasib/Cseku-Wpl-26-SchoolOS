const mongoose = require("mongoose");

// Connects to MongoDB using the URI from .env
// Call this once when the server starts (see server.js)
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/schoolos";
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`⚠️ MongoDB connection warning: ${error.message}`);
    console.warn("⚠️ Continuing server startup for AI Tutor & REST endpoints.");
  }
};

module.exports = connectDB;

