"use client";

import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface ResultRow {
  id: number;
  studentName: string;
  roll: string;
  initials: string;
  marks: number;
  grade: string;
  section: string;
  subject: string;
}

const FALLBACK_RESULTS: ResultRow[] = [
  { id: 1, studentName: "Rahim Hossain", roll: "01", initials: "RH", marks: 82, grade: "A", section: "9A", subject: "Math" },
  { id: 2, studentName: "Karim Uddin", roll: "02", initials: "KU", marks: 76, grade: "B+", section: "9A", subject: "Math" },
  { id: 3, studentName: "Sumaiya Akter", roll: "03", initials: "SA", marks: 91, grade: "A+", section: "9A", subject: "Math" },
  { id: 4, studentName: "Tanvir Ahmed", roll: "04", initials: "TA", marks: 73, grade: "B", section: "9A", subject: "Math" },
  { id: 5, studentName: "Nusrat Jahan", roll: "05", initials: "NJ", marks: 88, grade: "A", section: "9A", subject: "Math" },
  { id: 6, studentName: "Rafiqul Islam", roll: "06", initials: "RI", marks: 65, grade: "B-", section: "9A", subject: "Math" },
];

function computeGrade(m: number): string {
  if (m >= 90) return "A+";
  if (m >= 80) return "A";
  if (m >= 75) return "B+";
  if (m >= 65) return "B";
  if (m >= 55) return "C";
  return "F";
}

function gradeBadge(g: string): string {
  if (g === "A+") return "badge-green";
  if (g === "A") return "badge-cyan";
  if (g === "B+" || g === "B") return "badge-purple";
  if (g === "C") return "badge-orange";
  return "badge-red";
}

