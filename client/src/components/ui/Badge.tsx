import * as React from "react";

type Tone = "brand" | "green" | "amber" | "red" | "gray";

const tones: Record<Tone, string> = {
  brand: "bg-brand/20 text-brand ring-brand/40",
  green: "bg-emerald-500/15 text-emerald-400 ring-emerald-400/30",
  amber: "bg-amber-500/15 text-amber-400 ring-amber-400/30",
  red: "bg-rose-500/15 text-rose-400 ring-rose-400/30",
  gray: "bg-slate-700/30 text-slate-200 ring-white/10",
};

export default function Badge({
  tone = "gray",
  className = "",
  children,
}: React.PropsWithChildren<{ tone?: Tone; className?: string }>) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs ring-1 ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
