// Shared minimal types between client and server

export type Difficulty = "Easy" | "Medium" | "Hard" | "Adaptive";

export interface Rubric {
  correctness: number;
  complexity: number;
  edgeCases: number;
  clarity: number;
  codeQuality: number;
}

export interface StartSessionResponse {
  success: true;
  data: {
    sessionId: string;
    question: string;
    topic: string;
    difficulty: Difficulty;
    startedAt: string;
  };
}

export interface MessageResponse {
  success: true;
  data: {
    reply: string;
    rubric: Rubric;
    feedback: string;
    topic: string;
    difficulty: Difficulty;
  };
}

export interface FinishResponse {
  success: true;
  data: {
    sessionId: string;
    startedAt: string;
    endedAt: string;
    analytics: {
      readinessIndex: number;
      avgScore: number;
      attempts: number;
      strengths: { topic: string; avg: number }[];
      weaknesses: { topic: string; avg: number }[];
      rubricAverages: { total: number; breakdown: { criterion: string; score: number }[] };
    };
  };
}
