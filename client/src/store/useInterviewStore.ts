import { create } from "zustand";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface SessionState {
  sessionId: string | null;
  topic: string | null;
  difficulty: string | null;
  startedAt: string | null;
  endedAt: string | null;
  messages: ChatMessage[];
  setSession: (s: {
    sessionId: string;
    topic: string;
    difficulty: string;
    startedAt: string;
  }) => void;
  addMessage: (m: ChatMessage) => void;
  setEnded: (time: string) => void;
  reset: () => void;
}

export const useInterviewStore = create<SessionState>((set) => ({
  sessionId: null,
  topic: null,
  difficulty: null,
  startedAt: null,
  endedAt: null,
  messages: [],
  setSession: ({ sessionId, topic, difficulty, startedAt }) =>
    set({ sessionId, topic, difficulty, startedAt, messages: [], endedAt: null }),
  addMessage: (m) =>
    set((s) => ({
      messages: [...s.messages, m],
    })),
  setEnded: (time) => set({ endedAt: time }),
  reset: () =>
    set({
      sessionId: null,
      topic: null,
      difficulty: null,
      startedAt: null,
      endedAt: null,
      messages: [],
    }),
}));
