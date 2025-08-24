export default function TopicChips({
  topics,
  active,
  onToggle,
}: {
  topics: string[];
  active: string[];
  onToggle: (t: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {topics.map((t) => {
        const isOn = active.includes(t);
        return (
          <button
            type="button"
            key={t}
            onClick={() => onToggle(t)}
            className={`rounded-full px-4 py-2 text-sm transition ${
              isOn ? "bg-brand text-white shadow" : "bg-slate-800/60 text-slate-200 ring-1 ring-white/10 hover:bg-slate-800"
            }`}
          >
            {t}
          </button>
        );
      })}
    </div>
  );
}
