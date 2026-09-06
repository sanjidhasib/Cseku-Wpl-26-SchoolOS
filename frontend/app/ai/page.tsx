"use client";

import { useState, useId } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { NCTB_CLASSES, SAMPLE_QUESTIONS } from "./data";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AnswerSource {
  book: string;
  chapter: string;
  section: string;
  page: number | null;
}

interface QuestionRecord {
  id: string;
  time: string;
  classLevel: string;
  subject: string;
  chapter: string;
  question: string;
  answer: string;
  sources: AnswerSource[];
  noContextFound: boolean;
  source: "backend" | "offline-fallback";
}

// ─── Answer Renderer ──────────────────────────────────────────────────────────
// Renders AI answer text safely (no dangerouslySetInnerHTML).
// Supports blank-line-separated paragraphs and leading bullet/number markers.

function AnswerText({ text }: { text: string }) {
  const paragraphs = text.split(/\n\n+/).filter((p) => p.trim().length > 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {paragraphs.map((para, pIdx) => {
        const lines = para.split(/\n/).filter((l) => l.trim().length > 0);

        // Check if this paragraph is a list (lines starting with -, *, •, or number.)
        const isList = lines.length > 1 && lines.every((l) =>
          /^[\-\*\•]/.test(l.trim()) || /^\d+[\.\)]/.test(l.trim())
        );

        if (isList) {
          return (
            <ul
              key={pIdx}
              style={{
                margin: 0,
                paddingLeft: 20,
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              {lines.map((line, lIdx) => (
                <li
                  key={lIdx}
                  style={{ fontSize: "0.92rem", color: "var(--ink)", lineHeight: 1.65 }}
                >
                  {line.replace(/^[\-\*\•]\s*/, "").replace(/^\d+[\.\)]\s*/, "")}
                </li>
              ))}
            </ul>
          );
        }

        // Regular paragraph — join lines with space
        return (
          <p
            key={pIdx}
            style={{ margin: 0, fontSize: "0.92rem", color: "var(--ink)", lineHeight: 1.7 }}
          >
            {lines.join(" ")}
          </p>
        );
      })}
    </div>
  );
}

// ─── Source Attribution ───────────────────────────────────────────────────────

