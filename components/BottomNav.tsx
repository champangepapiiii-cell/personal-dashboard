"use client";

// Mobile-only bottom tab bar. Mirrors the sidebar's dynamic sections and scrolls
// horizontally when there are many, so it never cramps. Hidden at `md`+.

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNavSections } from "@/lib/useNav";
import { AddGoalModal } from "./goal/AddGoalModal";
import { NavIcon } from "./NavIcon";

function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function BottomNav() {
  const pathname = usePathname();
  const sections = useNavSections();
  const [addOpen, setAddOpen] = useState(false);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex h-16 items-stretch overflow-x-auto border-t border-border bg-surface/95 backdrop-blur md:hidden">
      {sections.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.key}
            href={item.href}
            className="flex w-[4.5rem] shrink-0 flex-col items-center justify-center gap-1 text-[11px] font-medium"
            style={{ color: active ? item.accent : "var(--muted)" }}
          >
            {item.emoji ? (
              <span className="text-base leading-none">{item.emoji}</span>
            ) : (
              <NavIcon path={item.icon ?? ""} className="h-5 w-5" />
            )}
            <span className="max-w-full truncate px-1">{item.label}</span>
          </Link>
        );
      })}
      <button
        type="button"
        onClick={() => setAddOpen(true)}
        className="flex w-[4.5rem] shrink-0 flex-col items-center justify-center gap-1 text-[11px] font-medium text-muted"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
        </svg>
        Add
      </button>

      <AddGoalModal open={addOpen} onClose={() => setAddOpen(false)} />
    </nav>
  );
}
