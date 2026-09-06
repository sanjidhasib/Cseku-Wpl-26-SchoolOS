# SchoolOS Backend & AI Tutor Service

Backend REST API for SchoolOS, powering school administration portals and the AI Tutor textbook knowledge retrieval service.

---

## 1. How to Start the Backend

### Prerequisites
- Node.js (v18 or higher)
- npm (Node Package Manager)
- Optional: MongoDB instance (local or Atlas cluster)

### Installation & Startup
```bash
# 1. Navigate to backend directory
cd schoolos-backend

# 2. Install dependencies
npm install

# 3. Start development server on http://localhost:5000
npm run dev
# or
node server.js
```

The server will initialize on `http://localhost:5000`.

---

## 2. Backend Folder Structure

```
schoolos-backend/
├── config/
│   ├── db.js                     # MongoDB connection with dev fallback
│   └── tutorPromptConfig.js      # Class-aware explanation rules (Class 1-10)
├── controllers/
│   └── aiController.js           # Handlers for health check & ask API
├── validators/
│   └── aiValidator.js            # Input validation middleware
├── routes/
│   ├── ai.js                     # AI Tutor endpoints (/health, /ask)
│   ├── auth.js                   # Auth routes
│   ├── attendance.js             # Attendance routes
│   ├── notices.js                # Notice routes
│   ├── results.js                # Results routes
│   ├── students.js               # Students routes
│   └── teachers.js               # Teachers routes
├── services/
│   └── retrievalService.js       # Search & retrieval over processed chunks
├── data/
│   ├── textbooks/                # Organized by class and subject
│   │   ├── class-1/ (bangla, english, mathematics)
│   │   ├── class-2/ (bangla, english, mathematics)
│   │   ├── class-3/ (bangla, english, mathematics, science, bgs)
│   │   ├── class-4/ (bangla, english, mathematics, science, bgs)
│   │   ├── class-5/ (bangla, english, mathematics, science, bgs)
│   │   ├── class-6/ (bangla, english, mathematics, science, bgs, ict)
│   │   ├── class-7/ (bangla, english, mathematics, science, bgs, ict)
│   │   ├── class-8/ (bangla, english, mathematics, science, bgs, ict)
│   │   ├── class-9/ (bangla, english, mathematics, physics, chemistry, biology, higher_math, bgs, ict)
│   │   ├── class-10/ (bangla, english, mathematics, physics, chemistry, biology, higher_math, bgs, ict)
│   │   └── README.md             # Placement instructions
│   ├── raw/                      # Unprocessed text notes/excerpts
│   └── processed/
│       └── textbook_chunks.json  # Structured knowledge chunks
├── scripts/
│   ├── extractText.js            # PDF and text extraction utility
│   ├── chunkText.js              # Sentence-aware semantic chunker
│   └── processTextbooks.js       # End-to-end pipeline runner
├── models/                       # Mongoose database models
├── middleware/                   # JWT & Auth middleware
├── .env                          # Local environment settings
├── .env.example                  # Environment configuration template
├── package.json
└── server.js                     # Main Express application entrypoint
```

---

## 3. GET /api/health

Checks that the AI Tutor backend service is online.

### Endpoint:
`GET http://localhost:5000/api/health`

### Response:
```json
{
  "status": "ok",
  "message": "AI Tutor backend is running"
}
```

---

## 4. POST /api/ask

Receives, validates, and logs student questions for NCTB textbook retrieval.

### Endpoint:
`POST http://localhost:5000/api/ask`

### Validation Rules:
- `classLevel`: Required, integer between 1 and 10.
- `subject`: Required, non-empty string.
- `question`: Required, non-empty string.
- `chapter`: Optional string.

---

## 5. Request and Response Format

### Sample Request:
```json
{
  "classLevel": 5,
  "subject": "Science",
  "chapter": "Photosynthesis",
  "question": "What is photosynthesis?"
}
```

