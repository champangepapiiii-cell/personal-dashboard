"use client";

// Watches derived achievements and celebrates newly-unlocked ones with confetti
// + an overlay. On first load it silently baselines whatever the demo data has
// already unlocked, so only genuinely new unlocks cheer.

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { fireConfetti } from "@/lib/confetti";
import { ACHIEVEMENTS, unlockedAchievements, type Achievement } from "@/lib/game";
import { useStore } from "@/lib/store-context";

export function AchievementWatcher() {
  const { data, hydrated, markAchievementsSeen } = useStore();
  const baselined = useRef(false);
  const [mounted, setMounted] = useState(false);
  const [celebrating, setCelebrating] = useState<Achievement[] | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!hydrated) return;
    const unlocked = unlockedAchievements(data);

    if (!baselined.current) {
      baselined.current = true;
      const unseen = unlocked.filter((id) => !data.seenAchievements.includes(id));
      if (unseen.length) markAchievementsSeen(unlocked);
      return;
    }

    const newly = unlocked.filter((id) => !data.seenAchievements.includes(id));
    if (newly.length) {
      setCelebrating(ACHIEVEMENTS.filter((a) => newly.includes(a.id)));
      fireConfetti();
      markAchievementsSeen(newly);
    }
  }, [data, hydrated, markAchievementsSeen]);

  useEffect(() => {
    if (!celebrating) return;
    const t = setTimeout(() => setCelebrating(null), 4500);
    return () => clearTimeout(t);
  }, [celebrating]);

  if (!mounted || !celebrating || celebrating.length === 0) return null;
  const [first, ...rest] = celebrating;

  return createPortal(
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
      onClick={() => setCelebrating(null)}
      role="presentation"
    >
      <div className="pointer-events-none w-full max-w-xs rounded-2xl border border-border bg-surface p-6 text-center shadow-2xl">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-surface-2 text-4xl">
          {first.icon}
        </div>
        <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-coach">
          Achievement unlocked
        </p>
        <p className="mt-1 text-lg font-semibold tracking-tight">{first.label}</p>
        <p className="mt-1 text-sm text-muted">{first.description}</p>
        {rest.length > 0 && (
          <p className="mt-3 text-xs text-muted">+{rest.length} more unlocked</p>
        )}
      </div>
    </div>,
    document.body,
  );
}
