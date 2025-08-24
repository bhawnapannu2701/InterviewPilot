import * as React from "react";
import * as RTooltip from "@radix-ui/react-tooltip";

export default function Tooltip({
  content,
  children,
}: React.PropsWithChildren<{ content: string }>) {
  return (
    <RTooltip.Provider delayDuration={200}>
      <RTooltip.Root>
        <RTooltip.Trigger asChild>{children}</RTooltip.Trigger>
        <RTooltip.Portal>
          <RTooltip.Content
            sideOffset={8}
            className="rounded-lg bg-slate-800 text-slate-100 text-xs px-2 py-1 ring-1 ring-white/10 shadow-lg"
          >
            {content}
            <RTooltip.Arrow className="fill-slate-800" />
          </RTooltip.Content>
        </RTooltip.Portal>
      </RTooltip.Root>
    </RTooltip.Provider>
  );
}
