"use client";

import Link from "next/link";
import NavBar from "../components/NavBar";
import StatCard from "../components/StatCard";

export default function GuardianPage() {
  return (
    <main className="page-shell">
      <NavBar />

      <section className="hero-panel">
        <div>
          <p className="eyebrow">Guardian</p>
          <h1>Guardian dashboard</h1>
        </div>
        <Link className="primary-btn" href="/notices">View notices</Link>
      </section>

      <section className="stats-grid">
        <StatCard title="Child" value="Student 01" accent="purple" />
        <StatCard title="Attendance" value="92%" accent="green" />
        <StatCard title="Performance" value="A-" accent="blue" />
        <StatCard title="Class" value="9A" accent="orange" />
      </section>

      <section className="content-grid">
        <div className="panel">
          <h3>Student overview</h3>
          <div className="profile-row"><span>Guardian</span><strong>Md. Rahman</strong></div>
          <div className="profile-row"><span>Phone</span><strong>+88017xxxxx</strong></div>
          <div className="profile-row"><span>Last update</span><strong>Today</strong></div>
        </div>

        <div className="panel">
          <h3>Recent issue</h3>
          <div className="mini-item">
            <strong>Attendance</strong>
            <span>Student was present for 12 of 13 school days.</span>
          </div>
          <div className="mini-item">
            <strong>Result</strong>
            <span>Math score improved by 6 points this month.</span>
          </div>
        </div>
      </section>
    </main>
  );
}
