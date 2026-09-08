"use client";

import { useState, useRef, useEffect, useId, useCallback } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { NCTB_CLASSES, SAMPLE_QUESTIONS_MAP } from "./data";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface AnswerSource {
  book: string;
  chapter: string;
  section: string;
  page: number | null;
}

type MsgRole = "user" | "assistant";

interface ChatMsg {
  id: string;
  role: MsgRole;
  text: string;
  time: string;
  sources?: AnswerSource[];
}

function AnswerText({ text }: { text: string }) {
  const paras = text.split(/\n\n+/).filter((p) => p.trim());
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {paras.map((para, pi) => {
        const lines = para.split(/\n/).filter((l) => l.trim());
        const isList =
          lines.length > 1 &&
          lines.every(
            (l) => /^[-*]/.test(l.trim()) || /^\d+[.)]\s/.test(l.trim())
          );
        if (isList) {
          return (
            <ul key={pi} style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 3 }}>
              {lines.map((ln, li) => (
                <li key={li} style={{ fontSize: "0.9rem", color: "var(--ink)", lineHeight: 1.65 }}>
                  {ln.replace(/^[-*]\s*/, "").replace(/^\d+[.)]\s*/, "")}
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={pi} style={{ margin: 0, fontSize: "0.9rem", color: "var(--ink)", lineHeight: 1.7 }}>
            {lines.join(" ")}
          </p>
        );
      })}
    </div>
  );
}

function Sources({ sources }: { sources: AnswerSource[] }) {
  if (!sources || sources.length === 0) return null;
  return (
    <div style={{ marginTop: 10, paddingTop: 8, borderTop: "1px solid rgba(34,211,238,0.15)", display: "flex", flexDirection: "column", gap: 3 }}>
      <span style={{ fontSize: "0.68rem", color: "var(--muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
        Source
      </span>
      {sources.map((s, i) => (
        <div key={i} style={{ fontSize: "0.74rem", color: "var(--muted)" }}>
          <span style={{ color: "var(--cyan)", fontWeight: 600 }}>{s.book}</span>
          {s.chapter && s.chapter !== "General" && <span> - {s.chapter}</span>}
          {s.section && s.section !== "General" && s.section !== s.chapter && <span> - {s.section}</span>}
          {s.page && <span> (p.{s.page})</span>}
        </div>
      ))}
    </div>
  );
}

function LoadingBubble({ label }: { label: string }) {
  const avatarSt: React.CSSProperties = {
    width: 30, height: 30, borderRadius: "50%",
    background: "linear-gradient(135deg,rgba(139,92,246,.22),rgba(34,211,238,.22))",
    border: "1px solid rgba(34,211,238,.28)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "0.85rem", flexShrink: 0,
  };
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, marginBottom: 14 }}>
      <div style={avatarSt}>🤖</div>
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "14px 14px 14px 3px", padding: "10px 14px", display: "flex", alignItems: "center", gap: 10, maxWidth: "78%" }}>
        <span style={{ fontSize: "0.84rem", color: "var(--muted)" }}>{label}</span>
        <span style={{ display: "flex", gap: 3 }}>
          {[0, 1, 2].map((i) => (
            <span key={i} style={{ display: "inline-block", width: 5, height: 5, borderRadius: "50%", background: "var(--cyan)", opacity: 0.75, animation: `tutorBounce 1.1s ease-in-out ${i * 0.18}s infinite` }} />
          ))}
        </span>
      </div>
    </div>
  );
}

const avatarSt: React.CSSProperties = {
  width: 30, height: 30, borderRadius: "50%",
  background: "linear-gradient(135deg,rgba(139,92,246,.22),rgba(34,211,238,.22))",
  border: "1px solid rgba(34,211,238,.28)",
  display: "flex", alignItems: "center", justifyContent: "center",
  fontSize: "0.85rem", flexShrink: 0,
};

const aiBubbleSt: React.CSSProperties = {
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: "14px 14px 14px 3px",
  padding: "10px 14px",
  maxWidth: "78%",
  wordBreak: "break-word",
};

