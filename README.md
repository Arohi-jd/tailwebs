# AssignFlow Portal

Role-based assignment workflow web app with React + Vite frontend and Node + Express backend.

## Tech Stack

- Frontend: React, Vite, TailwindCSS, Context API
- Backend: Node.js, Express.js, JWT, bcryptjs
- Database: MongoDB Atlas with Mongoose

## Project Structure

- backend: API, auth, models, seed script
- frontend: login, teacher dashboard, student dashboard

## Setup

### 1) Backend

1. Open terminal in backend folder
2. Install dependencies: `npm install`
3. Seed users: `npm run seed`
4. Start API: `npm run dev`

Backend runs on [http://localhost:5000](http://localhost:5000)

### 2) Frontend

1. Open terminal in frontend folder
2. Install dependencies: `npm install`
3. Start app: `npm run dev`

Frontend runs on [http://localhost:5173](http://localhost:5173)

## Seed Users

- Teacher: <teacher@test.com> / teacher123
- Student: <alice@test.com> / student123
- Student: <bob@test.com> / student123

## Core Features

- Single login for both teacher and students
- Role-based dashboard routing
- Teacher workflow: Draft → Published → Completed
- Draft-only edit/delete and forward-only status transitions
- Teacher submissions table with optional reviewed toggle
- Student published-assignment list and one-time submission enforcement
- Due-date urgency/overdue handling
- Student progress bar and polished empty states
