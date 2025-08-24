/**
 * Decorative particle field you can place behind headers/sections.
 * Usage: <TimerParticles className="h-20" />
 */
export default function TimerParticles({ className = "" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(37,99,235,0.25),rgba(34,211,238,0.08)_40%,transparent_70%)]" />
    </div>
  );
}
