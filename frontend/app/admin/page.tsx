"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { getUser } from "../lib/auth";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const ACTIVITY = [
  { color: "var(--cyan)", text: "New student enrolled in Class 9A", time: "2 min ago" },
  { color: "var(--green)", text: "Attendance for 9B saved by Ms. Fatima", time: "18 min ago" },
  { color: "var(--orange)", text: "New notice published: Science Fair", time: "1 hr ago" },
  { color: "var(--purple)", text: "Midterm results entered for Class 10A", time: "3 hrs ago" },
  { color: "var(--pink)", text: "Guardian meeting reminder sent to all", time: "Yesterday" },
];

const QUICK_ACTIONS = [
  { label: "Student Database", href: "/admin/students", color: "var(--cyan)" },
  { label: "Teacher Management", href: "/admin/teachers", color: "var(--purple)" },
  { label: "Attendance", href: "/attendance", color: "var(--green)" },
  { label: "Exam Results", href: "/results", color: "var(--orange)" },
  { label: "Notices", href: "/notices", color: "var(--pink)" },
  { label: "AI Tutor", href: "/ai", color: "var(--muted)" },
];

interface Stats { students: number; teachers: number }

export default function AdminPage() {
  const [user, setUser] = useState<ReturnType<typeof getUser>>(null);
  const [stats, setStats] = useState<Stats>({ students: 0, teachers: 0 });

  useEffect(() => {
    setUser(getUser());
    // fetch live counts
    Promise.all([
      fetch(`${API}/api/students`).then((r) => r.json()).catch(() => []),
      fetch(`${API}/api/teachers`).then((r) => r.json()).catch(() => []),
    ]).then(([students, teachers]) => {
      setStats({
        students: Array.isArray(students) ? students.length : 0,
        teachers: Array.isArray(teachers) ? teachers.length : 0,
      });
    });
  }, []);

  return (
    <div>
      <NavBar />
      <main className="page-shell">
        {/* Hero */}
        <section className="hero-panel">
          <div>
            <p className="eyebrow">Administrator</p>
            <h1>School Administration Dashboard</h1>
            <p style={{ color: "var(--muted)", marginTop: 6, fontSize: "0.9rem" }}>
              Welcome back{user?.email ? `, ${user.email}` : ""}! Here is an overview of SchoolOS today.
            </p>
          </div>
          <div className="button-row" style={{ flexShrink: 0 }}>
            <Link className="primary-btn" href="/notices">Publish Notice</Link>
            <Link className="secondary-btn" href="/attendance">Attendance</Link>
          </div>
        </section>

        {/* Stats */}
        <section className="stats-grid">
          <div className="stat-card purple">
            <div className="stat-title">Total Students</div>
            <div className="stat-value">{stats.students || 420}</div>
            <div className="stat-trend">Across all classes</div>
          </div>
          <div className="stat-card blue">
            <div className="stat-title">Teachers</div>
            <div className="stat-value">{stats.teachers || 28}</div>
            <div className="stat-trend">Active staff</div>
          </div>
          <div className="stat-card green">
            <div className="stat-title">Active Classes</div>
            <div className="stat-value">8</div>
            <div className="stat-trend">Class 3 – 10</div>
          </div>
          <div className="stat-card orange">
            <div className="stat-title">Open Notices</div>
            <div className="stat-value">06</div>
            <div className="stat-trend">2 urgent</div>
          </div>
        </section>

        {/* Content */}
        <section className="content-grid">
          {/* Left */}
          <div className="stack-panel">
            <div className="panel">
              <div className="section-header">
                <h3>Recent Activity</h3>
                <span className="badge badge-cyan">Live</span>
              </div>
              <ul className="activity-feed">
                {ACTIVITY.map((a, i) => (
                  <li key={i} className="activity-item">
                    <div className="activity-dot" style={{ background: a.color }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "0.88rem" }}>{a.text}</div>
                      <div className="activity-time">{a.time}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="panel">
              <h3 style={{ marginBottom: 16 }}>Quick Actions</h3>
              <div className="quick-actions">
                {QUICK_ACTIONS.map((q) => (
                  <Link key={q.label} href={q.href} className="quick-card">
                    <div className="quick-card-dot" style={{ background: q.color }} />
                    <span className="quick-card-label">{q.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="stack-panel">
            <div className="panel">
              <h3>School Overview</h3>
              <div className="mini-item">
                <span>Today&apos;s Attendance</span>
                <div>
                  <strong>388 / 420</strong>
                  <div className="progress-wrap" style={{ marginTop: 4, width: 100 }}>
                    <div className="progress-bar green" style={{ width: "92%" }} />
                  </div>
                </div>
              </div>
              <div className="mini-item">
                <span>Average Class Result</span>
                <strong>79.4%</strong>
              </div>
              <div className="mini-item">
                <span>Notices This Week</span>
                <strong>3 new</strong>
              </div>
              <div className="mini-item">
                <span>AI Tutor Sessions</span>
                <strong>147 today</strong>
              </div>

              <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 8 }}>
                <Link href="/admin/students" className="secondary-btn" style={{ justifyContent: "center" }}>
                  View Student Database
                </Link>
                <Link href="/admin/teachers" className="secondary-btn" style={{ justifyContent: "center" }}>
                  Manage Teachers
                </Link>
              </div>
            </div>

            <div className="panel">
              <h3>Recent Notices</h3>
              <div className="mini-item">
                <span>
                  <span className="badge badge-red" style={{ marginRight: 8 }}>Urgent</span>
                  Midterm Exam Schedule
                </span>
                <span style={{ color: "var(--muted)", fontSize: "0.78rem" }}>Sep 5</span>
              </div>
              <div className="mini-item">
                <span>
                  <span className="badge badge-cyan" style={{ marginRight: 8 }}>Event</span>
                  Annual Science Fair
                </span>
                <span style={{ color: "var(--muted)", fontSize: "0.78rem" }}>Sep 3</span>
              </div>
              <div className="mini-item">
                <span>
                  <span className="badge badge-orange" style={{ marginRight: 8 }}>Holiday</span>
                  National Day Closure
                </span>
                <span style={{ color: "var(--muted)", fontSize: "0.78rem" }}>Sep 2</span>
              </div>
              <div style={{ marginTop: 14 }}>
                <Link href="/notices" className="secondary-btn" style={{ width: "100%", justifyContent: "center" }}>
                  View All Notices
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
