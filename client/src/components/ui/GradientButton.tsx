// client/src/components/ui/GradientButton.tsx
import React, { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export default function GradientButton({
  children,
  className,
  ...rest
}: Props) {
  return (
    <button
      {...rest}
      className={clsx(
        "relative inline-flex items-center justify-center rounded-xl px-4 py-2 font-medium text-white",
        "bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500",
        "hover:from-cyan-400 hover:via-purple-400 hover:to-pink-400",
        "focus:outline-none focus:ring-2 focus:ring-cyan-400/60",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        "transition-[filter,transform,background] duration-200 ease-out",
        className
      )}
    >
      {/* soft glow */}
      <span className="absolute inset-0 rounded-xl blur-md opacity-40 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 pointer-events-none" />
      <span className="relative z-10">{children}</span>
    </button>
  );
}
