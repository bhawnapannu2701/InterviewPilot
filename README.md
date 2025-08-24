# InterviewPilot

AI‑powered mock interview app with animated UX, rubric‑based scoring, and recruiter‑ready reports.

## Stack
- Frontend: React + Vite + TypeScript + Tailwind + Framer Motion + Zustand + Recharts
- Backend: Node + Express + TypeScript + MongoDB (Mongoose)
- AI: OpenAI (chat + scoring JSON), optional STT

## 1) Setup

### Backend
```bash
cd server
npm i
cp .env.example .env
# edit .env with your values:
# - MONGO_URI (MongoDB Atlas)
# - OPENAI_API_KEY
# - CORS_ORIGIN (http://localhost:5173 for dev)
npm run dev
