import { IAttempt } from "../models/Attempt";
import { computeScore, normalizeRubric, RubricResult } from "../utils/scoring";

export interface SessionAnalytics {
  readinessIndex: number;            // 0..1 overall
  avgScore: number;                  // 0..1 mean of attempts
  attempts: number;                  // count
  strengths: { topic: string; avg: number }[];
  weaknesses: { topic: string; avg: number }[];
  rubricAverages: RubricResult;      // overall rubric breakdown
}

/**
 * Aggregate rubric fields across attempts
 */
function aggregateRubric(attempts: Pick<IAttempt, "aiFeedback" | "score">[] & any[]) {
  // We don't persist rubric fields separately, but we can re-normalize if stored.
  // If not available, we fallback from score only.
  const sums: Record<string, { total: number; count: number }> = {
    correctness: { total: 0, count: 0 },
    complexity: { total: 0, count: 0 },
    edgeCases: { total: 0, count: 0 },
    clarity: { total: 0, count: 0 },
    codeQuality: { total: 0, count: 0 },
  };

  // If attempts had rubric JSON, you'd parse and accumulate it here.
  // For MVP, we distribute overall score proportionally as a neutral baseline.
  attempts.forEach((a) => {
    const r = {
      correctness: a.score,
      complexity: Math.max(0, a.score - 0.1),
      edgeCases: Math.max(0, a.score - 0.15),
      clarity: a.score,
      codeQuality: Math.max(0, a.score - 0.05),
    };
    for (const k of Object.keys(sums)) {
      sums[k].total += (r as any)[k];
      sums[k].count += 1;
    }
  });

  const breakdown = Object.entries(sums).map(([criterion, { total, count }]) => ({
    criterion,
    score: count ? total / count : 0,
  }));

  return computeScore(breakdown);
}

/**
 * Compute strengths & weaknesses by topic using mean scores.
 */
export function computeSessionAnalytics(attempts: IAttempt[]): SessionAnalytics {
  const n = attempts.length || 1;
  const avg = attempts.reduce((s, a) => s + a.score, 0) / n;

  // Topic aggregates
  const byTopic: Record<string, { total: number; count: number }> = {};
  attempts.forEach((a) => {
    byTopic[a.topic] = byTopic[a.topic] || { total: 0, count: 0 };
    byTopic[a.topic].total += a.score;
    byTopic[a.topic].count += 1;
  });

  const topicAverages = Object.entries(byTopic).map(([topic, { total, count }]) => ({
    topic,
    avg: count ? total / count : 0,
  }));

  const strengths = [...topicAverages].sort((a, b) => b.avg - a.avg).slice(0, 3);
  const weaknesses = [...topicAverages].sort((a, b) => a.avg - b.avg).slice(0, 3);

  // Readiness Index: weighted blend of avg score + attempt volume (diminishing returns)
  // Rationale: consistent practice should increase readiness modestly.
  const practiceBoost = Math.min(0.15, Math.log1p(n) / 20); // max +0.15
  const readiness = Math.max(0, Math.min(1, avg * 0.9 + practiceBoost));

  const rubricAverages = aggregateRubric(attempts);

  return {
    readinessIndex: parseFloat(readiness.toFixed(3)),
    avgScore: parseFloat(avg.toFixed(3)),
    attempts: attempts.length,
    strengths,
    weaknesses,
    rubricAverages,
  };
}
