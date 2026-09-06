/**
 * Extract Text Utility
 * Reads raw NCTB textbook files (.pdf, .txt, .md, .json) and extracts clean content with rich metadata.
 */

const fs = require("fs");
const path = require("path");

/**
 * Extracts classLevel, subject, and book title from folder hierarchy or file path.
 * e.g., "data/textbooks/class-5/science/science.pdf" -> classLevel: 5, subject: "Science", book: "NCTB Class 5 Science"
 */
function inferMetadataFromPath(filePath) {
  const normalized = filePath.replace(/\\/g, "/");
  let classLevel = 5;
  let subject = "General";
  let book = "NCTB Textbook";

  // Match class folder e.g. class-5 or class-10
  const classMatch = normalized.match(/class-(\d+)/i);
  if (classMatch) {
    classLevel = parseInt(classMatch[1], 10);
  }

  // Check path segments for subject folder
  const parts = normalized.toLowerCase().split("/");
  if (parts.includes("science")) subject = "Science";
  else if (parts.includes("mathematics") || parts.includes("math")) subject = "Mathematics";
  else if (parts.includes("bangla")) subject = "Bangla";
  else if (parts.includes("english")) subject = "English";
  else if (parts.includes("physics")) subject = "Physics";
  else if (parts.includes("chemistry")) subject = "Chemistry";
  else if (parts.includes("biology")) subject = "Biology";
  else if (parts.includes("higher_math") || parts.includes("higher-math")) subject = "Higher Mathematics";
  else if (parts.includes("bgs") || parts.includes("global")) subject = "Bangladesh and Global Studies";
  else if (parts.includes("ict")) subject = "ICT";
  else {
    const baseName = path.basename(filePath, path.extname(filePath)).toLowerCase();
    if (baseName.includes("science")) subject = "Science";
    else if (baseName.includes("math")) subject = "Mathematics";
    else if (baseName.includes("bangla")) subject = "Bangla";
    else if (baseName.includes("english")) subject = "English";
    else subject = baseName.charAt(0).toUpperCase() + baseName.slice(1);
  }

  book = `NCTB Class ${classLevel} ${subject}`;

  return { classLevel, subject, book };
}

/**
 * Cleans extracted text by normalizing whitespace, linebreaks, and special artifacts
 * while strictly preserving the educational vocabulary and meaning.
 */
