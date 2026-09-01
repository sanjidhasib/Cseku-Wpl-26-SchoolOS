"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiRegister, setAuth, dashboardPath } from "../lib/auth";

const CLASS_NUMS = ["3", "4", "5", "6", "7", "8", "9", "10"];
const SECTIONS = ["A", "B", "C", "D"];
const GENDERS = ["Male", "Female", "Other"];
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const RELIGIONS = ["Islam", "Hinduism", "Christianity", "Buddhism", "Other"];

export default function SignupPage() {
    const router = useRouter();
    const [role, setRole] = useState<"student" | "guardian">("student");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // common
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPw, setConfirmPw] = useState("");
    const [name, setName] = useState("");
    const [showPw, setShowPw] = useState(false);

    // student-specific
    const [classNum, setClassNum] = useState("3");
    const [section, setSection] = useState("A");
    const [roll, setRoll] = useState("");
    const [gender, setGender] = useState("");
    const [dob, setDob] = useState("");
    const [address, setAddress] = useState("");
    const [bloodGroup, setBloodGroup] = useState("");
    const [religion, setReligion] = useState("");
    const [contact, setContact] = useState("");
    const [guardianName, setGuardianName] = useState("");
    const [guardianContact, setGuardianContact] = useState("");

    // guardian-specific
    const [gContact, setGContact] = useState("");
    const [gAddress, setGAddress] = useState("");

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError("");

        if (!name.trim()) { setError("Please enter your full name."); return; }
        if (!email.trim()) { setError("Please enter a valid email address."); return; }
        if (password.length < 6) { setError("Password must be at least 6 characters long."); return; }
        if (password !== confirmPw) { setError("Passwords do not match. Please re-enter."); return; }

        setLoading(true);
        try {
            const profile = role === "student"
                ? { name: name.trim(), classNum, section, roll, gender, dob: dob || undefined, address, bloodGroup, religion, contact, guardianName, guardianContact }
                : { name: name.trim(), contact: gContact, address: gAddress };

            const state = await apiRegister({ email: email.trim(), password, role, profile });
            setAuth(state);
            router.push(dashboardPath(state.user.role));
        } catch (err: unknown) {
            if (err instanceof TypeError && (err.message.includes("fetch") || err.message.includes("Failed to fetch") || err.message.includes("network"))) {
                setError("Cannot connect to the server. Please make sure the backend is running and try again.");
            } else {
                const msg = err instanceof Error ? err.message : "Registration failed. Please try again.";
                setError(msg);
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-shell">
            <div className="auth-card" style={{ maxWidth: 560, width: "100%" }}>
                <Link href="/" className="auth-brand" style={{ textDecoration: "none" }}>
                    <div className="brand-mark">SO</div>
                    <div>
                        <div className="brand-name">SchoolOS</div>
                        <div className="brand-sub">Smart Campus Management</div>
                    </div>
                </Link>

                <div className="auth-divider" />

                <h2 className="auth-title">Create Your Account</h2>
                <p className="auth-subtitle">Register as a student or guardian to get started</p>

                <div className="role-tabs" style={{ gridTemplateColumns: "1fr 1fr" }}>
                    {(["student", "guardian"] as const).map((r) => (
                        <button
                            key={r}
                            type="button"
                            className={`role-tab${role === r ? " active" : ""}`}
                            onClick={() => { setRole(r); setError(""); }}
                        >
                            {r === "student" ? "Student" : "Guardian"}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {error && (
                        <div style={{
                            background: "rgba(239,68,68,0.1)",
                            border: "1px solid rgba(239,68,68,0.3)",
                            borderRadius: "var(--radius-md)",
                            padding: "12px 14px",
                            color: "#fca5a5",
                            fontSize: "0.85rem",
                            lineHeight: 1.5,
                            marginBottom: 4,
                        }}>{error}</div>
                    )}

                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input type="text" className="field-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" required />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input type="email" className="field-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required />
                        </div>
                        {role === "student" && (
                            <div className="form-group">
                                <label className="form-label">Contact Number</label>
                                <input type="text" className="field-input" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="+880 1XX XXXXXXX" />
                            </div>
                        )}
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <div className="pw-wrap">
                                <input type={showPw ? "text" : "password"} className="field-input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters" required />
                                <button type="button" className="pw-toggle" onClick={() => setShowPw(!showPw)} tabIndex={-1}>
                                    {showPw ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Confirm Password</label>
                            <input type={showPw ? "text" : "password"} className="field-input" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} placeholder="Repeat password" required />
                        </div>
                    </div>

                    {role === "student" && (
                        <>
                            <div className="form-section-label">Academic Information</div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Class</label>
                                    <select className="field-input" value={classNum} onChange={(e) => setClassNum(e.target.value)}>
                                        {CLASS_NUMS.map((c) => <option key={c} value={c}>Class {c}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Section</label>
                                    <select className="field-input" value={section} onChange={(e) => setSection(e.target.value)}>
                                        {SECTIONS.map((s) => <option key={s} value={s}>Section {s}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Roll Number</label>
                                    <input type="text" className="field-input" value={roll} onChange={(e) => setRoll(e.target.value)} placeholder="e.g. 01" />
                                </div>
                            </div>

                            <div className="form-section-label">Personal Information</div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Gender</label>
                                    <select className="field-input" value={gender} onChange={(e) => setGender(e.target.value)}>
                                        <option value="">Select</option>
                                        {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Date of Birth</label>
                                    <input type="date" className="field-input" value={dob} onChange={(e) => setDob(e.target.value)} />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Blood Group</label>
                                    <select className="field-input" value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)}>
                                        <option value="">Select</option>
                                        {BLOOD_GROUPS.map((b) => <option key={b} value={b}>{b}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Religion</label>
                                    <select className="field-input" value={religion} onChange={(e) => setReligion(e.target.value)}>
                                        <option value="">Select</option>
                                        {RELIGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Home Address</label>
                                <input type="text" className="field-input" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Village/Town, District" />
                            </div>

                            <div className="form-section-label">Guardian Information</div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Guardian Name</label>
                                    <input type="text" className="field-input" value={guardianName} onChange={(e) => setGuardianName(e.target.value)} placeholder="Guardian full name" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Guardian Contact</label>
                                    <input type="text" className="field-input" value={guardianContact} onChange={(e) => setGuardianContact(e.target.value)} placeholder="+880 1XX XXXXXXX" />
                                </div>
                            </div>
                        </>
                    )}

                    {role === "guardian" && (
                        <>
                            <div className="form-section-label">Contact Information</div>
                            <div className="form-group">
                                <label className="form-label">Phone Number</label>
                                <input type="text" className="field-input" value={gContact} onChange={(e) => setGContact(e.target.value)} placeholder="+880 1XX XXXXXXX" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Address</label>
                                <input type="text" className="field-input" value={gAddress} onChange={(e) => setGAddress(e.target.value)} placeholder="Village/Town, District" />
                            </div>
                        </>
                    )}

                    <button type="submit" className="primary-btn auth-submit" disabled={loading}>
                        {loading ? "Creating account…" : "Create Account"}
                    </button>
                </form>

                <p className="auth-footer-text">
                    Already have an account?{" "}
                    <Link href="/login" style={{ color: "var(--cyan)" }}>Sign in</Link>
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
