// server/src/index.ts
import express from "express";
import cors, { CorsOptionsDelegate } from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import morgan from "morgan";

import { ENV } from "./config/env";
import authRoutes from "./routes/auth";
import sessionRoutes from "./routes/session";
import transcriptsRoutes from "./routes/transcripts";
import exportRoutes from "./routes/export";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

/** Required for SameSite=None; Secure cookies behind Render’s proxy */
app.set("trust proxy", 1);

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

/** ---- CORS (multi-origin, credentials) ----
 * Set ENV.CORS_ORIGIN to a comma-separated list, e.g.:
 *   CORS_ORIGIN=https://interview-pilot-three.vercel.app,https://interview-pilot-three-git-main-bhawnapannu2701.vercel.app
 */
const originList = (ENV.CORS_ORIGIN || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

const corsOptions: CorsOptionsDelegate = (req, cb) => {
  const origin = req.header("Origin");
  // allow same-origin/no-Origin (curl, health checks)
  const allow =
    !origin || originList.includes(origin);

  if (allow) {
    cb(null, {
      origin: true,
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    });
  } else {
    cb(new Error(`Not allowed by CORS: ${origin}`), {
      origin: false,
    } as any);
  }
};

// Apply CORS and explicit preflight
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Health
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

// Primary v1
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/session", sessionRoutes);
app.use("/api/v1/transcripts", transcriptsRoutes);
app.use("/api/v1/export", exportRoutes);

// Legacy (no /v1)
app.use("/api/auth", authRoutes);
app.use("/api/session", sessionRoutes);
app.use("/api/transcripts", transcriptsRoutes);
app.use("/api/export", exportRoutes);

// Extra legacy alias some UIs use: /api/session/:id/export/pdf
app.get("/api/session/:id/export/pdf", (req, res, next) => {
  req.url = `/${req.params.id}/pdf`;
  (exportRoutes as any)(req, res, next);
});

// Safety net to avoid scary client toasts on unknown /api paths
app.use("/api", (_req, res) => {
  res.status(200).json({ success: true, data: null });
});

// Errors
app.use(errorHandler);

// DB + start
mongoose
  .connect(ENV.MONGO_URI)
  .then(() => {
    app.listen(ENV.PORT, () => {
      console.log(`🚀 Server running on http://localhost:${ENV.PORT}`);
      console.log("CORS_ORIGIN list:", originList);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB", err);
    process.exit(1);
  });
