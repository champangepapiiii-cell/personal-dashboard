"use client";

import { useState } from "react";
import { Achievements } from "@/components/coach/Achievements";
import { GoalsCard } from "@/components/coach/GoalsCard";
import { HabitSuggestions } from "@/components/coach/HabitSuggestions";
import { Insights } from "@/components/coach/Insights";
import { LevelBar } from "@/components/coach/LevelBar";
import { MealPlanCard } from "@/components/coach/MealPlanCard";
import { OnboardingWizard } from "@/components/coach/OnboardingWizard";
import { SavingsPlanCard } from "@/components/coach/SavingsPlanCard";
import { useStore } from "@/lib/store-context";

export default function CoachPage() {
  const { data, hydrated } = useStore();
  const [setupOpen, setSetupOpen] = useState(false);
  const onboarded = hydrated && data.profile.onboarded;

  return (
    <div className="mx-auto max-w-5xl space-y-4 md:space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="h-8 w-1.5 rounded-full" style={{ background: "var(--coach)" }} />
          <div>
            <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "var(--coach)" }}>
              Coach
            </h1>
            <p className="text-sm text-muted">
              {hydrated && data.profile.name
                ? `${data.profile.name}, your personalised plan & progress.`
                : "Your personalised plan & progress."}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setSetupOpen(true)}
          className="shrink-0 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted hover:text-foreground"
        >
          {onboarded ? "Edit setup" : "Set up"}
        </button>
      </div>

      {hydrated && !onboarded && (
        <div className="rounded-2xl border border-coach/40 bg-coach/5 p-5">
          <p className="text-sm font-semibold">Make this system yours</p>
          <p className="mt-1 text-sm text-muted">
            Tell the coach your goals, diet and money style, and it&rsquo;ll generate a meal plan,
            a savings challenge and habit suggestions tailored to you.
          </p>
          <button
            type="button"
            onClick={() => setSetupOpen(true)}
            className="mt-3 rounded-lg bg-coach px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Personalise my system
          </button>
        </div>
      )}

      <LevelBar />
      <GoalsCard />
      <Achievements />
      <SavingsPlanCard />
      <MealPlanCard />

      <div className="grid gap-4 md:gap-5 lg:grid-cols-2">
        <HabitSuggestions />
        <Insights />
      </div>

      {setupOpen && <OnboardingWizard onDone={() => setSetupOpen(false)} />}
    </div>
  );
}
