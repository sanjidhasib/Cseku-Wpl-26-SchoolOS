# SchoolOS

Smart School Management and Personalized Education Platform

SchoolOS is a web-based platform that combines core school administration — user management, attendance, results, and notices — with an AI Learning Agent that helps students understand textbook topics in Bangla and English.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [User Roles](#user-roles)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Development Methodology](#development-methodology)
- [Scope](#scope)
- [Contributors](#contributors)
- [License](#license)

## Overview

SchoolOS provides a simple, easy-to-use web interface for administrators, teachers, students, and guardians to manage day-to-day school activities. Its core feature is the AI Learning Agent, which explains textbook topics to students based on their class level, in either Bangla or English.

The project is being developed within a three-month timeline, so the first version focuses on essential features rather than a full-scale school ERP.

## Features

- Role-based authentication for four user types: Administrator, Teacher, Student, and Guardian
- User, student, teacher, class, and subject management
- Attendance tracking, with view access for students and guardians
- Result entry and viewing, with automatic grade calculation
- Notice publishing and role-based notice visibility
- Role-specific dashboards for quick access to relevant information
- AI Learning Agent: class-aware, subject-aware textbook question answering in Bangla and English, with follow-up questions and simplified re-explanations

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js (React) |
| Backend | Node.js, Express |
| Database | MongoDB |
| AI Integration | External AI/LLM API |
| Authentication | Role-based session/JWT authentication |

## User Roles

| Role | Access |
|---|---|
| Administrator | Manage users, students, teachers, classes, and subjects; publish notices |
| Teacher | Take attendance, enter results, view assigned classes and students, publish notices |
| Student | View own profile, attendance, results, and notices; use the AI Learning Agent |
| Guardian | View their child's profile, attendance, results, and notices |

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- MongoDB (local instance or a hosted cluster such as MongoDB Atlas)
- npm or yarn

### Installation

Clone the repository:

```bash
git clone https://github.com/<your-username>/schoolos.git
cd schoolos
```

Install dependencies:

```bash
# Frontend
cd client
npm install

# Backend
cd ../server
npm install
```

Set up environment variables (see [Environment Variables](#environment-variables) below).

Run the development servers:

```bash
# Backend
cd server
npm run dev

# Frontend, in a separate terminal
cd client
npm run dev
```

The application will be available at `http://localhost:3000`.

## Project Structure

```
schoolos/
├── client/              Next.js frontend
│   ├── app/
│   ├── components/
│   └── ...
├── server/              Express backend
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   └── ...
└── README.md
```

## Environment Variables

`server/.env`

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
AI_SERVICE_API_KEY=your_ai_service_api_key
```

`client/.env.local`

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Development Methodology

This project follows the Agile (Scrum) model. The development period is divided into short sprints, each delivering a working increment of a feature. Each sprint includes planning, implementation, a review of completed work, and a brief retrospective. Requirements documented in the project's SRS form the initial product backlog, refined as development progresses.

## Scope

The first version of SchoolOS covers:

- Authentication and role-based access
- User, student, teacher, class, and subject management
- Attendance and result management
- Notice management
- Role-specific dashboards
- AI Learning Agent, with a limited set of classes and subjects

Advanced school management features and expanded AI capabilities are planned for future versions.

## Contributors

- Md. Sanjidul Hasan Hasib — 220233
- Audity Saha — 220232

## License

This project was developed as part of an academic coursework assignment. License to be determined.
