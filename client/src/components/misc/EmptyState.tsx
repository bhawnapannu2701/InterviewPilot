export default function EmptyState({
  title,
  desc,
  action,
}: {
  title: string;
  desc?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="text-center p-10 rounded-2xl bg-slate-900/40 ring-1 ring-white/10">
      <div className="text-lg font-medium">{title}</div>
      {desc && <p className="mt-1 text-slate-300">{desc}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
