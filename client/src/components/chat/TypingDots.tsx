export default function TypingDots() {
  return (
    <div className="flex gap-1 items-center">
      {[0,1,2].map(i=>(
        <span key={i} className="w-2 h-2 rounded-full bg-white/70 animate-bounce"
          style={{ animationDelay: `${i*0.12}s` }} />
      ))}
    </div>
  );
}
