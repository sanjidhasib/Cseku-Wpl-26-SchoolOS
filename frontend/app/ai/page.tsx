"use client";

import { useState } from "react";
import NavBar from "../components/NavBar";

const starterMessages = [
  { role: "ai", text: "Hello! Ask any textbook question in Bangla or English." },
];

export default function AITutorPage() {
  const [classLevel, setClassLevel] = useState("9");
  const [subject, setSubject] = useState("Science");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(starterMessages);

  function sendMessage() {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage = { role: "user", text: trimmed };
    setMessages((current) => [...current, userMessage]);
    setInput("");

    setTimeout(() => {
      const answer = `For class ${classLevel} ${subject}, the key idea is: ${trimmed}. Think of a simple example and then explain the main concept in a short sentence. If you want, I can simplify or give an example.`;
      setMessages((current) => [...current, { role: "ai", text: answer }]);
    }, 500);
  }

  function simplifyLast() {
    const lastUser = [...messages].reverse().find((msg) => msg.role === "user");
    if (!lastUser) return;

    setMessages((current) => [
      ...current,
      { role: "ai", text: `Simpler version: ${lastUser.text} means the main idea is to understand the basic rule first, then solve a small example step by step.` },
    ]);
  }

  return (
    <main className="page-shell">
      <NavBar />

      <section className="hero-panel">
        <div>
          <p className="eyebrow">AI Learning Agent</p>
          <h1>Ask your textbook question</h1>
        </div>
        <button className="secondary-btn" onClick={simplifyLast}>Simplify</button>
      </section>

      <section className="ai-layout">
        <div className="panel ai-panel">
          <div className="select-row">
            <select value={classLevel} onChange={(e) => setClassLevel(e.target.value)}>
              <option value="6">Class 6</option>
              <option value="7">Class 7</option>
              <option value="8">Class 8</option>
              <option value="9">Class 9</option>
              <option value="10">Class 10</option>
            </select>
            <select value={subject} onChange={(e) => setSubject(e.target.value)}>
              <option value="Math">Math</option>
              <option value="Science">Science</option>
              <option value="Bangla">Bangla</option>
              <option value="English">English</option>
            </select>
          </div>

          <div className="chat-box">
            {messages.map((msg, index) => (
              <div key={`${msg.role}-${index}`} className={`bubble ${msg.role}`}>
                {msg.text}
              </div>
            ))}
          </div>

          <div className="chat-input-row">
            <input
              className="field-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              placeholder="Ask a question..."
            />
            <button className="primary-btn" onClick={sendMessage}>Send</button>
          </div>
        </div>

        <div className="panel">
          <h3>Helpful prompts</h3>
          <ul className="list">
            <li>Explain respiration in simple words.</li>
            <li>Give an example of a quadratic equation.</li>
            <li>How do I solve this Bangla grammar question?</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
