// client/src/components/chat/ChatStream.tsx
import React from "react";
import ChatBubble from "./ChatBubble";
import TypingDots from "./TypingDots";

type Msg = {
  role: "user" | "assistant";
  content: string; // stored/content name is fine here
};

interface Props {
  messages: Msg[];
  isAssistantTyping?: boolean;
  className?: string;
}

export default function ChatStream({
  messages,
  isAssistantTyping = false,
  className = "",
}: Props) {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {messages.map((m, idx) => (
        // ChatBubble expects `text`, so forward content -> text
        <ChatBubble key={idx} role={m.role} text={m.content} />
      ))}

      {isAssistantTyping && (
        <div className="self-start">
          <TypingDots />
        </div>
      )}
    </div>
  );
}