function Bubble({ msg }: { msg: ChatMsg }) {
  if (msg.role === "user") {
    return (
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14, animation: "tutorIn .18s ease" }}>
        <div style={{ maxWidth: "78%", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3 }}>
          <div style={{ background: "linear-gradient(135deg,rgba(139,92,246,.28),rgba(34,211,238,.22))", border: "1px solid rgba(139,92,246,.32)", borderRadius: "14px 14px 3px 14px", padding: "10px 14px", fontSize: "0.9rem", color: "var(--ink)", lineHeight: 1.6, wordBreak: "break-word" }}>
            {msg.text}
          </div>
          <span style={{ fontSize: "0.67rem", color: "var(--muted)", paddingRight: 3 }}>{msg.time}</span>
        </div>
      </div>
    );
  }
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 14, animation: "tutorIn .18s ease" }}>
      <div style={{ ...avatarSt, marginTop: 2 }}>🤖</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 3, maxWidth: "80%" }}>
        <div style={aiBubbleSt}>
          <AnswerText text={msg.text} />
          {msg.sources && msg.sources.length > 0 && <Sources sources={msg.sources} />}
        </div>
        <span style={{ fontSize: "0.67rem", color: "var(--muted)", paddingLeft: 3 }}>{msg.time}</span>
      </div>
    </div>
  );
}

