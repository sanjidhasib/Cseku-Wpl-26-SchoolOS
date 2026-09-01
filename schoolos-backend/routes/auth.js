const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const Guardian = require("../models/Guardian");

const JWT_SECRET = process.env.JWT_SECRET || "schoolos_jwt_secret";
const JWT_EXPIRES = "7d";

// ─── POST /api/auth/register ─────────────────────────────────────────────────
router.post("/register", async (req, res) => {
    try {
        const { email, password, role, profile } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({ error: "Email, password and role are required" });
        }

        const allowed = ["student", "teacher", "guardian", "admin"];
        if (!allowed.includes(role)) {
            return res.status(400).json({ error: "Invalid role" });
        }

        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) {
            return res.status(409).json({ error: "Email already registered" });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.create({ email: email.toLowerCase(), passwordHash, role });

        let profileDoc = null;

        if (role === "student") {
            const p = profile || {};
            profileDoc = await Student.create({
                userId: user._id,
                studentId: p.studentId || `STU-${Date.now()}`,
                name: p.name || email.split("@")[0],
                classNum: p.classNum || "3",
                section: p.section || "A",
                roll: p.roll || "",
                gender: p.gender || "",
                dob: p.dob || null,
                address: p.address || "",
                bloodGroup: p.bloodGroup || "",
                religion: p.religion || "",
                contact: p.contact || "",
                guardianName: p.guardianName || "",
                guardianContact: p.guardianContact || "",
            });
        }

        if (role === "teacher") {
            const p = profile || {};
            profileDoc = await Teacher.create({
                userId: user._id,
                teacherId: p.teacherId || `TCH-${Date.now()}`,
                name: p.name || email.split("@")[0],
                contact: p.contact || "",
                gender: p.gender || "",
                dob: p.dob || null,
                address: p.address || "",
                qualification: p.qualification || "",
                joinDate: p.joinDate || new Date(),
                assignments: [],
            });
        }

        if (role === "guardian") {
            const p = profile || {};
            profileDoc = await Guardian.create({
                userId: user._id,
                name: p.name || email.split("@")[0],
                contact: p.contact || "",
                address: p.address || "",
            });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role, email: user.email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES }
        );

        res.status(201).json({
            message: "Registration successful",
            token,
            user: { id: user._id, email: user.email, role: user.role },
            profile: profileDoc,
        });
    } catch (err) {
        console.error("Register error:", err);
        res.status(500).json({ error: err.message || "Registration failed" });
    }
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password required" });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(401).json({ error: "Invalid credentials" });
        if (user.status === "deactivated") {
            return res.status(403).json({ error: "Account deactivated. Contact admin." });
        }

        const match = await bcrypt.compare(password, user.passwordHash);
        if (!match) return res.status(401).json({ error: "Invalid credentials" });

        // fetch role-specific profile
        let profile = null;
        if (user.role === "student") profile = await Student.findOne({ userId: user._id });
        if (user.role === "teacher") profile = await Teacher.findOne({ userId: user._id });
        if (user.role === "guardian") profile = await Guardian.findOne({ userId: user._id });

        const token = jwt.sign(
            { id: user._id, role: user.role, email: user.email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES }
        );

        res.json({
            token,
            user: { id: user._id, email: user.email, role: user.role },
            profile,
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "Login failed" });
    }
});

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
const { verifyToken } = require("../middleware/auth");
router.get("/me", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-passwordHash");
        if (!user) return res.status(404).json({ error: "User not found" });

        let profile = null;
        if (user.role === "student") profile = await Student.findOne({ userId: user._id });
        if (user.role === "teacher") profile = await Teacher.findOne({ userId: user._id });
        if (user.role === "guardian") profile = await Guardian.findOne({ userId: user._id });

        res.json({ user, profile });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch user" });
    }
});

module.exports = router;
