# AssignFlow Backend (API)

Express + MongoDB backend for the AssignFlow portal.

## Overview

This service provides:

- Authentication (`signup`, `login`, `profile`)
- Role-protected teacher and student routes
- Assignment lifecycle management (`Draft → Published → Completed`)
- Submission APIs for students and review actions for teachers

Tech stack:

- Node.js + Express
- MongoDB + Mongoose
- JWT auth
- bcrypt password hashing

## Project Structure

- src/server.js — app bootstrap
- src/app.js — middleware + routes
- src/config.js — environment config
- src/db.js — Mongo connection
- src/controllers/ — route handlers
- src/routes/ — API routes
- src/models/ — Mongoose models
- src/middleware/ — auth + error middleware
- src/seed.js — seed script

## Environment Variables

Create `backend/.env`:

```env
PORT=5001
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>/<db>
JWT_SECRET=<very-strong-random-secret>
# Optional (for stricter CORS in production)
# CORS_ORIGIN=https://your-frontend.vercel.app
```

## Install & Run

```bash
npm install
npm run dev
```

Production:

```bash
npm start
```

Seed sample users/data:

```bash
npm run seed
```

## API Base URL

Local:

- `http://localhost:5001/api`

Health check:

- `GET /api/health`

## Main Routes

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me` (protected)

### Assignments

- `GET /api/assignments/student/published` (student)
- `GET /api/assignments/teacher` (teacher)
- `GET /api/assignments/teacher/summary` (teacher)
- `POST /api/assignments/teacher` (teacher)
- `PUT /api/assignments/teacher/:id` (teacher, draft only)
- `DELETE /api/assignments/teacher/:id` (teacher, draft only)
- `PATCH /api/assignments/teacher/:id/status` (teacher)

### Submissions

- `POST /api/submissions/student/:assignmentId` (student)
- `GET /api/submissions/student/me` (student)
- `GET /api/submissions/teacher/:assignmentId` (teacher)
- `PATCH /api/submissions/teacher/review/:submissionId` (teacher)

## Deployment (Render)

Recommended settings:

- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`

Set env vars in Render:

- `MONGO_URI`
- `JWT_SECRET`
- `PORT` (optional, Render can manage this)
- `CORS_ORIGIN` (your Vercel frontend domain)

## Notes

- Rotate database credentials if they were shared.
- Use a long random JWT secret in production.
- If frontend calls fail, first verify: `GET /api/health`.