function cleanExtractedText(rawText) {
  if (!rawText) return "";
  return rawText
    .replace(/\r\n/g, "\n")
    .replace(/\t/g, " ")
    .replace(/[ \u00a0\u2000-\u200b]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Parses raw text content and segments it by chapter, section, and page boundaries.
 */
function parseTextContent(rawContent, defaultMeta = {}) {
  const sections = [];
  const cleaned = cleanExtractedText(rawContent);
  const lines = cleaned.split("\n");

  let currentPage = 1;
  let currentBook = defaultMeta.book || `NCTB Class ${defaultMeta.classLevel || 5} ${defaultMeta.subject || "Textbook"}`;
  let currentChapter = "General";
  let currentSection = "General";
  let buffer = [];

  const flushBuffer = () => {
    if (buffer.length > 0) {
      const text = buffer.join("\n").trim();
      if (text.length > 0) {
        sections.push({
          classLevel: defaultMeta.classLevel || 5,
          subject: defaultMeta.subject || "General",
          book: currentBook,
          chapter: currentChapter,
          section: currentSection,
          page: currentPage,
          text,
        });
      }
      buffer = [];
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();

    // Check for book title marker e.g. Book: NCTB Science
    const bookMatch = trimmed.match(/^Book:\s*(.+)$/i);
    if (bookMatch) {
      currentBook = bookMatch[1].trim();
      continue;
    }

    // Check for page markers e.g. [PAGE: 12] or --- Page 12 --- or -- 12 of 166 --
    const pageMatch =
      trimmed.match(/^\[PAGE:\s*(\d+)\]/i) ||
      trimmed.match(/^---\s*Page\s*(\d+)\s*---/i) ||
      trimmed.match(/^--\s*(\d+)\s*of\s*\d+\s*--/i);
    if (pageMatch) {
      flushBuffer();
      currentPage = parseInt(pageMatch[1], 10);
      continue;
    }

    // Check for chapter markers e.g. Chapter: Photosynthesis or Chapter 1: ...
    const chapterMatch =
      trimmed.match(/^Chapter:\s*(.+)$/i) ||
      trimmed.match(/^Chapter\s*(\d+[:\s].+)$/i) ||
      trimmed.match(/^অধ্যায়\s*(\d+[:\s].+)$/);
    if (chapterMatch) {
      flushBuffer();
      currentChapter = chapterMatch[1].trim();
      currentSection = currentChapter;
      continue;
    }

    // Check for section markers e.g. Section: Food Preparation in Plants
    const sectionMatch = trimmed.match(/^Section:\s*(.+)$/i) || trimmed.match(/^পরিচ্ছেদ:\s*(.+)$/);
    if (sectionMatch) {
      flushBuffer();
      currentSection = sectionMatch[1].trim();
      continue;
    }

    // Check for title markers e.g. Title: ... or # Title
    const titleMatch = trimmed.match(/^Title:\s*(.+)$/i) || trimmed.match(/^#+\s*(.+)$/);
    if (titleMatch) {
      const heading = titleMatch[1].trim();
      if (currentChapter === "General") {
        currentChapter = heading;
      }
      if (currentSection === "General" || currentSection === currentChapter) {
        currentSection = heading;
      }
    }

    buffer.push(line);
  }

  flushBuffer();
  return sections;
}

/**
 * Extracts sections from a file on disk (supports .pdf, .txt, .md, and .json).
 */
async function extractFromFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const ext = path.extname(filePath).toLowerCase();
  const defaultMeta = inferMetadataFromPath(filePath);

  if (ext === ".txt" || ext === ".md") {
    const raw = fs.readFileSync(filePath, "utf-8");
    return {
      sourceFile: filePath,
      type: "text",
      pageCount: (raw.match(/\[PAGE:\s*\d+\]/gi) || []).length || 1,
      sections: parseTextContent(raw, defaultMeta),
    };
  }

  if (ext === ".json") {
    const raw = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return {
        sourceFile: filePath,
        type: "json",
        pageCount: new Set(parsed.map((p) => p.page || 1)).size,
        sections: parsed.map((item) => ({
          classLevel: item.classLevel || defaultMeta.classLevel || 5,
          subject: item.subject || defaultMeta.subject || "General",
          book: item.book || defaultMeta.book || "NCTB Textbook",
          chapter: item.chapter || "General",
          section: item.section || item.chapterTitle || "General",
          page: item.page || 1,
          text: item.text || JSON.stringify(item),
        })),
      };
    }
    return {
      sourceFile: filePath,
      type: "json",
      pageCount: 1,
      sections: parseTextContent(JSON.stringify(parsed, null, 2), defaultMeta),
    };
  }

  if (ext === ".pdf") {
    try {
      const pdfModule = require("pdf-parse");
      const dataBuffer = fs.readFileSync(filePath);

      let totalPages = 0;
      let rawText = "";
      let isImageBased = false;

      if (pdfModule.PDFParse) {
        const parser = new pdfModule.PDFParse({ data: dataBuffer });
        const info = await parser.getInfo().catch(() => ({}));
        totalPages = info.total || 0;
        const textResult = await parser.getText();
        if (textResult) {
          totalPages = textResult.total || totalPages;
          if (textResult.pages && Array.isArray(textResult.pages)) {
            const pagesWithText = textResult.pages.filter((p) => p.text && p.text.trim().length > 0);
            if (pagesWithText.length === 0 && totalPages > 0) {
              isImageBased = true;
            } else {
              rawText = textResult.pages
                .map((p) => `[PAGE: ${p.num || 1}]\n${p.text || ""}`)
                .join("\n\n");
            }
          } else if (textResult.text) {
            rawText = textResult.text;
          }
        }
      } else if (typeof pdfModule === "function") {
        const data = await pdfModule(dataBuffer);
        totalPages = data.numpages || 0;
        rawText = data.text || "";
        if (!rawText.trim() && totalPages > 0) {
          isImageBased = true;
        }
      }

      if (isImageBased) {
        console.log(`ℹ️ [PDF Diagnostic] File: "${path.basename(filePath)}" (${(dataBuffer.length / (1024 * 1024)).toFixed(1)} MB)`);
        console.log(`   ↳ Detected ${totalPages} pages rendered as vector artwork/scanned images (0 embedded text fonts).`);
        console.log(`   ↳ Note: Scanned/image-based PDFs require OCR or paired curriculum text extracts for indexing.`);
      }

      if (rawText && rawText.trim().length > 0) {
        return {
          sourceFile: filePath,
          type: "pdf",
          pageCount: totalPages || 1,
          isImageBased: false,
          sections: parseTextContent(rawText, defaultMeta),
        };
      }

      return {
        sourceFile: filePath,
        type: "pdf",
        pageCount: totalPages,
        isImageBased: true,
        sections: [],
      };
    } catch (err) {
      console.warn(`[extractText] Error parsing PDF ${filePath}: ${err.message}`);
      return {
        sourceFile: filePath,
        type: "pdf",
        pageCount: 0,
        isImageBased: false,
        sections: [],
      };
    }
  }

  return { sourceFile: filePath, type: "unknown", pageCount: 0, sections: [] };
}

module.exports = {
  inferMetadataFromPath,
  cleanExtractedText,
  parseTextContent,
  extractFromFile,
};
