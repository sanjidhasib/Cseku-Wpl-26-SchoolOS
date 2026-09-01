"use client";

import Link from "next/link";
import Footer from "../components/Footer";

const MILESTONES = [
    { year: "1985", label: "School Founded", desc: "Established as a public secondary institution serving the local community." },
    { year: "1998", label: "SSC Recognition", desc: "Awarded national recognition for outstanding SSC pass rates." },
    { year: "2010", label: "Science Building", desc: "New science & computer lab block commissioned for modern STEM education." },
    { year: "2024", label: "SchoolOS Launch", desc: "Launched digital campus management system for seamless operations." },
];

const STATS = [
    { value: "1985", label: "Year Established" },
    { value: "420+", label: "Students Enrolled" },
    { value: "28", label: "Qualified Teachers" },
    { value: "98%", label: "SSC Pass Rate" },
];

const FACILITIES = [
    { name: "Science Laboratories", desc: "Fully equipped Physics, Chemistry, and Biology labs with modern apparatus." },
    { name: "Computer Lab", desc: "50-seat computer lab with broadband internet for digital literacy." },
    { name: "Library", desc: "Over 8,000 books, periodicals, and digital resources for research." },
    { name: "Sports Ground", desc: "Dedicated cricket and football field plus badminton courts." },
    { name: "Common Room", desc: "Student common room with study areas and recreational facilities." },
    { name: "Mosque", desc: "On-campus mosque for students and staff for daily prayers." },
];

