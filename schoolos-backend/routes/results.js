const express = require("express");
const router = express.Router();

// Since Result model requires ObjectId refs (studentId, classId, subjectId, enteredBy),
// we use a simple in-memory store for the demo frontend.
// This lets the frontend store/retrieve results without requiring a seeded DB.
let demoResults = [
    { id: 1, studentName: "Rahim Hossain", subject: "Math", marks: 82, section: "9A", grade: "A" },
    { id: 2, studentName: "Karim Uddin", subject: "Math", marks: 76, section: "9A", grade: "B+" },
    { id: 3, studentName: "Sumaiya Akter", subject: "Math", marks: 91, section: "9A", grade: "A+" },
    { id: 4, studentName: "Tanvir Ahmed", subject: "Math", marks: 73, section: "9A", grade: "B" },
    { id: 5, studentName: "Nusrat Jahan", subject: "Math", marks: 88, section: "9A", grade: "A" },
    { id: 6, studentName: "Rafiqul Islam", subject: "Math", marks: 65, section: "9A", grade: "B-" },
];
let nextId = 7;

function getGrade(marks) {
    if (marks >= 90) return "A+";
    if (marks >= 80) return "A";
    if (marks >= 75) return "B+";
    if (marks >= 65) return "B";
    if (marks >= 55) return "C";
    return "F";
}

// GET /api/results?subject=Math&section=9A
router.get("/", (req, res) => {
    const { subject, section } = req.query;
    let results = demoResults;
    if (subject) results = results.filter((r) => r.subject === subject);
    if (section) results = results.filter((r) => r.section === section);
    res.json(results);
});

// POST /api/results — receive array of { id, studentName, marks, subject, section }
router.post("/", (req, res) => {
    const { results } = req.body;
    if (!Array.isArray(results)) {
        return res.status(400).json({ error: "results must be an array" });
    }
    results.forEach((r) => {
        const idx = demoResults.findIndex((d) => d.id === r.id);
        const grade = getGrade(Number(r.marks));
        if (idx !== -1) {
            demoResults[idx] = { ...demoResults[idx], ...r, grade };
        } else {
            demoResults.push({ ...r, id: nextId++, grade });
        }
    });
    res.json({ saved: results.length, results: demoResults });
});

module.exports = router;
