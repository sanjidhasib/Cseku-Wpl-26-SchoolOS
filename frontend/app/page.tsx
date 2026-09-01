"use client";

import Link from "next/link";
import Footer from "./components/Footer";

const FEATURES = [
  {
    title: "Attendance Tracking",
    desc: "Real-time daily attendance marking with class-wise reports, trends and percentage tracking for all students.",
    color: "rgba(34,211,238,0.12)",
    border: "rgba(34,211,238,0.25)",
    accent: "var(--cyan)",
  },
  {
    title: "Academic Results",
    desc: "Enter, manage and publish exam results. Auto-compute grades, averages and subject-wise performance insights.",
    color: "rgba(139,92,246,0.12)",
    border: "rgba(139,92,246,0.25)",
    accent: "var(--purple)",
  },
  {
    title: "Notice Board",
    desc: "Publish and receive important announcements for students, guardians and teachers — categorised and searchable.",
    color: "rgba(34,197,94,0.12)",
    border: "rgba(34,197,94,0.25)",
    accent: "var(--green)",
  },
  {
    title: "AI Tutor",
    desc: "Bilingual AI learning assistant supporting Bangla & English. Ask any textbook question and get instant help.",
    color: "rgba(245,158,11,0.12)",
    border: "rgba(245,158,11,0.25)",
    accent: "var(--orange)",
  },
];

const STATS = [
  { value: "420+", label: "Students Enrolled" },
  { value: "28", label: "Expert Teachers" },
  { value: "8", label: "Active Classes (3–10)" },
  { value: "99%", label: "System Uptime" },
];

const ROLES = [
  { role: "Admin", desc: "Full school management & oversight", abbr: "AD" },
  { role: "Teacher", desc: "Classes, attendance & exam results", abbr: "TC" },
  { role: "Student", desc: "Results, notices & AI tutor", abbr: "ST" },
  { role: "Guardian", desc: "Monitor your child's performance", abbr: "GD" },
];

