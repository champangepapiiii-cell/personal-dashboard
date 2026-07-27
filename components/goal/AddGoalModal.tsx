"use client";

// Name a new goal → creates a goal section and navigates to its playbook page.

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store-context";

const SUGGESTIONS = ["Confidence", "Better sleep", "Learn Spanish", "Run a 5K", "Read more", "Public speaking", "Quit doomscrolling"];

export function AddGoalModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addGoalSection } = useStore();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !mounted) return null;

  const create = (value: string) => {
    const section = addGoalSection(value);
    setTitle("");
    onClose();
    if (section) router.push(`/goal/${section.id}`);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Add a goal"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-t-2xl border border-border bg-surface p-5 shadow-2xl sm:rounded-2xl"
      >
        <h2 className="text-lg font-semibold tracking-tight">Add a goal</h2>
        <p className="mt-1 text-sm text-muted">
          Name anything you want to improve. The coach builds a plan for it — methods, techniques, things to read, and habits.
        </p>

        <div className="mt-4 flex gap-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && title.trim()) {
                e.preventDefault();
                create(title);
              }
            }}
            autoFocus
            placeholder="e.g. Improve my confidence"
            className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none placeholder:text-muted focus:border-coach"
          />
          <button
            type="button"
            onClick={() => create(title)}
            disabled={!title.trim()}
            className="shrink-0 rounded-lg bg-coach px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-40"
          >
            Create
          </button>
        </div>

        <div className="mt-4">
          <p className="mb-2 text-xs font-medium text-muted">Or pick one to start:</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => create(s)}
                className="rounded-full border border-border px-3 py-1.5 text-sm text-muted transition-colors hover:border-coach hover:text-foreground"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
