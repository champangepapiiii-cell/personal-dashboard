"use client";

import { AllocationDonut } from "@/components/money/AllocationDonut";
import { NetWorthChart } from "@/components/money/NetWorthChart";
import { RecurringTable } from "@/components/money/RecurringTable";
import { SavedVsTarget } from "@/components/money/SavedVsTarget";
import { SavingsProgress } from "@/components/money/SavingsProgress";

export default function MoneyPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-4 md:space-y-5">
      <div className="flex items-center gap-3">
        <span className="h-8 w-1.5 rounded-full" style={{ background: "var(--money)" }} />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "var(--money)" }}>
            Money
          </h1>
          <p className="text-sm text-muted">Savings, net worth, investments and outgoings — in AED.</p>
        </div>
      </div>

      <SavingsProgress />
      <NetWorthChart />

      <div className="grid gap-4 md:gap-5 lg:grid-cols-2">
        <AllocationDonut />
        <SavedVsTarget />
      </div>

      <RecurringTable />
    </div>
  );
}
