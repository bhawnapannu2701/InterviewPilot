# Render Deployment (Server)

1) Create a new **Web Service** on Render:
   - Runtime: Node
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Root Directory: `server`

2) Add Environment Variables:
   - NODE_ENV=production
   - PORT=5000
   - CORS_ORIGIN=https://your-frontend.vercel.app
   - JWT_SECRET=your_long_random_secret
   - MONGO_URI=your_mongodb_atlas_url
   - OPENAI_API_KEY=sk-...

3) Scale:
   - Instance: Starter is fine for MVP
   - Enable Auto Deploys from your Git repo

4) Health Check:
   - `GET /api/health` should return `{ "status": "ok" }`

5) Update your client `.env`:
   - `VITE_API_BASE=https://your-backend.onrender.com`

6) If CORS issues occur:
   - Ensure your exact Vercel domain is in `CORS_ORIGIN`
   - Example: `https://interviewpilot.vercel.app`
