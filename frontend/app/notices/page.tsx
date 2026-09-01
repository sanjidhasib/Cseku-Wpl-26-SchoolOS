"use client";

import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const FALLBACK = [
  {
    _id: "1",
    title: "Midterm Exam Schedule",
    description:
      "The midterm examination for all classes (6–10) will begin on September 15, 2026. Students must bring their admit cards. Classes 9 and 10 will have extended paper timings. The full timetable has been posted on the school notice board.",
    date: "2026-09-05",
    audience: "all",
  },
  {
    _id: "2",
    title: "Annual Science Fair 2026",
    description:
      "The Annual Science Fair will be held on September 20, 2026 in the school auditorium. Students wishing to participate must submit their project proposals to their class teacher by September 10. Best projects receive certificates and cash prizes.",
    date: "2026-09-03",
    audience: "students",
  },
  {
    _id: "3",
    title: "School Holiday — National Day",
    description:
      "The school will remain closed on September 8, 2026 on account of the National Holiday. Regular classes will resume on September 9. Any pending assignments should be submitted on the resumption day.",
    date: "2026-09-02",
    audience: "all",
  },
  {
    _id: "4",
    title: "Guardian-Teacher Meeting",
    description:
      "A Guardian-Teacher Meeting (GTM) is scheduled for September 25, 2026 from 10:00 AM to 1:00 PM. All guardians are requested to attend with the student's diary. Individual student performance will be discussed.",
    date: "2026-09-04",
    audience: "guardians",
  },
  {
    _id: "5",
    title: "New Library Books Available",
    description:
      "The school library has received 200 new books covering Science, Literature, History and Mathematics. Students can borrow up to 2 books per week. Library hours are 8:00 AM – 4:00 PM on school days.",
    date: "2026-08-30",
    audience: "students",
  },
  {
    _id: "6",
    title: "Sports Day Registration Open",
    description:
      "Registration for the Annual Sports Day is now open. Students from all classes can participate in track and field events, team sports and talent shows. Submit entry forms to the PE teacher by September 12.",
    date: "2026-08-28",
    audience: "students",
  },
];

const AUDIENCE_BADGE: Record<string, string> = {
  all: "badge-cyan",
  students: "badge-purple",
  guardians: "badge-green",
  teachers: "badge-orange",
};

const AUDIENCE_ICON: Record<string, string> = {
  all: "🌐",
  students: "🎓",
  guardians: "👪",
  teachers: "👨‍🏫",
};

interface Notice {
  _id: string;
  title: string;
  description: string;
  date: string;
  audience: string;
}

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch(`${API}/api/notices`)
      .then((r) => r.json())
      .then((data) => setNotices(Array.isArray(data) && data.length > 0 ? data : FALLBACK))
      .catch(() => setNotices(FALLBACK))
      .finally(() => setLoading(false));
  }, []);

  const filtered = notices.filter((n) => {
    const matchSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.description.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || n.audience === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div>
      <NavBar />
      <main className="page-shell">
        {/* Hero */}
        <section className="hero-panel">
          <div>
            <p className="eyebrow">Announcement</p>
            <h1>Notice Board</h1>
            <p style={{ color: "var(--muted)", marginTop: 6, fontSize: "0.9rem" }}>
              {notices.length} notices published · Stay up to date with school announcements
            </p>
          </div>
          <span className="badge badge-green" style={{ padding: "8px 16px", fontSize: "0.8rem" }}>
            🟢 {notices.length} Active
          </span>
        </section>

        {/* Search + Filter */}
        <div className="search-bar" style={{ marginBottom: 24 }}>
          <input
            className="field-input"
            type="text"
            placeholder="🔍  Search notices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="field-input"
            style={{ maxWidth: 180 }}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">📢 All Audiences</option>
            <option value="students">🎓 Students</option>
            <option value="guardians">👪 Guardians</option>
            <option value="teachers">👨‍🏫 Teachers</option>
          </select>
        </div>

        {/* Notices */}
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="shimmer"
                style={{ height: 120, borderRadius: "var(--radius-lg)" }}
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="panel"
            style={{ textAlign: "center", padding: "48px 24px", color: "var(--muted)" }}
          >
            <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>📭</div>
            <div style={{ fontSize: "1rem", fontWeight: 600 }}>No notices match your search</div>
            <div style={{ fontSize: "0.85rem", marginTop: 6 }}>Try a different keyword or filter</div>
          </div>
        ) : (
          <div className="stack-panel">
            {filtered.map((notice, i) => (
              <div
                key={notice._id}
                className="panel"
                style={{
                  animationDelay: `${i * 0.06}s`,
                  animation: "fadeInUp 0.4s ease both",
                }}
              >
                <div className="notice-head">
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                    <h3 style={{ margin: 0 }}>{notice.title}</h3>
                    <span className={`badge ${AUDIENCE_BADGE[notice.audience] ?? "badge-cyan"}`}>
                      {AUDIENCE_ICON[notice.audience] ?? "📢"} {notice.audience}
                    </span>
                  </div>
                  <span className="notice-date">
                    📅{" "}
                    {new Date(notice.date).toLocaleDateString("en-BD", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <p style={{ color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.75, margin: 0 }}>
                  {notice.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
