# AssignFlow Portal

AssignFlow is a full-stack, role-based assignment workflow platform.

Teachers can create and manage assignments through a strict lifecycle (`Draft → Published → Completed`), and students can view published assignments and submit responses before due dates.

---


## Screenshots

### Login
<img src="https://github.com/user-attachments/assets/74091d9f-8a0e-4e58-af9e-f3cba30118b0">

### Teacher Dashboard
<img src="https://github.com/user-attachments/assets/c06f014f-a40a-4049-86e1-820b17a8cdc5">

### Student Dashboard
<img src="https://github.com/user-attachments/assets/03ebc2f2-43ca-4fa3-92c8-d435fb780094">

---
## How the system works

### 1) Authentication and roles

- Users can sign up/login as either `teacher` or `student`.
- Backend issues a JWT token after auth.
- Frontend stores the token and sends it in `Authorization: Bearer <token>` for protected endpoints.
- Route and action access is role-protected on both frontend and backend.

### 2) Teacher flow

- Create assignment (initial status is `Draft`).
- Edit/Delete is allowed only while assignment is in `Draft`.
- Status can only move forward one step at a time:
  - `Draft` → `Published`
  - `Published` → `Completed`
- View student submissions per assignment.
- Mark submissions as reviewed.

### 3) Student flow

- View only `Published` assignments.
- Submit answer once per assignment.
- Late submissions are blocked if due date passed.
- Dashboard shows submission progress and deadline urgency.

---

## Tech Stack

- Frontend: React, Vite, TailwindCSS, Axios, React Router
- Backend: Node.js, Express.js, JWT, bcryptjs, Mongoose
- Database: MongoDB Atlas

---

## Monorepo structure

- [backend](backend)
  - REST API, auth, business logic, MongoDB models
- [frontend](frontend)
  - UI, role-based dashboards, API integration

Detailed docs:

- [Backend README](backend/README.md)
- [Frontend README](frontend/README.md)

---

## Local development setup

### Prerequisites

- Node.js 18+
- npm
- MongoDB Atlas connection string

### 1) Backend

Create [backend/.env](backend/.env):

```env
PORT=5001
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>/<db>
JWT_SECRET=<strong-random-secret>
```

Run backend:

```bash
cd backend
npm install
npm run dev
```

Backend health check:

- [http://localhost:5001/api/health](http://localhost:5001/api/health)

### 2) Frontend

Create [frontend/.env](frontend/.env):

```env
VITE_API_URL=http://localhost:5001
```

Run frontend:

```bash
cd frontend
npm install
npm run dev
```

Frontend URL:

- [http://localhost:5173](http://localhost:5173)

---

## Deployment overview

- Backend deploy: Render
- Frontend deploy: Vercel

Required environment variables:

- Render (backend)
  - `MONGO_URI`
  - `JWT_SECRET`
  - `CORS_ORIGIN` = your Vercel frontend URL
- Vercel (frontend)
  - `VITE_API_URL` = your Render backend URL (with or without `/api`)

---


## Current feature summary

- Auth with JWT and role-based access
- Teacher dashboard with status lifecycle and metrics
- Student dashboard with submission state and progress
- Clean UI with responsive layout, dark nav/footer, and background assets
- Production-ready env-driven API integration
