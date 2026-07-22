"use client";

// Date header + an editable single-line focus for the day. Persists to the
// store on blur or Enter, keyed by today's date.

import { useEffect, useRef, useState } from "react";
import { dayKey, formatLongDate } from "@/lib/dates";
import { useStore } from "@/lib/store-context";

export function DailyFocus() {
  const { data, hydrated, setFocus } = useStore();
  const todayKey = dayKey();
  const saved = data.focuses[todayKey] ?? "";

  const [value, setValue] = useState(saved);
  // Locale-formatted date differs between the Node server and the browser, so
  // render it only after mount to avoid a hydration mismatch.
  const [dateLabel, setDateLabel] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDateLabel(formatLongDate());
  }, []);

  // Keep local state in sync when the store loads or is reset elsewhere.
  useEffect(() => {
    setValue(saved);
  }, [saved]);

  const commit = () => {
    if (value.trim() !== saved) setFocus(todayKey, value);
  };

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 md:p-6">
      <p className="min-h-4 text-xs font-medium uppercase tracking-wide text-muted">
        {dateLabel || " "}
      </p>
      <div className="mt-2 flex items-center gap-2">
        <span
          className="h-6 w-1.5 shrink-0 rounded-full"
          style={{ background: "var(--today)" }}
        />
        <input
          ref={inputRef}
          type="text"
          value={value}
          disabled={!hydrated}
          onChange={(e) => setValue(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              commit();
              inputRef.current?.blur();
            }
          }}
          placeholder="What's the one focus for today?"
          aria-label="Focus for today"
          className="w-full bg-transparent text-lg font-semibold tracking-tight text-foreground outline-none placeholder:font-normal placeholder:text-muted disabled:opacity-50"
        />
      </div>
    </div>
  );
}
