const express = require("express");
const router = express.Router();
const Notice = require("../models/Notice");
const mongoose = require("mongoose");

// GET /api/notices — all notices sorted newest first
router.get("/", async (req, res) => {
  try {
    const notices = await Notice.find().sort({ date: -1 }).lean();
    res.json(notices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/notices — create new notice
router.post("/", async (req, res) => {
  try {
    const { title, description, date, audience } = req.body;
    // Use a fixed demo ObjectId for authorId when no auth system is in place
    const demoAuthorId = new mongoose.Types.ObjectId("000000000000000000000001");
    const notice = await Notice.create({
      title,
      description,
      date: date ? new Date(date) : new Date(),
      audience: audience || "all",
      authorId: demoAuthorId,
    });
    res.status(201).json(notice);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
