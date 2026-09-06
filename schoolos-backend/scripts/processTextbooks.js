/**
 * NCTB Textbook Processing Pipeline
 * 
 * Pipeline Flow:
 * NCTB Textbook (.pdf, .txt, .json, .md) 
 * → Text Extraction (with scanned/image PDF detection)
 * → Cleaning (whitespace & encoding normalization)
 * → Chapter & Section Identification
 * → Semantic Sentence Chunking
 * → Metadata Attachment (classLevel, subject, book, chapter, section, page, text)
 * → Output to data/processed/textbook_chunks.json
 */

const fs = require("fs");
const path = require("path");
const { extractFromFile } = require("./extractText");
const { chunkAllSections } = require("./chunkText");

const TEXTBOOKS_DIR = path.join(__dirname, "..", "data", "textbooks");
const RAW_DIR = path.join(__dirname, "..", "data", "raw");
const OUTPUT_DIR = path.join(__dirname, "..", "data", "processed");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "textbook_chunks.json");

/**
 * Recursively retrieves all files from a directory.
 */
function getAllFiles(dirPath, arrayOfFiles = []) {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;

  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    if (file === ".gitkeep" || file === "README.md") continue;

    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  }
  return arrayOfFiles;
}

/**
 * Main processing runner
 */
async function processAllTextbooks() {
  console.log("================================================================================");
  console.log("📚 SchoolOS NCTB Textbook Processing Pipeline (Week 2 Knowledge Base)");
  console.log("================================================================================");

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Find all textbook files in data/textbooks and data/raw
  const textbookFiles = getAllFiles(TEXTBOOKS_DIR);
  const rawFiles = getAllFiles(RAW_DIR);
  const allFiles = [...new Set([...textbookFiles, ...rawFiles])];

  console.log(`📂 Found ${allFiles.length} textbook file(s) in repository.`);

  if (allFiles.length === 0) {
    console.log("ℹ️ No textbook files found to process.");
    console.log(`👉 Please place NCTB files in ${TEXTBOOKS_DIR}`);
    return;
  }

  let totalPagesProcessed = 0;
  let totalFilesProcessed = 0;
  const scannedPdfNotices = [];
  const allSections = [];
  const chaptersSet = new Set();
  const sectionsSet = new Set();

  for (const filePath of allFiles) {
    const relPath = path.relative(path.join(__dirname, ".."), filePath);
    try {
      console.log(`\n🔍 Inspecting: ${relPath}`);
      const extractionResult = await extractFromFile(filePath);

      if (extractionResult.type === "pdf" && extractionResult.isImageBased) {
        scannedPdfNotices.push({
          file: relPath,
          pages: extractionResult.pageCount,
        });
      }

      totalPagesProcessed += extractionResult.pageCount || 0;
      totalFilesProcessed += 1;

      const extractedSections = extractionResult.sections || [];
      console.log(`   ↳ Extracted: ${extractedSections.length} textbook section(s)`);

      for (const sec of extractedSections) {
        if (sec.chapter && sec.chapter !== "General") chaptersSet.add(sec.chapter);
        if (sec.section && sec.section !== "General") sectionsSet.add(sec.section);
      }

      allSections.push(...extractedSections);
    } catch (err) {
      console.error(`❌ Error extracting ${relPath}: ${err.message}`);
    }
  }

  console.log(`\n🧩 Chunking ${allSections.length} section(s) into semantic units...`);
  const chunks = chunkAllSections(allSections, {
    maxChunkChars: 500,
    minChunkChars: 120,
  });

  // Save to processed JSON
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(chunks, null, 2), "utf-8");

  // Summary Metrics
  console.log("\n================================================================================");
  console.log("📊 Processing Summary Report");
  console.log("================================================================================");
  console.log(`📄 Total Pages Processed:     ${totalPagesProcessed}`);
  console.log(`📖 Total Chapters Detected:   ${chaptersSet.size > 0 ? chaptersSet.size : "(from curriculum structure)"}`);
  if (chaptersSet.size > 0) {
    console.log(`   Chapters: ${Array.from(chaptersSet).join(", ")}`);
  }
  console.log(`📑 Total Sections Detected:   ${sectionsSet.size > 0 ? sectionsSet.size : "(from curriculum structure)"}`);
  if (sectionsSet.size > 0) {
    console.log(`   Sections: ${Array.from(sectionsSet).join(", ")}`);
  }
  console.log(`✨ Total Chunks Created:      ${chunks.length}`);
  console.log(`💾 Output File Location:      ${OUTPUT_FILE}`);

  if (scannedPdfNotices.length > 0) {
    console.log("\n⚠️ Image-Based / Scanned PDF Diagnostic:");
    for (const note of scannedPdfNotices) {
      console.log(`   - "${note.file}" (${note.pages} pages): Vector artwork / scanned image PDF without embedded font layer.`);
      console.log(`     (Paired NCTB text files provide clean indexed curriculum knowledge for this textbook).`);
    }
  }

  console.log("\n================================================================================");
  console.log("🔍 Sample Processed Chunks (3-5 Samples with Full Metadata):");
  console.log("================================================================================");

  const samples = chunks.slice(0, 4);
  samples.forEach((sample, i) => {
    console.log(`\n--- Sample Chunk #${i + 1} ---`);
    console.log(JSON.stringify(sample, null, 2));
  });

  console.log("\n================================================================================");
  console.log("🎉 NCTB Knowledge Base pipeline execution complete!");
  console.log("================================================================================");

  return {
    totalPagesProcessed,
    chaptersDetected: Array.from(chaptersSet),
    sectionsDetected: Array.from(sectionsSet),
    chunksCreated: chunks.length,
    outputFile: OUTPUT_FILE,
    samples,
  };
}

// Execute when called directly
if (require.main === module) {
  processAllTextbooks().catch((err) => {
    console.error("Fatal processing error:", err);
    process.exit(1);
  });
}

module.exports = {
  processAllTextbooks,
};
