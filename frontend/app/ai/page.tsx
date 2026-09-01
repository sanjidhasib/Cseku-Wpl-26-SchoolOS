"use client";

import { useEffect, useRef, useState } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

interface Message {
  role: "user" | "ai";
  text: string;
  time: string;
}

const STARTERS: Message[] = [
  {
    role: "ai",
    text: "👋 Hello! I am your SchoolOS AI Tutor. Ask me any textbook question in Bangla or English and I will do my best to help you understand!",
    time: new Date().toLocaleTimeString("en-BD", { hour: "2-digit", minute: "2-digit" }),
  },
];

const PROMPTS = [
  "Explain photosynthesis in simple words",
  "How do I solve a quadratic equation?",
  "What is the water cycle?",
  "Explain the French Revolution briefly",
  "What are Newton's 3 laws of motion?",
  "How to write a Bangla essay introduction?",
];

function fakeAnswer(q: string, classLevel: string, subject: string): string {
  return `📚 Great question about "${q.slice(0, 50)}${q.length > 50 ? "..." : ""}"!\n\nFor Class ${classLevel} ${subject}:\n\nThe key idea here is to break the concept into simple steps. First, identify the main principle or rule involved. Then, think of a real-life example that matches your question. Finally, apply the rule step by step.\n\nHere is a simplified explanation: ${q} is one of the most important topics in your syllabus. Understanding the core concept first will make solving related problems much easier.\n\nWould you like me to simplify this further or give a worked example? 😊`;
}

export default function AITutorPage() {
  const [classLevel, setClassLevel] = useState("9");
  const [subject, setSubject] = useState("Science");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(STARTERS);
  const [typing, setTyping] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, typing]);

  function now() {
    return new Date().toLocaleTimeString("en-BD", { hour: "2-digit", minute: "2-digit" });
  }

  function sendMessage(text?: string) {
    const q = (text ?? input).trim();
    if (!q) return;
    setInput("");
    setMessages((cur) => [...cur, { role: "user", text: q, time: now() }]);
    setTyping(true);
    setTimeout(
      () => {
        setTyping(false);
        setMessages((cur) => [
          ...cur,
          { role: "ai", text: fakeAnswer(q, classLevel, subject), time: now() },
        ]);
      },
      1200 + Math.random() * 600
    );
  }

  function simplifyLast() {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUser) return;
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((cur) => [
        ...cur,
        {
          role: "ai",
          text: `🔄 Simpler version:\n\n"${lastUser.text.slice(0, 60)}..." means: imagine a very simple everyday example. The main rule is straightforward once you see it step by step. Think of it like building blocks — one small idea at a time. Want me to show a worked example?`,
          time: now(),
        },
      ]);
    }, 900);
  }

  function clearChat() {
    setMessages(STARTERS);
  }

  return (
    <div>
      <NavBar />
      <main className="page-shell">
        {/* Hero */}
        <section className="hero-panel">
          <div>
            <p className="eyebrow">AI Learning Agent</p>
            <h1>AI Tutor 🤖</h1>
            <p style={{ color: "var(--muted)", marginTop: 6, fontSize: "0.9rem" }}>
              Ask any textbook question in Bangla or English — instant, smart answers
            </p>
          </div>
          <div className="button-row" style={{ flexShrink: 0 }}>
            <button className="secondary-btn" onClick={simplifyLast}>
              🔄 Simplify
            </button>
            <button className="danger-btn" onClick={clearChat}>
              🗑️ Clear
            </button>
          </div>
        </section>

        <section className="ai-layout">
          {/* Left — Chat */}
          <div className="panel ai-panel">
            <div className="select-row">
              <select value={classLevel} onChange={(e) => setClassLevel(e.target.value)}>
                {["6", "7", "8", "9", "10"].map((c) => (
                  <option key={c} value={c}>Class {c}</option>
                ))}
              </select>
              <select value={subject} onChange={(e) => setSubject(e.target.value)}>
                {["Math", "Science", "Bangla", "English", "History", "Geography"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Messages */}
            <div className="chat-box" ref={chatRef}>
              {messages.map((msg, i) => (
                <div
                  key={i}
                  style={{ display: "flex", flexDirection: "column", alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}
                >
                  <div className={`bubble ${msg.role}`}>
                    {msg.text.split("\n").map((line, j) => (
                      <span key={j}>
                        {line}
                        {j < msg.text.split("\n").length - 1 && <br />}
                      </span>
                    ))}
                  </div>
                  <div className="bubble-meta" style={{ textAlign: msg.role === "user" ? "right" : "left" }}>
                    {msg.role === "ai" ? "🤖 AI Tutor" : "You"} · {msg.time}
                  </div>
                </div>
              ))}

              {typing && (
                <div>
                  <div className="typing-indicator">
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                  </div>
                  <div className="bubble-meta">🤖 AI Tutor is typing...</div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="chat-input-row">
              <input
                className="field-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask a question... (press Enter to send)"
              />
              <button className="primary-btn" onClick={() => sendMessage()}>
                Send →
              </button>
            </div>

            {/* Prompt Chips */}
            <div className="prompt-chips">
              {PROMPTS.map((p) => (
                <button
                  key={p}
                  className="chip"
                  onClick={() => sendMessage(p)}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Right — Tips */}
          <div className="stack-panel">
            <div className="panel">
              <h3>📖 How to Use</h3>
              <ul className="list" style={{ paddingLeft: 0, listStyle: "none" }}>
                {[
                  "Type your question in the box and press Enter",
                  "Select your class and subject for better answers",
                  "Click a prompt chip below to try an example",
                  "Use 🔄 Simplify to get an easier explanation",
                  "Ask in Bangla or English — both work!",
                ].map((tip, i) => (
                  <li
                    key={i}
                    style={{
                      display: "flex",
                      gap: 10,
                      padding: "9px 0",
                      borderBottom: i < 4 ? "1px solid var(--border)" : "none",
                      fontSize: "0.87rem",
                      color: "var(--muted)",
                      alignItems: "flex-start",
                    }}
                  >
                    <span style={{ color: "var(--cyan)", fontWeight: 700, flexShrink: 0 }}>
                      {i + 1}.
                    </span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            <div className="panel">
              <h3>🎯 Try These Topics</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { icon: "🧪", topic: "Photosynthesis", sub: "Science" },
                  { icon: "📐", topic: "Pythagoras Theorem", sub: "Math" },
                  { icon: "🌍", topic: "Climate Change", sub: "Geography" },
                  { icon: "📖", topic: "Grammar Rules", sub: "English/Bangla" },
                  { icon: "⚡", topic: "Ohm's Law", sub: "Physics" },
                ].map((t) => (
                  <button
                    key={t.topic}
                    onClick={() => sendMessage(`Explain ${t.topic} for Class ${classLevel}`)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-sm)",
                      padding: "10px 14px",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "background 0.2s, border-color 0.2s",
                      color: "var(--ink)",
                    }}
                    onMouseOver={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "rgba(34,211,238,0.08)";
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(34,211,238,0.3)";
                    }}
                    onMouseOut={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)";
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
                    }}
                  >
                    <span style={{ fontSize: "1.2rem" }}>{t.icon}</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.88rem" }}>{t.topic}</div>
                      <div style={{ color: "var(--muted)", fontSize: "0.75rem" }}>{t.sub}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
