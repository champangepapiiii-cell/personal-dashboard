"use client";

// Quick-add entry point. The capture flow arrives in a later phase — for now
// this is a wired, styled affordance that acknowledges the click.

import { useState } from "react";

export function QuickAddButton() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-accent-fg shadow-sm transition-opacity hover:opacity-90"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} className="h-4 w-4" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
        </svg>
        <span className="hidden sm:inline">Quick add</span>
      </button>

      {open && (
        <div
          role="dialog"
          className="absolute right-0 top-full z-40 mt-2 w-60 rounded-xl border border-border bg-surface p-4 text-sm shadow-lg"
        >
          <p className="font-medium text-foreground">Quick add</p>
          <p className="mt-1 text-muted">
            Fast entry capture is coming in a later phase.
          </p>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="mt-3 w-full rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted hover:text-foreground"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
