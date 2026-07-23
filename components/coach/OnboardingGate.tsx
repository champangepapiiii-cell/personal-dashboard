"use client";

// Shows the setup wizard automatically the first time someone arrives (until
// they finish or skip). Dismissing without finishing won't nag again this
// session, but an un-onboarded profile still shows the "Set up" prompt on Coach.

import { useEffect, useState } from "react";
import { useStore } from "@/lib/store-context";
import { OnboardingWizard } from "./OnboardingWizard";

export function OnboardingGate() {
  const { data, hydrated } = useStore();
  const [dismissed, setDismissed] = useState(false);

  // Reset the dismiss flag if the profile flips back to un-onboarded (reset).
  useEffect(() => {
    if (data.profile.onboarded) setDismissed(false);
  }, [data.profile.onboarded]);

  if (!hydrated || data.profile.onboarded || dismissed) return null;
  return <OnboardingWizard onDone={() => setDismissed(true)} />;
}