export default function AboutPage() {
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
                    <Link href="/">Home</Link>
                    <Link href="/notices">Notices</Link>
                    <Link href="/about" style={{ color: "var(--cyan)" }}>About</Link>
                    <Link href="/signup" className="secondary-btn" style={{ padding: "7px 18px", fontSize: "0.82rem" }}>
                        Register
                    </Link>
                    <Link href="/login" className="primary-btn" style={{ padding: "7px 18px", fontSize: "0.82rem" }}>
                        Sign In
                    </Link>
                </nav>
            </header>

            <main className="page-shell">

                {/* Hero Banner */}
                <div style={{
                    textAlign: "center",
                    padding: "60px 20px 40px",
                    background: "linear-gradient(135deg, rgba(139,92,246,0.08), rgba(34,211,238,0.08))",
                    borderRadius: "var(--radius-lg)",
                    border: "1px solid var(--border)",
                    marginBottom: 48,
                    position: "relative",
                    overflow: "hidden",
                }}>
                    <div style={{
                        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                        backgroundImage: "radial-gradient(circle at 20% 50%, rgba(139,92,246,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(34,211,238,0.1) 0%, transparent 50%)",
                        pointerEvents: "none",
                    }} />
                    <div style={{
                        display: "inline-block",
                        background: "linear-gradient(135deg, var(--purple), var(--cyan))",
                        borderRadius: 16,
                        padding: "12px 20px",
                        marginBottom: 20,
                        fontSize: "1.5rem",
                        fontWeight: 900,
                        letterSpacing: "0.05em",
                        color: "#fff",
                    }}>SO</div>
                    <h1 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: 12, lineHeight: 1.2 }}>
                        Shapla High School
                    </h1>
                    <p style={{ color: "var(--muted)", fontSize: "1.05rem", maxWidth: 560, margin: "0 auto 8px" }}>
                        Established 1985 · Classes III to X · Govt. Recognised
                    </p>
                    <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
                        Narayanganj, Dhaka, Bangladesh
                    </p>
                </div>

                {/* Stats Bar */}
                <div className="stats-bar" style={{ marginBottom: 48 }}>
                    {STATS.map((s) => (
                        <div key={s.label} className="stats-bar-item">
                            <div className="stats-bar-value">{s.value}</div>
                            <div className="stats-bar-label">{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* About + Headmaster */}
                <div className="landing-layout" style={{ marginBottom: 48 }}>

                    {/* About the School */}
                    <div className="panel info-panel">
                        <p className="eyebrow">Our Story</p>
                        <h2>About Shapla High School</h2>
                        <p style={{ color: "var(--muted)", lineHeight: 1.8, marginTop: 12 }}>
                            Shapla High School has been a proud institution of academic excellence for nearly four decades.
                            Founded in 1985 by a group of community educators and local patrons, the school began with a
                            single building and a shared dream — to give every child in the region access to quality education.
                        </p>
                        <p style={{ color: "var(--muted)", lineHeight: 1.8, marginTop: 12 }}>
                            Today, we stand as one of the leading secondary schools in Narayanganj district, offering a
                            comprehensive curriculum aligned with the National Curriculum and Textbook Board (NCTB). We
                            believe education is not merely the transfer of information, but the development of character,
                            critical thinking and community responsibility.
                        </p>
                        <p style={{ color: "var(--muted)", lineHeight: 1.8, marginTop: 12 }}>
                            Our dedicated corps of <strong style={{ color: "var(--fg)" }}>28 qualified teachers</strong> guide
                            over <strong style={{ color: "var(--fg)" }}>420 students</strong> across Classes 3 to 10 in a nurturing
                            environment that values both academic achievement and personal well-being.
                        </p>

                        <div style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
                            {["NCTB Curriculum", "Govt. Recognised", "Co-Education", "Bilingual"].map((tag) => (
                                <span key={tag} style={{
                                    padding: "5px 14px",
                                    background: "rgba(34,211,238,0.1)",
                                    border: "1px solid rgba(34,211,238,0.25)",
                                    borderRadius: 20,
                                    fontSize: "0.8rem",
                                    color: "var(--cyan)",
                                    fontWeight: 600,
                                }}>{tag}</span>
                            ))}
                        </div>
                    </div>

                    {/* Headmaster Message */}
                    <div className="panel login-panel">
                        <p className="eyebrow">From the Headmaster</p>
                        <h2>A Message of Welcome</h2>

                        {/* Headmaster Photo Placeholder */}
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 16,
                            margin: "20px 0",
                            padding: "16px",
                            background: "rgba(139,92,246,0.08)",
                            border: "1px solid rgba(139,92,246,0.2)",
                            borderRadius: "var(--radius-md)",
                        }}>
                            <div style={{
                                width: 64,
                                height: 64,
                                borderRadius: "50%",
                                background: "linear-gradient(135deg, #7c3aed, #0ea5e9)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: 800,
                                fontSize: "1.4rem",
                                color: "#fff",
                                flexShrink: 0,
                            }}>MR</div>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: "1rem" }}>Md. Rafiqul Islam</div>
                                <div style={{ color: "var(--muted)", fontSize: "0.82rem" }}>Headmaster, Shapla High School</div>
                                <div style={{ color: "var(--muted)", fontSize: "0.8rem" }}>M.A. (Education) · 22 years experience</div>
                            </div>
                        </div>

                        <blockquote style={{
                            borderLeft: "3px solid var(--purple)",
                            paddingLeft: 16,
                            margin: "0 0 14px",
                            color: "var(--muted)",
                            lineHeight: 1.8,
                            fontStyle: "italic",
                            fontSize: "0.9rem",
                        }}>
                            "Education is the most powerful weapon which you can use to change the world. At Shapla High School,
                            we are not just teaching subjects — we are shaping futures."
                        </blockquote>

                        <p style={{ color: "var(--muted)", lineHeight: 1.75, fontSize: "0.88rem" }}>
                            Dear Students, Parents and Guardians,
                        </p>
                        <p style={{ color: "var(--muted)", lineHeight: 1.75, marginTop: 8, fontSize: "0.88rem" }}>
                            It is my honour to welcome you to Shapla High School. For nearly 40 years, this institution has
                            been built on the foundation of discipline, compassion and relentless pursuit of knowledge. Our
                            teachers are committed not just to academic instruction, but to mentoring each student as an
                            individual.
                        </p>
                        <p style={{ color: "var(--muted)", lineHeight: 1.75, marginTop: 8, fontSize: "0.88rem" }}>
                            We have embraced technology — including this digital management system — to bring greater
                            transparency and efficiency to school life. I encourage every family to stay engaged through
                            SchoolOS and be an active partner in your child's journey.
                        </p>
                        <p style={{ color: "var(--cyan)", fontWeight: 600, marginTop: 12, fontSize: "0.88rem" }}>
                            — Md. Rafiqul Islam, Headmaster
                        </p>
                    </div>
                </div>

                {/* Mission & Vision */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: 20,
                    marginBottom: 48,
                }}>
                    {[
                        {
                            title: "Our Mission",
                            color: "rgba(34,211,238,0.1)",
                            border: "rgba(34,211,238,0.25)",
                            accent: "var(--cyan)",
                            text: "To provide quality, inclusive secondary education that equips every student with the knowledge, skills and values needed to thrive in a rapidly changing world.",
                        },
                        {
                            title: "Our Vision",
                            color: "rgba(139,92,246,0.1)",
                            border: "rgba(139,92,246,0.25)",
                            accent: "var(--purple)",
                            text: "To be the premier school in Narayanganj district that transforms young minds into confident, ethical and contributing members of society.",
                        },
                        {
                            title: "Core Values",
                            color: "rgba(34,197,94,0.1)",
                            border: "rgba(34,197,94,0.25)",
                            accent: "var(--green)",
                            text: "Integrity, respect, excellence, inclusivity and community service form the bedrock of everything we do at Shapla High School.",
                        },
                    ].map((item) => (
                        <div key={item.title} className="feature-card" style={{ background: item.color, borderColor: item.border }}>
                            <div className="feature-accent-bar" style={{ background: item.accent }} />
                            <h3 style={{ color: item.accent }}>{item.title}</h3>
                            <p style={{ color: "var(--muted)", lineHeight: 1.7, fontSize: "0.88rem" }}>{item.text}</p>
                        </div>
                    ))}
                </div>

                {/* Milestones */}
                <div className="panel info-panel" style={{ marginBottom: 48 }}>
                    <p className="eyebrow">History</p>
                    <h2>Key Milestones</h2>
                    <div style={{ marginTop: 24, position: "relative" }}>
                        <div style={{
                            position: "absolute", left: 32, top: 0, bottom: 0, width: 2,
                            background: "linear-gradient(to bottom, var(--purple), var(--cyan))",
                            borderRadius: 2,
                        }} />
                        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                            {MILESTONES.map((m) => (
                                <div key={m.year} style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
                                    <div style={{
                                        width: 64,
                                        height: 64,
                                        borderRadius: "50%",
                                        background: "linear-gradient(135deg, var(--purple), var(--cyan))",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontWeight: 800,
                                        fontSize: "0.75rem",
                                        color: "#fff",
                                        flexShrink: 0,
                                        zIndex: 1,
                                    }}>{m.year}</div>
                                    <div style={{ paddingTop: 8 }}>
                                        <div style={{ fontWeight: 700, fontSize: "1rem", marginBottom: 4 }}>{m.label}</div>
                                        <div style={{ color: "var(--muted)", fontSize: "0.88rem", lineHeight: 1.6 }}>{m.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Facilities */}
                <div style={{ marginBottom: 48 }}>
                    <div style={{ textAlign: "center", marginBottom: 28 }}>
                        <p className="eyebrow">Campus</p>
                        <h2 style={{ fontSize: "1.6rem", fontWeight: 800 }}>Our Facilities</h2>
                    </div>
                    <div className="features-grid">
                        {FACILITIES.map((f, i) => (
                            <div key={f.name} className="feature-card" style={{
                                animationDelay: `${i * 0.06}s`,
                                background: "rgba(255,255,255,0.03)",
                                borderColor: "var(--border)",
                            }}>
                                <div className="feature-accent-bar" style={{
                                    background: ["var(--cyan)", "var(--purple)", "var(--green)", "var(--orange)", "var(--cyan)", "var(--purple)"][i],
                                }} />
                                <h3 style={{ fontSize: "0.95rem" }}>{f.name}</h3>
                                <p style={{ color: "var(--muted)", fontSize: "0.84rem", lineHeight: 1.6 }}>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div style={{
                    textAlign: "center",
                    padding: "48px 24px",
                    background: "linear-gradient(135deg, rgba(139,92,246,0.1), rgba(34,211,238,0.1))",
                    borderRadius: "var(--radius-lg)",
                    border: "1px solid var(--border)",
                    marginBottom: 32,
                }}>
                    <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: 12 }}>
                        Join the Shapla Family
                    </h2>
                    <p style={{ color: "var(--muted)", marginBottom: 28, maxWidth: 480, margin: "0 auto 28px", lineHeight: 1.7 }}>
                        Whether you are a student, guardian, or educator — SchoolOS gives you the tools to stay connected and informed.
                    </p>
                    <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
                        <Link href="/login" className="primary-btn" style={{ padding: "13px 32px", fontSize: "1rem" }}>
                            Sign In
                        </Link>
                        <Link href="/signup" className="secondary-btn" style={{ padding: "13px 32px", fontSize: "0.95rem" }}>
                            Create Account
                        </Link>
                    </div>
                </div>

            </main>

            <Footer />
        </div>
    );
}
