"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import { getUser, authHeaders } from "../../lib/auth";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const CLASS_NUMS = ["3", "4", "5", "6", "7", "8", "9", "10"];
const SECTIONS = ["A", "B", "C", "D"];
const SUBJECTS = ["Bangla", "English", "Mathematics", "Science", "Social Studies", "ICT", "Religion", "Physics", "Chemistry", "Biology", "History", "Geography"];
const GENDERS = ["", "Male", "Female", "Other"];

interface Assignment { classNum: string; section: string; subject: string }
interface Teacher {
    _id: string;
    teacherId: string;
    name: string;
    contact: string;
    gender: string;
    dob: string;
    address: string;
    qualification: string;
    joinDate: string;
    assignments: Assignment[];
}

const EMPTY_FORM = {
    name: "", email: "", password: "", teacherId: "", contact: "", gender: "",
    dob: "", address: "", qualification: "", joinDate: "",
};

export default function TeachersPage() {
    const router = useRouter();
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    const [formErr, setFormErr] = useState("");
    const [saving, setSaving] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    // assignment modal
    const [assignTeacher, setAssignTeacher] = useState<Teacher | null>(null);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [assignSaving, setAssignSaving] = useState(false);

    useEffect(() => {
        const user = getUser();
        if (!user || user.role !== "admin") { router.push("/login"); return; }
        fetchTeachers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function fetchTeachers() {
        setLoading(true);
        try {
            const res = await fetch(`${API}/api/teachers`);
            const data = await res.json();
            setTeachers(Array.isArray(data) ? data : []);
        } catch { setTeachers([]); }
        finally { setLoading(false); }
    }

    const filtered = teachers.filter((t) =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.teacherId.toLowerCase().includes(search.toLowerCase()) ||
        (t.qualification || "").toLowerCase().includes(search.toLowerCase())
    );

    function openAdd() {
        setEditId(null); setForm(EMPTY_FORM); setShowForm(true); setFormErr("");
    }

    function openEdit(t: Teacher) {
        setEditId(t._id);
        setForm({
            name: t.name, email: "", password: "", teacherId: t.teacherId,
            contact: t.contact || "", gender: t.gender || "",
            dob: t.dob ? t.dob.split("T")[0] : "",
            address: t.address || "", qualification: t.qualification || "",
            joinDate: t.joinDate ? t.joinDate.split("T")[0] : "",
        });
        setShowForm(true); setFormErr("");
    }

    function openAssign(t: Teacher) {
        setAssignTeacher(t);
        setAssignments(t.assignments && t.assignments.length > 0 ? [...t.assignments] : [{ classNum: "3", section: "A", subject: "Bangla" }]);
    }

    async function handleSave(e: FormEvent) {
        e.preventDefault(); setFormErr("");
        if (!form.name) { setFormErr("Name is required"); return; }
        setSaving(true);
        try {
            const url = editId ? `${API}/api/teachers/${editId}` : `${API}/api/teachers`;
            const method = editId ? "PUT" : "POST";
            const res = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(form) });
            const data = await res.json();
            if (!res.ok) { setFormErr(data.error || "Failed to save"); return; }
            setShowForm(false);
            fetchTeachers();
        } catch { setFormErr("Network error"); }
        finally { setSaving(false); }
    }

    async function handleSaveAssign() {
        if (!assignTeacher) return;
        setAssignSaving(true);
        try {
            const res = await fetch(`${API}/api/teachers/${assignTeacher._id}/assign`, {
                method: "PUT",
                headers: authHeaders(),
                body: JSON.stringify({ assignments }),
            });
            if (!res.ok) { alert("Failed to save assignments"); return; }
            setAssignTeacher(null);
            fetchTeachers();
        } catch { alert("Network error"); }
        finally { setAssignSaving(false); }
    }

    async function handleDelete(id: string, name: string) {
        if (!confirm(`Delete teacher "${name}"? This cannot be undone.`)) return;
        try {
            await fetch(`${API}/api/teachers/${id}`, { method: "DELETE", headers: authHeaders() });
            setTeachers((prev) => prev.filter((t) => t._id !== id));
        } catch { alert("Delete failed"); }
    }

    function addAssignmentRow() {
        setAssignments([...assignments, { classNum: "3", section: "A", subject: "Bangla" }]);
    }

    function removeAssignmentRow(i: number) {
        setAssignments(assignments.filter((_, idx) => idx !== i));
    }

    function updateAssignment(i: number, field: keyof Assignment, value: string) {
        const updated = [...assignments];
        updated[i] = { ...updated[i], [field]: value };
        setAssignments(updated);
    }

    return (
        <div>
            <NavBar />
            <main className="page-shell">
                <section className="hero-panel">
                    <div>
                        <p className="eyebrow">Administration</p>
                        <h1>Teacher Management</h1>
                        <p style={{ color: "var(--muted)", marginTop: 6, fontSize: "0.9rem" }}>
                            Manage teacher profiles and class/subject assignments
                        </p>
                    </div>
                    <div className="button-row" style={{ flexShrink: 0 }}>
                        <button className="primary-btn" onClick={openAdd}>Add Teacher</button>
                        <Link href="/admin" className="secondary-btn">Back to Dashboard</Link>
                    </div>
                </section>

                <div className="toolbar" style={{ marginTop: 8 }}>
                    <input
                        type="text" className="field-input" style={{ maxWidth: 340 }}
                        placeholder="Search by name, ID or qualification..."
                        value={search} onChange={(e) => setSearch(e.target.value)}
                    />
                    <span style={{ color: "var(--muted)", fontSize: "0.85rem", marginLeft: "auto" }}>
                        {filtered.length} teacher{filtered.length !== 1 ? "s" : ""}
                    </span>
                </div>

                <div className="panel" style={{ padding: 0, overflow: "hidden" }}>
                    {loading ? (
                        <div style={{ padding: 32, textAlign: "center", color: "var(--muted)" }}>Loading...</div>
                    ) : filtered.length === 0 ? (
                        <div style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>
                            {search ? "No teachers match your search." : "No teachers added yet."}
                            {!search && (
                                <div style={{ marginTop: 12 }}>
                                    <button className="primary-btn" onClick={openAdd} style={{ fontSize: "0.85rem" }}>Add First Teacher</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div style={{ overflowX: "auto" }}>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Teacher ID</th>
                                        <th>Name</th>
                                        <th>Gender</th>
                                        <th>Qualification</th>
                                        <th>Contact</th>
                                        <th>Join Date</th>
                                        <th>Assigned Classes</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((t) => (
                                        <tr key={t._id}>
                                            <td style={{ color: "var(--muted)", fontSize: "0.8rem" }}>{t.teacherId}</td>
                                            <td><strong>{t.name}</strong></td>
                                            <td style={{ color: "var(--muted)" }}>{t.gender || "—"}</td>
                                            <td style={{ color: "var(--muted)" }}>{t.qualification || "—"}</td>
                                            <td style={{ color: "var(--muted)", fontSize: "0.82rem" }}>{t.contact || "—"}</td>
                                            <td style={{ color: "var(--muted)", fontSize: "0.8rem" }}>
                                                {t.joinDate ? new Date(t.joinDate).toLocaleDateString("en-BD", { year: "numeric", month: "short", day: "numeric" }) : "—"}
                                            </td>
                                            <td>
                                                {t.assignments && t.assignments.length > 0 ? (
                                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                                                        {t.assignments.slice(0, 3).map((a, i) => (
                                                            <span key={i} className="badge badge-purple" style={{ fontSize: "0.65rem" }}>
                                                                Cls {a.classNum}{a.section} · {a.subject}
                                                            </span>
                                                        ))}
                                                        {t.assignments.length > 3 && (
                                                            <span className="badge badge-cyan" style={{ fontSize: "0.65rem" }}>+{t.assignments.length - 3} more</span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span style={{ color: "var(--muted)", fontSize: "0.82rem" }}>None assigned</span>
                                                )}
                                            </td>
                                            <td>
                                                <div style={{ display: "flex", gap: 6 }}>
                                                    <button className="action-btn" onClick={() => openAssign(t)}>Assign</button>
                                                    <button className="action-btn" onClick={() => openEdit(t)}>Edit</button>
                                                    <button className="action-btn danger" onClick={() => handleDelete(t._id, t.name)}>Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Add/Edit Teacher Modal */}
                {showForm && (
                    <div className="modal-overlay" onClick={() => setShowForm(false)}>
                        <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3>{editId ? "Edit Teacher" : "Add New Teacher"}</h3>
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
                                        <label className="form-label">Teacher ID</label>
                                        <input type="text" className="field-input" value={form.teacherId} onChange={(e) => setForm({ ...form, teacherId: e.target.value })} placeholder="e.g. TCH-001" />
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
                                        <label className="form-label">Contact</label>
                                        <input type="text" className="field-input" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} placeholder="+880..." />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Join Date</label>
                                        <input type="date" className="field-input" value={form.joinDate} onChange={(e) => setForm({ ...form, joinDate: e.target.value })} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Qualification</label>
                                    <input type="text" className="field-input" value={form.qualification} onChange={(e) => setForm({ ...form, qualification: e.target.value })} placeholder="e.g. B.Sc, M.A. in English" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Address</label>
                                    <input type="text" className="field-input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Village/Town, District" />
                                </div>
                                {!editId && (
                                    <>
                                        <div className="form-section-label">Login Credentials (optional)</div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label className="form-label">Email</label>
                                                <input type="email" className="field-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="teacher@email.com" />
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
                                        {saving ? "Saving..." : editId ? "Update Teacher" : "Add Teacher"}
                                    </button>
                                    <button type="button" className="secondary-btn" onClick={() => setShowForm(false)}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Assign Classes Modal */}
                {assignTeacher && (
                    <div className="modal-overlay" onClick={() => setAssignTeacher(null)}>
                        <div className="modal-box" style={{ maxWidth: 640 }} onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3>Assign Classes — {assignTeacher.name}</h3>
                                <button className="modal-close" onClick={() => setAssignTeacher(null)}>×</button>
                            </div>
                            <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginBottom: 16 }}>
                                Set which classes and subjects this teacher is responsible for.
                            </p>

                            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                {assignments.map((a, i) => (
                                    <div key={i} className="assign-row">
                                        <select className="field-input" value={a.classNum} onChange={(e) => updateAssignment(i, "classNum", e.target.value)}>
                                            {CLASS_NUMS.map((c) => <option key={c} value={c}>Class {c}</option>)}
                                        </select>
                                        <select className="field-input" value={a.section} onChange={(e) => updateAssignment(i, "section", e.target.value)}>
                                            {SECTIONS.map((s) => <option key={s} value={s}>Section {s}</option>)}
                                        </select>
                                        <select className="field-input" value={a.subject} onChange={(e) => updateAssignment(i, "subject", e.target.value)}>
                                            {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                        <button className="action-btn danger" style={{ whiteSpace: "nowrap" }} onClick={() => removeAssignmentRow(i)}>Remove</button>
                                    </div>
                                ))}
                            </div>

                            <div className="button-row" style={{ marginTop: 16 }}>
                                <button className="secondary-btn" onClick={addAssignmentRow}>+ Add Row</button>
                                <button className="primary-btn" disabled={assignSaving} onClick={handleSaveAssign} style={{ flex: 1 }}>
                                    {assignSaving ? "Saving..." : "Save Assignments"}
                                </button>
                                <button className="secondary-btn" onClick={() => setAssignTeacher(null)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
