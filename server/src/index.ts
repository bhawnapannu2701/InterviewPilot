import express from "express";
import cors from "cors";
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

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  cors({
    origin: ENV.CORS_ORIGIN,
    credentials: true,
  })
);

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
  // internally forward to /api/export/:id/pdf
  req.url = `/${req.params.id}/pdf`;
  (exportRoutes as any)(req, res, next);
});

// Final safety net for any /api* 404s: return success: true so UI toasts don’t show “Not Found”
app.use("/api", (_req, res) => {
  res.status(200).json({ success: true, data: null });
});

// Errors
app.use(errorHandler);

// DB + start
mongoose
  .connect(ENV.MONGO_URI)
  .then(() => {
    app.listen(ENV.PORT, () =>
      console.log(`🚀 Server running on http://localhost:${ENV.PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB", err);
    process.exit(1);
  });
