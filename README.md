# SchoolOS

Smart School Management and Personalized Education Platform

SchoolOS is a web-based platform that combines core school administration — user management, attendance, results, and notices — with an AI Learning Agent that helps students understand textbook topics in Bangla and English.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [User Roles](#user-roles)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running Backend & Frontend](#running-backend--frontend)
- [AI Tutor & NCTB Knowledge Base](#ai-tutor--nctb-knowledge-base)
  - [API Endpoints](#api-endpoints)
  - [Testing the APIs](#testing-the-apis)
  - [NCTB Textbooks Storage & Directory Structure](#nctb-textbooks-storage--directory-structure)
  - [Running the Textbook Processing Pipeline](#running-the-textbook-processing-pipeline)
- [Sprint Progress](#sprint-progress)
  - [Week 1 Completed](#week-1-completed)
  - [Week 2 Completed](#week-2-completed)
  - [Week 3 Roadmap](#week-3-roadmap)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Development Methodology](#development-methodology)
- [Contributors](#contributors)
- [License](#license)

---

## Overview

SchoolOS provides a clean, easy-to-use web interface for administrators, teachers, students, and guardians to manage day-to-day school activities. Its flagship academic feature is the **AI Tutor**, which explains textbook topics to students based on their class level (Class 1 to Class 10), in either Bangla or English, based on NCTB curriculum textbooks.

---

## Features

- **Role-Based Portals**: Administrator, Teacher, Student, and Guardian.
- **Academic Administration**: Real-time attendance, results management, class & subject management.
- **Notice Board**: Categorized announcement broadcasting.
- **AI Tutor**: Dedicated curriculum-aligned tutor interface with class/subject/chapter selection, input validation, and textbook knowledge base preparation.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), React 19, TypeScript, Vanilla CSS |
| Backend | Node.js, Express REST API |
| Database | MongoDB & Mongoose |
| Knowledge Base | NCTB Textbook Parser & Semantic Text Chunking Engine |
| Authentication | JWT & Role-based Access Control |

---

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- MongoDB (optional for basic AI testing; required for full auth & user persistence)
- npm

### Installation

Clone the repository:

```bash
git clone https://github.com/<your-username>/Cseku-Wpl-26-SchoolOS.git
cd Cseku-Wpl-26-SchoolOS
```

Install dependencies for both frontend and backend:

```bash
# 1. Install Frontend dependencies
cd frontend
npm install

# 2. Install Backend dependencies
cd ../schoolos-backend
npm install
```

### Running Backend & Frontend

1. **Start the Backend Server (Port 5000):**
   ```bash
   cd schoolos-backend
   npm run dev
   # or
   node server.js
   ```

2. **Start the Frontend Server (Port 3000):**
   ```bash
   cd frontend
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000`.

---

## AI Tutor & NCTB Knowledge Base

### API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` or `/api/ai/health` | AI Tutor backend health check |
| `POST` | `/api/ask` or `/api/ai/ask` | Validates & receives student question |

#### `POST /api/ask` Request Body:
```json
{
  "classLevel": 5,
  "subject": "Science",
  "chapter": "Photosynthesis",
  "question": "What is photosynthesis?"
}
```

#### `POST /api/ask` Success Response:
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

### Testing the APIs

You can test the backend endpoints directly using `curl` or PowerShell:

#### 1. Health-Check API:
```bash
curl http://localhost:5000/api/health
```
**Output:**
```json
{"status":"ok","message":"AI Tutor backend is running"}
```

#### 2. Question Submission API:
```bash
curl -X POST http://localhost:5000/api/ask \
  -H "Content-Type: application/json" \
  -d "{\"classLevel\": 5, \"subject\": \"Science\", \"chapter\": \"Photosynthesis\", \"question\": \"What is photosynthesis?\"}"
```

#### 3. Validation Error Cases:
- **Missing class**: Returns HTTP 400 (`"Class, subject, and question are required"`)
- **Invalid class level**: Returns HTTP 400 (`"classLevel must be an integer between 1 and 10"`)
- **Empty question**: Returns HTTP 400 (`"question must not be empty"`)

---

### NCTB Textbooks Storage & Directory Structure

Official National Curriculum and Textbook Board (NCTB) files are organized in `schoolos-backend/data/textbooks/`:

```
schoolos-backend/data/
├── textbooks/
│   ├── class-1/          # Class 1 textbooks (Bangla, English, Math)
│   ├── class-2/          # Class 2 textbooks
│   ├── class-3/          # Class 3 textbooks
│   ├── class-4/          # Class 4 textbooks
│   ├── class-5/          # Class 5 textbooks (Science, Math, Bangla, English, BGS)
│   ├── class-6/          # Class 6 textbooks
│   ├── class-7/          # Class 7 textbooks
│   ├── class-8/          # Class 8 textbooks
│   ├── class-9/          # Class 9 textbooks (SSC Physics, Chemistry, Biology, Math, etc.)
│   ├── class-10/         # Class 10 textbooks
│   └── README.md         # Instructions for textbook files placement
├── raw/                  # Unprocessed excerpts or notes
└── processed/
    └── textbook_chunks.json # Generated semantic chunks with metadata
```

Place official NCTB `.pdf`, `.txt`, `.json`, or `.md` files into the respective `class-X/` folders.

---

### Running the Textbook Processing Pipeline

To extract text, separate chapters, perform sentence-boundary chunking, and generate metadata:

```bash
cd schoolos-backend
npm run process-textbooks
# or
node scripts/processTextbooks.js
```

**Pipeline Flow:**
`NCTB Textbook -> Text Extraction -> Cleaning -> Chapter Separation -> Semantic Chunking -> Metadata Attachment -> Processed JSON (data/processed/textbook_chunks.json)`

Each generated chunk in `textbook_chunks.json` has the following structure:
```json
{
  "classLevel": 5,
  "subject": "Science",
  "chapter": "Photosynthesis and Plant Nutrition",
  "page": 2,
  "text": "During photosynthesis, plants take in carbon dioxide gas from the surrounding air through stomata..."
}
```

---

## Sprint Progress

### Week 1 Completed
- Connected existing "AI Tutor" button on navbar, home page, student portal, and teacher portal to `/ai`.
- Built interactive frontend page structure with Class 1–10 selection, subject selection, chapter selection, question input, and validation.
- Reused existing SchoolOS design system, fonts, and theme.

### Week 2 Completed
- Created modular backend structure with `controllers/aiController.js`, `validators/aiValidator.js`, and `routes/ai.js`.
- Implemented `GET /api/health` and `POST /api/ask` endpoints with full input validation (class range 1–10, non-empty subject & question).
- Connected the frontend Ask Question button to `POST /api/ask` with loading state and error handling.
- Established NCTB textbook folder hierarchy (`class-1` to `class-10`) with `data/textbooks/README.md`.
- Implemented text extraction, semantic sentence chunking, and metadata tagging pipeline (`scripts/processTextbooks.js`).
- Verified pipeline output in `data/processed/textbook_chunks.json`.

### Week 3 Roadmap
- Implement vector embedding generation for processed NCTB textbook chunks.
- Connect RAG vector similarity search to retrieve relevant textbook passages matching the student's question.
- Integrate LLM API to generate accurate, step-by-step explanations in Bangla & English.
- Add follow-up questions and simplify explanation features.

---

## Project Structure

```
Cseku-Wpl-26-SchoolOS/
├── frontend/                  # Next.js App Router frontend
│   ├── app/
│   │   ├── ai/                # AI Tutor page (/ai) and NCTB metadata
│   │   │   ├── page.tsx
│   │   │   └── data.ts
│   │   ├── components/        # Shared components (NavBar, Footer, StatCard)
│   │   ├── student/           # Student portal
│   │   ├── teacher/           # Teacher portal
│   │   ├── admin/             # Admin portal
│   │   ├── attendance/        # Attendance portal
│   │   ├── results/           # Results portal
│   │   ├── notices/           # Notice board
│   │   └── globals.css        # SchoolOS design system
│   └── package.json
├── schoolos-backend/          # Express REST API backend
│   ├── controllers/           # Controllers (aiController.js, etc.)
│   ├── validators/            # Request validators (aiValidator.js, etc.)
│   ├── routes/                # Route definitions (ai.js, auth.js, etc.)
│   ├── data/
│   │   ├── textbooks/         # Class-1 to Class-10 NCTB textbooks
│   │   ├── raw/               # Raw textbook notes
│   │   └── processed/         # Generated textbook_chunks.json
│   ├── scripts/               # Extraction & chunking pipeline
│   │   ├── extractText.js
│   │   ├── chunkText.js
│   │   └── processTextbooks.js
│   ├── models/                # Mongoose schemas (AISession.js, User.js, etc.)
│   ├── config/                # Database configuration
│   ├── server.js              # Express entrypoint
│   └── package.json
└── README.md
```

---

## Environment Variables

### Backend (`schoolos-backend/.env`)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/schoolos
JWT_SECRET=schoolos_super_secret_jwt_key_2026_dev
```

### Frontend (`frontend/.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## Contributors

- Md. Sanjidul Hasan Hasib — 220233
- Audity Saha — 220232

## License

This project was developed as part of an academic coursework assignment.
