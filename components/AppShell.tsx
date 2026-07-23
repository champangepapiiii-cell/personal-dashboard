// Overall chrome: sidebar (desktop) + header + scrollable content + bottom
// tabs (mobile). Wraps every route via the root layout.

import { AchievementWatcher } from "./coach/AchievementWatcher";
import { BottomNav } from "./BottomNav";
import { Header } from "./Header";
import { OnboardingGate } from "./coach/OnboardingGate";
import { SideNav } from "./SideNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh">
      <SideNav />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main className="flex-1 px-4 pb-24 pt-5 md:px-6 md:pb-8">{children}</main>
      </div>
      <BottomNav />
      <OnboardingGate />
      <AchievementWatcher />
    </div>
  );
}
