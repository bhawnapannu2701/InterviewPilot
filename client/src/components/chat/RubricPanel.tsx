export interface Rubric {
  correctness: number; complexity: number; edgeCases: number; clarity: number; codeQuality: number;
}

export default function RubricPanel({ rubric }: { rubric: Rubric }) {
  if (!rubric) return null;

  const rows = [
    ["Correctness", rubric.correctness],
    ["Complexity", rubric.complexity],
    ["Edge cases", rubric.edgeCases],
    ["Clarity", rubric.clarity],
    ["Code quality", rubric.codeQuality],
  ] as const;

  return (
    <div className="rounded-xl bg-slate-900/40 ring-1 ring-white/10 p-3 text-sm">
      <div className="font-medium mb-2">Rubric</div>
      <div className="space-y-2">
        {rows.map(([label, v]) => (
          <div key={label} className="flex items-center gap-3">
            <div className="w-32 text-slate-300">{label}</div>
            <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-brand" style={{ width: `${Math.round(v * 100)}%` }} />
            </div>
            <div className="w-10 text-right">{Math.round(v * 100)}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}
