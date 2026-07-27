// Built-in "playbook" engine: turns a free-text goal (e.g. "Confidence") into a
// structured plan — methods, techniques, things to read/watch, and habits.
// Keyword-matched against a curated library, with a solid generic fallback.
// No network, no LLM. Structured so a real-AI generator can drop in later.

export type ResourceKind = "read" | "watch" | "listen" | "app" | "tool";

export interface PlaybookResource {
  label: string;
  url: string;
  kind: ResourceKind;
}

export interface PlaybookTechnique {
  name: string;
  how: string;
}

export interface Playbook {
  icon: string;
  accent: string;
  summary: string;
  methods: string[];
  techniques: PlaybookTechnique[];
  resources: PlaybookResource[];
  habits: string[];
}

const search = (q: string) => `https://www.google.com/search?q=${encodeURIComponent(q)}`;
const watch = (q: string) => `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;

interface Theme {
  keys: string[];
  playbook: Playbook;
}

const THEMES: Theme[] = [
  {
    keys: ["confidence", "confident", "self esteem", "self-esteem", "self worth", "believe in myself", "insecure"],
    playbook: {
      icon: "🦁",
      accent: "#8b5cf6",
      summary: "Confidence is built by doing hard things in small doses and collecting evidence you can rely on yourself.",
      methods: [
        "Keep a daily 'wins log' — write 3 things you did well, however small.",
        "Do one slightly-uncomfortable thing a day (speak up, ask, go first).",
        "Fix your inputs: posture, sleep, and 20 minutes of movement lift baseline self-belief.",
        "Prepare, then trust it — over-preparing for key moments quiets the inner critic.",
        "Reframe nerves as excitement; the body signal is nearly identical.",
      ],
      techniques: [
        { name: "Power posture reset", how: "Before a hard moment, stand tall, shoulders back, breathe slow for 60 seconds." },
        { name: "Box breathing", how: "In 4, hold 4, out 4, hold 4 — repeat 4 rounds to steady nerves." },
        { name: "The 5-second rule", how: "Count 5-4-3-2-1 and move before hesitation talks you out of it." },
      ],
      resources: [
        { label: "The Confidence Gap — reframing self-doubt", url: search("The Confidence Gap Russ Harris summary"), kind: "read" },
        { label: "Amy Cuddy: body language shapes who you are (TED)", url: watch("Amy Cuddy body language TED"), kind: "watch" },
      ],
      habits: ["Daily wins log", "One brave thing", "10-min morning movement"],
    },
  },
  {
    keys: ["anxiety", "anxious", "stress", "stressed", "overwhelm", "worry", "panic", "calm", "mental health"],
    playbook: {
      icon: "🌿",
      accent: "#14b8a6",
      summary: "Lower the baseline first (breath, sleep, movement), then handle worries on paper instead of in your head.",
      methods: [
        "Do a daily 10-minute 'worry dump' — write every worry, then mark what's actually in your control.",
        "Move your body daily; even a brisk walk drops cortisol.",
        "Cut the amplifiers: caffeine after 2pm, doomscrolling, and news before bed.",
        "Name the feeling ('this is anxiety') — labelling reduces its intensity.",
        "Protect sleep — most anxiety spikes trace back to poor rest.",
      ],
      techniques: [
        { name: "Physiological sigh", how: "Two quick inhales through the nose, one long exhale through the mouth. Repeat 3x." },
        { name: "5-4-3-2-1 grounding", how: "Name 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste." },
        { name: "Box breathing", how: "In 4, hold 4, out 4, hold 4 — 4 rounds." },
      ],
      resources: [
        { label: "NHS: breathing & self-help for anxiety", url: "https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/breathing-exercises-for-stress/", kind: "read" },
        { label: "How to breathe to calm your nervous system", url: watch("physiological sigh Huberman"), kind: "watch" },
      ],
      habits: ["10-min worry dump", "Daily walk", "No caffeine after 2pm"],
    },
  },
  {
    keys: ["sleep", "insomnia", "rest", "tired", "wake up early", "sleep better"],
    playbook: {
      icon: "😴",
      accent: "#6366f1",
      summary: "Sleep improves when light, timing, and wind-down are consistent — the routine matters more than any single night.",
      methods: [
        "Same wake time every day, weekends included — it anchors your whole rhythm.",
        "Get daylight within 30 minutes of waking; dim the lights 90 minutes before bed.",
        "No screens in bed; charge the phone in another room.",
        "Keep the room cool and dark; a slight temperature drop triggers sleepiness.",
        "No caffeine after early afternoon; no big meals late.",
      ],
      techniques: [
        { name: "4-7-8 breathing", how: "In through the nose 4, hold 7, out through the mouth 8. Repeat 4x in bed." },
        { name: "Wind-down hour", how: "Last hour before bed: lights low, no screens, something calm (read, stretch, journal)." },
      ],
      resources: [
        { label: "Sleep Foundation: healthy sleep habits", url: "https://www.sleepfoundation.org/sleep-hygiene", kind: "read" },
        { label: "Matthew Walker: sleep is your superpower (TED)", url: watch("Matthew Walker sleep TED"), kind: "watch" },
      ],
      habits: ["Lights out by 11", "Daylight within 30 min", "No screens in bed"],
    },
  },
  {
    keys: ["focus", "productivity", "procrastinate", "procrastination", "discipline", "distracted", "deep work", "concentration", "time management"],
    playbook: {
      icon: "🎯",
      accent: "#3b82f6",
      summary: "Focus is a system, not willpower — remove friction, work in blocks, and make distraction harder than the task.",
      methods: [
        "Pick one 'most important task' each morning and do it first, before email.",
        "Work in 25–50 minute blocks with short breaks (Pomodoro).",
        "Put the phone in another room while you work — out of sight, out of mind.",
        "Batch shallow work (messages, admin) into set windows.",
        "Define 'done' before you start so you know when to stop.",
      ],
      techniques: [
        { name: "Pomodoro", how: "25 minutes focused, 5 minutes off. After 4 rounds, take 20." },
        { name: "2-minute start", how: "Commit to just 2 minutes on the task — starting is the hard part." },
      ],
      resources: [
        { label: "Deep Work — key ideas (Cal Newport)", url: search("Deep Work Cal Newport summary"), kind: "read" },
        { label: "How to beat procrastination", url: watch("how to stop procrastinating science"), kind: "watch" },
      ],
      habits: ["Set a daily focus", "One deep-work block", "Phone in another room"],
    },
  },
  {
    keys: ["fitness", "fit", "gym", "muscle", "strength", "strong", "workout", "exercise", "lift", "toned"],
    playbook: {
      icon: "💪",
      accent: "#ef4444",
      summary: "Consistency beats intensity — train a few times a week, progress gradually, and let recovery do the building.",
      methods: [
        "Train 3–4 times a week with a simple plan you'll actually follow.",
        "Progressive overload: add a little weight or a rep each week.",
        "Prioritise compound lifts (squat, hinge, push, pull).",
        "Hit protein daily (~1.6g per kg bodyweight) and sleep 7–8 hours.",
        "Track sessions so you can see progress and stay honest.",
      ],
      techniques: [
        { name: "Two-set minimum", how: "On low-energy days, commit to just two sets — often you'll keep going." },
        { name: "Deload week", how: "Every 6–8 weeks, cut volume ~40% to recover and come back stronger." },
      ],
      resources: [
        { label: "Beginner strength routines", url: search("beginner full body strength routine"), kind: "read" },
        { label: "Progressive overload explained", url: watch("progressive overload explained"), kind: "watch" },
      ],
      habits: ["Hit protein target", "3 sessions / week", "10k steps"],
    },
  },
  {
    keys: ["lose weight", "weight loss", "fat loss", "slim", "leaner", "lean"],
    playbook: {
      icon: "⚖️",
      accent: "#f43f5e",
      summary: "Fat loss is a small, sustainable calorie deficit plus protein and steps — patience and consistency over crash diets.",
      methods: [
        "Aim for a modest deficit (~300–500 kcal); slow loss sticks.",
        "Anchor meals around protein and vegetables to stay full.",
        "Walk daily — steps are the most sustainable calorie burn.",
        "Cook at home more; you control portions and ingredients.",
        "Weigh in a few times a week and watch the 7-day trend, not the daily number.",
      ],
      techniques: [
        { name: "Plate method", how: "Half veg, a quarter protein, a quarter carbs — no counting needed." },
        { name: "Hunger pause", how: "Before seconds, wait 10 minutes and drink water; often the craving passes." },
      ],
      resources: [
        { label: "Sustainable fat loss basics", url: search("sustainable fat loss calorie deficit protein"), kind: "read" },
        { label: "Why slow weight loss wins", url: watch("why slow weight loss is better"), kind: "watch" },
      ],
      habits: ["Hit protein target", "10k steps", "Cook at home"],
    },
  },
  {
    keys: ["run", "running", "marathon", "5k", "10k", "cardio", "jog"],
    playbook: {
      icon: "🏃",
      accent: "#f97316",
      summary: "Build the distance gradually and keep most runs easy — the slow miles are what make the fast ones possible.",
      methods: [
        "Follow a couch-to-goal plan; increase weekly distance by ~10% max.",
        "Keep 80% of runs easy (conversational pace); add one faster session.",
        "One long run a week builds endurance — go slow and steady.",
        "Warm up, cool down, and don't skip rest days.",
        "Log every run so the training heatmap fills in and you stay accountable.",
      ],
      techniques: [
        { name: "Run-walk method", how: "Alternate running and walking intervals to build distance without burning out." },
        { name: "Talk test", how: "If you can't speak a full sentence, slow down — most miles should be easy." },
      ],
      resources: [
        { label: "Couch to 5K plan (NHS)", url: "https://www.nhs.uk/live-well/exercise/running-and-aerobic-exercises/get-running-with-couch-to-5k/", kind: "read" },
        { label: "How to build running endurance", url: watch("how to build running endurance beginner"), kind: "watch" },
      ],
      habits: ["3 runs / week", "One long run", "Stretch after running"],
    },
  },
  {
    keys: ["read", "reading", "learn", "learning", "study", "course", "skill", "book", "knowledge", "smarter"],
    playbook: {
      icon: "📚",
      accent: "#f59e0b",
      summary: "Learning compounds through small daily doses and active recall — a little every day beats occasional cramming.",
      methods: [
        "Commit to a small daily dose (20 minutes) at a fixed time.",
        "Use active recall: after reading, close the book and write what you remember.",
        "Space your reviews — revisit notes after a day, a week, a month.",
        "Teach it to someone (or write it up) to expose gaps.",
        "Keep a running notes doc so knowledge accumulates.",
      ],
      techniques: [
        { name: "Feynman technique", how: "Explain the idea in plain language as if to a child; simplify until it clicks." },
        { name: "Spaced repetition", how: "Review at increasing intervals (1 day, 3 days, 1 week) to lock it in." },
      ],
      resources: [
        { label: "How to learn faster (evidence-based)", url: search("evidence based learning techniques active recall"), kind: "read" },
        { label: "The Feynman technique explained", url: watch("Feynman technique explained"), kind: "watch" },
      ],
      habits: ["Read 20 min", "Daily notes review", "Weekly recap"],
    },
  },
  {
    keys: ["language", "spanish", "french", "german", "arabic", "japanese", "fluent", "bilingual", "speak a language"],
    playbook: {
      icon: "🗣️",
      accent: "#06b6d4",
      summary: "Language sticks through daily input and speaking early — small reps every day beat long occasional sessions.",
      methods: [
        "Study 15–20 minutes daily with an app; consistency is everything.",
        "Learn the 1,000 most common words first — they cover most conversation.",
        "Speak from day one, even badly — output cements input.",
        "Immerse passively: music, shows, and podcasts in the language.",
        "Find a conversation partner or tutor weekly.",
      ],
      techniques: [
        { name: "Comprehensible input", how: "Consume content just above your level; you learn from context you mostly understand." },
        { name: "Shadowing", how: "Play a sentence, pause, and repeat it out loud mimicking the accent." },
      ],
      resources: [
        { label: "How to learn a language fast", url: search("how to learn a language fast comprehensible input"), kind: "read" },
        { label: "Language learning tips", url: watch("how to learn any language tips"), kind: "watch" },
      ],
      habits: ["15 min language app", "One spoken conversation / week", "Listen while commuting"],
    },
  },
  {
    keys: ["public speaking", "presentation", "present", "speech", "stage", "pitch", "speak in public"],
    playbook: {
      icon: "🎤",
      accent: "#ec4899",
      summary: "Great speaking is preparation plus reps — structure your message, rehearse out loud, and seek low-stakes stages.",
      methods: [
        "Open with a hook, make one clear point, close with a call to action.",
        "Rehearse out loud (not in your head) at least 3 times.",
        "Record yourself once and watch it back — it's uncomfortable and effective.",
        "Slow down and use pauses; silence reads as confidence.",
        "Seek small stages often (meetings, toasts) to build the reps.",
      ],
      techniques: [
        { name: "Power pause", how: "Pause 2 seconds before and after key points; it commands attention." },
        { name: "Breathe before you speak", how: "One slow exhale before starting steadies your voice." },
      ],
      resources: [
        { label: "Talk like TED — key ideas", url: search("Talk Like TED summary public speaking"), kind: "read" },
        { label: "How to speak so people listen", url: watch("how to speak so people want to listen TED"), kind: "watch" },
      ],
      habits: ["Rehearse out loud", "Speak up once / day", "Record & review monthly"],
    },
  },
  {
    keys: ["meditate", "meditation", "mindful", "mindfulness", "presence", "peace", "spiritual"],
    playbook: {
      icon: "🧘",
      accent: "#10b981",
      summary: "Mindfulness is a daily rep — short and consistent beats long and rare. Return to the breath, again and again.",
      methods: [
        "Start with 5 minutes daily at a fixed time; grow slowly.",
        "Anchor on the breath; when the mind wanders, gently return — that's the rep.",
        "Try a guided app while you build the habit.",
        "Add a mindful pause to a daily cue (before meals, at red lights).",
        "Don't chase a 'blank mind' — noticing you drifted is the practice working.",
      ],
      techniques: [
        { name: "Breath counting", how: "Count each exhale up to 10, then restart. Lost count? Start again, no judgement." },
        { name: "Body scan", how: "Move attention slowly from head to toe, noticing sensation without changing it." },
      ],
      resources: [
        { label: "Getting started with mindfulness", url: "https://www.mindful.org/meditation/mindfulness-getting-started/", kind: "read" },
        { label: "10-minute guided meditation", url: watch("10 minute guided meditation for beginners"), kind: "watch" },
      ],
      habits: ["Meditate", "Mindful pause before meals", "Phone-free first hour"],
    },
  },
  {
    keys: ["relationship", "relationships", "social", "friends", "family", "connection", "dating", "lonely", "network"],
    playbook: {
      icon: "🤝",
      accent: "#a855f7",
      summary: "Relationships grow through consistent, intentional contact — small, regular gestures compound into closeness.",
      methods: [
        "Schedule recurring time with people who matter and protect it.",
        "Reach out first — a short check-in message goes a long way.",
        "Be fully present: phone away, listen more than you talk.",
        "Do small acts of thoughtfulness (remember details, follow up).",
        "Say yes to more low-key invitations; proximity builds bonds.",
      ],
      techniques: [
        { name: "Active listening", how: "Reflect back what you heard before responding — people feel understood." },
        { name: "The 5:1 ratio", how: "Aim for five positive interactions for every difficult one." },
      ],
      resources: [
        { label: "What makes a good life (Harvard study, TED)", url: watch("what makes a good life Harvard study TED"), kind: "watch" },
        { label: "How to make and keep friends as an adult", url: search("how to make friends as an adult"), kind: "read" },
      ],
      habits: ["Weekly quality time", "Reach out to one person / day", "Phone-away dinners"],
    },
  },
  {
    keys: ["write", "writing", "create", "creative", "creativity", "art", "music", "content", "make things", "side project"],
    playbook: {
      icon: "🎨",
      accent: "#d97706",
      summary: "Creativity is a volume game — make a lot, ship regularly, and let quality emerge from quantity.",
      methods: [
        "Create daily, even for 20 minutes — protect the streak over perfection.",
        "Separate making from editing; get it out first, polish later.",
        "Ship on a steady cadence; feedback beats endless tinkering.",
        "Keep a swipe file of things that inspire you.",
        "Study one creator you admire and reverse-engineer their work.",
      ],
      techniques: [
        { name: "Morning pages", how: "Write 3 pages stream-of-consciousness first thing to clear the runway." },
        { name: "Ship-it deadline", how: "Set a public deadline; constraints force finishing." },
      ],
      resources: [
        { label: "The War of Art — beating resistance", url: search("The War of Art Steven Pressfield summary"), kind: "read" },
        { label: "Ira Glass on the creative gap", url: watch("Ira Glass the gap creative work"), kind: "watch" },
      ],
      habits: ["Create for 30 min", "Ship weekly", "Collect inspiration"],
    },
  },
  {
    keys: ["career", "job", "promotion", "work", "professional", "leadership", "business", "startup", "entrepreneur"],
    playbook: {
      icon: "🚀",
      accent: "#2563eb",
      summary: "Career growth comes from doing visible high-value work and building relationships — results plus reputation.",
      methods: [
        "Identify the few outcomes your role is truly measured on and over-deliver there.",
        "Keep a 'brag doc' of wins for reviews and updates.",
        "Build relationships before you need them — help people, stay in touch.",
        "Ask for feedback quarterly and act on one thing.",
        "Learn a skill that compounds your value; block weekly time for it.",
      ],
      techniques: [
        { name: "Weekly review", how: "Every Friday, note wins, lessons, and next week's top 3 priorities." },
        { name: "The 1-on-1 ask", how: "In reviews, ask: 'What would it take to get to the next level?'" },
      ],
      resources: [
        { label: "So Good They Can't Ignore You — key ideas", url: search("So Good They Can't Ignore You summary"), kind: "read" },
        { label: "How to grow your career", url: watch("how to accelerate your career growth"), kind: "watch" },
      ],
      habits: ["Weekly review", "Update brag doc", "One skill block / week"],
    },
  },
  {
    keys: ["quit", "stop", "screen time", "phone addiction", "smoking", "vaping", "drinking", "porn", "sugar", "bad habit", "addiction"],
    playbook: {
      icon: "🚫",
      accent: "#dc2626",
      summary: "Breaking a habit is about friction and replacement — make it hard to do, easy to avoid, and swap in something better.",
      methods: [
        "Identify the trigger (time, place, feeling) that starts the habit.",
        "Add friction: delete apps, remove the cue, make it inconvenient.",
        "Replace, don't just remove — swap in a better action for the same trigger.",
        "Tell someone and track your streak; accountability multiplies success.",
        "Plan for slips — one lapse isn't failure; get back on the next rep.",
      ],
      techniques: [
        { name: "Urge surfing", how: "When a craving hits, watch it rise and fall like a wave — most pass in 10 minutes." },
        { name: "10-minute delay", how: "Tell yourself 'not now, in 10 minutes'; the urge usually fades." },
      ],
      resources: [
        { label: "Atomic Habits — breaking bad habits", url: "https://jamesclear.com/three-steps-habit-change", kind: "read" },
        { label: "How to break a bad habit", url: watch("how to break a bad habit science"), kind: "watch" },
      ],
      habits: ["No-spend / no-use check-in", "Track the streak", "Replacement action"],
    },
  },
];

const GENERIC: Playbook = {
  icon: "✨",
  accent: "var(--coach)",
  summary: "Turn this into a clear system: one small repeatable action, tracked daily, reviewed weekly.",
  methods: [
    "Define what 'done' looks like — a specific, measurable outcome.",
    "Break it into one small action you can repeat most days.",
    "Add it as a habit and protect the streak.",
    "Review weekly: what worked, what to adjust.",
    "Tell someone or track it publicly for accountability.",
  ],
  techniques: [
    { name: "2-minute start", how: "Commit to just 2 minutes; starting is the hardest part." },
    { name: "Habit stacking", how: "Attach the new action to something you already do daily." },
  ],
  resources: [],
  habits: ["Daily action", "Weekly review"],
};

/** Build a full playbook for a goal title. */
export function generatePlaybook(title: string): Playbook {
  const text = title.toLowerCase();
  const theme = THEMES.find((t) => t.keys.some((k) => text.includes(k)));
  const base = theme ? theme.playbook : GENERIC;

  // Always append goal-specific reading/watching so every goal has resources.
  const resources: PlaybookResource[] = [
    ...base.resources,
    { label: `Articles about ${title}`, url: search(`${title} tips how to`), kind: "read" },
    { label: `Videos about ${title}`, url: watch(`${title} how to`), kind: "watch" },
  ];

  return { ...base, resources };
}
