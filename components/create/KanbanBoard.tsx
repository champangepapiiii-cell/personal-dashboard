"use client";

// Idea → Drafting → Editing → Published. Move cards by dropdown (works
// everywhere, incl. mobile) or by dragging on desktop. Quick-add drops a new
// idea straight into the first column.

import { useRef, useState } from "react";
import { dayKey } from "@/lib/dates";
import { STATUS_LABEL, STATUSES } from "@/lib/create";
import { newId } from "@/lib/id";
import { useStore } from "@/lib/store-context";
import type { ContentFormat, ContentStatus } from "@/lib/types";
import { ContentCard } from "./ContentCard";

const FORMATS: ContentFormat[] = ["blog", "video", "newsletter", "social"];

export function KanbanBoard() {
  const { data, hydrated, addEntry, setEntries } = useStore();
  const draggedId = useRef<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<ContentStatus | null>(null);

  const [title, setTitle] = useState("");
  const [format, setFormat] = useState<ContentFormat>("blog");

  const updateStatus = (id: string, status: ContentStatus) => {
    setEntries(
      "content",
      data.content.map((c) => {
        if (c.id !== id) return c;
        const next = { ...c, status };
        // Stamp a publish date on the way in; drop it on the way out.
        if (status === "published") next.publishedAt = c.publishedAt ?? dayKey();
        else next.publishedAt = undefined;
        return next;
      }),
    );
  };

  const addIdea = () => {
    const t = title.trim();
    if (!t) return;
    addEntry("content", {
      id: newId("c"),
      title: t,
      format,
      status: "idea",
      createdAt: dayKey(),
    });
    setTitle("");
  };

  return (
    <div>
      {/* Quick-add idea */}
      <div className="mb-4 flex flex-col gap-2 rounded-2xl border border-border bg-surface p-3 sm:flex-row sm:items-center">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addIdea();
            }
          }}
          disabled={!hydrated}
          placeholder="Capture an idea…"
          className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none placeholder:text-muted focus:border-create"
        />
        <div className="flex gap-2">
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as ContentFormat)}
            className="rounded-lg border border-border bg-surface-2 px-2 py-2 text-sm capitalize outline-none focus:border-create"
          >
            {FORMATS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={addIdea}
            disabled={!hydrated || !title.trim()}
            className="shrink-0 rounded-lg px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-40"
            style={{ background: "var(--create)" }}
          >
            Add idea
          </button>
        </div>
      </div>

      {/* Columns */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {STATUSES.map((status) => {
          const items = hydrated ? data.content.filter((c) => c.status === status) : [];
          const isOver = dragOver === status;
          return (
            <div
              key={status}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(status);
              }}
              onDragLeave={(e) => {
                if (e.currentTarget === e.target) setDragOver(null);
              }}
              onDrop={(e) => {
                e.preventDefault();
                if (draggedId.current) updateStatus(draggedId.current, status);
                draggedId.current = null;
                setDraggingId(null);
                setDragOver(null);
              }}
              className={
                "flex flex-col rounded-2xl border p-3 transition-colors " +
                (isOver ? "border-create bg-create/5" : "border-border bg-surface-2/40")
              }
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold tracking-tight">{STATUS_LABEL[status]}</h3>
                <span className="rounded-full bg-surface px-2 py-0.5 text-xs tabular-nums text-muted">
                  {items.length}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {items.map((item) => (
                  <ContentCard
                    key={item.id}
                    item={item}
                    onStatusChange={updateStatus}
                    onDragStart={(id) => {
                      draggedId.current = id;
                      setDraggingId(id);
                    }}
                    onDragEnd={() => {
                      draggedId.current = null;
                      setDraggingId(null);
                      setDragOver(null);
                    }}
                    dragging={draggingId === item.id}
                  />
                ))}
                {hydrated && items.length === 0 && (
                  <p className="rounded-lg border border-dashed border-border py-6 text-center text-xs text-muted">
                    {status === "idea" ? "Add an idea above" : "Drop cards here"}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
