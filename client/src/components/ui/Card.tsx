import * as React from "react";

export const Card = ({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`rounded-2xl bg-slate-900/40 ring-1 ring-white/10 ${className}`}
    {...props}
  />
);

export const CardHeader = ({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`px-4 py-3 border-b border-white/10 ${className}`} {...props} />
);

export const CardContent = ({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`px-4 py-4 ${className}`} {...props} />
);

export const CardFooter = ({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`px-4 py-3 border-t border-white/10 ${className}`} {...props} />
);

export default Card;
