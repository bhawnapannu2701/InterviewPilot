import { motion } from "framer-motion";

function cn(...c: (string|false|undefined)[]) { return c.filter(Boolean).join(" "); }

export default function GradientButton(
  { children, className, variant="primary", ...props }:
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary"|"ghost" }
) {
  if (variant === "ghost") {
    return (
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        className={cn(
          "rounded-xl px-5 py-2 border border-white/15 text-white/90 hover:text-white/100 hover:border-white/25 transition",
          className
        )}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        "relative overflow-hidden rounded-xl px-6 py-2 font-semibold text-white shadow-lg hover:shadow-xl transition",
        "bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-pink-500",
        className
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      <span className="absolute inset-0 opacity-30 bg-[radial-gradient(600px_200px_at_50%_-50%,white,transparent)]" />
    </motion.button>
  );
}
