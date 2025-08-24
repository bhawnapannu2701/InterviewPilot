import * as React from "react";

export default function Progress({ value = 0 }: { value: number }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-brand to-accent-cyan transition-all"
        style={{ width: `${v}%` }}
      />
    </div>
  );
}
