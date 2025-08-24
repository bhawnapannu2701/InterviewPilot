// server/src/services/ai.ts
import { ENV } from "../config/env";
import fetch from "node-fetch";

type GenOpts = { topic: string; difficulty?: string; resumeUrl?: string };
type ScoreOpts = { userAnswer: string; topic: string; difficulty?: string };

const BANK: Record<string, string[]> = {
  DSA: [
    "Given an array of integers, return the length of the longest increasing subsequence. Explain your approach and complexity.",
    "You are given an array of 0s and 1s. Find the length of the longest subarray with equal number of 0s and 1s.",
    "Design a stack that supports push, pop and getMin in O(1) time.",
    "Given a binary tree, return its right view. Explain recursion vs BFS approach.",
    "Given a matrix of 0/1, find the largest square consisting of 1s. Return the area."
  ],
  "System Design": [
    "Design a URL shortener. Discuss API design, data model, hashing, scale, and rate limiting.",
    "Design a news feed (like Twitter). Discuss fan‑out, timelines, caching, and ranking.",
    "Design a file storage service like Google Drive. Consider metadata, sharding, and sharing.",
  ],
  DBMS: [
    "Explain normalization (1NF, 2NF, 3NF) with examples. Why denormalize?",
    "How would you design an index strategy for a table storing events(time, userId, type)?"
  ],
  OS: [
    "Explain processes vs threads; context switch; when to use each.",
    "Describe deadlock conditions and how to prevent or avoid them."
  ],
  CN: [
    "Explain TCP vs UDP and when you would use each.",
    "What happens when you type a URL in the browser? Walk through DNS, TCP, TLS, HTTP."
  ]
};

function pickFromBank(topic: string, index = 0) {
  const list = BANK[topic] || BANK["DSA"];
  return list[index % list.length];
}

export async function generateQuestion(opts: GenOpts): Promise<string> {
  // Try OpenAI if available
  try {
    if (!ENV.OPENAI_API_KEY) throw new Error("no key");
    const sys = `You are an expert interviewer. Create a single concise interview prompt for topic "${opts.topic}" at ${opts.difficulty ?? "Adaptive"} difficulty. Do not give solution.`;
    const user = opts.resumeUrl
      ? `Tailor to resume hints at: ${opts.resumeUrl}`
      : `General audience.`;

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${ENV.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: sys },
          { role: "user", content: user }
        ],
        temperature: 0.7,
        max_tokens: 180
      })
    });
    const j: any = await r.json();
    const text = j?.choices?.[0]?.message?.content?.trim();
    if (text) return text;
  } catch (e) {
    console.warn("generateQuestion fallback:", (e as Error).message);
  }
  // Fallback bank
  return pickFromBank(opts.topic, Math.floor(Math.random() * 10));
}

export async function scoreAnswer(opts: ScoreOpts): Promise<{
  topic: string;
  difficulty: string;
  feedback: string;
  reply: string;
  rubric: {
    correctness: number;
    complexity: number;
    edgeCases: number;
    clarity: number;
    codeQuality: number;
  };
}> {
  // AI route
  try {
    if (!ENV.OPENAI_API_KEY) throw new Error("no key");
    const sys = `You grade interview answers. Return structured JSON only with keys: feedback, reply, rubric{correctness,complexity,edgeCases,clarity,codeQuality} numbers in [0,1]. Be concise.`;
    const user = `Topic: ${opts.topic}\nDifficulty: ${opts.difficulty ?? "Adaptive"}\nCandidate answer:\n${opts.userAnswer}`;

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${ENV.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: sys },
          { role: "user", content: user }
        ],
        temperature: 0.3,
        max_tokens: 300
      })
    });
    const j: any = await r.json();
    const raw = j?.choices?.[0]?.message?.content || "{}";
    const parsed = JSON.parse(raw);

    const rubric = parsed?.rubric || {};
    return {
      topic: opts.topic,
      difficulty: opts.difficulty ?? "Adaptive",
      feedback: String(parsed?.feedback || "Thanks — consider complexity and edge cases."),
      reply: String(parsed?.reply || "Here's how to improve…"),
      rubric: {
        correctness: clamp01(rubric.correctness ?? 0.6),
        complexity:  clamp01(rubric.complexity ?? 0.6),
        edgeCases:   clamp01(rubric.edgeCases ?? 0.6),
        clarity:     clamp01(rubric.clarity ?? 0.6),
        codeQuality: clamp01(rubric.codeQuality ?? 0.6),
      }
    };
  } catch (e) {
    console.warn("scoreAnswer fallback:", (e as Error).message);
  }

  // Fallback heuristic
  const base = (s: string) => Math.max(0.3, Math.min(0.9, s.length / 500));
  const score = base(opts.userAnswer);
  return {
    topic: opts.topic,
    difficulty: opts.difficulty ?? "Adaptive",
    feedback: "Add edge cases (empty input, extremes), discuss time/space complexity, and compare alternatives.",
    reply: "Good attempt! You can strengthen your answer by stating the approach first, then complexity, then 2+ edge cases.",
    rubric: {
      correctness: score,
      complexity: Math.max(0.3, score - 0.05),
      edgeCases: Math.max(0.3, score - 0.1),
      clarity: Math.min(0.95, score + 0.05),
      codeQuality: Math.max(0.35, score - 0.05),
    }
  };
}

const clamp01 = (n: number) => Math.max(0, Math.min(1, Number(n)));
export function bankQuestion(topic: string, i: number) { return pickFromBank(topic, i); }