function SourceAttribution({ sources }: { sources: AnswerSource[] }) {
  if (!sources || sources.length === 0) return null;

  return (
    <div
      style={{
        marginTop: 12,
        paddingTop: 10,
        borderTop: "1px solid rgba(34, 211, 238, 0.18)",
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <span
        style={{
          fontSize: "0.72rem",
          color: "var(--muted)",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        📖 Textbook Reference
      </span>
      {sources.map((src, i) => (
        <div
          key={i}
          style={{
            fontSize: "0.78rem",
            color: "var(--muted)",
            background: "rgba(34, 211, 238, 0.05)",
            borderRadius: 4,
            padding: "4px 8px",
          }}
        >
          <span style={{ color: "var(--cyan)", fontWeight: 600 }}>{src.book}</span>
          {src.chapter && src.chapter !== "General" && (
            <span> · Ch: {src.chapter}</span>
          )}
          {src.section && src.section !== "General" && src.section !== src.chapter && (
            <span> · {src.section}</span>
          )}
          {src.page && <span> · Page {src.page}</span>}
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AITutorPage() {
  const [selectedClass, setSelectedClass] = useState<string>("9");
  const [selectedSubject, setSelectedSubject] = useState<string>("Science");
  const [selectedChapter, setSelectedChapter] = useState<string>("All Chapters");
  const [question, setQuestion] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [apiNotice, setApiNotice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [history, setHistory] = useState<QuestionRecord[]>([]);

  const classSelectId = useId();
  const subjectSelectId = useId();
  const chapterSelectId = useId();
  const questionInputId = useId();

  const currentClassData = NCTB_CLASSES.find((c) => c.id === selectedClass);
  const availableSubjects = currentClassData?.subjects || [];
  const currentSubjectData = availableSubjects.find(
    (s) => s.id === selectedSubject || s.name.toLowerCase() === selectedSubject.toLowerCase()
  );
  const availableChapters = currentSubjectData?.chapters || ["All Chapters"];

  const handleClassChange = (newClassId: string) => {
    setSelectedClass(newClassId);
    setError(null);
    setApiNotice(null);
    const newClass = NCTB_CLASSES.find((c) => c.id === newClassId);
    if (newClass && newClass.subjects.length > 0) {
      setSelectedSubject(newClass.subjects[0].name);
      setSelectedChapter(newClass.subjects[0].chapters[0] || "All Chapters");
    } else {
      setSelectedSubject("");
      setSelectedChapter("All Chapters");
    }
  };

  const handleSubjectChange = (newSubjectName: string) => {
    setSelectedSubject(newSubjectName);
    setError(null);
    setApiNotice(null);
    const subj = availableSubjects.find((s) => s.name === newSubjectName);
    if (subj && subj.chapters.length > 0) {
      setSelectedChapter(subj.chapters[0]);
    } else {
      setSelectedChapter("All Chapters");
    }
  };

  const handleAskQuestion = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!selectedClass) {
      setError("⚠️ Please select your Class before asking a question.");
      return;
    }
    if (!selectedSubject) {
      setError("⚠️ Please select a Subject.");
      return;
    }
    if (!question.trim()) {
      setError("⚠️ Please write a question from your textbook.");
      return;
    }

    setError(null);
    setApiNotice(null);
    setIsLoading(true);

    const payload = {
      classLevel: parseInt(selectedClass, 10),
      subject: selectedSubject,
      chapter: selectedChapter !== "All Chapters" ? selectedChapter : "",
      question: question.trim(),
    };

    try {
      const response = await fetch(`${API}/api/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to get answer from AI Tutor.");
      }

      const d = data.data;

      const newRecord: QuestionRecord = {
        id: Date.now().toString(),
        time: new Date().toLocaleTimeString("en-BD", { hour: "2-digit", minute: "2-digit" }),
        classLevel: currentClassData ? currentClassData.name : `Class ${selectedClass}`,
        subject: d.subject || selectedSubject,
        chapter: d.chapter || selectedChapter,
        question: payload.question,
        answer: d.answer || "No answer was returned.",
        sources: d.sources || [],
        noContextFound: d.noContextFound || false,
        source: "backend",
      };

      setHistory((prev) => [newRecord, ...prev]);
      setQuestion("");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      console.warn("Backend API call error:", errorMessage);

      setApiNotice(
        `Could not reach the AI Tutor backend: ${errorMessage}. Make sure schoolos-backend is running on ${API}.`
      );

      // Offline fallback — show clear placeholder (no fake answers)
      const fallbackRecord: QuestionRecord = {
        id: Date.now().toString(),
        time: new Date().toLocaleTimeString("en-BD", { hour: "2-digit", minute: "2-digit" }),
        classLevel: currentClassData ? currentClassData.name : `Class ${selectedClass}`,
        subject: selectedSubject,
        chapter: selectedChapter,
        question: question.trim(),
        answer: "Could not reach the AI Tutor backend. Please ensure the backend server is running and try again.",
        sources: [],
        noContextFound: true,
        source: "offline-fallback",
      };

      setHistory((prev) => [fallbackRecord, ...prev]);
      setQuestion("");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromptClick = (promptText: string) => {
    setQuestion(promptText);
    setError(null);
  };

  const handleClearHistory = () => {
    setHistory([]);
    setError(null);
    setApiNotice(null);
  };

  return (
    <div className="login-shell" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <NavBar />

      <main className="page-shell" style={{ flex: 1 }}>
        {/* Hero Section */}
        <section className="hero-panel" style={{ marginBottom: 24 }}>
          <div>
            <p className="eyebrow">Smart Learning Assistant</p>
            <h1>AI Tutor 🤖</h1>
            <p style={{ color: "var(--muted)", marginTop: 6, fontSize: "0.95rem", maxWidth: 640, lineHeight: 1.6 }}>
              Select your class, subject, and chapter from the NCTB curriculum, then ask any textbook question in Bangla or English.
            </p>
          </div>
          <div className="button-row" style={{ flexShrink: 0 }}>
            {history.length > 0 && (
              <button
                type="button"
                className="secondary-btn"
                onClick={handleClearHistory}
                style={{ fontSize: "0.85rem", padding: "8px 16px" }}
              >
                Clear Results
              </button>
            )}
          </div>
        </section>

        {/* Validation Error Banner */}
        {error && (
          <div
            role="alert"
            style={{
              background: "rgba(248, 113, 113, 0.12)",
              border: "1px solid rgba(248, 113, 113, 0.35)",
              borderRadius: "var(--radius-sm)",
              padding: "12px 18px",
              marginBottom: 20,
              color: "var(--red)",
              fontSize: "0.9rem",
              display: "flex",
              alignItems: "center",
              gap: 10,
              animation: "fadeIn 0.25s ease",
            }}
          >
            <span>{error}</span>
          </div>
        )}

        {/* API Notice Banner */}
        {apiNotice && (
          <div
            role="status"
            style={{
              background: "rgba(245, 158, 11, 0.10)",
              border: "1px solid rgba(245, 158, 11, 0.25)",
              borderRadius: "var(--radius-sm)",
              padding: "10px 16px",
              marginBottom: 20,
              color: "var(--orange)",
              fontSize: "0.85rem",
              display: "flex",
              alignItems: "center",
              gap: 8,
              animation: "fadeIn 0.25s ease",
            }}
          >
            <span>⚠️ {apiNotice}</span>
          </div>
        )}

        {/* Main Grid */}
        <div className="ai-layout" style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 24 }}>
          {/* Left Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Question Form Card */}
            <div className="panel" style={{ position: "relative" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3 style={{ margin: 0, fontSize: "1.1rem" }}>Ask Your Textbook Question</h3>
                <span className="badge badge-cyan" style={{ fontSize: "0.75rem" }}>
                  AI Tutor Active
                </span>
              </div>

              <form onSubmit={handleAskQuestion}>
                {/* 3-Column Dropdowns */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                    gap: 12,
                    marginBottom: 16,
                  }}
                >
                  {/* Class */}
                  <div>
                    <label
                      htmlFor={classSelectId}
                      style={{ display: "block", fontSize: "0.8rem", color: "var(--muted)", marginBottom: 6, fontWeight: 600 }}
                    >
                      1. Select Class <span style={{ color: "var(--cyan)" }}>*</span>
                    </label>
                    <select
                      id={classSelectId}
                      value={selectedClass}
                      onChange={(e) => handleClassChange(e.target.value)}
                      disabled={isLoading}
                      style={{ cursor: isLoading ? "not-allowed" : "pointer" }}
                    >
                      {NCTB_CLASSES.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Subject */}
                  <div>
                    <label
                      htmlFor={subjectSelectId}
                      style={{ display: "block", fontSize: "0.8rem", color: "var(--muted)", marginBottom: 6, fontWeight: 600 }}
                    >
                      2. Select Subject <span style={{ color: "var(--cyan)" }}>*</span>
                    </label>
                    <select
                      id={subjectSelectId}
                      value={selectedSubject}
                      onChange={(e) => handleSubjectChange(e.target.value)}
                      disabled={isLoading}
                      style={{ cursor: isLoading ? "not-allowed" : "pointer" }}
                    >
                      {availableSubjects.map((s) => (
                        <option key={s.id} value={s.name}>{s.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Chapter */}
                  <div>
                    <label
                      htmlFor={chapterSelectId}
                      style={{ display: "block", fontSize: "0.8rem", color: "var(--muted)", marginBottom: 6, fontWeight: 600 }}
                    >
                      3. Chapter (Optional)
                    </label>
                    <select
                      id={chapterSelectId}
                      value={selectedChapter}
                      onChange={(e) => setSelectedChapter(e.target.value)}
                      disabled={isLoading}
                      style={{ cursor: isLoading ? "not-allowed" : "pointer" }}
                    >
                      {availableChapters.map((ch, idx) => (
                        <option key={idx} value={ch}>{ch}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Question Textarea */}
                <div style={{ marginBottom: 16 }}>
                  <label
                    htmlFor={questionInputId}
                    style={{ display: "block", fontSize: "0.8rem", color: "var(--muted)", marginBottom: 6, fontWeight: 600 }}
                  >
                    Your Question <span style={{ color: "var(--cyan)" }}>*</span>
                  </label>
                  <textarea
                    id={questionInputId}
                    rows={4}
                    value={question}
                    disabled={isLoading}
                    onChange={(e) => {
                      setQuestion(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="Ask a question from your textbook in Bangla or English..."
                    style={{ resize: "vertical", fontSize: "0.95rem", lineHeight: 1.6 }}
                  />
                </div>

                {/* Submit Row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                  <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
                    Selected: <strong>{currentClassData?.name || `Class ${selectedClass}`}</strong> · <strong>{selectedSubject}</strong>
                  </span>
                  <button
                    type="submit"
                    className="primary-btn"
                    disabled={isLoading}
                    style={{
                      padding: "12px 28px",
                      fontSize: "0.95rem",
                      opacity: isLoading ? 0.7 : 1,
                      cursor: isLoading ? "wait" : "pointer",
                    }}
                  >
                    {isLoading ? "AI Tutor Thinking..." : "Ask Question 🚀"}
                  </button>
                </div>
              </form>

              {/* Sample Question Chips */}
              <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
                <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginBottom: 8, fontWeight: 600 }}>
                  💡 Try asking one of these sample questions:
                </p>
                <div className="prompt-chips">
                  {SAMPLE_QUESTIONS.slice(0, 4).map((qText, i) => (
                    <button
                      key={i}
                      type="button"
                      className="chip"
                      disabled={isLoading}
                      onClick={() => handlePromptClick(qText)}
                      style={{ textAlign: "left", fontSize: "0.8rem" }}
                    >
                      {qText}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Answer / Chat Area */}
            <div className="panel" style={{ minHeight: 300 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3 style={{ margin: 0, fontSize: "1.1rem" }}>Answer / Chat Area</h3>
                {history.length > 0 && (
                  <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
                    {history.length} {history.length === 1 ? "question" : "questions"} asked
                  </span>
                )}
              </div>

              {/* Loading Indicator */}
              {isLoading && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "16px 20px",
                    background: "rgba(34, 211, 238, 0.08)",
                    border: "1px solid rgba(34, 211, 238, 0.25)",
                    borderRadius: "var(--radius-md)",
                    marginBottom: 16,
                    animation: "fadeIn 0.2s ease",
                  }}
                >
                  <div className="typing-indicator" style={{ background: "transparent", border: "none", padding: 0 }}>
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                  </div>
                  <span style={{ fontSize: "0.88rem", color: "var(--cyan)", fontWeight: 600 }}>
                    Retrieving NCTB content &amp; generating AI answer...
                  </span>
                </div>
              )}

              {/* Empty State */}
              {history.length === 0 && !isLoading ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "48px 20px",
                    textAlign: "center",
                    background: "rgba(255, 255, 255, 0.02)",
                    borderRadius: "var(--radius-md)",
                    border: "1px dashed var(--border)",
                  }}
                >
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(34, 211, 238, 0.2))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.6rem",
                      marginBottom: 14,
                    }}
                  >
                    💬
                  </div>
                  <h4 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: 6 }}>
                    No Questions Asked Yet
                  </h4>
                  <p style={{ color: "var(--muted)", fontSize: "0.88rem", maxWidth: 420, lineHeight: 1.6 }}>
                    Choose your class, subject, and chapter above, type your textbook question, and click{" "}
                    <strong style={{ color: "var(--ink)" }}>&ldquo;Ask Question&rdquo;</strong> to receive an AI-generated answer from the NCTB curriculum.
                  </p>
                </div>
              ) : (
                /* History list */
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  {history.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        background: "rgba(255, 255, 255, 0.03)",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius-md)",
                        padding: "18px 20px",
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                        animation: "fadeInUp 0.3s ease",
                      }}
                    >
                      {/* Meta Tags */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                          <span className="badge badge-purple">{item.classLevel}</span>
                          <span className="badge badge-cyan">{item.subject}</span>
                          {item.chapter && item.chapter !== "All Chapters" && (
                            <span className="badge badge-orange" style={{ textTransform: "none" }}>
                              {item.chapter}
                            </span>
                          )}
                          {item.source === "backend" && !item.noContextFound && item.sources.length > 0 && (
                            <span className="badge badge-green" style={{ fontSize: "0.68rem" }}>
                              📚 NCTB Matched
                            </span>
                          )}
                          {item.source === "backend" && item.noContextFound && (
                            <span
                              className="badge"
                              style={{
                                fontSize: "0.68rem",
                                background: "rgba(245, 158, 11, 0.15)",
                                color: "var(--orange)",
                                borderColor: "rgba(245, 158, 11, 0.3)",
                              }}
                            >
                              General Answer
                            </span>
                          )}
                          {item.source === "offline-fallback" && (
                            <span className="badge" style={{ fontSize: "0.68rem", background: "rgba(248,113,113,0.12)", color: "var(--red)" }}>
                              Offline
                            </span>
                          )}
                        </div>
                        <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
                          🕒 {item.time}
                        </span>
                      </div>

                      {/* Question */}
                      <div style={{ borderLeft: "3px solid var(--cyan)", paddingLeft: 12 }}>
                        <div style={{ fontSize: "0.75rem", color: "var(--cyan)", fontWeight: 700, textTransform: "uppercase", marginBottom: 2 }}>
                          Question
                        </div>
                        <div style={{ fontSize: "0.95rem", color: "var(--ink)", fontWeight: 600 }}>
                          {item.question}
                        </div>
                      </div>

                      {/* AI Answer */}
                      <div
                        style={{
                          background: "rgba(34, 211, 238, 0.05)",
                          border: "1px solid rgba(34, 211, 238, 0.2)",
                          borderRadius: "var(--radius-sm)",
                          padding: "14px 16px",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                          <span style={{ fontSize: "1.1rem" }}>🤖</span>
                          <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--cyan)" }}>
                            AI Tutor Response
                          </span>
                          <span className="badge badge-green" style={{ fontSize: "0.68rem" }}>
                            Week 3 · Live AI
                          </span>
                        </div>

                        {/* Safely rendered answer */}
                        <AnswerText text={item.answer} />

                        {/* Source attribution */}
                        <SourceAttribution sources={item.sources} />
                      </div>

                      {/* Ask another question hint */}
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
                          💬 To ask a follow-up, type your next question above.
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="stack-panel">
            {/* How It Works */}
            <div className="panel">
              <h3>📖 How It Works</h3>
              <ul className="list" style={{ paddingLeft: 0, listStyle: "none" }}>
                {[
                  "Select your Class (1 up to 10)",
                  "Pick your Subject and textbook Chapter",
                  "Type your question in Bangla or English",
                  "AI retrieves matching NCTB textbook content",
                  "Get a class-appropriate explanation instantly",
                ].map((step, idx) => (
                  <li
                    key={idx}
                    style={{
                      display: "flex",
                      gap: 12,
                      padding: "10px 0",
                      borderBottom: idx < 4 ? "1px solid var(--border)" : "none",
                      fontSize: "0.87rem",
                      color: "var(--muted)",
                      alignItems: "flex-start",
                    }}
                  >
                    <span
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        background: "rgba(34, 211, 238, 0.12)",
                        color: "var(--cyan)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: "0.78rem",
                        flexShrink: 0,
                      }}
                    >
                      {idx + 1}
                    </span>
                    <span style={{ lineHeight: 1.5 }}>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* NCTB Coverage */}
            <div className="panel">
              <h3>📚 NCTB Coverage</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.6, marginBottom: 14 }}>
                SchoolOS AI Tutor is structured around the National Curriculum and Textbook Board (NCTB) Bangladesh syllabus.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { level: "Classes 1 – 5", desc: "Primary foundation in Bangla, English, Math & Science", color: "badge-purple" },
                  { level: "Classes 6 – 8", desc: "Junior secondary with ICT, BGS, General Science & Math", color: "badge-cyan" },
                  { level: "Classes 9 – 10", desc: "Secondary SSC streams in Physics, Chemistry, Biology & Higher Math", color: "badge-orange" },
                ].map((lvl, i) => (
                  <div
                    key={i}
                    style={{
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-sm)",
                      padding: "10px 14px",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, fontSize: "0.88rem" }}>{lvl.level}</span>
                      <span className={`badge ${lvl.color}`}>NCTB</span>
                    </div>
                    <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--muted)", lineHeight: 1.4 }}>
                      {lvl.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Week 3 Live Status Card */}
            <div
              className="panel"
              style={{
                background: "linear-gradient(135deg, rgba(34, 197, 94, 0.10), rgba(34, 211, 238, 0.07))",
                borderColor: "rgba(34, 197, 94, 0.25)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: "1.2rem" }}>✅</span>
                <h4 style={{ margin: 0, fontSize: "0.95rem" }}>Week 3 Active</h4>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: "0.82rem", color: "var(--muted)", lineHeight: 1.5 }}>
                <span>✓ NCTB textbook retrieval</span>
                <span>✓ Keyword search with Bangla support</span>
                <span>✓ Class-aware prompting (Class 1–10)</span>
                <span>✓ Google Gemini AI integration</span>
                <span>✓ Bangla &amp; English answers</span>
                <span>✓ Textbook source attribution</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
