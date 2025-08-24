import * as React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, className = "", ...props }, ref) => {
    return (
      <label className="block">
        {label && <div className="text-sm text-slate-300">{label}</div>}
        <input
          ref={ref}
          className={`mt-1 w-full rounded-xl bg-slate-900/70 ring-1 ring-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand ${className}`}
          {...props}
        />
        {hint && <div className="mt-1 text-xs text-slate-400">{hint}</div>}
      </label>
    );
  }
);
Input.displayName = "Input";

export default Input;
