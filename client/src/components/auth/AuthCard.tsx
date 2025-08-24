export default function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6 w-[420px]">
      <h1 className="text-2xl font-bold mb-1">{title}</h1>
      {subtitle && <p className="text-white/60 mb-5">{subtitle}</p>}
      {children}
    </div>
  );
}