### Success Response (HTTP 200):
```json
{
  "success": true,
  "message": "Question received successfully",
  "data": {
    "classLevel": 5,
    "subject": "Science",
    "chapter": "Photosynthesis",
    "question": "What is photosynthesis?"
  }
}
```

### Error Response (HTTP 400):
```json
{
  "success": false,
  "message": "Class, subject, and question are required"
}
```

---

## 6. Where NCTB PDFs Should Be Placed

Place official NCTB curriculum PDF files into their respective class and subject folders inside `data/textbooks/`:

- **Class 5 Science PDF:** `data/textbooks/class-5/science/science.pdf`
- **Class 9 Physics PDF:** `data/textbooks/class-9/physics/physics.pdf`
- **Class 10 Mathematics PDF:** `data/textbooks/class-10/mathematics/math.pdf`

---

## 7. How Textbook Processing Works

The automated pipeline reads files from `data/textbooks/` and `data/raw/`:

1. **Text Extraction (`scripts/extractText.js`)**: Extracts raw text from `.pdf`, `.txt`, `.json`, or `.md` files using `pdf-parse` or standard text decoders.
2. **Cleaning & Metadata Tagging**: Infers `classLevel`, `subject`, `book`, `chapter`, `section`, and `page` numbers from directory hierarchy and file contents.
3. **Sentence Chunking (`scripts/chunkText.js`)**: Splits sections into meaningful chunks (~300–500 characters) preserving sentence integrity with sliding overlap.
4. **JSON Output (`scripts/processTextbooks.js`)**: Exports all processed knowledge to `data/processed/textbook_chunks.json`.

### Running the pipeline:
```bash
npm run process-textbooks
# or
node scripts/processTextbooks.js
```

---

## 8. Processed Textbook Chunk Format

Each chunk in `data/processed/textbook_chunks.json` follows this schema:
```json
{
  "classLevel": 5,
  "subject": "Science",
  "book": "NCTB Science",
  "chapter": "Photosynthesis",
  "section": "Food Preparation in Plants",
  "page": 2,
  "text": "During photosynthesis, plants take in carbon dioxide gas from the surrounding air through tiny microscopic pores in their leaves called stomata. At the same time, roots absorb water and dissolved minerals from the soil."
}
```

---

## 9. Class-Aware Explanation Configuration

Located in [`config/tutorPromptConfig.js`](./config/tutorPromptConfig.js), the configuration adjusts explanation complexity and pedagogical tone:

- **Class 1–2 (Early Primary):** Extremely simple vocabulary, 2–3 short sentences, playful tone, everyday familiar examples.
- **Class 3–5 (Upper Primary):** Simple educational explanations, step-by-step breakdowns, relatable nature examples.
- **Class 6–8 (Junior Secondary):** Moderate detail, standard NCTB subject terminology with explanations, structured reasoning.
- **Class 9–10 (Secondary SSC):** Deep academic explanations, exact subject formulas and laws, exam-oriented clarity.

---

## 10. What is Completed in Week 2

1. Modular backend with routes, controllers, validators, and retrieval services.
2. Health-check API (`GET /api/health`) and Question API (`POST /api/ask`).
3. Frontend-to-backend connection with loading indicator and error handling.
4. NCTB textbook directory structure for Class 1 through Class 10 with subject subfolders.
5. End-to-end PDF/text extraction, cleaning, and sentence-chunking pipeline.
6. Class-aware explanation and prompt configuration.

---

## 11. What Will Be Implemented in Week 3

1. **Vector Embeddings**: Compute embeddings for all chunks in `textbook_chunks.json`.
2. **RAG Vector Similarity Search**: Match student questions with the most relevant textbook chunk.
3. **AI/LLM Model Integration**: Connect external AI API using class-aware prompts to generate tutor answers in Bangla & English.
4. **Interactive Tutor Capabilities**: Add follow-up questions and simplified re-explanation modes.
