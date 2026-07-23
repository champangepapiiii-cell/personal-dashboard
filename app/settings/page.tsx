"use client";

import { HabitManager } from "@/components/life/HabitManager";
import { DataControls } from "@/components/settings/DataControls";
import { GoalsForm } from "@/components/settings/GoalsForm";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-4 md:space-y-5">
      <div className="flex items-center gap-3">
        <span className="h-8 w-1.5 rounded-full bg-foreground/60" />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
          <p className="text-sm text-muted">Goals, habits, and your data.</p>
        </div>
      </div>

      <GoalsForm />
      <HabitManager />
      <DataControls />
    </div>
  );
}
