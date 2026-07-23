"use client";

// Own your data: export to JSON, import from JSON, reset to demo, or wipe
// everything. Destructive actions require a second confirming click.

import { useRef, useState } from "react";
import { Card } from "@/components/Card";
import { dayKey } from "@/lib/dates";
import { useStore } from "@/lib/store-context";

type Status = { type: "ok" | "err"; msg: string } | null;

export function DataControls() {
  const { data, hydrated, importData, resetToDemo, clearAll } = useStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<Status>(null);
  const [confirm, setConfirm] = useState<"reset" | "clear" | null>(null);

  const flash = (s: Status) => {
    setStatus(s);
    if (s) setTimeout(() => setStatus(null), 3000);
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `the-system-backup-${dayKey()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    flash({ type: "ok", msg: "Exported a JSON backup." });
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      const ok = importData(parsed);
      flash(
        ok
          ? { type: "ok", msg: "Imported. Your data has been replaced." }
          : { type: "err", msg: "That file doesn't look like a valid backup." },
      );
    } catch {
      flash({ type: "err", msg: "Couldn't read that file as JSON." });
    }
  };

  const doReset = () => {
    resetToDemo();
    setConfirm(null);
    flash({ type: "ok", msg: "Reset to a fresh demo dataset." });
  };
  const doClear = () => {
    clearAll();
    setConfirm(null);
    flash({ type: "ok", msg: "Everything cleared." });
  };

  return (
    <Card title="Your data" subtitle="Local to this device — export anytime, no lock-in">
      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        onChange={onFile}
        className="hidden"
      />

      <div className="grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={exportData}
          disabled={!hydrated}
          className="rounded-lg border border-border px-4 py-2.5 text-sm font-semibold hover:border-accent disabled:opacity-40"
        >
          ↓ Export as JSON
        </button>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={!hydrated}
          className="rounded-lg border border-border px-4 py-2.5 text-sm font-semibold hover:border-accent disabled:opacity-40"
        >
          ↑ Import from JSON
        </button>
      </div>

      <div className="mt-3 border-t border-border pt-3">
        <div className="grid gap-2 sm:grid-cols-2">
          {/* Reset to demo */}
          {confirm === "reset" ? (
            <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 py-1.5">
              <span className="text-sm text-muted">Replace with demo?</span>
              <button type="button" onClick={doReset} className="ml-auto rounded-md bg-accent px-2.5 py-1 text-xs font-semibold text-accent-fg">
                Yes
              </button>
              <button type="button" onClick={() => setConfirm(null)} className="rounded-md px-2 py-1 text-xs text-muted hover:text-foreground">
                No
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirm("reset")}
              disabled={!hydrated}
              className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-muted hover:text-foreground disabled:opacity-40"
            >
              Reset to demo data
            </button>
          )}

          {/* Clear everything */}
          {confirm === "clear" ? (
            <div className="flex items-center gap-2 rounded-lg border border-negative/50 bg-negative/5 px-3 py-1.5">
              <span className="text-sm text-negative">Wipe everything?</span>
              <button type="button" onClick={doClear} className="ml-auto rounded-md bg-negative px-2.5 py-1 text-xs font-semibold text-white">
                Yes
              </button>
              <button type="button" onClick={() => setConfirm(null)} className="rounded-md px-2 py-1 text-xs text-muted hover:text-foreground">
                No
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirm("clear")}
              disabled={!hydrated}
              className="rounded-lg border border-negative/40 px-4 py-2.5 text-sm font-medium text-negative hover:bg-negative/5 disabled:opacity-40"
            >
              Clear everything
            </button>
          )}
        </div>
      </div>

      {status && (
        <p className={"mt-3 text-sm " + (status.type === "ok" ? "text-positive" : "text-negative")}>
          {status.msg}
        </p>
      )}
    </Card>
  );
}
