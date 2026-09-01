const express = require("express");
const router = express.Router();
const Teacher = require("../models/Teacher");
const User = require("../models/User");
const { verifyToken, requireRole } = require("../middleware/auth");

// GET /api/teachers
router.get("/", async (req, res) => {
    try {
        const teachers = await Teacher.find().sort({ name: 1 });
        res.json(teachers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/teachers/:id
router.get("/:id", async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id);
        if (!teacher) return res.status(404).json({ error: "Teacher not found" });
        res.json(teacher);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/teachers — create teacher (admin only)
router.post("/", verifyToken, requireRole("admin"), async (req, res) => {
    try {
        const {
            email, password, teacherId, name, contact, gender,
            dob, address, qualification, joinDate,
        } = req.body;

        if (!name) return res.status(400).json({ error: "Name is required" });

        let userId = null;
        if (email && password) {
            const bcrypt = require("bcryptjs");
            const existing = await User.findOne({ email: email.toLowerCase() });
            if (existing) return res.status(409).json({ error: "Email already registered" });
            const passwordHash = await bcrypt.hash(password, 10);
            const user = await User.create({ email: email.toLowerCase(), passwordHash, role: "teacher" });
            userId = user._id;
        }

        const teacher = await Teacher.create({
            userId,
            teacherId: teacherId || `TCH-${Date.now()}`,
            name,
            contact: contact || "",
            gender: gender || "",
            dob: dob || null,
            address: address || "",
            qualification: qualification || "",
            joinDate: joinDate || new Date(),
            assignments: [],
        });

        res.status(201).json(teacher);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/teachers/:id — update teacher info
router.put("/:id", verifyToken, requireRole("admin"), async (req, res) => {
    try {
        // don't allow overwriting assignments via this route
        const { assignments, ...rest } = req.body;
        const teacher = await Teacher.findByIdAndUpdate(req.params.id, rest, { new: true, runValidators: true });
        if (!teacher) return res.status(404).json({ error: "Teacher not found" });
        res.json(teacher);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/teachers/:id/assign — set class/subject assignments
router.put("/:id/assign", verifyToken, requireRole("admin"), async (req, res) => {
    try {
        // req.body.assignments = [{ classNum, section, subject }, ...]
        const { assignments } = req.body;
        if (!Array.isArray(assignments)) {
            return res.status(400).json({ error: "assignments must be an array" });
        }
        const teacher = await Teacher.findByIdAndUpdate(
            req.params.id,
            { assignments },
            { new: true, runValidators: true }
        );
        if (!teacher) return res.status(404).json({ error: "Teacher not found" });
        res.json(teacher);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/teachers/:id
router.delete("/:id", verifyToken, requireRole("admin"), async (req, res) => {
    try {
        const teacher = await Teacher.findByIdAndDelete(req.params.id);
        if (!teacher) return res.status(404).json({ error: "Teacher not found" });
        if (teacher.userId) await User.findByIdAndDelete(teacher.userId);
        res.json({ message: "Teacher deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
