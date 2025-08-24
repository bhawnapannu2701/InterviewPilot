export default function HintRibbon({
  hints,
}: {
  hints: string[];
}) {
  if (!hints || hints.length === 0) return null;
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {hints.map((h, i) => (
        <span key={i} className="rounded-full bg-slate-800/60 ring-1 ring-white/10 px-3 py-1 text-xs text-slate-300">
          {h}
        </span>
      ))}
    </div>
  );
}
