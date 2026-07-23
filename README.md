# The System

A personal life dashboard — track money, body, habits, and creative output in
one place, and let a built-in coach turn your goals into plans. Single-user, no
account, no server: **all data lives in your browser's `localStorage`**.

Open it, and it seeds ~90 days of realistic demo data so every chart is
populated before you've logged a thing.

## Sections

- **Today** — an editable daily focus, streak cards (trained, cooked, created,
  under budget), and a weekly completion ring.
- **Money** — savings progress with a projected hit-date, a 12-month net-worth
  chart, an editable investment allocation, saved-vs-target bars, and a
  recurring-outgoings table. All amounts in AED.
- **Body** — a weight chart with a shaded target band and 7-day rolling average,
  GitHub-style training and cooking heatmaps, and a weekly session counter.
- **Life** — a 30-day habit grid (tap to toggle), monthly consistency bars, and
  add / rename / archive habit management.
- **Create** — an Idea → Drafting → Editing → Published kanban, quick idea
  capture, a pieces-shipped chart, and a deliberately uncomfortable "days since
  last published" counter.
- **Coach** — a setup wizard, free-text goals the engine turns into plans,
  generated meal plans and a savings challenge, habit suggestions, insights, and
  gamification (XP, levels, achievements, confetti). Runs entirely client-side —
  no API keys, no external calls.
- **Settings** — edit every goal, manage habits, and **export / import your data
  as JSON** so you're never locked in.

## Tech stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com)
- [Recharts](https://recharts.org) for all charts
- `localStorage` for persistence, behind a single typed store module
  (`lib/store.ts`) — no database, no backend, no auth

## Prerequisites

- **Node.js 18.18+** (built and tested on Node 24) and npm.
  Check with `node -v`. If you don't have Node, grab the LTS installer from
  [nodejs.org](https://nodejs.org).

## Local development

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

Other scripts:

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint
```

## Deploy to Vercel

Zero configuration — it's a standard Next.js app with no environment variables
or backend.

1. Push this repo to GitHub / GitLab / Bitbucket.
2. Import it at [vercel.com/new](https://vercel.com/new) and accept the detected
   Next.js defaults.
3. Deploy. Every visitor gets their own private dashboard (data is stored in
   their browser, not shared).

Or from the CLI:

```bash
npm i -g vercel
vercel        # preview deploy
vercel --prod # production deploy
```

## Your data

- Everything is stored locally under the `the-system:v1` key in `localStorage`.
  Nothing is sent anywhere.
- **Settings → Your data** lets you export a JSON backup, import one, reset to
  fresh demo data, or clear everything.
- Because storage is per-browser, your data does not sync across devices — use
  export / import to move it.

## Keyboard shortcuts

- **Q** or **⌘/Ctrl + K** — open Quick add from anywhere.

## Project structure

```
app/            Routes (today, money, body, life, create, coach, settings)
components/     UI, grouped by section (money/, body/, life/, create/, coach/, settings/, ui/)
lib/            types, the store, and pure metric/generator modules
  store.ts        the only module that touches localStorage
  types.ts        the full data model
  seed.ts         demo-data generator + defaults
  metrics/money/body/create/coach/game.ts   derived values, no I/O
```

All app state flows through `lib/store.ts` and the `StoreProvider` context — no
component reads or writes `localStorage` directly.
