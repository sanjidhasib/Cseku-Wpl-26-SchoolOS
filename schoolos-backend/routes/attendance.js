const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");
const mongoose = require("mongoose");

// GET /api/attendance?section=9A&date=2026-09-01
router.get("/", async (req, res) => {
    try {
        const { section, date } = req.query;
        const query = {};
        if (section) query.section = section;
        if (date) query.date = new Date(date);
        const records = await Attendance.find(query).lean();
        res.json(records);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/attendance — save or upsert attendance for a class+section+date
// Body: { section, date, records: [{studentId, status}] }
router.post("/", async (req, res) => {
    try {
        const { section, date, records } = req.body;
        const demoClassId = new mongoose.Types.ObjectId("000000000000000000000002");
        const demoTeacherId = new mongoose.Types.ObjectId("000000000000000000000003");

        const attendance = await Attendance.findOneAndUpdate(
            { classId: demoClassId, section, date: new Date(date) },
            {
                classId: demoClassId,
                section,
                date: new Date(date),
                records: records || [],
                takenBy: demoTeacherId,
            },
            { upsert: true, new: true }
        );
        res.status(200).json(attendance);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
