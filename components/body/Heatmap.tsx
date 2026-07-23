"use client";

// GitHub-style contribution grid: columns are weeks (oldest→newest), rows are
// weekdays (Mon→Sun). Cells are coloured by the caller.

import { monthLabels, type HeatCell } from "@/lib/body";

const WEEKDAYS = ["Mon", "", "Wed", "", "Fri", "", ""];

export function Heatmap({ grid }: { grid: HeatCell[][] }) {
  const months = monthLabels(grid);

  return (
    <div className="w-full overflow-x-auto">
      <div className="inline-flex flex-col gap-1">
        {/* Month labels */}
        <div className="flex gap-1 pl-8">
          {months.map((m, i) => (
            <div key={i} className="w-3 text-[10px] text-muted">
              {m ?? ""}
            </div>
          ))}
        </div>

        <div className="flex gap-1">
          {/* Weekday labels */}
          <div className="flex w-7 flex-col gap-1">
            {WEEKDAYS.map((d, i) => (
              <div key={i} className="flex h-3 items-center text-[10px] leading-none text-muted">
                {d}
              </div>
            ))}
          </div>

          {/* Week columns */}
          {grid.map((col, w) => (
            <div key={w} className="flex flex-col gap-1">
              {col.map((cell) => (
                <div
                  key={cell.date}
                  title={cell.title}
                  className="h-3 w-3 rounded-[3px]"
                  style={{
                    background: cell.color ?? "var(--surface-2)",
                    opacity: cell.future ? 0 : 1,
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
