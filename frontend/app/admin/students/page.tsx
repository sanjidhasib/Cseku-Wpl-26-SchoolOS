"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import { getUser, authHeaders } from "../../lib/auth";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const CLASS_NUMS = ["3", "4", "5", "6", "7", "8", "9", "10"];
const SECTIONS = ["", "A", "B", "C", "D"];
const GENDERS = ["", "Male", "Female", "Other"];
const BLOOD_GROUPS = ["", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const RELIGIONS = ["", "Islam", "Hinduism", "Christianity", "Buddhism", "Other"];

interface Student {
    _id: string;
    studentId: string;
    name: string;
    classNum: string;
    section: string;
    roll: string;
    gender: string;
    dob: string;
    address: string;
    bloodGroup: string;
    religion: string;
    contact: string;
    guardianName: string;
    guardianContact: string;
    createdAt: string;
}

const EMPTY_FORM = {
    name: "", email: "", password: "", classNum: "3", section: "A", roll: "", gender: "",
    dob: "", address: "", bloodGroup: "", religion: "", contact: "", guardianName: "", guardianContact: "",
};

export default function StudentsPage() {
    const router = useRouter();
    const [activeClass, setActiveClass] = useState("3");
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    const [formErr, setFormErr] = useState("");
    const [saving, setSaving] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);

    useEffect(() => {
        const user = getUser();
        if (!user || user.role !== "admin") { router.push("/login"); return; }
        fetchStudents(activeClass);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeClass]);

    async function fetchStudents(cls: string) {
        setLoading(true);
        try {
            const res = await fetch(`${API}/api/students?class=${cls}`);
            const data = await res.json();
            setStudents(Array.isArray(data) ? data : []);
        } catch { setStudents([]); }
        finally { setLoading(false); }
    }

    const filtered = students.filter((s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.studentId.toLowerCase().includes(search.toLowerCase()) ||
        (s.roll || "").includes(search)
    );

    function openAdd() {
        setEditId(null);
        setForm({ ...EMPTY_FORM, classNum: activeClass });
        setShowForm(true);
        setFormErr("");
    }

    function openEdit(s: Student) {
        setEditId(s._id);
        setForm({
            name: s.name, email: "", password: "", classNum: s.classNum, section: s.section,
            roll: s.roll || "", gender: s.gender || "", dob: s.dob ? s.dob.split("T")[0] : "",
            address: s.address || "", bloodGroup: s.bloodGroup || "", religion: s.religion || "",
            contact: s.contact || "", guardianName: s.guardianName || "", guardianContact: s.guardianContact || "",
        });
        setShowForm(true);
        setFormErr("");
    }

    async function handleSave(e: FormEvent) {
        e.preventDefault();
        setFormErr("");
        if (!form.name || !form.classNum) { setFormErr("Name and class are required"); return; }
        setSaving(true);
        try {
            const url = editId ? `${API}/api/students/${editId}` : `${API}/api/students`;
            const method = editId ? "PUT" : "POST";
            const body = editId ? { ...form } : { ...form };
            const res = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(body) });
            const data = await res.json();
            if (!res.ok) { setFormErr(data.error || "Failed to save"); return; }
            setShowForm(false);
            fetchStudents(activeClass);
        } catch { setFormErr("Network error"); }
        finally { setSaving(false); }
    }

    async function handleDelete(id: string, name: string) {
        if (!confirm(`Delete student "${name}"? This cannot be undone.`)) return;
        try {
            await fetch(`${API}/api/students/${id}`, { method: "DELETE", headers: authHeaders() });
            setStudents((prev) => prev.filter((s) => s._id !== id));
        } catch { alert("Delete failed"); }
    }

    return (
        <div>
            <NavBar />
            <main className="page-shell">
                {/* Header */}
                <section className="hero-panel">
                    <div>
                        <p className="eyebrow">Administration</p>
                        <h1>Student Database</h1>
                        <p style={{ color: "var(--muted)", marginTop: 6, fontSize: "0.9rem" }}>
                            Manage student records across all classes (3 – 10)
                        </p>
                    </div>
                    <div className="button-row" style={{ flexShrink: 0 }}>
                        <button className="primary-btn" onClick={openAdd}>Add Student</button>
                        <Link href="/admin" className="secondary-btn">Back to Dashboard</Link>
                    </div>
                </section>

                {/* Class Tabs */}
                <div className="class-tabs">
                    {CLASS_NUMS.map((c) => (
                        <button
                            key={c}
                            className={`class-tab${activeClass === c ? " active" : ""}`}
                            onClick={() => { setActiveClass(c); setSearch(""); }}
                        >
                            Class {c}
                        </button>
                    ))}
                </div>

                {/* Toolbar */}
                <div className="toolbar" style={{ marginTop: 16 }}>
                    <input
                        type="text"
                        className="field-input"
                        style={{ maxWidth: 320 }}
                        placeholder="Search by name, ID or roll..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <span style={{ color: "var(--muted)", fontSize: "0.85rem", marginLeft: "auto" }}>
                        {filtered.length} student{filtered.length !== 1 ? "s" : ""} in Class {activeClass}
                    </span>
                </div>

                {/* Table */}
                <div className="panel" style={{ padding: 0, overflow: "hidden" }}>
                    {loading ? (
                        <div style={{ padding: 32, textAlign: "center", color: "var(--muted)" }}>Loading...</div>
                    ) : filtered.length === 0 ? (
                        <div style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>
                            {search ? "No students match your search." : `No students in Class ${activeClass} yet.`}
                            {!search && (
                                <div style={{ marginTop: 12 }}>
                                    <button className="primary-btn" onClick={openAdd} style={{ fontSize: "0.85rem" }}>Add First Student</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div style={{ overflowX: "auto" }}>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Roll</th>
                                        <th>Name</th>
                                        <th>Student ID</th>
                                        <th>Section</th>
                                        <th>Gender</th>
                                        <th>Blood</th>
                                        <th>Religion</th>
                                        <th>Guardian</th>
                                        <th>Contact</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((s) => (
                                        <tr key={s._id}>
                                            <td><span className="badge badge-cyan">{s.roll || "—"}</span></td>
                                            <td><strong>{s.name}</strong></td>
                                            <td style={{ color: "var(--muted)", fontSize: "0.8rem" }}>{s.studentId}</td>
                                            <td>{s.section}</td>
                                            <td style={{ color: "var(--muted)" }}>{s.gender || "—"}</td>
                                            <td><span className="badge badge-purple">{s.bloodGroup || "—"}</span></td>
                                            <td style={{ color: "var(--muted)" }}>{s.religion || "—"}</td>
                                            <td>{s.guardianName || "—"}</td>
                                            <td style={{ color: "var(--muted)", fontSize: "0.82rem" }}>{s.contact || s.guardianContact || "—"}</td>
                                            <td>
                                                <div style={{ display: "flex", gap: 6 }}>
                                                    <button className="action-btn" onClick={() => openEdit(s)}>Edit</button>
                                                    <button className="action-btn danger" onClick={() => handleDelete(s._id, s.name)}>Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Add/Edit Modal */}
                {showForm && (
                    <div className="modal-overlay" onClick={() => setShowForm(false)}>
                        <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3>{editId ? "Edit Student" : "Add New Student"}</h3>
                                <button className="modal-close" onClick={() => setShowForm(false)}>×</button>
                            </div>
                            <form onSubmit={handleSave} className="auth-form" style={{ gap: 14 }}>
                                {formErr && <div className="auth-error">{formErr}</div>}

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Full Name *</label>
                                        <input type="text" className="field-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Roll Number</label>
                                        <input type="text" className="field-input" value={form.roll} onChange={(e) => setForm({ ...form, roll: e.target.value })} placeholder="e.g. 01" />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Class *</label>
                                        <select className="field-input" value={form.classNum} onChange={(e) => setForm({ ...form, classNum: e.target.value })}>
                                            {CLASS_NUMS.map((c) => <option key={c} value={c}>Class {c}</option>)}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Section</label>
                                        <select className="field-input" value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })}>
                                            {SECTIONS.filter(Boolean).map((s) => <option key={s} value={s}>Section {s}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Gender</label>
                                        <select className="field-input" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                                            {GENDERS.map((g) => <option key={g} value={g}>{g || "Select"}</option>)}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Date of Birth</label>
                                        <input type="date" className="field-input" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Blood Group</label>
                                        <select className="field-input" value={form.bloodGroup} onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}>
                                            {BLOOD_GROUPS.map((b) => <option key={b} value={b}>{b || "Select"}</option>)}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Religion</label>
                                        <select className="field-input" value={form.religion} onChange={(e) => setForm({ ...form, religion: e.target.value })}>
                                            {RELIGIONS.map((r) => <option key={r} value={r}>{r || "Select"}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Address</label>
                                    <input type="text" className="field-input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Village/Town, District" />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Student Contact</label>
                                        <input type="text" className="field-input" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} placeholder="+880..." />
                                    </div>
                                </div>

                                <div className="form-section-label">Guardian Information</div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Guardian Name</label>
                                        <input type="text" className="field-input" value={form.guardianName} onChange={(e) => setForm({ ...form, guardianName: e.target.value })} placeholder="Guardian full name" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Guardian Contact</label>
                                        <input type="text" className="field-input" value={form.guardianContact} onChange={(e) => setForm({ ...form, guardianContact: e.target.value })} placeholder="+880..." />
                                    </div>
                                </div>

                                {!editId && (
                                    <>
                                        <div className="form-section-label">Login Credentials (optional)</div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label className="form-label">Email</label>
                                                <input type="email" className="field-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="student@email.com" />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Password</label>
                                                <input type="password" className="field-input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Min 6 chars" />
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="button-row" style={{ marginTop: 0 }}>
                                    <button type="submit" className="primary-btn" disabled={saving} style={{ flex: 1 }}>
                                        {saving ? "Saving..." : editId ? "Update Student" : "Add Student"}
                                    </button>
                                    <button type="button" className="secondary-btn" onClick={() => setShowForm(false)}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
