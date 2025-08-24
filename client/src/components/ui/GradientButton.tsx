// client/src/components/ui/GradientButton.tsx
import React, { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

type Variant = "primary" | "ghost" | "danger"; // extend as you like

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: Variant; // <-- accept `variant` so existing calls compile
};

export default function GradientButton({
  children,
  className,
  variant = "primary",
  ...rest
}: Props) {
  // base visuals
  const base =
    "relative inline-flex items-center justify-center rounded-xl px-4 py-2 font-medium transition-[filter,transform,background] duration-200 ease-out focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed";

  // style per variant (keep primary as gradient)
  const variants: Record<Variant, string> = {
    primary:
      "text-white bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 " +
      "hover:from-cyan-400 hover:via-purple-400 hover:to-pink-400 " +
      "focus:ring-2 focus:ring-cyan-400/60",
    ghost:
      "text-white/90 bg-white/10 hover:bg-white/15 backdrop-blur border border-white/15 " +
      "focus:ring-2 focus:ring-white/30",
    danger:
      "text-white bg-gradient-to-r from-rose-500 via-red-500 to-orange-500 " +
      "hover:from-rose-400 hover:via-red-400 hover:to-orange-400 " +
      "focus:ring-2 focus:ring-rose-400/60",
  };

  const isGradient = variant === "primary" || variant === "danger";

  return (
    <button
      {...rest}
      className={clsx(base, variants[variant], className)}
    >
      {/* soft glow only for gradient variants */}
      {isGradient && (
        <span className="absolute inset-0 rounded-xl blur-md opacity-40 bg-inherit pointer-events-none" />
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
}
