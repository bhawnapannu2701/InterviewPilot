import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { success, error as toastError } from "@/lib/toast";
import { useInterviewStore } from "@/store/useInterviewStore";

interface StartResp {
  success: boolean;
  data: {
    sessionId: string;
    question: string;
    topic: string;
    difficulty: "Easy" | "Medium" | "Hard" | "Adaptive";
    startedAt: string;
  };
}

const ALL_TOPICS = ["DSA", "Java", "System Design", "DBMS", "OS", "CN"] as const;
const DIFFS = ["Easy", "Medium", "Hard", "Adaptive"] as const;

export default function Setup() {
  const nav = useNavigate();
  const setSession = useInterviewStore((s) => s.setSession);
  const addMessage = useInterviewStore((s) => s.addMessage);

  const [topics, setTopics] = useState<string[]>(["DSA"]);
  const [difficulty, setDifficulty] = useState<(typeof DIFFS)[number]>("Adaptive");
  const [duration, setDuration] = useState<number>(20);
  const [resumeUrl, setResumeUrl] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const toggleTopic = (t: string) => {
    setTopics((curr) =>
      curr.includes(t) ? curr.filter((x) => x !== t) : [...curr, t]
    );
  };

  async function startSession(e: React.FormEvent) {
    e.preventDefault();
    if (topics.length === 0) {
      toastError("Pick at least one topic");
      return;
    }
    try {
      setSubmitting(true);
      const resp = await api<StartResp>("/api/v1/session/start", {
        method: "POST",
        body: JSON.stringify({ topics, difficulty, duration }),
      });
      if (!resp.success) throw new Error("Failed to start session");

      const { sessionId, question, topic, difficulty: diff, startedAt } = resp.data;

      setSession({
        sessionId,
        topic,
        difficulty: diff,
        startedAt,
      });
      // seed first assistant question
      addMessage({ role: "assistant", content: question });
      success("Session started");
      nav(`/interview/${sessionId}`);
    } catch (err: any) {
      toastError(err.message || "Could not start session");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen px-6 py-10 mx-auto max-w-3xl">
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-semibold"
      >
        Configure your mock interview
      </motion.h1>

      <form onSubmit={startSession} className="mt-8 space-y-8">
        {/* Topics */}
        <section className="rounded-2xl bg-surface/60 ring-1 ring-white/5 p-5">
          <h2 className="font-medium">Topics</h2>
          <p className="text-sm text-slate-300 mt-1">
            Choose one or more—questions will rotate.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {ALL_TOPICS.map((t) => {
              const active = topics.includes(t);
              return (
                <button
                  type="button"
                  key={t}
                  onClick={() => toggleTopic(t)}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    active
                      ? "bg-brand text-white shadow"
                      : "bg-slate-800/60 text-slate-200 ring-1 ring-white/10 hover:bg-slate-800"
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </section>

        {/* Difficulty & duration */}
        <section className="grid sm:grid-cols-2 gap-5">
          <div className="rounded-2xl bg-surface/60 ring-1 ring-white/5 p-5">
            <h2 className="font-medium">Difficulty</h2>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {DIFFS.map((d) => (
                <label key={d}>
                  <input
                    type="radio"
                    name="difficulty"
                    value={d}
                    className="peer sr-only"
                    checked={difficulty === d}
                    onChange={() => setDifficulty(d)}
                  />
                  <div className={`rounded-xl px-4 py-2 text-center cursor-pointer transition
                    peer-checked:bg-brand peer-checked:text-white
                    bg-slate-800/60 text-slate-200 ring-1 ring-white/10 hover:bg-slate-800`}>
                    {d}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-surface/60 ring-1 ring-white/5 p-5">
            <h2 className="font-medium">Duration</h2>
            <p className="text-sm text-slate-300 mt-1">Recommended: 20 minutes</p>
            <div className="mt-4 flex items-center gap-3">
              {[10, 20, 30].map((m) => (
                <label key={m}>
                  <input
                    type="radio"
                    name="duration"
                    value={m}
                    className="peer sr-only"
                    checked={duration === m}
                    onChange={() => setDuration(m)}
                  />
                  <div className={`rounded-xl px-4 py-2 text-center cursor-pointer transition
                    peer-checked:bg-brand peer-checked:text-white
                    bg-slate-800/60 text-slate-200 ring-1 ring-white/10 hover:bg-slate-800`}>
                    {m} min
                  </div>
                </label>
              ))}
            </div>
          </div>
        </section>

        {/* Resume (optional personalization placeholder for future) */}
        <section className="rounded-2xl bg-surface/60 ring-1 ring-white/5 p-5">
          <h2 className="font-medium">Resume link (optional)</h2>
          <p className="text-sm text-slate-300 mt-1">
            Paste a public Drive link to tailor questions to your background.
          </p>
          <input
            type="url"
            placeholder="https://drive.google.com/..."
            className="mt-3 w-full rounded-xl bg-slate-900/70 ring-1 ring-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
            value={resumeUrl}
            onChange={(e) => setResumeUrl(e.target.value)}
          />
        </section>

        {/* CTA */}
        <div className="flex items-center gap-4">
          <motion.button
            type="submit"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            disabled={submitting}
            className="relative rounded-2xl bg-brand px-6 py-3 font-medium shadow-lg disabled:opacity-60"
          >
            <span className="absolute inset-0 rounded-2xl btn-shimmer opacity-40" />
            {submitting ? "Starting…" : "Start Interview"}
          </motion.button>

          <span className="text-slate-300 text-sm">
            Voice answers supported. Live audio coming later.
          </span>
        </div>
      </form>
    </div>
  );
}
