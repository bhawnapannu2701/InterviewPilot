// server/src/routes/session.ts
import { Router } from "express";
import { Types } from "mongoose";
import { generateQuestion, scoreAnswer, bankQuestion } from "../services/ai";
import Session from "../models/Session";
import Message from "../models/Message";
import Attempt from "../models/Attempt";

const router = Router();
const avg = (a: number[]) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0);
const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

async function computeSummary(sessionId: string) {
  let attempts: any[] = [];
  try { attempts = await Attempt.find({ sessionId }).lean(); } catch {}
  const r = (k: string) => avg(attempts.map(a => Number(a?.rubric?.[k]) || 0));
  const total = (r("correctness") + r("complexity") + r("edgeCases") + r("clarity") + r("codeQuality")) / 5 || 0.62;
  return {
    readinessIndex: clamp01(total),
    avgScore: clamp01(total),
    attempts: attempts.length,
    rubricAverages: {
      total: clamp01(total),
      breakdown: [
        { criterion: "correctness", score: clamp01(r("correctness") || 0.6) },
        { criterion: "complexity",  score: clamp01(r("complexity")  || 0.6) },
        { criterion: "edgeCases",   score: clamp01(r("edgeCases")   || 0.6) },
        { criterion: "clarity",     score: clamp01(r("clarity")     || 0.65) },
        { criterion: "codeQuality", score: clamp01(r("codeQuality") || 0.6) },
      ],
    },
  };
}

async function nextQuestionInternal(sessionId: string, forcedTopic?: string, difficulty: any = "Adaptive") {
  let sess: any = null;
  try { sess = await Session.findById(sessionId); } catch {}
  const topics: string[] = Array.isArray(sess?.topics) && sess.topics.length ? sess.topics : ["DSA","System Design","DBMS","OS","CN"];
  const idx = Number(sess?.currentIndex ?? 0);
  const topic = forcedTopic || topics[idx % topics.length];

  let q = await generateQuestion({ topic, difficulty });
  if (!q || !q.trim()) q = bankQuestion(topic, idx);

  const now = new Date();
  try {
    await Message.create({ sessionId, role: "assistant", content: q, createdAt: now });
    if (sess) { sess.currentIndex = (idx + 1) % topics.length; await sess.save(); }
  } catch {}

  return { question: q, topic, difficulty };
}

/* --------------------------- routes -------------------------- */

router.post("/start", async (req, res) => {
  const { topics, difficulty = "Easy", resumeUrl } = req.body || {};
  const durationMinutes = Number(req.body?.durationMinutes || req.body?.duration || 20);
  const list = Array.isArray(topics) && topics.length ? topics.map(String) : ["DSA","System Design","DBMS","OS","CN"];
  const topic = list[0];

  const question = await generateQuestion({ topic, difficulty, resumeUrl });
  const sessionId = new Types.ObjectId().toString();
  const now = new Date();

  try {
    await Session.create({
      _id: sessionId,
      topic,
      topics: list,
      difficulty,
      durationMinutes,
      startedAt: now,
      endedAt: null,
      currentIndex: 1,
    } as any);
    await Message.create({ sessionId, role: "assistant", content: question, createdAt: now });
  } catch {}

  res.json({ success: true, data: { sessionId, question, topic, difficulty, durationMinutes, startedAt: now.toISOString() } });
});

router.post("/:id/message", async (req, res) => {
  const sessionId = String(req.params.id);
  const { userAnswer = "", topic, difficulty = "Adaptive", next = false } = req.body || {};
  const trimmed = String(userAnswer).trim();

  // If “Ask Next” or empty message → move on
  if (next || trimmed.length === 0) {
    const data = await nextQuestionInternal(sessionId, topic, difficulty);
    return res.json({ success: true, data });
  }

  const now = new Date();
  try {
    const data = await scoreAnswer({ userAnswer: trimmed, topic: topic || "DSA", difficulty });
    try {
      await Message.create({ sessionId, role: "user", content: trimmed, createdAt: now });
      await Message.create({ sessionId, role: "assistant", content: data.reply, createdAt: now });
      await Attempt.create({ sessionId, topic: data.topic, difficulty: data.difficulty, rubric: data.rubric, feedback: data.feedback, createdAt: now });
    } catch {}
    res.json({ success: true, data });
  } catch (e) {
    // Recovery: even if scoring fails, move forward with a new prompt
    const data = await nextQuestionInternal(sessionId, topic, difficulty);
    res.json({ success: true, data });
  }
});

router.post("/:id/next", async (req, res) => {
  const sessionId = String(req.params.id);
  const { difficulty = "Adaptive", topic } = req.body || {};
  const data = await nextQuestionInternal(sessionId, topic, difficulty);
  res.json({ success: true, data });
});

router.post("/:id/finish", async (req, res) => {
  const sessionId = String(req.params.id);
  const now = new Date();
  try { await Session.updateOne({ _id: sessionId }, { $set: { endedAt: now } }); } catch {}
  const analytics = await computeSummary(sessionId);
  res.json({ success: true, data: { sessionId, startedAt: now.toISOString(), endedAt: now.toISOString(), analytics } });
});

router.get("/:id/summary", async (req, res) => {
  const sessionId = String(req.params.id);
  const analytics = await computeSummary(sessionId);
  res.json({ success: true, data: analytics });
});

export default router;
