"use client";

import { DaysSincePublished } from "@/components/create/DaysSincePublished";
import { KanbanBoard } from "@/components/create/KanbanBoard";
import { ShippedChart } from "@/components/create/ShippedChart";

export default function CreatePage() {
  return (
    <div className="mx-auto max-w-6xl space-y-4 md:space-y-5">
      <div className="flex items-center gap-3">
        <span className="h-8 w-1.5 rounded-full" style={{ background: "var(--create)" }} />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "var(--create)" }}>
            Create
          </h1>
          <p className="text-sm text-muted">Your content pipeline — idea to published.</p>
        </div>
      </div>

      <DaysSincePublished />
      <KanbanBoard />
      <ShippedChart />
    </div>
  );
}
