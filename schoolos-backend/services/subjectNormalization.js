// Subject normalization utility for internal use
// Maps frontend subject labels to canonical metadata values used in textbook chunks.

const SUBJECT_MAP = {
  "primary science": "science",
  "secondary science": "science",
  // Add more mappings as needed
};

/**
 * Normalizes a subject name to the canonical form stored in textbook metadata.
 * The matching is case‑insensitive and trims whitespace.
 * If no mapping exists, returns the lower‑cased trimmed input.
 * @param {string} name - Subject name from the request (e.g. "Primary Science").
 * @returns {string} Normalized subject name (e.g. "science").
 */
function normalizeSubject(name) {
  if (!name) return "";
  const key = name.trim().toLowerCase();
  return SUBJECT_MAP[key] || key;
}

module.exports = { normalizeSubject };
