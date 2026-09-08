/**
 * Answer Service — RAG Orchestrator
 *
 * Orchestrates the full Week 3 AI Tutor pipeline:
 *   1. Retrieve relevant NCTB textbook chunks (retrieval service)
 *   2. Build class-aware prompts (prompt service)
 *   3. Call AI model (ai service)
 *   4. Return structured answer with source metadata
 */

const retrievalService = require("./retrievalService");
const promptService = require("./promptService");
const aiService = require("./aiService");

/**
 * Main answer generation pipeline.
 *
 * @param {Object} params
 * @param {number} params.classLevel  - Student class (1–10)
 * @param {string} params.subject     - Subject name (e.g. "Science")
 * @param {string} params.chapter     - Chapter name or "" for all
 * @param {string} params.question    - Student's question
 *
 * @returns {Promise<Object>} Structured response:
 *   {
 *     answer: string,
 *     classLevel: number,
 *     subject: string,
 *     chapter: string,
 *     sources: Array<{ book, chapter, section, page }>,
 *     noContextFound: boolean
 *   }
 */
async function getAnswer({ classLevel, subject, chapter, question }) {
  // ─── Step 1: Retrieve relevant textbook chunks ─────────────────────────────
  let retrievedChunks = [];
  let noContextFound = false;

  try {
    retrievedChunks = retrievalService.retrieveContext(
      { classLevel, subject, chapter, question },
      4 // top-K chunks
    );
  } catch (retrievalErr) {
    console.warn("[AnswerService] Retrieval error:", retrievalErr.message);
    retrievedChunks = [];
  }

  if (!retrievedChunks || retrievedChunks.length === 0) {
    noContextFound = true;
  }

  // ─── Step 2: Build prompts ─────────────────────────────────────────────────
  const { systemPrompt, userPrompt } = promptService.buildPrompt({
    classLevel,
    subject,
    chapter,
    question,
    retrievedChunks,
  });

  // ─── Step 3: Call AI model ─────────────────────────────────────────────────
  let answer;
  try {
    answer = await aiService.generateAnswer(systemPrompt, userPrompt);
  } catch (aiErr) {
    // Distinguish between "not configured" and "API failure"
    const isConfigError =
      aiErr.message && aiErr.message.includes("not configured");

    if (isConfigError) {
      // Return a clear setup message instead of a hard error
      answer = noContextFound
        ? `I found no matching NCTB textbook content for your question, and the AI provider is not configured yet. Please set AI_API_KEY in the backend .env file to enable AI-generated answers.`
        : `The AI provider is not configured yet. Please set AI_API_KEY in the backend .env file to enable AI-generated answers.\n\nRelevant textbook content was found: ${retrievedChunks.map((c) => c.text).join(" ")}`;
    } else {
      // Real API error — log it but return a safe user message
      console.error("[AnswerService] AI model error:", aiErr.message);
      throw new Error(
        "The AI Tutor is temporarily unavailable. Please try again shortly."
      );
    }
  }

  // ─── Step 4: Build source metadata (without exposing full text) ────────────
  const sources = noContextFound
    ? []
    : retrievedChunks.map((chunk) => ({
      book: chunk.book || "NCTB Textbook",
      chapter: chunk.chapter || "General",
      section: chunk.section || "",
      page: chunk.page || null,
    }));

  // De-duplicate sources (same chapter/section may appear in multiple chunks)
  const uniqueSources = sources.filter(
    (src, idx, arr) =>
      idx ===
      arr.findIndex(
        (s) => s.chapter === src.chapter && s.section === src.section
      )
  );

  return {
    answer,
    classLevel,
    subject,
    chapter: chapter || "",
    sources: uniqueSources,
    noContextFound,
    retrievedChunkCount: retrievedChunks.length,
  };
}

module.exports = {
  getAnswer,
};
