# AssignFlow Frontend (Web App)

React + Vite frontend for the AssignFlow portal.

## Overview

This app provides:

- Authentication (login/signup)
- Role-based routing (Teacher / Student)
- Teacher dashboard for assignment management
- Student dashboard for assignment submission and progress
- Responsive UI with TailwindCSS

Tech stack:

- React 18
- React Router
- Axios
- TailwindCSS
- Vite

## Project Structure

- src/main.jsx — app entry
- src/App.jsx — route wiring
- src/context/AuthContext.jsx — auth state + token persistence
- src/services/api.js — axios client/config
- src/pages/LoginPage.jsx — auth screen
- src/pages/TeacherDashboard.jsx — teacher experience
- src/pages/StudentDashboard.jsx — student experience
- src/components/ — reusable UI components
- src/utils/ — helper functions

## Environment Variables

Create `frontend/.env`:

```env
# Local backend
VITE_API_URL=http://localhost:5001
```

The client normalizes base URL and appends `/api` automatically.
So both values work:

- `http://localhost:5001`
- `http://localhost:5001/api`

## Install & Run

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Scripts

- `npm run dev` — start Vite dev server
- `npm run build` — create production build
- `npm run preview` — preview built app

## Deployment (Vercel)

Recommended settings:

- Root Directory: `frontend`
- Framework: Vite

Set env var in Vercel:

```env
VITE_API_URL=https://your-backend-service.onrender.com
```

Then redeploy.

## Troubleshooting

- If login/signup hits 404, verify backend URL and `/api` routing.
- If CORS error appears, set backend `CORS_ORIGIN` to your exact Vercel domain.
- If token issues appear after deploy, clear site storage and login again.

## Screenshots

### Login
<img src="https://github.com/user-attachments/assets/74091d9f-8a0e-4e58-af9e-f3cba30118b0">

### Teacher Dashboard
<img src="https://github.com/user-attachments/assets/c06f014f-a40a-4049-86e1-820b17a8cdc5">

### Student Dashboard
<img src="https://github.com/user-attachments/assets/03ebc2f2-43ca-4fa3-92c8-d435fb780094">

## UI Notes

- Navbar/footer colors are intentionally dark for contrast.
- Dashboard backgrounds use images from `public/`.