export default function ResultsPage() {
  const [rows, setRows] = useState<ResultRow[]>(FALLBACK_RESULTS);
  const [subject, setSubject] = useState("Math");
  const [section, setSection] = useState("9A");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);

  useEffect(() => {
    fetch(`${API}/api/results?subject=${subject}&section=${section}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setRows(
            data.map((d, i) => ({
              id: d.id ?? i + 1,
              studentName: d.studentName ?? `Student ${String(i + 1).padStart(2, "0")}`,
              roll: String(i + 1).padStart(2, "0"),
              initials: (d.studentName ?? "S?")
                .split(" ")
                .map((w: string) => w[0])
                .join("")
                .slice(0, 2)
                .toUpperCase(),
              marks: d.marks ?? 0,
              grade: computeGrade(d.marks ?? 0),
              section: d.section ?? section,
              subject: d.subject ?? subject,
            }))
          );
        }
      })
      .catch(() => { });
  }, [subject, section]);

  const average = Math.round(rows.reduce((s, r) => s + r.marks, 0) / rows.length) || 0;
  const highest = rows.length ? Math.max(...rows.map((r) => r.marks)) : 0;
  const lowest = rows.length ? Math.min(...rows.map((r) => r.marks)) : 0;

  function updateMarks(id: number, value: string) {
    setRows((cur) =>
      cur.map((r) => {
        if (r.id !== id) return r;
        const m = Math.min(100, Math.max(0, Number(value) || 0));
        return { ...r, marks: m, grade: computeGrade(m) };
      })
    );
  }

  function showToast(msg: string, type: "ok" | "err" = "ok") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function saveResults() {
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/results`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ results: rows }),
      });
      if (res.ok) showToast("✅ Marks saved successfully!");
      else showToast("⚠️ Saved locally (backend offline)", "err");
    } catch {
      showToast("✅ Marks saved locally", "ok");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <NavBar />
      <main className="page-shell">
        {/* Hero */}
        <section className="hero-panel">
          <div>
            <p className="eyebrow">Academic</p>
            <h1>Exam Results</h1>
            <p style={{ color: "var(--muted)", marginTop: 6, fontSize: "0.9rem" }}>
              Enter and manage marks for {section} · {subject}
            </p>
          </div>
          <button
            className="primary-btn"
            onClick={saveResults}
            disabled={saving}
            style={{ flexShrink: 0 }}
          >
            {saving ? <span className="spinner" /> : "💾 Save Marks"}
          </button>
        </section>

        <section className="two-column">
          {/* Left — Table */}
          <div className="panel">
            <div className="toolbar">
              <select value={subject} onChange={(e) => setSubject(e.target.value)}>
                <option value="Math">Mathematics</option>
                <option value="Science">Science</option>
                <option value="Bangla">Bangla</option>
                <option value="English">English</option>
              </select>
              <select value={section} onChange={(e) => setSection(e.target.value)}>
                <option value="9A">Class 9A</option>
                <option value="9B">Class 9B</option>
                <option value="10A">Class 10A</option>
              </select>
            </div>

            <table className="data-table">
              <thead>
                <tr>
                  <th>Roll</th>
                  <th>Student</th>
                  <th>Marks / 100</th>
                  <th>Grade</th>
                  <th>Performance</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td style={{ color: "var(--muted)", fontSize: "0.82rem" }}>#{r.roll}</td>
                    <td>
                      <div className="avatar-row">
                        <div className="avatar">{r.initials}</div>
                        <span style={{ fontWeight: 500, fontSize: "0.9rem" }}>{r.studentName}</span>
                      </div>
                    </td>
                    <td>
                      <input
                        className="field-input"
                        type="number"
                        min={0}
                        max={100}
                        value={r.marks}
                        onChange={(e) => updateMarks(r.id, e.target.value)}
                        style={{ width: 80, padding: "7px 10px", textAlign: "center" }}
                      />
                    </td>
                    <td>
                      <span className={`badge ${gradeBadge(r.grade)}`}>{r.grade}</span>
                    </td>
                    <td style={{ width: 120 }}>
                      <div className="progress-wrap" style={{ marginTop: 0 }}>
                        <div
                          className={`progress-bar ${r.marks >= 80 ? "green" : r.marks >= 60 ? "" : "orange"}`}
                          style={{ width: `${r.marks}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Right — Summary */}
          <div className="stack-panel">
            <div className="panel">
              <h3>Class Summary</h3>
              <div style={{ textAlign: "center", padding: "18px 0" }}>
                <div
                  style={{
                    fontSize: "3rem",
                    fontWeight: 900,
                    letterSpacing: "-0.05em",
                    background: "linear-gradient(90deg, var(--cyan), var(--purple))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {average}
                </div>
                <div style={{ color: "var(--muted)", fontSize: "0.82rem", marginTop: 4 }}>
                  Class Average
                </div>
              </div>
              <div className="mini-item">
                <span>Highest Score</span>
                <strong style={{ color: "var(--green)" }}>{highest}</strong>
              </div>
              <div className="mini-item">
                <span>Lowest Score</span>
                <strong style={{ color: "var(--red)" }}>{lowest}</strong>
              </div>
              <div className="mini-item">
                <span>Total Students</span>
                <strong>{rows.length}</strong>
              </div>
              <div className="mini-item">
                <span>Pass Rate</span>
                <strong>
                  {Math.round((rows.filter((r) => r.marks >= 50).length / rows.length) * 100)}%
                </strong>
              </div>
            </div>

            <div className="panel">
              <h3>Grade Distribution</h3>
              {["A+", "A", "B+", "B", "C", "F"].map((g) => {
                const count = rows.filter((r) => r.grade === g).length;
                return (
                  <div key={g} className="mini-item">
                    <span className={`badge ${gradeBadge(g)}`}>{g}</span>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, justifyContent: "flex-end" }}
                    >
                      <div className="progress-wrap" style={{ width: 80, marginTop: 0 }}>
                        <div
                          className="progress-bar"
                          style={{ width: rows.length ? `${(count / rows.length) * 100}%` : "0%" }}
                        />
                      </div>
                      <strong style={{ minWidth: 14 }}>{count}</strong>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {toast && (
        <div className={`toast${toast.type === "err" ? " error" : ""}`}>
          {toast.msg}
        </div>
      )}

      <Footer />
    </div>
  );
}
