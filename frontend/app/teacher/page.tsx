"use client";

import Link from "next/link";
import NavBar from "../components/NavBar";
import StatCard from "../components/StatCard";

export default function TeacherPage() {
  return (
    <main className="page-shell">
      <NavBar />

      <section className="hero-panel">
        <div>
          <p className="eyebrow">Teacher</p>
          <h1>Teacher dashboard</h1>
        </div>
        <Link className="primary-btn" href="/attendance">
          Take attendance
        </Link>
      </section>

      <section className="stats-grid">
        <StatCard title="Assigned classes" value="04" accent="purple" />
        <StatCard title="Students" value="146" accent="cyan" />
        <StatCard title="Notice updates" value="02" accent="green" />
        <StatCard title="Pending marks" value="08" accent="orange" />
      </section>

      <section className="content-grid">
        <div className="panel">
          <h3>Class overview</h3>
          <ul className="list">
            <li>Class 6A - Science</li>
            <li>Class 8B - English</li>
            <li>Class 9A - Math</li>
            <li>Class 10B - Bangla</li>
          </ul>
        </div>

        <div className="panel">
          <h3>Quick actions</h3>
          <div className="stack-actions">
            <Link className="secondary-btn" href="/results">Enter results</Link>
            <Link className="secondary-btn" href="/notices">Publish notice</Link>
            <Link className="secondary-btn" href="/ai">AI tutoring help</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
