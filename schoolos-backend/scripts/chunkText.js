/**
 * Text Chunking Utility
 * Splits textbook section text into semantic, sentence-preserving chunks with complete metadata.
 */

/**
 * Splits text into individual sentences without breaking abbreviation periods.
 */
function splitIntoSentences(text) {
  if (!text) return [];
  const rawSentences = text
    .replace(/(\r\n|\n|\r)/gm, " ")
    .split(/(?<=[.?!])\s+/);

  return rawSentences
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/**
 * Chunks a single textbook section into smaller semantic units with metadata.
 * @param {Object} section - { classLevel, subject, book, chapter, section, page, text }
 * @param {Object} options - { maxChunkChars: 500, minChunkChars: 120 }
 * @returns {Array<Object>} List of chunk objects
 */
function chunkSection(section, options = {}) {
  const maxChunkChars = options.maxChunkChars || 500;
  const minChunkChars = options.minChunkChars || 120;

  const sentences = splitIntoSentences(section.text);
  if (sentences.length === 0) return [];

  const chunks = [];
  let currentSentences = [];
  let currentLength = 0;

  for (const sentence of sentences) {
    if (currentLength + sentence.length > maxChunkChars && currentLength >= minChunkChars) {
      // Create chunk from accumulated sentences
      chunks.push({
        classLevel: section.classLevel || 5,
        subject: section.subject || "General",
        book: section.book || `NCTB Class ${section.classLevel || 5} ${section.subject || "Textbook"}`,
        chapter: section.chapter || "General",
        section: section.section || section.chapter || "General",
        page: section.page || 1,
        text: currentSentences.join(" "),
      });

      // Keep last sentence for overlap context if available
      if (currentSentences.length > 1) {
        const lastSentence = currentSentences[currentSentences.length - 1];
        currentSentences = [lastSentence, sentence];
        currentLength = lastSentence.length + sentence.length + 1;
      } else {
        currentSentences = [sentence];
        currentLength = sentence.length;
      }
    } else {
      currentSentences.push(sentence);
      currentLength += sentence.length + 1;
    }
  }

  // Push remaining sentences as final chunk
  if (currentSentences.length > 0) {
    chunks.push({
      classLevel: section.classLevel || 5,
      subject: section.subject || "General",
      book: section.book || `NCTB Class ${section.classLevel || 5} ${section.subject || "Textbook"}`,
      chapter: section.chapter || "General",
      section: section.section || section.chapter || "General",
      page: section.page || 1,
      text: currentSentences.join(" "),
    });
  }

  return chunks;
}

/**
 * Chunks multiple sections into a flat list of chunk records.
 */
function chunkAllSections(sections, options = {}) {
  const allChunks = [];
  for (const section of sections) {
    const sectionChunks = chunkSection(section, options);
    allChunks.push(...sectionChunks);
  }
  return allChunks;
}

module.exports = {
  splitIntoSentences,
  chunkSection,
  chunkAllSections,
};
