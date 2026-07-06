# WE CARE CHESS ACADEMY — Full-Stack Platform

A real, working full-stack build: **React + TypeScript frontend** and a **Node.js + Express +
MongoDB backend** with JWT authentication, role-based access (Admin / Student), and real CRUD for
every feature in the product brief — students, live classes, learning content, puzzles, weekly
updates, payments, private notes, and announcements.

This is **one project, two processes**: the frontend (this folder) and the backend (`/server`)
run separately — one command each — and talk to each other over HTTP. There's no single command
that starts both, because they're two independent services (this is standard for any real
website with its own backend, not a limitation of this build).

```
we-care-chess-academy/
├── src/                 ← React frontend (this README's "Part 1")
├── server/              ← Express + MongoDB backend ("Part 2")
│   └── README is folded into this file below
├── package.json         ← frontend
└── server/package.json  ← backend
```

---

## Table of contents

1. [Quick local run (5 minutes)](#1-quick-local-run-5-minutes)
2. [MongoDB Atlas setup, step by step](#2-mongodb-atlas-setup-step-by-step)
3. [Backend — full setup and API reference](#3-backend)
4. [Frontend — full setup](#4-frontend)
5. [Deploying the backend to Render](#5-deploying-the-backend-to-render)
6. [Deploying the frontend to Vercel](#6-deploying-the-frontend-to-vercel)
7. [Connecting the deployed frontend to the deployed backend](#7-connecting-the-deployed-frontend-to-the-deployed-backend)
8. [Demo accounts & testing the flows](#8-demo-accounts--testing-the-flows)
9. [What's intentionally NOT built yet](#9-whats-intentionally-not-built-yet)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Quick local run (5 minutes)

You need **two terminals** — one for the backend, one for the frontend. Both need Node.js 18+.

**Terminal 1 — backend:**
```bash
cd server
npm install
cp .env.example .env          # then edit .env — see Part 2/3 below for the Mongo URI
npm run seed                  # creates an admin account + sample data
npm run dev                   # starts the API on http://localhost:5000
```

**Terminal 2 — frontend:**
```bash
cd ..                         # back to the project root
npm install
cp .env.example .env          # default already points at http://localhost:5000/api
npm run dev                   # starts the site on http://localhost:5173
```

Open `http://localhost:5173`, click **Student Login**, and sign in with the seeded admin or
student account (printed by `npm run seed` — see [section 8](#8-demo-accounts--testing-the-flows)).

The one thing you still need before step 1 works: a MongoDB connection string. That's section 2.

---

## 2. MongoDB Atlas setup, step by step

Atlas is MongoDB's free hosted database — you don't install anything locally.

1. Go to **https://www.mongodb.com/cloud/atlas/register** and create a free account.
2. When prompted, create a new **Project** (e.g. "WE CARE CHESS ACADEMY").
3. Click **Build a Database** → choose the **M0 Free** tier → pick any cloud provider/region close
   to you → click **Create**.
4. **Create a database user** (you'll be prompted automatically):
   - Username: e.g. `wecare_admin`
   - Password: click "Autogenerate Secure Password" and **copy it somewhere safe**
   - Click **Create User**
5. **Network access**: add an IP entry. For local development, click **Add My Current IP
   Address**. Because this app will also run on Render (which uses dynamic IPs), also add
   `0.0.0.0/0` ("Allow access from anywhere") — acceptable for this kind of small project, since
   the database is still protected by the username/password. Click **Confirm**.
6. Once the cluster is created (takes ~1–3 minutes), click **Connect** on your cluster →
   **Drivers** → copy the connection string. It looks like:
   ```
   mongodb+srv://wecare_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
7. Paste that into `server/.env` as `MONGODB_URI`, replacing `<password>` with the real password,
   and add a database name before the `?` — e.g.:
   ```
   MONGODB_URI=mongodb+srv://wecare_admin:YourPasswordHere@cluster0.xxxxx.mongodb.net/wecarechess?retryWrites=true&w=majority
   ```
   (`wecarechess` is the database name — Atlas creates it automatically on first write, you don't
   need to create it manually.)

That's it — no schema setup needed; Mongoose creates collections automatically.

---

## 3. Backend

### 3.1 Stack

Express 4 · TypeScript · Mongoose 8 (MongoDB) · JWT (`jsonwebtoken`) · `bcryptjs` for password
hashing · `zod` for request validation · `multer` for image uploads · `cors`, `morgan`, `dotenv`.

### 3.2 Environment variables (`server/.env`)

Copy `server/.env.example` to `server/.env` and fill in:

| Variable | Description |
|---|---|
| `PORT` | Port the API listens on locally (default `5000`) |
| `NODE_ENV` | `development` or `production` |
| `MONGODB_URI` | Your Atlas connection string from section 2 |
| `JWT_SECRET` | Any long random string — used to sign login tokens. Generate one with `openssl rand -hex 32` |
| `JWT_EXPIRES_IN` | How long a login session lasts (default `7d`) |
| `CLIENT_ORIGIN` | The frontend's URL(s), comma-separated (CORS allowlist) |
| `ADMIN_NAME` / `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Used once by `npm run seed` to create the first admin account |

### 3.3 Commands

```bash
cd server
npm install
npm run seed     # one-time: creates admin account + sample data (safe to re-run, skips existing)
npm run dev       # local dev server with auto-reload (tsx watch)
npm run build     # compiles TypeScript to /dist
npm start         # runs the compiled build (used in production/Render)
```

### 3.4 Data model

| Model | Purpose |
|---|---|
| `User` | Both admin and student accounts — `role: 'admin' \| 'student'`, hashed password, `mustChangePassword` flag for first-login |
| `LiveClass` | Topic, date/time, links, `published`, `status`, embedded `attendance` array |
| `LearningItem` | Video/PDF/Note/Link content, `completedBy: ObjectId[]` tracks per-student completion |
| `Puzzle` | Instruction/hint/answer/explanation, `completedBy: ObjectId[]` |
| `WeeklyUpdate` | Per-student, per-week coach feedback |
| `Payment` | Manual fee tracking per student/month |
| `PrivateNote` | Admin-only notes — **never** returned by any student-facing route |
| `Announcement` | Global broadcast messages |

Progress percentages (attendance / learning / puzzles) shown on the student dashboard and admin
student profile are **computed on read** from actual attendance records and completion arrays —
they are not stored as stale numbers anywhere.

### 3.5 API reference

Base path: `/api`. All routes except `/auth/login`, `/auth/forgot-password`, and
`/auth/reset-password` require `Authorization: Bearer <token>`.

| Method & path | Role | Purpose |
|---|---|---|
| `POST /auth/login` | — | `{ identifier, password }` → `{ token, user }` |
| `GET /auth/me` | any | Current user |
| `POST /auth/first-login-password` | any | Set password on first login |
| `POST /auth/change-password` | any | `{ currentPassword, newPassword }` |
| `POST /auth/forgot-password` | — | `{ identifier }` → generates reset token (see note below) |
| `POST /auth/reset-password` | — | `{ token, newPassword }` |
| `GET/POST /students` | admin | List / create students |
| `GET/PATCH /students/:id` | admin | Detail / update |
| `PATCH /students/:id/status` | admin | Toggle active/inactive |
| `POST /students/:id/reset-password` | admin | Generates a new temp password |
| `GET /me/dashboard` | student | Dashboard aggregate |
| `GET /me/progress` | student | Progress stats + update history |
| `GET /me/profile` | student | Own profile |
| `GET/POST/PATCH /live-classes` | both | List (role-filtered) / create / edit (admin only for write) |
| `POST /live-classes/:id/attendance` | admin | Mark Present/Absent/Late |
| `GET/POST/PATCH /learning-items` | both | Content library |
| `POST /learning-items/:id/complete` | student | Mark complete |
| `GET/POST/PATCH /puzzles` | both | Puzzle bank |
| `POST /puzzles/:id/submit` | student | Check an answer |
| `POST /puzzles/:id/reveal` | student | Reveal the solution |
| `GET/POST /weekly-updates` | both | Coach feedback |
| `GET /weekly-updates/missing` | admin | Students missing this week's update |
| `GET/POST/PATCH /payments` | admin | Manual fee tracking |
| `GET/POST/PATCH /private-notes` | admin | Admin-only notes |
| `GET/POST/PATCH /announcements` | both (read), admin (write) | Broadcasts |
| `POST /uploads` | admin | `multipart/form-data`, field `file` → `{ url }` |
| `GET /admin/summary` | admin | Dashboard counts |

### 3.6 Important note about "forgot password" and "temporary student passwords"

There is **no email or WhatsApp sending service wired up yet** — that's a real third-party
integration (e.g. Resend/SendGrid for email, or the WhatsApp Cloud API) that needs its own account
and credentials, which only you can set up. In place of that:

- **Forgot password**: the reset token is printed to the **backend's server console** and, only
  when `NODE_ENV` is *not* `production`, also returned in the API response so you can test the
  flow locally without an inbox. In production it is **not** returned in the response — you'd
  wire in a real email/SMS send inside `server/src/routes/auth.routes.ts` (search for `NOTE:` in
  that file).
- **New student temp passwords**: when admin creates a student or resets their password, the
  plaintext temporary password is returned once in the API response and shown in a modal in the
  admin UI — the admin is expected to copy it and send it manually on WhatsApp, matching the
  product brief's "registration happens through WhatsApp" design.

### 3.7 File uploads

Puzzle images and content thumbnails currently upload to local disk (`server/uploads/`), served at
`/uploads/<filename>`. This works fine for local dev and even for a small single-server Render
deployment, **but Render's free/starter web services have an ephemeral filesystem** — uploaded
files are wiped on every restart/redeploy. For a production deployment, swap the storage backend
in `server/src/routes/uploads.routes.ts` for Cloudinary or an S3-compatible bucket (both have free
tiers); the route's request/response shape (`POST /api/uploads` → `{ url }`) can stay identical.

---

## 4. Frontend

### 4.1 Environment variable

Copy `.env.example` to `.env` in the project root:
```
VITE_API_URL=http://localhost:5000/api
```
Change this to your deployed backend URL once you deploy (section 6/7).

### 4.2 Commands
```bash
npm install
npm run dev       # local dev server, http://localhost:5173
npm run build     # type-checks + production build to /dist
npm run preview   # serve the production build locally
```

### 4.3 How auth works in the UI

- `src/context/AuthContext.tsx` holds the logged-in user and exposes `login`/`logout`.
- The JWT is stored in `localStorage` (`wcca_token`) and attached to every API call automatically
  by `src/lib/api.ts`.
- `src/components/ProtectedRoute.tsx` guards every `/student/*` and `/admin/*` route: it redirects
  to `/login` if not authenticated, to `/inactive-account` if a student account was deactivated,
  and to `/first-login` if the account still has a temporary password.

---

## 5. Deploying the backend to Render

1. Push this project to a GitHub repository (or GitLab).
2. Go to **https://render.com** → sign up/log in → **New** → **Web Service**.
3. Connect your repo, then configure:
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance type**: Free is fine to start
4. Under **Environment Variables**, add every key from `server/.env.example`:
   `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_ORIGIN` (set this to your Vercel URL once
   you have it — you can update it after step 6), `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`.
   Do **not** set `PORT` — Render sets it automatically and the app already reads `process.env.PORT`.
5. Click **Create Web Service**. Render will build and deploy; you'll get a URL like
   `https://we-care-chess-academy-api.onrender.com`.
6. Seed the production database once, from your local machine, by temporarily pointing your local
   `server/.env`'s `MONGODB_URI` at the same Atlas cluster (it already is, if you're using one
   cluster for both) and running `npm run seed` locally — this creates the admin account in the
   real database Render is using. (Render's free tier doesn't give you a shell to run one-off
   scripts, so running the seed script locally against the same Atlas cluster is the simplest
   approach.)

Health check: visit `https://<your-render-url>/health` — should return `{"status":"ok",...}`.

---

## 6. Deploying the frontend to Vercel

1. Push the project to GitHub (same repo as the backend is fine — Vercel only needs the root).
2. Go to **https://vercel.com** → **Add New** → **Project** → import the repo.
3. Vercel auto-detects Vite. Set:
   - **Root Directory**: leave as the repo root (where this frontend's `package.json` lives)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Under **Environment Variables**, add:
   ```
   VITE_API_URL = https://<your-render-url>/api
   ```
5. Click **Deploy**. You'll get a URL like `https://we-care-chess-academy.vercel.app`.

---

## 7. Connecting the deployed frontend to the deployed backend

Two things need to point at each other:

1. **Frontend → backend**: `VITE_API_URL` on Vercel must be `https://<render-url>/api` (done in
   step 6.4 above). Any time you change this, redeploy the frontend (Vercel redeploys
   automatically on env var changes if you trigger a redeploy).
2. **Backend → frontend (CORS)**: `CLIENT_ORIGIN` on Render must equal your Vercel URL exactly
   (e.g. `https://we-care-chess-academy.vercel.app`, no trailing slash). If you have a custom
   domain too, add it comma-separated: `https://yourapp.com,https://we-care-chess-academy.vercel.app`.
   Update the env var in Render's dashboard and it will auto-redeploy.

If you see CORS errors in the browser console, it's almost always #2 — double-check the exact
origin string matches (protocol + domain, no trailing slash).

---

## 8. Demo accounts & testing the flows

After `npm run seed` (locally or against your Atlas cluster), you'll have:

- **Admin**: whatever you set in `server/.env` as `ADMIN_EMAIL` / `ADMIN_PASSWORD`
  (defaults to `[email protected]` / `ChangeThisPassword123!` if left unchanged —
  **do change these before deploying anywhere public**).
- **Sample student**: phone `+919847000001`, password `ChessDemo123!` (login with the phone
  number in the "email or phone" field).

Quick manual test with `curl` (swap in your own values):
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"+919847000001","password":"ChessDemo123!"}'
```
should return `{"token": "...", "user": {...}}`.

To test the full admin → student flow in the UI:
1. Log in as admin → **Students** → **Add Student** → note the generated temp password.
2. Log out → log in as that student using the temp password → you'll be routed to
   **first-login** to set a real password.
3. Back as admin: publish a live class, publish a puzzle, publish a learning resource, write a
   weekly update, record a payment — then log in as the student to see all of it reflected live.

---

## 9. What's intentionally NOT built yet

Per the original product brief, and consistent with earlier scoping:

- No parent portal, no public access to learning materials, no batch/curriculum system.
- No payment gateway — payments are tracked manually by the admin (as specified).
- No real email/SMS/WhatsApp sending — see section 3.6.
- Puzzle board positions are shown as a stylized placeholder graphic, not an interactive chess
  board — wiring in a real chess board (e.g. `chessground` or `react-chessboard`) plus FEN
  positions for each puzzle is a natural next step if you want that.
- File uploads use local disk storage — fine for local dev, needs Cloudinary/S3 for a durable
  production deployment (see section 3.7).

---

## 10. Troubleshooting

**"Missing required environment variable: MONGODB_URI"** — you haven't created `server/.env`, or
it's missing that key. Copy `server/.env.example` to `server/.env` and fill it in.

**Login fails with "Incorrect email/phone or password"** — check you ran `npm run seed`, and that
your backend is pointed at the same Atlas cluster you expect (check `MONGODB_URI`).

**Frontend loads but every page shows a spinner forever** — the frontend can't reach the backend.
Check `VITE_API_URL` in your frontend `.env`, and check the backend is actually running (`/health`
endpoint).

**CORS error in the browser console** — see section 7, point 2.

**"Account inactive" page appears for a student who should be active** — an admin deactivated them
under Students → toggle status. Reactivate from there.

**Uploaded images disappear after a Render redeploy** — expected on Render's free tier (ephemeral
disk); see section 3.7 for the Cloudinary/S3 fix.
