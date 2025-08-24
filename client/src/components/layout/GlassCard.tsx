import { PropsWithChildren } from "react";

export default function GlassCard({ children, className = "" }: PropsWithChildren<{className?:string}>) {
  return (
    <div className={`glass rounded-2xl p-6 shadow-xl ${className}`}>
      {children}
    </div>
  );
}
