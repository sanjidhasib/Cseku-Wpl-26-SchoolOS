import Link from "next/link";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-inner">
                {/* Column 1 — Brand */}
                <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                        <div
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 11,
                                background: "linear-gradient(135deg, var(--cyan), var(--purple))",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: 800,
                                fontSize: "0.95rem",
                                color: "#fff",
                            }}
                        >
                            SO
                        </div>
                        <div className="footer-brand-name">SchoolOS</div>
                    </div>
                    <p className="footer-brand-desc">
                        An all-in-one smart school management system for administrators, teachers,
                        students and guardians. Streamlining education with technology.
                    </p>
                    <div style={{ display: "flex", gap: 10 }}>
                        {["🎓", "📚", "🏫"].map((emoji, i) => (
                            <span
                                key={i}
                                style={{
                                    width: 34,
                                    height: 34,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    background: "rgba(255,255,255,0.05)",
                                    border: "1px solid var(--border)",
                                    borderRadius: "50%",
                                    fontSize: "1rem",
                                    cursor: "pointer",
                                }}
                            >
                                {emoji}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Column 2 — Quick Links */}
                <div>
                    <p className="footer-heading">Quick Links</p>
                    <ul className="footer-links">
                        <li><Link href="/admin">Admin Dashboard</Link></li>
                        <li><Link href="/teacher">Teacher Portal</Link></li>
                        <li><Link href="/student">Student Portal</Link></li>
                        <li><Link href="/guardian">Guardian Portal</Link></li>
                        <li><Link href="/notices">Notice Board</Link></li>
                        <li><Link href="/attendance">Attendance</Link></li>
                        <li><Link href="/results">Results</Link></li>
                        <li><Link href="/ai">AI Tutor</Link></li>
                    </ul>
                </div>

                {/* Column 3 — Contact */}
                <div>
                    <p className="footer-heading">Contact</p>
                    <div className="footer-contact-item">
                        <span>🏫</span>
                        <span>SchoolOS Campus, Dhaka, Bangladesh</span>
                    </div>
                    <div className="footer-contact-item">
                        <span>📞</span>
                        <span>+880 1700 000000</span>
                    </div>
                    <div className="footer-contact-item">
                        <span>✉️</span>
                        <span>info@schoolos.edu.bd</span>
                    </div>
                    <div className="footer-contact-item">
                        <span>⏰</span>
                        <span>Mon – Fri, 8:00 AM – 4:30 PM</span>
                    </div>
                    <div
                        style={{
                            marginTop: 16,
                            padding: "10px 14px",
                            background: "rgba(34,211,238,0.07)",
                            border: "1px solid rgba(34,211,238,0.2)",
                            borderRadius: "var(--radius-sm)",
                            fontSize: "0.82rem",
                            color: "var(--cyan)",
                        }}
                    >
                        🟢 System Status: All services operational
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <span>© {new Date().getFullYear()} SchoolOS. All rights reserved.</span>
                <span>
                    Built with ❤️ for better education ·{" "}
                    <Link href="/notices">Notice Board</Link> ·{" "}
                    <Link href="/ai">AI Tutor</Link>
                </span>
            </div>
        </footer>
    );
}
