import { motion } from "framer-motion";

export default function ChatBubble({
  role, text
}: { role: "user" | "assistant", text: string }) {
  const isUser = role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}
    >
      <div className={`max-w-[78%] rounded-2xl px-4 py-3 leading-relaxed ${isUser
        ? "bg-cyan-500/20 border border-cyan-400/30"
        : "bg-white/5 border border-white/15"}`}>
        <p className="whitespace-pre-wrap">{text}</p>
      </div>
    </motion.div>
  );
}
