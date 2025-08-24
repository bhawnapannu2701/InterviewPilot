// server/src/routes/transcripts.ts
import { Router, type Request, type Response } from "express";
import { Message } from "../models/Message";
import { Attempt } from "../models/Attempt";
import { Session } from "../models/Session";

const router = Router();

const avg = (a: number[]) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0);
const clamp01 = (n: number) => Math.max(0, Math.min(1, Number(n)));

async function buildPayload(sessionId: string) {
  let msgs: any[] = [];
  let attempts: any[] = [];

  try {
    if (sessionId) {
      msgs = await Message.find({ sessionId }).sort({ createdAt: 1 }).lean();
      attempts = await Attempt.find({ sessionId }).lean();
      // Optionally mark session ended if there are any messages/attempts
      try {
        if (msgs.length || attempts.length) {
          await Session.updateOne({ _id: sessionId }, { $set: { endedAt: new Date() } });
        }
      } catch {
        /* ignore */
      }
    }
  } catch (e) {
    console.warn("transcripts DB read failed:", (e as Error).message);
  }

  if (!msgs.length) {
    msgs = [
      {
        role: "assistant",
        content: "No transcript messages recorded for this session yet.",
        createdAt: new Date(),
      },
    ];
  }

  // Real rubric averages from attempts (no hardcoded defaults)
  const r = (k: string) => avg(attempts.map((a) => Number(a?.rubric?.[k]) || 0));
  const correctness = clamp01(r("correctness"));
  const complexity = clamp01(r("complexity"));
  const edgeCases = clamp01(r("edgeCases"));
  const clarity = clamp01(r("clarity"));
  const codeQuality = clamp01(r("codeQuality"));

  const hasData = attempts.length > 0;
  const total = hasData
    ? clamp01((correctness + complexity + edgeCases + clarity + codeQuality) / 5)
    : 0;

  return {
    messages: msgs,
    summary: {
      readinessIndex: total,
      avgScore: total,
      attempts: attempts.length,
      rubricAverages: {
        total,
        breakdown: [
          { criterion: "correctness", score: hasData ? correctness : 0 },
          { criterion: "complexity", score: hasData ? complexity : 0 },
          { criterion: "edgeCases", score: hasData ? edgeCases : 0 },
          { criterion: "clarity", score: hasData ? clarity : 0 },
          { criterion: "codeQuality", score: hasData ? codeQuality : 0 },
        ],
      },
    },
  };
}

/** Primary path: /api(/v1)/transcripts/:id */
router.get("/:id", async (req: Request, res: Response) => {
  const sessionId = String(req.params.id || "");
  const data = await buildPayload(sessionId);
  res.json({ success: true, data });
});

/** Alias: /api(/v1)/transcripts?id=...  */
router.get("/", async (req: Request, res: Response) => {
  const sessionId = String((req.query.id as string) || "");
  const data = await buildPayload(sessionId);
  res.json({ success: true, data });
});

export default router;
