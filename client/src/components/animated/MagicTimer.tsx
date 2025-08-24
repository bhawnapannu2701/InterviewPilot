import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { motion } from "framer-motion";

export default function MagicTimer({
  timeLeftSeconds,
  totalSeconds,
}: { timeLeftSeconds: number; totalSeconds: number }) {
  const pct = Math.max(0, Math.min(100, Math.round((timeLeftSeconds / totalSeconds) * 100)));
  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = timeLeftSeconds % 60;

  return (
    <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-24 h-24 relative">
      <CircularProgressbar
        value={pct}
        text={`${minutes}:${seconds.toString().padStart(2, "0")}`}
        styles={buildStyles({
          textColor: "#fff",
          pathColor: "url(#magicGradient)",
          trailColor: "#1f2937",
        })}
      />
      <svg style={{ height: 0 }}>
        <defs>
          <linearGradient id="magicGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
}
