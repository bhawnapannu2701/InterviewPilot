import * as React from "react";

export default function Skeleton({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`animate-pulse bg-white/10 rounded-lg ${className}`}
      style={style}
    />
  );
}