export default function AITutorPage() {
  const [selClass, setSelClass] = useState("5");
  const [selSubject, setSelSubject] = useState("Primary Science");
  const [selChapter, setSelChapter] = useState("All Chapters");
  const [draft, setDraft] = useState("");
  const [msgs, setMsgs] = useState<ChatMsg[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadLabel, setLoadLabel] = useState("বই থেকে তথ্য খুঁজছি...");

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const classId = useId();
  const subjectId = useId();
  const chapterId = useId();

  const classData = NCTB_CLASSES.find((c) => c.id === selClass);
  const subjects = classData?.subjects || [];
  const subjectData = subjects.find((s) => s.name === selSubject || s.id === selSubject);
  const chapters = subjectData?.chapters || ["All Chapters"];

  const samples: string[] = (() => {
    const map = SAMPLE_QUESTIONS_MAP[selClass] || {};
    return (map[selSubject] || map[subjectData?.id || ""] || []).slice(0, 4);
  })();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, loading]);

  const ts = () => new Date().toLocaleTimeString("en-BD", { hour: "2-digit", minute: "2-digit" });

  const changeClass = (id: string) => {
    setSelClass(id);
    const cls = NCTB_CLASSES.find((c) => c.id === id);
    if (cls?.subjects.length) {
      setSelSubject(cls.subjects[0].name);
      setSelChapter(cls.subjects[0].chapters[0] || "All Chapters");
    }
  };

  const changeSubject = (name: string) => {
    setSelSubject(name);
    const sub = subjects.find((s) => s.name === name);
    setSelChapter(sub?.chapters[0] || "All Chapters");
  };

  const send = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: ChatMsg = { id: `u${Date.now()}`, role: "user", text: text.trim(), time: ts() };
    setMsgs((p) => [...p, userMsg]);
    setDraft("");
    setLoading(true);
    setLoadLabel("বই থেকে তথ্য খুঁজছি...");
    const t = setTimeout(() => setLoadLabel("তোমার জন্য উত্তর তৈরি করছি..."), 1600);
    try {
      const res = await fetch(`${API}/api/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classLevel: parseInt(selClass, 10), subject: selSubject, chapter: selChapter !== "All Chapters" ? selChapter : "", question: text.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error();
      const d = data.data;
      setMsgs((p) => [...p, { id: `a${Date.now()}`, role: "assistant", text: d.answer || "উত্তর পাওয়া যায়নি।", time: ts(), sources: d.sources || [] }]);
    } catch {
      setMsgs((p) => [...p, {
        id: `a${Date.now()}`, role: "assistant",
        text: "তোমার প্রশ্নটি গ্রহণ করা হয়েছে।\n\nআসল NCTB-based AI উত্তর শীঘ্রই এখানে দেখানো হবে।\n\nYour question has been received. The NCTB-based AI answer will appear here once the AI service is connected.",
        time: ts(),
      }]);
    } finally {
      clearTimeout(t);
      setLoading(false);
      setLoadLabel("বই থেকে তথ্য খুঁজছি...");
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [loading, selClass, selSubject, selChapter]);

  const onSubmit = (e: React.FormEvent) => { e.preventDefault(); send(draft); };
  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(draft); }
  };

  return (
    <>
      <style>{`
        @keyframes tutorBounce{0%,60%,100%{transform:translateY(0);opacity:.7}30%{transform:translateY(-4px);opacity:1}}
        @keyframes tutorIn{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
        .aip{min-height:100vh;display:flex;flex-direction:column}
        .aim{flex:1;display:flex;flex-direction:column;max-width:820px;margin:0 auto;width:100%;padding:22px 16px 0}
        .aih{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:16px}
        .aih h1{font-size:1.35rem;font-weight:800;margin:0 0 3px;display:flex;align-items:center;gap:7px}
        .aih p{color:var(--muted);font-size:0.82rem;margin:0}
        .aic{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px;align-items:center}
        .aicg{display:flex;align-items:center;gap:5px;flex:1;min-width:130px}
        .aicg label{font-size:0.72rem;font-weight:600;color:var(--muted);white-space:nowrap;flex-shrink:0}
        .aicg select{flex:1;font-size:0.78rem;padding:5px 8px;min-width:0}
        .aiw{flex:1;display:flex;flex-direction:column;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-md) var(--radius-md) 0 0;overflow:hidden}
        .aiwh{display:flex;align-items:center;justify-content:space-between;padding:9px 14px;border-bottom:1px solid var(--border);background:rgba(34,211,238,.04)}
        .aiwhl{display:flex;align-items:center;gap:7px}
        .aidot{width:7px;height:7px;border-radius:50%;background:#22c55e;box-shadow:0 0 0 2px rgba(34,197,94,.2)}
        .aiml{flex:1;overflow-y:auto;padding:18px 14px 6px;min-height:320px;max-height:420px}
        .aiml::-webkit-scrollbar{width:3px}
        .aiml::-webkit-scrollbar-track{background:transparent}
        .aiml::-webkit-scrollbar-thumb{background:var(--border);border-radius:4px}
        .aies{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px 16px;text-align:center}
        .aies-icon{width:52px;height:52px;border-radius:50%;background:linear-gradient(135deg,rgba(139,92,246,.2),rgba(34,211,238,.2));border:1px solid rgba(34,211,238,.2);display:flex;align-items:center;justify-content:center;font-size:1.55rem;margin-bottom:12px}
        .aies h3{font-size:.95rem;font-weight:700;margin:0 0 7px}
        .aies p{color:var(--muted);font-size:.8rem;max-width:300px;line-height:1.6;margin:0 0 10px}
        .aies ul{color:var(--muted);font-size:.78rem;text-align:left;line-height:1.8;padding-left:16px;margin:0 0 14px}
        .aichips{display:flex;flex-wrap:wrap;gap:7px;justify-content:center;max-width:460px}
        .aichip{background:rgba(34,211,238,.08);border:1px solid rgba(34,211,238,.25);border-radius:18px;padding:5px 12px;font-size:.74rem;color:var(--ink);cursor:pointer;transition:background .14s,border-color .14s;line-height:1.4}
        .aichip:hover:not(:disabled){background:rgba(34,211,238,.15);border-color:rgba(34,211,238,.45)}
        .aichip:disabled{opacity:.45;cursor:not-allowed}
        .aicomp{border-top:1px solid var(--border);padding:11px 14px;background:var(--surface)}
        .aicomp-form{display:flex;gap:9px;align-items:flex-end}
        .aicomp-ta{flex:1;resize:none;font-size:.88rem;line-height:1.5;min-height:42px;max-height:110px;border-radius:var(--radius-sm);padding:9px 12px;font-family:inherit;overflow-y:auto}
        .aicomp-btn{width:42px;height:42px;border-radius:50%;background:var(--cyan);color:#0a0f1e;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:1rem;transition:opacity .14s,transform .1s;flex-shrink:0;font-weight:700}
        .aicomp-btn:hover:not(:disabled){opacity:.84;transform:scale(1.06)}
        .aicomp-btn:disabled{opacity:.38;cursor:not-allowed;transform:none}
        .aicomp-hint{font-size:.65rem;color:var(--muted);margin-top:5px;text-align:right}
        @media(max-width:600px){
          .aim{padding:13px 11px 0}
          .aicg{min-width:100%}
          .aiml{min-height:240px;max-height:320px}
          .aih h1{font-size:1.15rem}
        }
      `}</style>

      <div className="aip">
        <NavBar />
        <main className="aim" role="main" aria-label="AI Tutor Chat">
          <div className="aih">
            <div>
              <h1><span aria-hidden="true">🤖</span> AI Tutor</h1>
              <p>তোমার ব্যক্তিগত NCTB সহকারী · Your personal NCTB learning assistant</p>
            </div>
            {msgs.length > 0 && (
              <button type="button" className="secondary-btn" onClick={() => setMsgs([])} style={{ fontSize: ".78rem", padding: "6px 13px" }}>
                New Chat
              </button>
            )}
          </div>

          <div className="aic" role="group" aria-label="Select class and subject">
            <div className="aicg">
              <label htmlFor={classId}>Class</label>
              <select id={classId} value={selClass} onChange={(e) => changeClass(e.target.value)} disabled={loading}>
                {NCTB_CLASSES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="aicg">
              <label htmlFor={subjectId}>Subject</label>
              <select id={subjectId} value={selSubject} onChange={(e) => changeSubject(e.target.value)} disabled={loading}>
                {subjects.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
            </div>
            <div className="aicg">
              <label htmlFor={chapterId}>Chapter</label>
              <select id={chapterId} value={selChapter} onChange={(e) => setSelChapter(e.target.value)} disabled={loading}>
                {chapters.map((ch, i) => <option key={i} value={ch}>{ch}</option>)}
              </select>
            </div>
          </div>

          <div className="aiw">
            <div className="aiwh">
              <div className="aiwhl">
                <div className="aidot" aria-hidden="true" />
                <span style={{ fontSize: ".8rem", fontWeight: 600, color: "var(--ink)" }}>AI Tutor</span>
                <span style={{ fontSize: ".73rem", color: "var(--muted)" }}>· {classData?.name} · {selSubject}</span>
              </div>
              {msgs.length > 0 && (
                <span style={{ fontSize: ".7rem", color: "var(--muted)" }}>
                  {msgs.filter((m) => m.role === "user").length} প্রশ্ন
                </span>
              )}
            </div>

            <div className="aiml" role="log" aria-live="polite" aria-label="Conversation">
              {msgs.length === 0 && !loading ? (
                <div className="aies">
                  <div className="aies-icon" aria-hidden="true">🤖</div>
                  <h3>আমি তোমার AI Tutor!</h3>
                  <p>পাঠ্যবই থেকে যেকোনো প্রশ্ন করো।<br />বাংলা বা ইংরেজিতে উত্তর পাবে।</p>
                  <ul>
                    <li>পাঠ্যবইয়ের ধারণা বোঝা</li>
                    <li>কঠিন শব্দের অর্থ</li>
                    <li>গণিতের ধাপে ধাপে সমাধান</li>
                    <li>বিজ্ঞানের ব্যাখ্যা</li>
                    <li>পরীক্ষার প্রস্তুতি</li>
                  </ul>
                  {samples.length > 0 && (
                    <>
                      <p style={{ fontSize: ".74rem", color: "var(--muted)", marginBottom: 9 }}>💡 এই প্রশ্নগুলো দিয়ে শুরু করতে পারো:</p>
                      <div className="aichips">
                        {samples.map((q, i) => (
                          <button key={i} type="button" className="aichip" disabled={loading} onClick={() => { setDraft(q); inputRef.current?.focus(); }}>{q}</button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <>
                  {msgs.map((m) => <Bubble key={m.id} msg={m} />)}
                  {loading && <LoadingBubble label={loadLabel} />}
                </>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="aicomp">
              <form className="aicomp-form" onSubmit={onSubmit}>
                <textarea
                  ref={inputRef}
                  className="aicomp-ta"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={onKey}
                  placeholder="তোমার প্রশ্ন লেখো... (Enter = পাঠাও, Shift+Enter = নতুন লাইন)"
                  disabled={loading}
                  rows={1}
                  aria-label="Type your question"
                />
                <button type="submit" className="aicomp-btn" disabled={loading || !draft.trim()} aria-label="Send" title="Send">
                  {loading ? "⏳" : "↑"}
                </button>
              </form>
              <p className="aicomp-hint">Enter · পাঠাও &nbsp;|&nbsp; Shift+Enter · নতুন লাইন</p>
            </div>
          </div>

          <div style={{ height: 28 }} />
        </main>
        <Footer />
      </div>
    </>
  );
}