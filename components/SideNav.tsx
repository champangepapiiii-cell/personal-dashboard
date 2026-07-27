"use client";

// Desktop-only left sidebar. Sections are driven by the user's choices:
// Today + enabled trackers + custom goal sections + Coach, plus "Add goal".

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNavSections } from "@/lib/useNav";
import { AddGoalModal } from "./goal/AddGoalModal";
import { NavIcon } from "./NavIcon";

function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function SideNav() {
  const pathname = usePathname();
  const sections = useNavSections();
  const [addOpen, setAddOpen] = useState(false);

  return (
    <aside className="hidden md:flex md:w-56 md:flex-col md:shrink-0 md:border-r md:border-border md:bg-surface">
      <div className="flex h-16 items-center gap-2 px-5">
        <span className="grid h-7 w-7 place-items-center rounded-md bg-accent text-accent-fg text-sm font-bold">
          S
        </span>
        <span className="text-[15px] font-semibold tracking-tight">The System</span>
      </div>
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-2">
        {sections.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.key}
              href={item.href}
              className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors data-[active=true]:bg-surface-2 hover:bg-surface-2"
              data-active={active}
              style={active ? { color: item.accent } : undefined}
            >
              {item.emoji ? (
                <span className="grid h-5 w-5 place-items-center text-base leading-none">{item.emoji}</span>
              ) : (
                <NavIcon path={item.icon ?? ""} className="h-5 w-5" />
              )}
              <span className={active ? "truncate" : "truncate text-foreground/80 group-hover:text-foreground"}>
                {item.label}
              </span>
            </Link>
          );
        })}

        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
        >
          <span className="grid h-5 w-5 place-items-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4.5 w-4.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
            </svg>
          </span>
          Add goal
        </button>
      </nav>
      <div className="px-5 py-4 text-xs text-muted">v1 · local-only</div>

      <AddGoalModal open={addOpen} onClose={() => setAddOpen(false)} />
    </aside>
  );
}