export default function HomePage() {
  return (
    <div className="login-shell">
      {/* Top Nav */}
      <header className="topbar" style={{ position: "sticky", top: 0 }}>
        <Link href="/" className="brand-wrap" style={{ textDecoration: "none" }}>
          <div className="brand-mark">SO</div>
          <div>
            <div className="brand-name">SchoolOS</div>
            <div className="brand-sub">Smart Campus Management</div>
          </div>
        </Link>
        <nav className="nav-links">
          <Link href="/about">About</Link>
          <Link href="/notices">Notices</Link>
          <Link href="/ai">AI Tutor</Link>
          <Link href="/signup" className="secondary-btn" style={{ padding: "7px 18px", fontSize: "0.82rem" }}>
            Register
          </Link>
          <Link href="/login" className="primary-btn" style={{ padding: "7px 18px", fontSize: "0.82rem" }}>
            Sign In
          </Link>
        </nav>
      </header>

      <main className="page-shell">
        {/* Hero */}
        <div className="landing-hero">
          <h1 className="hero-title">
            The Smart Way to<br />Manage Your School
          </h1>
          <p className="hero-sub">
            SchoolOS brings together attendance, results, notices and AI-powered tutoring
            in one beautiful, easy-to-use platform — built for Bangladeshi schools.
          </p>
          <div className="button-row" style={{ justifyContent: "center" }}>
            <Link href="/login" className="primary-btn" style={{ padding: "13px 32px", fontSize: "1rem" }}>
              Get Started
            </Link>
            <Link href="/notices" className="secondary-btn" style={{ padding: "13px 32px", fontSize: "1rem" }}>
              View Notices
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="feature-card"
              style={{ background: f.color, borderColor: f.border, animationDelay: `${i * 0.08}s` }}
            >
              <div className="feature-accent-bar" style={{ background: f.accent }} />
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Stats Bar */}
        <div className="stats-bar">
          {STATS.map((s) => (
            <div key={s.label} className="stats-bar-item">
              <div className="stats-bar-value">{s.value}</div>
              <div className="stats-bar-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* School Intro Teaser */}
        <div style={{
          background: "linear-gradient(135deg, rgba(139,92,246,0.07), rgba(34,211,238,0.07))",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          padding: "40px 36px",
          marginBottom: 40,
          display: "flex",
          gap: 40,
          alignItems: "center",
          flexWrap: "wrap",
        }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <p className="eyebrow">Our School</p>
            <h2 style={{ fontSize: "1.7rem", fontWeight: 800, marginBottom: 12 }}>Shapla High School</h2>
            <p style={{ color: "var(--muted)", lineHeight: 1.75, marginBottom: 16 }}>
              Established in 1985, Shapla High School is a government-recognised secondary institution serving
              over 420 students across Classes 3 to 10. For nearly four decades, we have been committed to
              quality education, character building, and community development in Narayanganj district.
            </p>
            <Link href="/about" className="secondary-btn" style={{ display: "inline-flex", padding: "10px 24px", fontSize: "0.88rem" }}>
              Learn More About Us
            </Link>
          </div>
          <div style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(139,92,246,0.25)",
            borderRadius: "var(--radius-md)",
            padding: "24px 28px",
            minWidth: 220,
            flexShrink: 0,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
              <div style={{
                width: 52, height: 52, borderRadius: "50%",
                background: "linear-gradient(135deg, #7c3aed, #0ea5e9)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 800, fontSize: "1rem", color: "#fff", flexShrink: 0,
              }}>MR</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>Md. Rafiqul Islam</div>
                <div style={{ color: "var(--muted)", fontSize: "0.78rem" }}>Headmaster</div>
              </div>
            </div>
            <p style={{ color: "var(--muted)", fontSize: "0.83rem", lineHeight: 1.7, fontStyle: "italic", borderLeft: "2px solid var(--purple)", paddingLeft: 12 }}>
              &ldquo;We are not just teaching subjects — we are shaping futures.&rdquo;
            </p>
            <Link href="/about#headmaster" style={{ color: "var(--cyan)", fontSize: "0.8rem", marginTop: 10, display: "inline-block" }}>
              Read full message &rarr;
            </Link>
          </div>
        </div>

        {/* Info + CTA */}
        <div className="landing-layout">
          {/* Info Panel */}
          <div className="panel info-panel">
            <p className="eyebrow">Welcome to SchoolOS</p>
            <h2>One Platform for Every School Role</h2>
            <p style={{ color: "var(--muted)", lineHeight: 1.7, marginTop: 8 }}>
              Whether you are an administrator managing the whole institution, a teacher
              tracking student progress, a student checking your results, or a guardian
              monitoring your child's performance — SchoolOS has a personalised dashboard
              designed just for you.
            </p>

            <div className="feature-list">
              <span>Daily Attendance</span>
              <span>Exam Results</span>
              <span>Notice Board</span>
              <span>AI Tutor</span>
              <span>Guardian Portal</span>
              <span>Admin Dashboard</span>
            </div>

            <div style={{ marginTop: 28, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {ROLES.map((r) => (
                <div
                  key={r.role}
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-md)",
                    padding: "14px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: "linear-gradient(135deg, var(--purple), var(--cyan))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: "0.75rem",
                      color: "#fff",
                      flexShrink: 0,
                    }}
                  >
                    {r.abbr}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{r.role}</div>
                    <div style={{ color: "var(--muted)", fontSize: "0.78rem" }}>{r.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sign-In CTA Panel */}
          <div className="panel login-panel">
            <p className="eyebrow">Portal Access</p>
            <h2>Start Using SchoolOS</h2>
            <p style={{ color: "var(--muted)", marginTop: 4, marginBottom: 24, lineHeight: 1.7, fontSize: "0.9rem" }}>
              Sign in to your personalised dashboard. If you're a new student or guardian,
              create a free account in seconds.
            </p>

            <div className="stack-actions" style={{ gap: 12 }}>
              <Link href="/login" className="primary-btn" style={{ justifyContent: "center", padding: "14px 0", fontSize: "1rem" }}>
                Sign In
              </Link>
              <Link href="/signup" className="secondary-btn" style={{ justifyContent: "center", padding: "14px 0", fontSize: "0.95rem" }}>
                Create an Account
              </Link>
              <Link href="/notices" className="secondary-btn" style={{ justifyContent: "center", padding: "12px 0", fontSize: "0.88rem" }}>
                View Public Notices
              </Link>
            </div>

            <div style={{
              marginTop: 28,
              background: "rgba(34,211,238,0.06)",
              border: "1px solid rgba(34,211,238,0.18)",
              borderRadius: "var(--radius-md)",
              padding: "16px",
            }}>
              <div style={{ fontWeight: 600, fontSize: "0.88rem", marginBottom: 6 }}>What you can do after signing in</div>
              {["View your personalised dashboard", "Track attendance and results", "Read school notices", "Chat with the AI Tutor"].map((t) => (
                <div key={t} style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--muted)", fontSize: "0.82rem", padding: "4px 0" }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--cyan)", flexShrink: 0 }} />
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
