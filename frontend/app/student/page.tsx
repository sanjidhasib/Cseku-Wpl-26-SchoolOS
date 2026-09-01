"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import StatCard from "../components/StatCard";
import Footer from "../components/Footer";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Notice { _id: string; title: string; date: string; audience: string; }

const SUBJECTS = [
  { name: "Mathematics", marks: 82, max: 100 },
  { name: "Science", marks: 88, max: 100 },
  { name: "Bangla", marks: 90, max: 100 },
  { name: "English", marks: 76, max: 100 },
  { name: "Social Studies", marks: 84, max: 100 },
];

const EXAMS = [
  { name: "Math Midterm", date: "Sep 15", class: "9A", type: "Midterm" },
  { name: "Science Quiz", date: "Sep 18", class: "9A", type: "Quiz" },
  { name: "Bangla Final", date: "Sep 25", class: "9A", type: "Final" },
];

function grade(m: number) {
  if (m >= 90) return { label: "A+", c: "badge-green" };
  if (m >= 80) return { label: "A", c: "badge-cyan" };
  if (m >= 75) return { label: "B+", c: "badge-purple" };
  if (m >= 65) return { label: "B", c: "badge-orange" };
  return { label: "C", c: "badge-red" };
}

export default function StudentPage() {
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    fetch(`${API}/api/notices`)
      .then((r) => r.json())
      .then((data) => setNotices(Array.isArray(data) ? data.slice(0, 3) : []))
      .catch(() => setNotices([]));
  }, []);

  return (
    <div>
      <NavBar />
      <main className="page-shell">
        {/* Hero */}
        <section className="hero-panel">
          <div>
            <p className="eyebrow">Student</p>
            <h1>Student Dashboard</h1>
            <p style={{ color: "var(--muted)", marginTop: 6, fontSize: "0.9rem" }}>
              Welcome back, Rahim! Class 9A · Roll 01
            </p>
          </div>
          <div className="button-row" style={{ flexShrink: 0 }}>
            <Link className="primary-btn" href="/ai">
              AI Tutor
            </Link>
            <Link className="secondary-btn" href="/results">
              My Results
            </Link>
          </div>
        </section>

        {/* Stats */}
        <section className="stats-grid">
          <StatCard title="Attendance" value="92%" accent="green" trend="12/13 days" />
          <StatCard title="Class Average" value="84" accent="blue" trend="+6 points" />
          <StatCard title="Class" value="9A" accent="purple" trend="Roll: 01" />
          <StatCard title="Notices" value="03" accent="orange" trend="2 unread" />
        </section>

        {/* Content */}
        <section className="content-grid">
          {/* Left — Subjects + Exams */}
          <div className="stack-panel">
            <div className="panel">
              <h3>Academic Performance</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {SUBJECTS.map((s) => {
                  const g = grade(s.marks);
                  return (
                    <div key={s.name}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 5,
                        }}
                      >
                        <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{s.name}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
                            {s.marks}/{s.max}
                          </span>
                          <span className={`badge ${g.c}`}>{g.label}</span>
                        </div>
                      </div>
                      <div className="progress-wrap">
                        <div className="progress-bar" style={{ width: `${s.marks}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="panel">
              <h3>Upcoming Exams</h3>
              <table className="schedule-table">
                <thead>
                  <tr>
                    <th>Exam</th>
                    <th>Date</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {EXAMS.map((e, i) => (
                    <tr key={i}>
                      <td><strong>{e.name}</strong></td>
                      <td>
                        <span className="badge badge-cyan">{e.date}</span>
                      </td>
                      <td style={{ color: "var(--muted)", fontSize: "0.85rem" }}>{e.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right — Profile + Notices */}
          <div className="stack-panel">
            <div className="panel">
              <h3>My Profile</h3>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  marginBottom: 20,
                  padding: "14px",
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border)",
                }}
              >
                <div
                  className="avatar"
                  style={{ width: 54, height: 54, fontSize: "1.2rem" }}
                >
                  RH
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "1rem" }}>Rahim Hossain</div>
                  <div style={{ color: "var(--muted)", fontSize: "0.82rem" }}>Class 9A · Roll 01</div>
                  <div style={{ color: "var(--cyan)", fontSize: "0.75rem", marginTop: 2 }}>
                    Student ID: STU-0001
                  </div>
                </div>
              </div>
              <div className="profile-row"><span>Guardian</span><strong>Md. Rahman</strong></div>
              <div className="profile-row"><span>Phone</span><strong>+880 170 0000001</strong></div>
              <div className="profile-row"><span>Section</span><strong>9A</strong></div>
              <div className="profile-row"><span>GPA</span><strong>4.25 / 5.0</strong></div>
            </div>

            <div className="panel">
              <div className="section-header">
                <h3>Latest Notices</h3>
                <Link href="/notices" style={{ color: "var(--cyan)", fontSize: "0.8rem" }}>
                  View all →
                </Link>
              </div>
              {notices.length > 0 ? (
                notices.map((n) => (
                  <div key={n._id} className="mini-item">
                    <span style={{ fontSize: "0.88rem" }}>{n.title}</span>
                    <span style={{ color: "var(--muted)", fontSize: "0.75rem", whiteSpace: "nowrap" }}>
                      {new Date(n.date).toLocaleDateString("en-BD", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                ))
              ) : (
                <>
                  <div className="mini-item">
                    <span>Midterm Exam Schedule</span>
                    <span style={{ color: "var(--muted)", fontSize: "0.75rem" }}>Sep 5</span>
                  </div>
                  <div className="mini-item">
                    <span>Annual Science Fair</span>
                    <span style={{ color: "var(--muted)", fontSize: "0.75rem" }}>Sep 3</span>
                  </div>
                  <div className="mini-item">
                    <span>School Holiday — National Day</span>
                    <span style={{ color: "var(--muted)", fontSize: "0.75rem" }}>Sep 2</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
