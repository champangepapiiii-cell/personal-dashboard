// Layout for the signed-in app: wraps every dashboard route in the shell
// (sidebar, header, bottom nav). The landing page at "/" lives outside this
// group, so it renders without app chrome.

import { AppShell } from "@/components/AppShell";

export default function AppGroupLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
