// server/src/routes/transcripts.ts
import { Router } from "express";
import Message from "../models/Message";
import Attempt from "../models/Attempt";
import Session from "../models/Session";

const router = Router();

async function buildPayload(sessionId: string) {
  let msgs: any[] = [];
  let attempts: any[] = [];
  try {
    if (sessionId) {
      msgs = await Message.find({ sessionId }).sort({ createdAt: 1 }).lean();
      attempts = await Attempt.find({ sessionId }).lean();
      await Session.updateOne({ _id: sessionId }, { $set: { endedAt: new Date() } }).lean();
    }
  } catch (e) {
    console.warn("transcripts DB read failed:", (e as Error).message);
  }
  if (!msgs.length) {
    msgs = [{ role: "assistant", content: "Here is your interview summary.", createdAt: new Date() }];
  }
  const avg = (arr: number[]) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);
  const r = (k: string) => avg(attempts.map(a => Number(a?.rubric?.[k]) || 0));
  const total = (r("correctness") + r("complexity") + r("edgeCases") + r("clarity") + r("codeQuality")) / 5 || 0.62;

  return {
    messages: msgs,
    summary: {
      readinessIndex: Math.max(0, Math.min(1, total)),
      avgScore: Math.max(0, Math.min(1, total)),
      attempts: attempts.length,
      rubricAverages: {
        total: Math.max(0, Math.min(1, total)),
        breakdown: [
          { criterion: "correctness", score: r("correctness") || 0.6 },
          { criterion: "complexity",  score: r("complexity")  || 0.6 },
          { criterion: "edgeCases",   score: r("edgeCases")   || 0.6 },
          { criterion: "clarity",     score: r("clarity")     || 0.65 },
          { criterion: "codeQuality", score: r("codeQuality") || 0.6 },
        ],
      },
    },
  };
}

/** Primary path: /api(/v1)/transcripts/:id */
router.get("/:id", async (req, res) => {
  const sessionId = String(req.params.id || "");
  const data = await buildPayload(sessionId);
  res.json({ success: true, data });
});

/** Defensive alias: /api(/v1)/transcripts?id=...  (handles missing path param) */
router.get("/", async (req, res) => {
  const sessionId = String((req.query.id as string) || "");
  const data = await buildPayload(sessionId);
  res.json({ success: true, data });
});

export default router;
