"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const [role, setRole] = useState("student");
  const [user, setUser] = useState("student01@example.com");

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    router.push(`/${role}`);
  };

  return (
    <main className="page-shell login-shell">
      <header className="topbar">
        <div className="brand-wrap">
          <div className="brand-mark">SO</div>
          <div>
            <div className="brand-name">SchoolOS</div>
            <div className="small-text">Smart campus management</div>
          </div>
        </div>
      </header>

      <section className="login-layout">
        <div className="panel info-panel">
          <p className="eyebrow">Welcome</p>
          <h1>SchoolOS</h1>
          <p>
            A simple and colorful school management platform for administrators,
            teachers, students, and guardians.
          </p>
          <div className="feature-list">
            <span>Attendance</span>
            <span>Results</span>
            <span>Notices</span>
            <span>AI Tutor</span>
          </div>
        </div>

        <div className="panel login-panel">
          <h2>Login</h2>
          <form onSubmit={onSubmit} className="login-form">
            <label>
              Email or ID
              <input
                type="text"
                className="field-input"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                placeholder="student01@example.com"
              />
            </label>

            <label>
              Role
              <select
                className="field-input"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="guardian">Guardian</option>
                <option value="admin">Administrator</option>
              </select>
            </label>

            <div className="button-row">
              <button type="submit" className="primary-btn">Login</button>
              <Link href="/notices" className="secondary-btn">View notices</Link>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
