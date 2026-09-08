/**
 * NCTB Textbook Retrieval Service
 * Provides filtering and retrieval over processed textbook knowledge chunks.
 *
 * Week 3: Improved keyword scoring with Bangla support.
 * Future: Replace scoredChunks sort with vector embedding similarity search.
 */

const fs = require("fs");
const path = require("path");
const { normalizeSubject } = require("./subjectNormalization");

const CHUNKS_FILE = path.join(
  __dirname,
  "..",
  "data",
  "processed",
  "textbook_chunks.json"
);

class RetrievalService {
  constructor() {
    this.chunks = [];
    this.loadChunks();
  }

  /**
   * Loads processed chunks from disk.
   * Called on startup and before each retrieval (handles hot-reload).
   */
  loadChunks() {
    try {
      if (fs.existsSync(CHUNKS_FILE)) {
        const raw = fs.readFileSync(CHUNKS_FILE, "utf-8");
        this.chunks = JSON.parse(raw);
        console.log(
          `[RetrievalService] Loaded ${this.chunks.length} textbook chunk(s).`
        );
      } else {
        this.chunks = [];
        console.warn(
          `[RetrievalService] Chunks file not found: ${CHUNKS_FILE}`
        );
      }
    } catch (err) {
      console.warn(`[RetrievalService] Failed to load chunks: ${err.message}`);
      this.chunks = [];
    }
  }

  /**
   * Reloads chunks from disk (useful after processing new textbooks).
   */
  reloadChunks() {
    this.loadChunks();
  }

  /**
   * Filters textbook chunks by classLevel, subject, and optional chapter.
   * @param {Object} query - { classLevel, subject, chapter }
   * @returns {Array<Object>}
   */
  filterChunks({ classLevel, subject, chapter }) {
    return this.chunks.filter((chunk) => {
      // Match classLevel
      if (
        classLevel !== undefined &&
        classLevel !== null &&
        Number(chunk.classLevel) !== Number(classLevel)
      ) {
        return false;
      }

      // Normalize and match subject (case-insensitive exact after trimming)
      if (subject && chunk.subject) {
        const normalizedRequestSubject = normalizeSubject(subject);
        const normalizedChunkSubject = normalizeSubject(chunk.subject);
        if (normalizedRequestSubject !== normalizedChunkSubject) {
          return false;
        }
      }

      // Match chapter if provided and not "All Chapters"
      if (chapter && chapter !== "All Chapters" && chunk.chapter) {
        // Exact case-insensitive match after trimming
        if (chapter.trim().toLowerCase() !== chunk.chapter.trim().toLowerCase()) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Tokenizes text for keyword scoring.
   * Handles both English (alphanumeric) and Bangla (Unicode block U+0980–U+09FF).
   * @param {string} text
   * @returns {string[]}
   */
  tokenize(text) {
    if (!text) return [];
    return text
      .toLowerCase()
      // Keep English alphanum and Bangla Unicode characters; replace rest with space
      .replace(/[^a-z0-9\u0980-\u09FF\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 1); // Keep short Bangla morphemes too
  }

  /**
   * Retrieves the most relevant textbook chunks for a question.
   *
   * Current method: Keyword (lexical) scoring — simple and reliable for Week 3.
   * Future: Replace with cosine similarity over text embeddings (e.g. Gemini embeddings).
   *
   * @param {Object} query  - { classLevel, subject, chapter, question }
   * @param {number} topK   - Maximum number of chunks to return (default: 4)
   * @returns {Array<Object>} Top-K scored chunks (without the internal score field)
   */
  retrieveContext({ classLevel, subject, chapter, question }, topK = 4) {
    // Reload on every request to pick up newly processed textbooks
    this.loadChunks();

    const candidateChunks = this.filterChunks({ classLevel, subject, chapter });
    if (candidateChunks.length === 0) return [];
    if (!question) return candidateChunks.slice(0, topK);

    const questionTokens = this.tokenize(question);

    const scored = candidateChunks.map((chunk) => {
      // Combine searchable fields into one text blob
      const searchable = [
        chunk.text || "",
        chunk.chapter || "",
        chunk.section || "",
        chunk.subject || "",
      ]
        .join(" ")
        .toLowerCase();

      let score = 0;
      for (const token of questionTokens) {
        const occurrences = (
          searchable.match(new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []
        ).length;
        score += occurrences;
      }

      return { ...chunk, _score: score };
    });

    // De‑duplicate chunks based on a unique key (book+chapter+section+page)
    const seen = new Set();
    const uniqueScored = [];
    for (const item of scored) {
      const key = `${item.book || ""}|${item.chapter || ""}|${item.section || ""}|${item.page || ""}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueScored.push(item);
      }
    }

    // Sort by score descending; fall back to page order for ties
    uniqueScored.sort((a, b) => {
      if (b._score !== a._score) return b._score - a._score;
      return (a.page || 0) - (b.page || 0);
    });

    // Return top‑K, stripping the internal _score field
    return uniqueScored.slice(0, topK).map(({ _score, ...chunk }) => chunk);
  }
}

module.exports = new RetrievalService();
