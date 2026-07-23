"use client";

// The generated weekly meal plan: tick meals off, see calories vs target, and
// reshuffle. Everything runs client-side from the recipe library.

import { Card } from "@/components/Card";
import { generateMealPlan, mealPlanCalories } from "@/lib/coach";
import { recipeById } from "@/lib/recipes";
import { useStore } from "@/lib/store-context";
import type { MealSlot } from "@/lib/types";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const SLOTS: MealSlot[] = ["Breakfast", "Lunch", "Dinner"];

export function MealPlanCard() {
  const { data, hydrated, setMealPlan } = useStore();
  const plan = data.mealPlan;

  if (!hydrated) return <Card title="Meal plan"><div className="h-24" /></Card>;

  if (!plan) {
    return (
      <Card title="Meal plan" subtitle="Tailored to your diet and calories">
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <p className="text-sm text-muted">No meal plan yet.</p>
          <button
            type="button"
            onClick={() => setMealPlan(generateMealPlan(data.profile))}
            className="rounded-lg bg-coach px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Generate meal plan
          </button>
        </div>
      </Card>
    );
  }

  const done = plan.meals.filter((m) => m.done).length;
  const avg = mealPlanCalories(plan);

  const toggle = (day: string, slot: MealSlot) => {
    setMealPlan({
      ...plan,
      meals: plan.meals.map((m) =>
        m.day === day && m.slot === slot ? { ...m, done: !m.done } : m,
      ),
    });
  };

  const regenerate = () => setMealPlan(generateMealPlan(data.profile, Date.now()));

  return (
    <Card
      title="Meal plan"
      subtitle={`${cap(plan.dietType)} · ~${avg} kcal/day (target ${plan.calorieTarget})`}
      right={
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted tabular-nums">{done}/{plan.meals.length} eaten</span>
          <button
            type="button"
            onClick={regenerate}
            className="rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-muted hover:text-foreground"
          >
            ↻ Shuffle
          </button>
        </div>
      }
    >
      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
        {DAYS.map((day) => (
          <div key={day} className="rounded-xl border border-border p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">{day}</p>
            <div className="grid gap-1.5 lg:grid-cols-3">
              {SLOTS.map((slot) => {
                const meal = plan.meals.find((m) => m.day === day && m.slot === slot);
                const recipe = meal ? recipeById(meal.recipeId) : undefined;
                if (!meal || !recipe) return null;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => toggle(day, slot)}
                    className={
                      "flex items-start gap-2 rounded-lg border p-2 text-left transition-colors " +
                      (meal.done ? "border-coach/40 bg-coach/5" : "border-border hover:border-coach/40")
                    }
                  >
                    <span
                      className={
                        "mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border text-[10px] " +
                        (meal.done ? "border-transparent bg-coach text-white" : "border-muted text-transparent")
                      }
                    >
                      ✓
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[10px] uppercase tracking-wide text-muted">{slot}</span>
                      <span className={"block text-sm leading-tight " + (meal.done ? "line-through opacity-60" : "")}>
                        {recipe.name}
                      </span>
                      <span className="text-[11px] text-muted">{recipe.calories} kcal · {recipe.minutes}m</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
