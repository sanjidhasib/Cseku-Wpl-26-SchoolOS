"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiLogin, setAuth, dashboardPath, isAuthenticated, getUser } from "../lib/auth";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("student");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPw, setShowPw] = useState(false);

    // redirect if already logged in
    useEffect(() => {
        if (isAuthenticated()) {
            const user = getUser();
            if (user) router.push(dashboardPath(user.role));
        }
    }, [router]);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError("");
        if (!email.trim()) { setError("Please enter your email address."); return; }
        if (!password) { setError("Please enter your password."); return; }
        setLoading(true);
        try {
            const state = await apiLogin(email.trim(), password);
            // verify role matches what was selected
            if (state.user.role !== role) {
                setError(`This account is registered as "${state.user.role}", not "${role}". Please select the correct role tab.`);
                setLoading(false);
                return;
            }
            setAuth(state);
            router.push(dashboardPath(state.user.role));
        } catch (err: unknown) {
            if (err instanceof TypeError && (err.message.includes("fetch") || err.message.includes("network") || err.message.includes("Failed"))) {
                setError("Cannot connect to the server. Make sure the backend is running on port 5000.");
            } else {
                const msg = err instanceof Error ? err.message : "Login failed. Please try again.";
                setError(msg);
            }
        } finally {
            setLoading(false);
        }
    }

    const ROLES = [
        { value: "admin", label: "Administrator" },
        { value: "teacher", label: "Teacher" },
        { value: "student", label: "Student" },
        { value: "guardian", label: "Guardian" },
    ];

    return (
        <div className="auth-shell">
            <div className="auth-card">
                {/* Brand */}
                <Link href="/" className="auth-brand" style={{ textDecoration: "none" }}>
                    <div className="brand-mark">SO</div>
                    <div>
                        <div className="brand-name">SchoolOS</div>
                        <div className="brand-sub">Smart Campus Management</div>
                    </div>
                </Link>

                <div className="auth-divider" />

                <h2 className="auth-title">Sign In to Your Portal</h2>
                <p className="auth-subtitle">Enter your credentials to access your dashboard</p>

                {/* Role Tabs */}
                <div className="role-tabs">
                    {ROLES.map((r) => (
                        <button
                            key={r.value}
                            type="button"
                            className={`role-tab${role === r.value ? " active" : ""}`}
                            onClick={() => { setRole(r.value); setError(""); }}
                        >
                            {r.label}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {error && (
                        <div className="auth-error" style={{
                            background: "rgba(239,68,68,0.1)",
                            border: "1px solid rgba(239,68,68,0.3)",
                            borderRadius: "var(--radius-md)",
                            padding: "12px 14px",
                            color: "#fca5a5",
                            fontSize: "0.85rem",
                            lineHeight: 1.5,
                        }}>{error}</div>
                    )}

                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            className="field-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            required
                            autoComplete="email"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div className="pw-wrap">
                            <input
                                type={showPw ? "text" : "password"}
                                className="field-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                className="pw-toggle"
                                onClick={() => setShowPw(!showPw)}
                                tabIndex={-1}
                            >
                                {showPw ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="primary-btn auth-submit"
                        disabled={loading}
                    >
                        {loading ? "Signing in…" : `Sign In as ${ROLES.find((r) => r.value === role)?.label}`}
                    </button>
                </form>

                <p className="auth-footer-text">
                    New student or guardian?{" "}
                    <Link href="/signup" style={{ color: "var(--cyan)" }}>
                        Create an account
                    </Link>
                </p>
                <p className="auth-footer-text" style={{ marginTop: 4 }}>
                    <Link href="/" style={{ color: "var(--muted)", fontSize: "0.8rem" }}>
                        ← Back to home
                    </Link>
                </p>
            </div>
        </div>
    );
}
