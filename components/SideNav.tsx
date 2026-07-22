"use client";

// Desktop-only left sidebar. Hidden below `md`, where BottomNav takes over.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/nav";
import { NavIcon } from "./NavIcon";

function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function SideNav() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-56 md:flex-col md:shrink-0 md:border-r md:border-border md:bg-surface">
      <div className="flex h-16 items-center gap-2 px-5">
        <span className="grid h-7 w-7 place-items-center rounded-md bg-accent text-accent-fg text-sm font-bold">
          S
        </span>
        <span className="text-[15px] font-semibold tracking-tight">The System</span>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3 py-2">
        {NAV_ITEMS.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors data-[active=true]:bg-surface-2 hover:bg-surface-2"
              data-active={active}
              style={active ? { color: item.accent } : undefined}
            >
              <NavIcon path={item.icon} className="h-5 w-5" />
              <span className={active ? "" : "text-foreground/80 group-hover:text-foreground"}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
      <div className="px-5 py-4 text-xs text-muted">v1 · local-only</div>
    </aside>
  );
}
