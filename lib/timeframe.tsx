"use client";

// Global timeframe selection (Week / Month / Quarter / Year), shared by the
// header toggle and every data view. React context only — no state library.

import { createContext, useContext, useMemo, useState } from "react";

export const TIMEFRAMES = ["Week", "Month", "Quarter", "Year"] as const;
export type Timeframe = (typeof TIMEFRAMES)[number];

/** Number of days each timeframe spans — used by views to window their data. */
export const TIMEFRAME_DAYS: Record<Timeframe, number> = {
  Week: 7,
  Month: 30,
  Quarter: 90,
  Year: 365,
};

interface TimeframeContextValue {
  timeframe: Timeframe;
  setTimeframe: (t: Timeframe) => void;
  days: number;
}

const TimeframeContext = createContext<TimeframeContextValue | null>(null);

export function TimeframeProvider({ children }: { children: React.ReactNode }) {
  const [timeframe, setTimeframe] = useState<Timeframe>("Month");

  const value = useMemo<TimeframeContextValue>(
    () => ({ timeframe, setTimeframe, days: TIMEFRAME_DAYS[timeframe] }),
    [timeframe],
  );

  return <TimeframeContext.Provider value={value}>{children}</TimeframeContext.Provider>;
}

export function useTimeframe(): TimeframeContextValue {
  const ctx = useContext(TimeframeContext);
  if (!ctx) throw new Error("useTimeframe must be used within a TimeframeProvider");
  return ctx;
}
