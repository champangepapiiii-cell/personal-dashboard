"use client";

// Landing page (chrome-less — outside the (app) group). WePresent-style
// horizontal tile carousel: each tile has its own colour, an image slot that
// zooms on hover, and the tile nearest the centre is scaled up. Image slots are
// tonal placeholders until real images are uploaded.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store-context";

interface Tile {
  key: string;
  eyebrow: string;
  title: string;
  desc: string;
  frame: string; // tile background / frame colour
  ink: string; // text colour on the frame
  img: string; // /tiles/<file> — falls back to the tonal placeholder if missing
}

const TILES: Tile[] = [
  {
    key: "body",
    eyebrow: "Health & Fitness",
    title: "Move Well, Eat Well",
    desc: "Workout and cooking trackers, plus a weight trend that shows direction over daily noise.",
    frame: "#0d5c3a",
    ink: "#ffffff",
    img: "/tiles/health.jpg",
  },
  {
    key: "money",
    eyebrow: "Money & Finances",
    title: "Grow What You Keep",
    desc: "Savings goals with a hit-date, net worth over time, and an investment tracker.",
    frame: "#1a7a50",
    ink: "#ffffff",
    img: "/tiles/money.jpg",
  },
  {
    key: "life",
    eyebrow: "Habits & Routines",
    title: "Show Up Daily",
    desc: "A 30-day habit grid and streaks for the small things that move the needle.",
    frame: "#ede6d6",
    ink: "#0a1f14",
    img: "/tiles/habits.jpg",
  },
  {
    key: "create",
    eyebrow: "Creative Output",
    title: "Ship Your Ideas",
    desc: "An idea-to-published pipeline so the work leaves your head and reaches the world.",
    frame: "#b4531f",
    ink: "#ffffff",
    img: "/tiles/create.jpg",
  },
  {
    key: "coach",
    eyebrow: "Personal Growth",
    title: "Any Goal, A Real Plan",
    desc: "Confidence, better sleep, a new language — methods, techniques and habits for each.",
    frame: "#8ba898",
    ink: "#0a1f14",
    img: "/tiles/growth.jpg",
  },
  {
    key: "today",
    eyebrow: "Your Day",
    title: "Everything In One Place",
    desc: "A daily focus, live streaks and a weekly completion ring to keep momentum.",
    frame: "#0a1f14",
    ink: "#e8f5ee",
    img: "/tiles/today.jpg",
  },
];

function imageTone(frame: string) {
  return `linear-gradient(135deg, color-mix(in oklab, ${frame} 55%, #000 22%), color-mix(in oklab, ${frame} 78%, #fff 14%))`;
}

export default function LandingPage() {
  const { data, hydrated } = useStore();
  const onboarded = hydrated && data.profile.onboarded;
  const cta = onboarded ? "Enter Your Dashboard" : "Get Started";

  const rowRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // Track the tile nearest the carousel's horizontal centre → make it prominent.
  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    let raf = 0;
    const update = () => {
      const centre = row.scrollLeft + row.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      Array.from(row.querySelectorAll<HTMLElement>("[data-tile]")).forEach((el, i) => {
        const c = el.offsetLeft + el.offsetWidth / 2;
        const d = Math.abs(c - centre);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      setActive(best);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    row.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      row.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const scrollByTile = (dir: 1 | -1) => {
    const row = rowRef.current;
    if (!row) return;
    const tile = row.querySelector<HTMLElement>("[data-tile]");
    const step = tile ? tile.offsetWidth + 20 : 340;
    row.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <div className="min-h-dvh bg-background text-foreground">
      {/* Top bar */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 md:px-8">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-accent text-accent-fg text-sm font-bold">
            S
          </span>
          <span className="font-serif text-lg font-semibold tracking-tight">The System</span>
        </div>
        <Link
          href="/today"
          className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
        >
          {onboarded ? "Dashboard" : "Sign In"}
        </Link>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-5 pb-10 pt-10 md:px-8 md:pb-14 md:pt-16">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sage">The System</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
          Optimise Your Lifestyle.
          <br />
          <span className="italic text-forest">One System.</span>
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
          Money, body, habits and creative output — tracked in one place, with a coach that builds a
          real plan for any goal you set.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            href="/today"
            className="rounded-full bg-accent px-7 py-3.5 text-base font-semibold text-accent-fg shadow-sm transition-transform hover:-translate-y-0.5 hover:opacity-95"
          >
            {cta} →
          </Link>
          <span className="text-sm text-muted">No account needed · your data stays on your device.</span>
        </div>
      </section>

      {/* Tile carousel */}
      <section className="pb-16">
        <div className="mx-auto mb-6 flex max-w-6xl items-end justify-between gap-4 px-5 md:px-8">
          <h2 className="font-serif text-2xl font-semibold tracking-tight md:text-3xl">
            Ways We Help You Optimise
          </h2>
          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              onClick={() => scrollByTile(-1)}
              aria-label="Previous"
              className="grid h-9 w-9 place-items-center rounded-full border border-border text-foreground transition-colors hover:border-accent hover:text-accent"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => scrollByTile(1)}
              aria-label="Next"
              className="grid h-9 w-9 place-items-center rounded-full border border-border text-foreground transition-colors hover:border-accent hover:text-accent"
            >
              →
            </button>
          </div>
        </div>

        <div
          ref={rowRef}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-6 pt-4 [scrollbar-width:none] md:px-8 [&::-webkit-scrollbar]:hidden"
        >
          {TILES.map((t, i) => {
            const prominent = i === active;
            return (
              <Link
                key={t.key}
                href="/today"
                data-tile
                className="group relative shrink-0 snap-center transition-[transform,opacity] duration-500 ease-out w-[78vw] sm:w-[300px] md:w-[320px]"
                style={{
                  transform: prominent ? "scale(1.05) translateY(-8px)" : "scale(0.96)",
                  opacity: prominent ? 1 : 0.82,
                  zIndex: prominent ? 10 : 1,
                }}
              >
                <div
                  className="flex h-full flex-col rounded-2xl p-3 shadow-sm"
                  style={{ background: t.frame, color: t.ink }}
                >
                  {/* Image slot — real photo zooms on hover; tonal placeholder shows until uploaded */}
                  <div
                    className="aspect-[4/5] w-full overflow-hidden rounded-xl"
                    style={{ background: imageTone(t.frame) }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={t.img}
                      alt={t.title}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                  </div>
                  {/* Caption */}
                  <div className="px-1 pb-1 pt-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] opacity-70">
                      {t.eyebrow}
                    </p>
                    <h3 className="mt-1.5 font-serif text-xl font-semibold leading-tight">{t.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed opacity-80">{t.desc}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="mx-auto max-w-6xl px-5 pb-20 md:px-8">
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-border bg-surface px-6 py-14 text-center">
          <h2 className="font-serif text-3xl font-semibold tracking-tight md:text-4xl">
            Ready To Build Your System?
          </h2>
          <p className="max-w-md text-muted">
            Tell us what you want to improve and we&rsquo;ll set up a dashboard and a plan tailored to you.
          </p>
          <Link
            href="/today"
            className="mt-2 rounded-full bg-accent px-7 py-3.5 text-base font-semibold text-accent-fg shadow-sm transition-transform hover:-translate-y-0.5 hover:opacity-95"
          >
            {cta} →
          </Link>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-5 py-8 text-sm text-muted md:px-8">
        The System · A Personal Optimisation Dashboard.
      </footer>
    </div>
  );
}
