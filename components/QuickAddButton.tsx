"use client";

// Opens the interactive Quick Add modal and shows a brief confirmation toast
// when an entry is saved.

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { QuickAddModal } from "./QuickAddModal";

export function QuickAddButton() {
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  // Global shortcut: "q", or ⌘/Ctrl+K. Ignored while typing in a field.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented) return;
      const el = document.activeElement as HTMLElement | null;
      const typing =
        !!el &&
        (el.tagName === "INPUT" ||
          el.tagName === "TEXTAREA" ||
          el.tagName === "SELECT" ||
          el.isContentEditable);
      const cmdK = (e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K");
      const plainQ = !e.metaKey && !e.ctrlKey && !e.altKey && (e.key === "q" || e.key === "Q");
      if (cmdK || (plainQ && !typing)) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title="Quick add (press Q)"
        className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-accent-fg shadow-sm transition-opacity hover:opacity-90"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} className="h-4 w-4" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
        </svg>
        <span className="hidden sm:inline">Quick add</span>
        <kbd className="ml-0.5 hidden rounded border border-accent-fg/30 px-1.5 py-0.5 font-mono text-[10px] font-semibold leading-none text-accent-fg/80 md:inline">
          Q
        </kbd>
      </button>

      <QuickAddModal
        open={open}
        onClose={() => setOpen(false)}
        onSaved={(message) => setToast(message)}
      />

      {mounted &&
        toast &&
        createPortal(
          <div
            role="status"
            className="fixed inset-x-0 bottom-20 z-[60] mx-auto flex w-fit items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium shadow-lg md:bottom-6"
          >
            <span
              className="grid h-4 w-4 place-items-center rounded-full text-[10px] text-accent-fg"
              style={{ background: "var(--accent)" }}
              aria-hidden="true"
            >
              ✓
            </span>
            {toast}
          </div>,
          document.body,
        )}
    </>
  );
}
