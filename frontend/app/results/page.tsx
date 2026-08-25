"use client";

import { useState } from "react";
import NavBar from "../components/NavBar";

const initialRows = [
  { id: 1, name: "Student 01", marks: 82 },
  { id: 2, name: "Student 02", marks: 76 },
  { id: 3, name: "Student 03", marks: 91 },
  { id: 4, name: "Student 04", marks: 73 },
];

export default function ResultsPage() {
  const [rows, setRows] = useState(initialRows);

  const average = Math.round(
    rows.reduce((sum, row) => sum + Number(row.marks), 0) / rows.length,
  );

  function updateMarks(id: number, value: string) {
    setRows((current) =>
      current.map((row) => (row.id === id ? { ...row, marks: Number(value) || 0 } : row)),
    );
  }

  function saveResults() {
    alert("Marks saved successfully.");
  }

  return (
    <main className="page-shell">
      <NavBar />

      <section className="hero-panel">
        <div>
          <p className="eyebrow">Academic</p>
          <h1>Results</h1>
        </div>
        <button className="primary-btn" onClick={saveResults}>Save marks</button>
      </section>

      <section className="two-column">
        <div className="panel">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Marks</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>{row.name}</td>
                  <td>
                    <input
                      className="field-input"
                      type="number"
                      min={0}
                      max={100}
                      value={row.marks}
                      onChange={(e) => updateMarks(row.id, e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="panel">
          <h3>Summary</h3>
          <div className="mini-item">
            <strong>Class average</strong>
            <span>{average}</span>
          </div>
          <div className="mini-item">
            <strong>Highest score</strong>
            <span>{Math.max(...rows.map((row) => row.marks))}</span>
          </div>
          <div className="mini-item">
            <strong>Lowest score</strong>
            <span>{Math.min(...rows.map((row) => row.marks))}</span>
          </div>
        </div>
      </section>
    </main>
  );
}
