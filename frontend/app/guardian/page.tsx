"use client";

import Link from "next/link";
import NavBar from "../components/NavBar";
import StatCard from "../components/StatCard";
import Footer from "../components/Footer";

const ATTENDANCE_WEEK = [
  { day: "Mon", present: true },
  { day: "Tue", present: true },
  { day: "Wed", present: false },
  { day: "Thu", present: true },
  { day: "Fri", present: true },
  { day: "Sat", present: true },
  { day: "Sun", present: false },
];

const RECENT_RESULTS = [
  { subject: "Mathematics", marks: 82, grade: "A", change: "+6" },
  { subject: "Science", marks: 88, grade: "A", change: "+4" },
  { subject: "Bangla", marks: 90, grade: "A+", change: "+2" },
  { subject: "English", marks: 76, grade: "B+", change: "-1" },
];

export default function GuardianPage() {
  return (
    <div>
      <NavBar />
      <main className="page-shell">
        {/* Hero */}
        <section className="hero-panel">
          <div>
            <p className="eyebrow">Guardian</p>
            <h1>Guardian Dashboard</h1>
            <p style={{ color: "var(--muted)", marginTop: 6, fontSize: "0.9rem" }}>
              Hello, Md. Rahman! Monitoring Rahim Hossain — Class 9A.
            </p>
          </div>
          <div className="button-row" style={{ flexShrink: 0 }}>
            <Link className="primary-btn" href="/notices">
              📢 View Notices
            </Link>
          </div>
        </section>

        {/* Stats */}
        <section className="stats-grid">
          <StatCard title="Child" value="Rahim" accent="purple" icon="🎓" trend="Class 9A" />
          <StatCard title="Attendance" value="92%" accent="green" icon="📋" trend="12/13 days" />
          <StatCard title="Performance" value="A" accent="blue" icon="📊" trend="GPA 4.25" />
          <StatCard title="Class" value="9A" accent="orange" icon="🏫" trend="Roll 01" />
        </section>

        {/* Content */}
        <section className="content-grid">
          {/* Left — Child profile + Attendance Calendar */}
          <div className="stack-panel">
            <div className="panel">
              <h3>Child Profile</h3>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  marginBottom: 20,
                  padding: "16px",
                  background: "rgba(139,92,246,0.08)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid rgba(139,92,246,0.2)",
                }}
              >
                <div className="avatar" style={{ width: 58, height: 58, fontSize: "1.3rem" }}>
                  RH
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "1.05rem" }}>Rahim Hossain</div>
                  <div style={{ color: "var(--muted)", fontSize: "0.82rem" }}>Class 9A · Roll No. 01</div>
                  <div style={{ color: "var(--cyan)", fontSize: "0.75rem", marginTop: 3 }}>
                    STU-0001 · Active
                  </div>
                </div>
              </div>
              <div className="profile-row"><span>Guardian Name</span><strong>Md. Abdul Rahman</strong></div>
              <div className="profile-row"><span>Relation</span><strong>Father</strong></div>
              <div className="profile-row"><span>Phone</span><strong>+880 170 0000001</strong></div>
              <div className="profile-row"><span>Email</span><strong>rahman@example.com</strong></div>
              <div className="profile-row"><span>Last Update</span><strong>Today, 8:00 AM</strong></div>
            </div>

            <div className="panel">
              <h3>Attendance — Last 7 Days</h3>
              <div style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
                {ATTENDANCE_WEEK.map((d) => (
                  <div
                    key={d.day}
                    style={{
                      flex: 1,
                      minWidth: 52,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: "var(--radius-sm)",
                        background: d.present
                          ? "rgba(34,197,94,0.18)"
                          : "rgba(248,113,113,0.18)",
                        border: `1px solid ${d.present ? "rgba(34,197,94,0.4)" : "rgba(248,113,113,0.4)"}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1rem",
                      }}
                    >
                      {d.present ? "✅" : "❌"}
                    </div>
                    <span style={{ fontSize: "0.72rem", color: "var(--muted)", fontWeight: 600 }}>
                      {d.day}
                    </span>
                  </div>
                ))}
              </div>
              <div
                style={{
                  marginTop: 16,
                  padding: "10px 14px",
                  background: "rgba(34,197,94,0.08)",
                  border: "1px solid rgba(34,197,94,0.2)",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.85rem",
                  color: "var(--green)",
                }}
              >
                ✅ Present 5 / 7 days this week — 71% this week, 92% overall
              </div>
            </div>
          </div>

          {/* Right — Results + Notices */}
          <div className="stack-panel">
            <div className="panel">
              <h3>Recent Exam Results</h3>
              {RECENT_RESULTS.map((r) => (
                <div key={r.subject} className="mini-item">
                  <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{r.subject}</span>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <span style={{ color: "var(--muted)", fontSize: "0.85rem" }}>{r.marks}/100</span>
                    <span
                      className={`badge ${r.grade === "A+" ? "badge-green" : r.grade === "A" ? "badge-cyan" : "badge-purple"}`}
                    >
                      {r.grade}
                    </span>
                    <span
                      style={{
                        fontSize: "0.78rem",
                        color: r.change.startsWith("+") ? "var(--green)" : "var(--red)",
                        fontWeight: 600,
                      }}
                    >
                      {r.change}
                    </span>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 14 }}>
                <Link href="/results" className="secondary-btn" style={{ width: "100%", justifyContent: "center" }}>
                  View Full Report →
                </Link>
              </div>
            </div>

            <div className="panel">
              <h3>Important Notices</h3>
              <div className="mini-item">
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.88rem", marginBottom: 3 }}>
                    Guardian-Teacher Meeting
                  </div>
                  <div style={{ color: "var(--muted)", fontSize: "0.8rem" }}>
                    Sep 25, 10 AM – 1 PM at school.
                  </div>
                </div>
                <span className="badge badge-red">Attend</span>
              </div>
              <div className="mini-item">
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.88rem", marginBottom: 3 }}>
                    Midterm Exam
                  </div>
                  <div style={{ color: "var(--muted)", fontSize: "0.8rem" }}>
                    Starting Sep 15. Admit card required.
                  </div>
                </div>
                <span className="badge badge-orange">Sep 15</span>
              </div>
              <Link href="/notices" style={{ display: "block", marginTop: 14, color: "var(--cyan)", fontSize: "0.85rem" }}>
                View all notices →
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
