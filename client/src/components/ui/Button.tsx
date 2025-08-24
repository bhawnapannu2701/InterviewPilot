import * as React from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type Size = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const base =
  "inline-flex items-center justify-center rounded-2xl font-medium transition focus:outline-none focus:ring-2 focus:ring-brand disabled:opacity-60 disabled:cursor-not-allowed";
const sizes: Record<Size, string> = {
  sm: "text-sm px-3 py-1.5",
  md: "text-sm px-4 py-2",
  lg: "text-base px-5 py-2.5",
};
const variants: Record<Variant, string> = {
  primary: "bg-brand text-white shadow-lg hover:brightness-110",
  secondary: "bg-slate-800 text-white ring-1 ring-white/10 hover:bg-slate-700",
  ghost: "bg-transparent hover:bg-white/5",
  outline: "bg-transparent ring-1 ring-white/20 hover:bg-white/5",
  danger: "bg-rose-600 text-white hover:bg-rose-500",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", loading, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
        {...props}
      >
        <span className="absolute inset-0 rounded-2xl btn-shimmer opacity-30 pointer-events-none" />
        {loading ? "Please wait…" : children}
      </button>
    );
  }
);
Button.displayName = "Button";

export default Button;
