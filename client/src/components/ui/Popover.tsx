import * as React from "react";
import * as RPopover from "@radix-ui/react-popover";

export function Popover({
  trigger,
  children,
  align = "center",
}: {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "start" | "center" | "end";
}) {
  return (
    <RPopover.Root>
      <RPopover.Trigger asChild>{trigger}</RPopover.Trigger>
      <RPopover.Portal>
        <RPopover.Content
          align={align}
          sideOffset={8}
          className="rounded-2xl bg-slate-900 ring-1 ring-white/10 p-3 shadow-2xl"
        >
          {children}
        </RPopover.Content>
      </RPopover.Portal>
    </RPopover.Root>
  );
}
