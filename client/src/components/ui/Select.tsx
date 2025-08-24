import * as React from "react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { label: string; value: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, className = "", ...props }, ref) => {
    return (
      <label className="block">
        {label && <div className="text-sm text-slate-300">{label}</div>}
        <select
          ref={ref}
          className={`mt-1 w-full rounded-xl bg-slate-900/70 ring-1 ring-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand ${className}`}
          {...props}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
    );
  }
);
Select.displayName = "Select";

export default Select;
