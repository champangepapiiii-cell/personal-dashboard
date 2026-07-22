"use client";

import { PageStub } from "@/components/PageStub";
import { useStore } from "@/lib/store-context";
import { useTimeframe } from "@/lib/timeframe";
import { withinDays } from "@/lib/dates";

export default function MoneyPage() {
  const { data } = useStore();
  const { days } = useTimeframe();

  const inRange = data.money.filter((m) => withinDays(m.date, days));
  const sum = (type: string) =>
    inRange.filter((m) => m.type === type).reduce((s, m) => s + m.amount, 0);

  const fmt = (n: number) => Math.round(n).toLocaleString();

  return (
    <PageStub
      title="Money"
      accent="var(--money)"
      description="Saved, spent, invested — in AED."
      stats={[
        { label: "Saved", value: fmt(sum("saved")) },
        { label: "Spent", value: fmt(sum("spent")) },
        { label: "Invested", value: fmt(sum("invested")) },
        { label: "Transactions", value: inRange.length },
      ]}
    />
  );
}
