import { useEffect, useRef, useState } from "react";
import MagicTimer from "../components/animated/MagicTimer";
import ChatBubble from "../components/chat/ChatBubble";
import TypingDots from "../components/chat/TypingDots";
import GradientButton from "../components/ui/GradientButton";
import GlassCard from "../components/layout/GlassCard";

const API = import.meta.env.VITE_API_BASE || "http://localhost:5000";

type Msg = { role: "user" | "assistant"; content: string };
type StartResp = { sessionId: string; question: string; topic: string; difficulty: string; durationMinutes?: number };
type NextResp = { question: string; topic: string; difficulty: string };

export default function Interview() {
  const [sessionId, setSessionId] = useState<string>("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingNext, setLoadingNext] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(20 * 60);
  const [timeLeft, setTimeLeft] = useState(20 * 60);
  const listRef = useRef<HTMLDivElement>(null);

  // 🔒 StrictMode guard – ensures start runs only once
  const startedRef = useRef(false);

  useEffect(() => {
    listRef.current?.scrollTo({ top: 999999, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    (async () => {
      if (startedRef.current) return;
      startedRef.current = true;

      const stored = localStorage.getItem("ip_session_id");
      if (stored) setSessionId(stored);

      if (!stored) {
        const topics = JSON.parse(localStorage.getItem("ip_topics") || '["DSA","System Design","DBMS","OS","CN"]');
        const difficulty = localStorage.getItem("ip_diff") || "Adaptive";
        const durationMinutes = Number(localStorage.getItem("ip_duration") || 20);

        const res = await fetch(`${API}/api/v1/session/start`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ topics, difficulty, durationMinutes }),
        });
        const j = await res.json();
        const d: StartResp = j?.data || j;
        setSessionId(d.sessionId);
        localStorage.setItem("ip_session_id", d.sessionId);

        // first prompt once
        setMessages([{ role: "assistant", content: d.question }]);
        const secs = Math.max(1, Math.round(d.durationMinutes ?? durationMinutes)) * 60;
        setTotalSeconds(secs);
        setTimeLeft(secs);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!timeLeft) return;
    const id = setInterval(() => setTimeLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [timeLeft]);

  const send = async () => {
    if (!sessionId) return;
    setSending(true);
    try {
      const body: any = { userAnswer: input, difficulty: "Adaptive" };
      if (!input.trim()) body.next = true; // empty -> next question

      const res = await fetch(`${API}/api/v1/session/${sessionId}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      const j = await res.json();

      if (body.next) {
        const d: NextResp = j?.data || j;
        setMessages((m) => [...m, { role: "assistant", content: d.question }]);
      } else {
        const d = j?.data;
        setMessages((m) => [
          ...m,
          { role: "user", content: input },
          { role: "assistant", content: String(d?.reply || d?.feedback || "Thanks — noted.") },
        ]);
      }
      setInput("");
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Network issue — try again." }]);
    } finally {
      setSending(false);
    }
  };

  const nextPrompt = async () => {
    if (!sessionId) return;
    setLoadingNext(true);
    try {
      const res = await fetch(`${API}/api/v1/session/${sessionId}/next`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const j = await res.json();
      const d: NextResp = j?.data || j;
      setMessages((m) => [...m, { role: "assistant", content: d.question }]);
    } finally {
      setLoadingNext(false);
    }
  };

  const finish = async () => {
    if (!sessionId) return;
    localStorage.removeItem("ip_session_id");
    await fetch(`${API}/api/v1/session/${sessionId}/finish`, {
      method: "POST",
      credentials: "include",
    });
    window.location.href = `/result/${sessionId}`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 pt-6 pb-16">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-semibold">Interview</h2>
        <MagicTimer timeLeftSeconds={timeLeft} totalSeconds={totalSeconds} />
      </div>

      <GlassCard className="h-[60vh] overflow-y-auto pr-2">
        <div ref={listRef}>
          {messages.map((m, i) => (
            <ChatBubble key={i} role={m.role} text={m.content} />
          ))}
          {(sending || loadingNext) && (
            <div className="flex justify-start mb-3">
              <div className="max-w-[80%] rounded-xl px-4 py-3 bg-white/5 border border-white/15">
                <TypingDots />
              </div>
            </div>
          )}
        </div>
      </GlassCard>

      <div className="flex gap-2 mt-4">
        <input
          className="flex-1 bg-white/5 border border-white/15 rounded-xl px-4 py-3 outline-none focus:border-cyan-400/50"
          placeholder="Type your answer (leave empty to get the next prompt)…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") send(); }}
        />
        <GradientButton onClick={send} disabled={sending}>
          {sending ? "Sending..." : input.trim() ? "Send" : "Ask Next"}
        </GradientButton>
        <GradientButton variant="ghost" onClick={nextPrompt} disabled={loadingNext}>
          Next prompt
        </GradientButton>
        <GradientButton variant="ghost" onClick={finish}>
          Finish
        </GradientButton>
      </div>
    </div>
  );
}
