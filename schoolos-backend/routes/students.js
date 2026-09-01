const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const User = require("../models/User");
const { verifyToken, requireRole } = require("../middleware/auth");

// GET /api/students?class=7&section=A
router.get("/", async (req, res) => {
    try {
        const filter = {};
        if (req.query.class) filter.classNum = req.query.class;
        if (req.query.section) filter.section = req.query.section;

        const students = await Student.find(filter).sort({ classNum: 1, roll: 1, name: 1 });
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/students/:id
router.get("/:id", async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ error: "Student not found" });
        res.json(student);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/students — create student (admin only)
router.post("/", verifyToken, requireRole("admin"), async (req, res) => {
    try {
        const {
            email, password, studentId, name, classNum, section, roll,
            gender, dob, address, bloodGroup, religion, contact,
            guardianName, guardianContact,
        } = req.body;

        if (!name || !classNum) {
            return res.status(400).json({ error: "Name and class are required" });
        }

        let userId = null;
        if (email && password) {
            const bcrypt = require("bcryptjs");
            const existing = await User.findOne({ email: email.toLowerCase() });
            if (existing) return res.status(409).json({ error: "Email already registered" });
            const passwordHash = await bcrypt.hash(password, 10);
            const user = await User.create({ email: email.toLowerCase(), passwordHash, role: "student" });
            userId = user._id;
        }

        const student = await Student.create({
            userId,
            studentId: studentId || `STU-${Date.now()}`,
            name, classNum, section: section || "A",
            roll: roll || "", gender: gender || "",
            dob: dob || null, address: address || "",
            bloodGroup: bloodGroup || "", religion: religion || "",
            contact: contact || "",
            guardianName: guardianName || "", guardianContact: guardianContact || "",
        });

        res.status(201).json(student);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/students/:id — update student
router.put("/:id", verifyToken, requireRole("admin"), async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!student) return res.status(404).json({ error: "Student not found" });
        res.json(student);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/students/:id
router.delete("/:id", verifyToken, requireRole("admin"), async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) return res.status(404).json({ error: "Student not found" });
        // also delete associated user account if exists
        if (student.userId) await User.findByIdAndDelete(student.userId);
        res.json({ message: "Student deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
