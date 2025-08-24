import { useState } from "react";

export default function ChatInput({
  onSend,
  disabled,
}: {
  onSend: (text: string) => void;
  disabled?: boolean;
}) {
  const [text, setText] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const t = text.trim();
        if (!t) return;
        onSend(t);
        setText("");
      }}
      className="flex items-center gap-2"
    >
      <textarea
        className="flex-1 rounded-xl bg-slate-900/70 ring-1 ring-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand min-h-[48px] max-h-40"
        placeholder="Type your answer… (Shift+Enter for new line)"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            (e.currentTarget.closest("form") as HTMLFormElement)?.requestSubmit();
          }
        }}
        disabled={disabled}
      />
      <button
        type="submit"
        disabled={disabled || text.trim().length === 0}
        className="relative rounded-2xl bg-brand px-4 py-2 font-medium shadow-lg disabled:opacity-60"
      >
        <span className="absolute inset-0 rounded-2xl btn-shimmer opacity-40" />
        Send
      </button>
    </form>
  );
}
