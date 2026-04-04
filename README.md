# Resume Analyzar With Google Gemini API

AI-powered resume analyzer and interview preparation web app built with React, Node.js, MongoDB, and Google Gemini. Users can sign up, upload a resume PDF or add a self-description, paste a job description, and generate a personalized interview report with match score, skill gaps, technical questions, behavioral questions, and a 7-day preparation plan.

## Features

- User authentication with HTTP-only cookie based login
- Resume PDF upload and text extraction using `pdf-parse`
- AI-generated interview report using Google Gemini
- Match score, skill gap analysis, technical questions, and behavioral questions
- 7-day preparation roadmap
- Downloadable AI-generated resume PDF using Puppeteer
- Saved interview reports history for each logged-in user

## Tech Stack

### Frontend

- React 19
- Vite
- React Router
- Axios
- Sass
- Lucide React / React Icons

### Backend

- Node.js
- Express
- MongoDB with Mongoose
- Google Gemini via `@google/genai`
- JWT authentication
- Multer
- `pdf-parse`
- Puppeteer
- Zod

## Project Structure

```text
Resume Analyzar With Google Gemini API/
+-- frontend/
|   +-- src/
|   |   +-- features/
|   |   |   +-- auth/
|   |   |   +-- interview/
|   |   +-- services/
|   |   +-- app.routes.jsx
|   +-- package.json
+-- backend/
|   +-- src/
|   |   +-- config/
|   |   +-- controllers/
|   |   +-- middleware/
|   |   +-- models/
|   |   +-- routes/
|   |   +-- services/
|   +-- server.js
|   +-- package.json
+-- README.md
```

## How It Works

1. User registers or logs in.
2. User pastes a job description.
3. User uploads a resume PDF or adds a self-description.
4. Backend extracts resume text from the uploaded PDF.
5. Gemini generates a structured interview report in JSON format.
6. The report is saved in MongoDB and shown in the frontend.
7. User can reopen old reports or generate an AI-formatted resume PDF.

## Verified Scripts

### Frontend

From `frontend/package.json`:

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

### Backend

From `backend/package.json`:

```bash
npm run dev
npm start
```

## Environment Variables

### Backend `.env`

Create `backend/.env`:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_google_gemini_api_key
VERCEL_FRONTEND_LINK=your-frontend-domain.vercel.app
NODE_ENV=development
```

Notes:

- `PORT=3000` is recommended for local development because the frontend currently calls `http://localhost:3000` in local mode.
- `VERCEL_FRONTEND_LINK` is optional for local development and used in CORS for deployed frontend access.
- In production, cookie settings switch to `secure: true` and `sameSite: "none"`.

### Frontend `.env`

This project can run locally without a frontend env file.

If you deploy the frontend, create `frontend/.env`:

```env
VITE_BACKEND_RENDER_URL=https://your-backend-domain.com
```

## Local Setup

### 1. Clone the project

```bash
git clone <your-repo-url>
cd "Resume Analyzar With Google Gemini API"
```

### 2. Install frontend dependencies

```bash
cd frontend
npm install
```

### 3. Install backend dependencies

```bash
cd ../backend
npm install
```

### 4. Add environment variables

Create the `.env` files as shown above.

### 5. Run backend

```bash
cd backend
npm run dev
```

### 6. Run frontend

Open another terminal:

```bash
cd frontend
npm run dev
```

### 7. Open the app

Frontend:

```text
http://localhost:5173
```

Backend health route:

```text
http://localhost:3000
```

## Main Routes

### Frontend Routes

- `/register` - register page
- `/login` - login page
- `/` - protected home page
- `/interview/:interviewId` - protected interview report page

### Backend API Routes

#### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/logout`
- `GET /api/auth/get-me`

#### Interview

- `POST /api/interview`
- `GET /api/interview`
- `GET /api/interview/report/:interviewId`
- `POST /api/interview/resume/pdf/:interviewReportId`

## Request Details

### Generate Interview Report

`POST /api/interview`

Form data:

- `resume` - PDF file
- `jobDescription` - required text
- `selfDescription` - optional if resume is provided

Backend validation currently requires at least one of:

- resume text
- self description

## Database Models

### User

- `userName`
- `email`
- `password`

### InterviewReport

- `user`
- `title`
- `jobDescription`
- `resume`
- `selfDescription`
- `matchScore`
- `technicalQuestion`
- `behavioralQuestion`
- `skillGap`
- `preprationPlan`

## Important Notes

- Resume upload middleware currently allows files up to `3MB`.
- Frontend file input currently accepts `.pdf` only.
- Authentication uses cookies, so frontend requests are sent with `withCredentials: true`.
- The AI report is validated with Zod before being saved.
- Puppeteer is used to generate the downloadable resume PDF.

## Current Improvement Areas

- Add proper error to the resume PDF controller response on failure
- Add tests for auth and interview APIs
- Add better form validation on the frontend
- Add loading and empty states for all API screens
- Fix small text/label typos such as `Dawnload Ai Resume` and `preprationPlan`

## Deployment Notes

- Frontend includes `vercel.json` rewrite support for SPA routing.
- Backend CORS allows:
  - `http://localhost:5173`
  - `http://127.0.0.1:5173`
  - `process.env.VERCEL_FRONTEND_LINK`

## License

This project is currently unlicensed. Add a license if you plan to make it public.
