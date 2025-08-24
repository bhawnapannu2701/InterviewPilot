/**
 * Placeholder for future streaming UI.
 * For now the Interview route handles messages; this component can render a list nicely.
 */
import { motion } from "framer-motion";
import ChatBubble from "./ChatBubble";

export interface ChatMessage { role: "user" | "assistant"; content: string; }

export default function ChatStream({ messages }: { messages: ChatMessage[] }) {
  return (
    <div className="space-y-3">
      {messages.map((m, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <ChatBubble role={m.role} content={m.content} />
        </motion.div>
      ))}
    </div>
  );
}
