# NCTB Textbooks Directory

This directory is the designated storage repository for official **National Curriculum and Textbook Board (NCTB) Bangladesh** curriculum textbook files.

## Folder Organization

Place textbook files into their respective class folders:

```
textbooks/
├── class-1/       # Class 1 NCTB textbooks (Bangla, English, Math)
├── class-2/       # Class 2 NCTB textbooks (Bangla, English, Math)
├── class-3/       # Class 3 NCTB textbooks (Bangla, English, Math, Science, BGS)
├── class-4/       # Class 4 NCTB textbooks (Bangla, English, Math, Science, BGS)
├── class-5/       # Class 5 NCTB textbooks (Bangla, English, Math, Science, BGS)
├── class-6/       # Class 6 NCTB textbooks (Bangla, English, Math, Science, BGS, ICT)
├── class-7/       # Class 7 NCTB textbooks (Bangla, English, Math, Science, BGS, ICT)
├── class-8/       # Class 8 NCTB textbooks (Bangla, English, Math, Science, BGS, ICT)
├── class-9/       # Class 9 NCTB textbooks (Science/Arts/Commerce SSC streams)
└── class-10/      # Class 10 NCTB textbooks (Science/Arts/Commerce SSC streams)
```

## File Naming Convention

To ensure the automated extraction and chunking pipeline parses metadata accurately, name your files according to this format:

`<subject>-<optional_chapter_or_volume>.[pdf|txt|json|md]`

Examples:
- `class-5/science.pdf`
- `class-9/physics.pdf`
- `class-9/chemistry-chapter-1.txt`
- `class-10/mathematics.pdf`

## Supported Formats

- `.pdf` (Standard NCTB textbook digital PDF editions)
- `.txt` (Plain text extracts)
- `.json` (Pre-structured chapter data)
- `.md` (Markdown formatted curriculum notes)

## Processing Pipeline

Once official NCTB textbooks are added to this folder, run the extraction and chunking pipeline:

```bash
cd schoolos-backend
npm run process-textbooks
# or
node scripts/processTextbooks.js
```

Processed chunks with semantic chunking and metadata will be generated in `data/processed/textbook_chunks.json`.
