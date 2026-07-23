"use client";

import { MONTH_ABBR } from "@/lib/dates";
import { STATUS_LABEL, STATUSES } from "@/lib/create";
import type { ContentFormat, ContentItem, ContentStatus } from "@/lib/types";

export const FORMAT_COLOR: Record<ContentFormat, string> = {
  blog: "#2563eb",
  video: "#dc2626",
  newsletter: "#0891b2",
  social: "#7c3aed",
};

function shortDate(iso?: string): string {
  if (!iso) return "";
  const [, m, d] = iso.split("-");
  return `${Number(d)} ${MONTH_ABBR[Number(m) - 1]}`;
}

export function ContentCard({
  item,
  onStatusChange,
  onDragStart,
  onDragEnd,
  dragging,
}: {
  item: ContentItem;
  onStatusChange: (id: string, status: ContentStatus) => void;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  dragging: boolean;
}) {
  const date = item.status === "published" ? item.publishedAt : item.createdAt;

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        onDragStart(item.id);
      }}
      onDragEnd={onDragEnd}
      className={
        "rounded-xl border border-border bg-surface p-3 shadow-sm transition-opacity md:cursor-grab md:active:cursor-grabbing " +
        (dragging ? "opacity-40" : "")
      }
    >
      <div className="flex items-center gap-2">
        <span
          className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white"
          style={{ background: FORMAT_COLOR[item.format] }}
        >
          {item.format}
        </span>
        <span className="ml-auto text-xs text-muted">{shortDate(date)}</span>
      </div>
      <p className="mt-2 text-sm font-medium leading-snug">{item.title}</p>

      <label className="mt-3 flex items-center gap-2">
        <span className="sr-only">Status</span>
        <select
          value={item.status}
          onChange={(e) => onStatusChange(item.id, e.target.value as ContentStatus)}
          className="w-full rounded-lg border border-border bg-surface-2 px-2 py-1.5 text-xs font-medium text-foreground outline-none focus:border-create"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABEL[s]}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
