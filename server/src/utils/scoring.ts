/**
 * Rubric-based scoring for interview answers.
 * Each criterion is scored between 0 and 1 (by AI or rules).
 * We compute a weighted average for the final score.
 */

export interface CriterionScore {
  criterion: string;
  score: number; // 0–1
}

export interface RubricResult {
  total: number; // weighted average 0–1
  breakdown: CriterionScore[];
}

const DEFAULT_WEIGHTS: Record<string, number> = {
  correctness: 0.4,
  complexity: 0.2,
  edgeCases: 0.15,
  clarity: 0.15,
  codeQuality: 0.1,
};

/**
 * Compute final score given breakdown and optional custom weights.
 */
export function computeScore(
  breakdown: CriterionScore[],
  weights: Record<string, number> = DEFAULT_WEIGHTS
): RubricResult {
  let totalWeight = 0;
  let weightedSum = 0;

  breakdown.forEach(({ criterion, score }) => {
    const weight = weights[criterion] ?? 0;
    weightedSum += score * weight;
    totalWeight += weight;
  });

  const final = totalWeight > 0 ? weightedSum / totalWeight : 0;

  return {
    total: parseFloat(final.toFixed(3)),
    breakdown,
  };
}

/**
 * Normalize a free-form rubric object from AI into CriterionScore[]
 */
export function normalizeRubric(raw: Record<string, any>): CriterionScore[] {
  const scores: CriterionScore[] = [];
  for (const [criterion, val] of Object.entries(raw)) {
    let num = Number(val);
    if (isNaN(num)) continue;
    num = Math.max(0, Math.min(1, num));
    scores.push({ criterion, score: num });
  }
  return scores;
}
