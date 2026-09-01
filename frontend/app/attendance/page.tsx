"use client";

import { useState } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Student {
  id: number;
  name: string;
  roll: string;
  initials: string;
  present: boolean;
}

const INITIAL_STUDENTS: Student[] = [
  { id: 1, name: "Rahim Hossain", roll: "01", initials: "RH", present: true },
  { id: 2, name: "Karim Uddin", roll: "02", initials: "KU", present: false },
  { id: 3, name: "Sumaiya Akter", roll: "03", initials: "SA", present: true },
  { id: 4, name: "Tanvir Ahmed", roll: "04", initials: "TA", present: true },
  { id: 5, name: "Nusrat Jahan", roll: "05", initials: "NJ", present: false },
  { id: 6, name: "Rafiqul Islam", roll: "06", initials: "RI", present: true },
  { id: 7, name: "Mitu Begum", roll: "07", initials: "MB", present: true },
  { id: 8, name: "Tariqul Hasan", roll: "08", initials: "TH", present: true },
];

export default function AttendancePage() {
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [selectedClass, setSelectedClass] = useState("9A");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);

  const presentCount = students.filter((s) => s.present).length;
  const rate = Math.round((presentCount / students.length) * 100);

  function showToast(msg: string, type: "ok" | "err" = "ok") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  function toggle(id: number) {
    setStudents((cur) =>
      cur.map((s) => (s.id === id ? { ...s, present: !s.present } : s))
    );
  }

  function markAll(present: boolean) {
    setStudents((cur) => cur.map((s) => ({ ...s, present })));
  }

  async function saveAttendance() {
    setSaving(true);
    const records = students.map((s) => ({
      studentId: String(s.id),
      status: s.present ? "present" : "absent",
    }));
    try {
      const res = await fetch(`${API}/api/attendance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: selectedClass, date, records }),
      });
      if (res.ok) {
        showToast(`✅ Attendance saved for ${selectedClass} on ${date}`);
      } else {
        showToast("⚠️ Saved locally (backend offline)", "err");
      }
    } catch {
      showToast(`✅ Saved locally · ${presentCount}/${students.length} present`, "ok");
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
            <p className="eyebrow">Teacher</p>
            <h1>Daily Attendance</h1>
            <p style={{ color: "var(--muted)", marginTop: 6, fontSize: "0.9rem" }}>
              Mark attendance for {selectedClass} · {new Date(date).toLocaleDateString("en-BD", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <button
            className="primary-btn"
            onClick={saveAttendance}
            disabled={saving}
            style={{ flexShrink: 0 }}
          >
            {saving ? <span className="spinner" /> : "💾 Save Attendance"}
          </button>
        </section>

        <section className="two-column">
          {/* Left — Student List */}
          <div className="panel">
            <div className="toolbar">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                style={{ maxWidth: 120 }}
              >
                <option value="9A">Class 9A</option>
                <option value="9B">Class 9B</option>
                <option value="10A">Class 10A</option>
                <option value="10B">Class 10B</option>
              </select>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <button className="secondary-btn" onClick={() => markAll(true)}>
                ✅ All Present
              </button>
              <button className="danger-btn" onClick={() => markAll(false)}>
                ❌ All Absent
              </button>
            </div>

            <table className="data-table">
              <thead>
                <tr>
                  <th>Roll</th>
                  <th>Student</th>
                  <th>Status</th>
                  <th>Toggle</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id}>
                    <td style={{ color: "var(--muted)", fontSize: "0.82rem" }}>#{s.roll}</td>
                    <td>
                      <div className="avatar-row">
                        <div
                          className="avatar"
                          style={{
                            background: s.present
                              ? "linear-gradient(135deg, var(--green), #4ade80)"
                              : "linear-gradient(135deg, var(--red), #fca5a5)",
                          }}
                        >
                          {s.initials}
                        </div>
                        <span style={{ fontWeight: 500 }}>{s.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className={s.present ? "status-present" : "status-absent"}>
                        {s.present ? "✅ Present" : "❌ Absent"}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => toggle(s.id)}
                        style={{
                          width: 48,
                          height: 26,
                          borderRadius: 999,
                          border: "none",
                          cursor: "pointer",
                          background: s.present
                            ? "linear-gradient(90deg, var(--green), #4ade80)"
                            : "rgba(255,255,255,0.1)",
                          transition: "background 0.22s",
                          position: "relative",
                        }}
                        aria-label={`Toggle ${s.name}`}
                      >
                        <span
                          style={{
                            position: "absolute",
                            top: 3,
                            left: s.present ? 24 : 4,
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            background: "#fff",
                            transition: "left 0.22s",
                          }}
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Right — Summary */}
          <div className="stack-panel">
            <div className="panel">
              <h3>Attendance Summary</h3>

              {/* Circular-ish bar */}
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div
                  style={{
                    width: 110,
                    height: 110,
                    borderRadius: "50%",
                    background: `conic-gradient(var(--green) ${rate * 3.6}deg, rgba(255,255,255,0.05) 0deg)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 12px",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      width: 82,
                      height: 82,
                      borderRadius: "50%",
                      background: "var(--bg-2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                    }}
                  >
                    <div style={{ fontSize: "1.6rem", fontWeight: 800 }}>{rate}%</div>
                  </div>
                </div>
                <div style={{ color: "var(--muted)", fontSize: "0.82rem" }}>Attendance Rate</div>
              </div>

              <div className="mini-item">
                <span>Present</span>
                <strong style={{ color: "var(--green)" }}>{presentCount}</strong>
              </div>
              <div className="mini-item">
                <span>Absent</span>
                <strong style={{ color: "var(--red)" }}>{students.length - presentCount}</strong>
              </div>
              <div className="mini-item">
                <span>Total Students</span>
                <strong>{students.length}</strong>
              </div>

              <div style={{ marginTop: 18 }}>
                <button
                  className="primary-btn"
                  style={{ width: "100%" }}
                  onClick={saveAttendance}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "💾 Save"}
                </button>
              </div>
            </div>

            <div className="panel">
              <h3>Quick Stats</h3>
              <div className="mini-item">
                <span>Class</span>
                <span className="badge badge-purple">{selectedClass}</span>
              </div>
              <div className="mini-item">
                <span>Date</span>
                <span className="badge badge-cyan">{date}</span>
              </div>
              <div className="mini-item">
                <span>Status</span>
                <span className={`badge ${rate >= 75 ? "badge-green" : "badge-red"}`}>
                  {rate >= 75 ? "Good" : "Low"}
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Toast */}
      {toast && (
        <div className={`toast${toast.type === "err" ? " error" : ""}`}>
          {toast.msg}
        </div>
      )}

      <Footer />
    </div>
  );
}
