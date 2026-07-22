"use client";

// Sticky top bar: app name (mobile), timeframe toggle, and quick-add.

import { QuickAddButton } from "./QuickAddButton";
import { TimeframeToggle } from "./TimeframeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-border bg-background/80 px-4 backdrop-blur md:px-6">
      <div className="flex items-center gap-2 md:hidden">
        <span className="grid h-7 w-7 place-items-center rounded-md bg-accent text-accent-fg text-sm font-bold">
          S
        </span>
        <span className="text-[15px] font-semibold tracking-tight">The System</span>
      </div>

      <div className="hidden md:block" />

      <div className="flex items-center gap-2 md:gap-3">
        <TimeframeToggle />
        <QuickAddButton />
      </div>
    </header>
  );
}
