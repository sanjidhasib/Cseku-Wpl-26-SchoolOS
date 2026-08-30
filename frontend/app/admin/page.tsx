"use client";

import Link from "next/link";
import NavBar from "../components/NavBar";
import StatCard from "../components/StatCard";

export default function AdminPage() {
  return (
    <main className="page-shell">
      <NavBar />

      <section className="hero-panel">
        <div>
          <p className="eyebrow">Administrator</p>
          <h1>School administration dashboard</h1>
        </div>
        <Link className="primary-btn" href="/notices">
          Publish notice
        </Link>
      </section>

      <section className="stats-grid">
        <StatCard title="Students" value="420" accent="purple" />
        <StatCard title="Teachers" value="28" accent="blue" />
        <StatCard title="Classes" value="12" accent="green" />
        <StatCard title="Notices" value="06" accent="orange" />
      </section>

      <section className="content-grid">
        <div className="panel">
          <h3>Quick access</h3>
          <ul className="list">
            <li><Link href="/admin">Overview</Link></li>
            <li><Link href="/notices">Notice board</Link></li>
            <li><Link href="/attendance">Attendance</Link></li>
            <li><Link href="/results">Results</Link></li>
            <li><Link href="/ai">AI tutor</Link></li>
          </ul>
        </div>

        <div className="panel">
          <h3>Recent updates</h3>
          <div className="mini-item">
            <strong>Holiday</strong>
            <span>School will be closed on Friday for national holiday.</span>
          </div>
          <div className="mini-item">
            <strong>Exam schedule</strong>
            <span>Midterm exam registration is open for Class 9 and 10.</span>
          </div>
        </div>
      </section>
    </main>
  );
}
