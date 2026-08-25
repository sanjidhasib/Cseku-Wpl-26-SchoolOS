"use client";

import { useState } from "react";
import NavBar from "../components/NavBar";

const initialStudents = [
  { id: 1, name: "Student 01", present: true },
  { id: 2, name: "Student 02", present: false },
  { id: 3, name: "Student 03", present: true },
  { id: 4, name: "Student 04", present: false },
  { id: 5, name: "Student 05", present: true },
];

export default function AttendancePage() {
  const [students, setStudents] = useState(initialStudents);
  const [selectedClass, setSelectedClass] = useState("9A");
  const [date, setDate] = useState("2026-08-25");

  const presentCount = students.filter((s) => s.present).length;

  function toggleStudent(id: number) {
    setStudents((current) =>
      current.map((student) =>
        student.id === id ? { ...student, present: !student.present } : student,
      ),
    );
  }

  function markAll() {
    setStudents((current) => current.map((student) => ({ ...student, present: true })));
  }

  function saveAttendance() {
    alert(`Attendance saved for ${selectedClass} on ${date}.`);
  }

  return (
    <main className="page-shell">
      <NavBar />

      <section className="hero-panel">
        <div>
          <p className="eyebrow">Teacher</p>
          <h1>Attendance</h1>
        </div>
        <button className="primary-btn" onClick={saveAttendance}>Save attendance</button>
      </section>

      <section className="two-column">
        <div className="panel">
          <div className="toolbar">
            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
              <option value="9A">9A</option>
              <option value="9B">9B</option>
              <option value="10A">10A</option>
            </select>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.name}</td>
                  <td>
                    <label className="toggle-row">
                      <input
                        type="checkbox"
                        checked={student.present}
                        onChange={() => toggleStudent(student.id)}
                      />
                      <span>{student.present ? "Present" : "Absent"}</span>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="panel">
          <h3>Summary</h3>
          <div className="mini-item">
            <strong>Present</strong>
            <span>{presentCount}</span>
          </div>
          <div className="mini-item">
            <strong>Absent</strong>
            <span>{students.length - presentCount}</span>
          </div>
          <div className="mini-item">
            <strong>Rate</strong>
            <span>{Math.round((presentCount / students.length) * 100)}%</span>
          </div>
          <button className="secondary-btn" onClick={markAll}>Mark all present</button>
        </div>
      </section>
    </main>
  );
}
