"use client";

import Link from "next/link";
import NavBar from "../components/NavBar";
import StatCard from "../components/StatCard";
import Footer from "../components/Footer";

const SCHEDULE = [
  { time: "8:00 AM", class: "Class 6A", subject: "Science", room: "101" },
  { time: "9:30 AM", class: "Class 8B", subject: "English", room: "203" },
  { time: "11:00 AM", class: "Class 9A", subject: "Math", room: "305" },
  { time: "1:00 PM", class: "Class 10B", subject: "Bangla", room: "104" },
];

const SUBJECTS = [
  { name: "Mathematics", students: 36, avg: 78, color: "var(--purple)" },
  { name: "English", students: 34, avg: 82, color: "var(--cyan)" },
  { name: "Science", students: 36, avg: 75, color: "var(--green)" },
  { name: "Bangla", students: 40, avg: 85, color: "var(--orange)" },
];

export default function TeacherPage() {
  return (
    <div>
      <NavBar />
      <main className="page-shell">
        {/* Hero */}
        <section className="hero-panel">
          <div>
            <p className="eyebrow">Teacher</p>
            <h1>Teacher Dashboard</h1>
            <p style={{ color: "var(--muted)", marginTop: 6, fontSize: "0.9rem" }}>
              Good morning, Ms. Fatima! You have 4 classes today.
            </p>
          </div>
          <div className="button-row" style={{ flexShrink: 0 }}>
            <Link className="primary-btn" href="/attendance">
              Take Attendance
            </Link>
            <Link className="secondary-btn" href="/results">
              Enter Results
            </Link>
          </div>
        </section>

        {/* Stats */}
        <section className="stats-grid">
          <StatCard title="Assigned Classes" value="04" accent="purple" trend="All active" />
          <StatCard title="Total Students" value="146" accent="blue" trend="+3 this week" />
          <StatCard title="Pending Marks" value="08" accent="orange" trend="Due Friday" />
          <StatCard title="Notices Posted" value="02" accent="green" trend="This month" />
        </section>

        {/* Content */}
        <section className="content-grid">
          {/* Left — Schedule + Performance */}
          <div className="stack-panel">
            <div className="panel">
              <h3>Today&apos;s Schedule — {new Date().toLocaleDateString("en-BD", { weekday: "long", day: "numeric", month: "long" })}</h3>
              <table className="schedule-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Class</th>
                    <th>Subject</th>
                    <th>Room</th>
                  </tr>
                </thead>
                <tbody>
                  {SCHEDULE.map((s, i) => (
                    <tr key={i}>
                      <td>
                        <span className="badge badge-cyan">{s.time}</span>
                      </td>
                      <td><strong>{s.class}</strong></td>
                      <td style={{ color: "var(--muted)" }}>{s.subject}</td>
                      <td style={{ color: "var(--muted)" }}>Room {s.room}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="panel">
              <h3>Subject Performance Overview</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {SUBJECTS.map((s) => (
                  <div key={s.name}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{s.name}</span>
                      <span style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
                        Avg: <strong style={{ color: "var(--ink)" }}>{s.avg}%</strong> · {s.students} students
                      </span>
                    </div>
                    <div className="progress-wrap">
                      <div
                        className="progress-bar"
                        style={{ width: `${s.avg}%`, background: `linear-gradient(90deg, ${s.color}, ${s.color}99)` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Quick Actions + Notices */}
          <div className="stack-panel">
            <div className="panel">
              <h3>Quick Actions</h3>
              <div className="stack-actions">
                <Link className="secondary-btn" href="/attendance">
                  Mark Today&apos;s Attendance
                </Link>
                <Link className="secondary-btn" href="/results">
                  Enter Exam Results
                </Link>
                <Link className="secondary-btn" href="/notices">
                  Publish Notice
                </Link>
                <Link className="secondary-btn" href="/ai">
                  AI Tutoring Help
                </Link>
              </div>
            </div>

            <div className="panel">
              <h3>Upcoming Deadlines</h3>
              <div className="mini-item">
                <span>Midterm results — 9A</span>
                <span className="badge badge-red">Sep 10</span>
              </div>
              <div className="mini-item">
                <span>Assignment marks — 8B</span>
                <span className="badge badge-orange">Sep 12</span>
              </div>
              <div className="mini-item">
                <span>Attendance report — 10B</span>
                <span className="badge badge-cyan">Sep 15</span>
              </div>
              <div className="mini-item">
                <span>Science fair project review</span>
                <span className="badge badge-purple">Sep 18</span>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
