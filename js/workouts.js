// ============================================================
// THE PROGRAMMING — exercises & workouts built around the
// garage setup: PRx fold-out rack, barbell + bumpers, bench,
// multi-grip pull-up bar, 20lb med ball, 24" box, bands, turf.
// ============================================================

// type: "weighted" (barbell, plate loader) | "reps" (bodyweight/ball) | "timed" (seconds)
export const EXERCISES = {
  squat:    { name: "Back Squat",        type: "weighted", intro: "intro_squat",    gear: "rack + bar",       rest: 120 },
  bench:    { name: "Bench Press",       type: "weighted", intro: "intro_bench",    gear: "rack + bench",     rest: 120 },
  ohp:      { name: "Overhead Press",    type: "weighted", intro: "intro_ohp",      gear: "bar",              rest: 90  },
  deadlift: { name: "Deadlift",          type: "weighted", intro: "intro_deadlift", gear: "bar + bumpers",    rest: 150 },
  rdl:      { name: "Romanian Deadlift", type: "weighted", intro: "intro_rdl",      gear: "bar",              rest: 90  },
  row:      { name: "Barbell Row",       type: "weighted", intro: "intro_row",      gear: "bar",              rest: 90  },
  pullup:   { name: "Pull-Ups",          type: "reps",     intro: "intro_pullup",   gear: "multi-grip bar",   rest: 90  },
  pushup:   { name: "Push-Ups",          type: "reps",     intro: "intro_pushup",   gear: "garage floor",     rest: 60  },
  wallball: { name: "Wall Balls",        type: "reps",     intro: "intro_wallball", gear: "20 lb med ball",   rest: 60  },
  boxjump:  { name: "Box Jumps",         type: "reps",     intro: "intro_boxjump",  gear: "24\" box",         rest: 60  },
  band:     { name: "Band Pull-Aparts",  type: "reps",     intro: "intro_band",     gear: "bands",            rest: 45  },
  burpee:   { name: "Burpees",           type: "reps",     intro: "intro_burpee",   gear: "regret",           rest: 60  },
  lunge:    { name: "Walking Lunges",    type: "reps",     intro: "intro_lunge",    gear: "turf strip",       rest: 60  },
  plank:    { name: "Plank",             type: "timed",    intro: "intro_plank",    gear: "garage floor",     rest: 45  },
};

// Each warm-up move is timed (seconds).
const WARMUPS = {
  lower: [
    { name: "Jumping Jacks",       secs: 40 },
    { name: "Air Squats",          secs: 40 },
    { name: "Leg Swings (each)",   secs: 40 },
  ],
  upper: [
    { name: "Jumping Jacks",       secs: 40 },
    { name: "Arm Circles",         secs: 30 },
    { name: "Band Pull-Aparts",    secs: 40 },
  ],
  engine: [
    { name: "Jumping Jacks",       secs: 40 },
    { name: "High Knees",          secs: 30 },
    { name: "Inchworms",           secs: 40 },
  ],
};

export const PROGRAMS = [
  {
    id: "rack",
    title: "Rack Day",
    subtitle: "Legs & lower body",
    tagline: "The stairs will be personal tomorrow.",
    accent: "#ff7a1a",
    icon: "rack",
    warmup: WARMUPS.lower,
    blocks: [
      { ex: "squat",   sets: 4, reps: 5  },
      { ex: "rdl",     sets: 3, reps: 8  },
      { ex: "lunge",   sets: 3, reps: 12 },
      { ex: "plank",   sets: 3, secs: 45 },
    ],
  },
  {
    id: "press",
    title: "Press Conference",
    subtitle: "Chest, shoulders & triceps",
    tagline: "All questions answered by your upper body.",
    accent: "#4da3ff",
    icon: "bench",
    warmup: WARMUPS.upper,
    blocks: [
      { ex: "bench",  sets: 4, reps: 5  },
      { ex: "ohp",    sets: 3, reps: 8  },
      { ex: "pushup", sets: 3, reps: 12 },
      { ex: "band",   sets: 3, reps: 15 },
    ],
  },
  {
    id: "pull",
    title: "Pull Rank",
    subtitle: "Back & biceps",
    tagline: "The multi-grip bar knows your name.",
    accent: "#9d6bff",
    icon: "pullup",
    warmup: WARMUPS.upper,
    blocks: [
      { ex: "pullup", sets: 4, reps: 6  },
      { ex: "row",    sets: 3, reps: 8  },
      { ex: "rdl",    sets: 3, reps: 10 },
      { ex: "band",   sets: 3, reps: 15 },
    ],
  },
  {
    id: "engine",
    title: "The Engine Room",
    subtitle: "Conditioning & core",
    tagline: "Lungs are a muscle-adjacent situation.",
    accent: "#3ecf6e",
    icon: "ball",
    warmup: WARMUPS.engine,
    blocks: [
      { ex: "wallball", sets: 4, reps: 15 },
      { ex: "boxjump",  sets: 4, reps: 10 },
      { ex: "burpee",   sets: 3, reps: 10 },
      { ex: "plank",    sets: 3, secs: 40 },
    ],
  },
];

export function programById(id) {
  return PROGRAMS.find((p) => p.id === id);
}

// Suggest today's program: rotate through the split by day-of-year,
// nudged forward past whatever was done most recently.
export function suggestProgram(lastProgramId) {
  const order = ["rack", "press", "engine", "pull"];
  if (lastProgramId) {
    const i = order.indexOf(lastProgramId);
    if (i >= 0) return programById(order[(i + 1) % order.length]);
  }
  const day = Math.floor(Date.now() / 86400000);
  return programById(order[day % order.length]);
}
