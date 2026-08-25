"use client";

import Link from "next/link";
import NavBar from "../components/NavBar";
import StatCard from "../components/StatCard";

export default function StudentPage() {
  return (
    <main className="page-shell">
      <NavBar />

      <section className="hero-panel">
        <div>
          <p className="eyebrow">Student</p>
          <h1>Student dashboard</h1>
        </div>
        <Link className="primary-btn" href="/ai">AI tutor</Link>
      </section>

      <section className="stats-grid">
        <StatCard title="Attendance" value="92%" accent="green" />
        <StatCard title="Average" value="85" accent="blue" />
        <StatCard title="Notices" value="03" accent="orange" />
        <StatCard title="Class" value="9A" accent="purple" />
      </section>

      <section className="content-grid">
        <div className="panel">
          <h3>Profile</h3>
          <div className="profile-row"><span>Name</span><strong>Student 01</strong></div>
          <div className="profile-row"><span>Class</span><strong>9A</strong></div>
          <div className="profile-row"><span>Guardian</span><strong>Md. Rahman</strong></div>
        </div>

        <div className="panel">
          <h3>Academic summary</h3>
          <div className="mini-item">
            <strong>Math</strong>
            <span>82</span>
          </div>
          <div className="mini-item">
            <strong>Science</strong>
            <span>88</span>
          </div>
          <div className="mini-item">
            <strong>Bangla</strong>
            <span>90</span>
          </div>
        </div>
      </section>
    </main>
  );
}
