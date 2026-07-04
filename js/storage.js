// ============================================================
// STORAGE — Jeff's clipboard. Everything lives in localStorage.
// ============================================================

const KEY = "garage-jeff-v1";

const DEFAULTS = {
  name: "",
  onboarded: false,
  streak: 0,
  lastWorkoutDay: null,      // "YYYY-MM-DD"
  lastProgramId: null,
  totalWorkouts: 0,
  totalVolume: 0,            // lifetime lbs moved
  prs: {},                   // { exId: { weight, reps } }
  achievements: [],          // [id]
  history: [],               // newest first: {date, programId, title, grade, volume, sets, prCount, durationMin, remark}
  lastWeights: {},           // { exId: lbs } remembered between sessions
  muted: false,
};

let state = load();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch (_) { /* fresh start */ }
  return { ...DEFAULTS };
}

export function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (_) { /* private mode etc. */ }
}

export function get() { return state; }

export function set(patch) {
  Object.assign(state, patch);
  save();
}

export function todayKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// Streak rule: training on consecutive days — with a 1-day grace
// (one rest day allowed) — keeps the streak alive.
export function bumpStreak() {
  const today = todayKey();
  if (state.lastWorkoutDay === today) return state.streak; // already counted
  if (state.lastWorkoutDay) {
    const gap = daysBetween(state.lastWorkoutDay, today);
    state.streak = gap <= 2 ? state.streak + 1 : 1;
  } else {
    state.streak = 1;
  }
  state.lastWorkoutDay = today;
  save();
  return state.streak;
}

export function daysSinceLastWorkout() {
  if (!state.lastWorkoutDay) return null;
  return daysBetween(state.lastWorkoutDay, todayKey());
}

function daysBetween(a, b) {
  return Math.round((new Date(b) - new Date(a)) / 86400000);
}

export function unlock(achievementId) {
  if (state.achievements.includes(achievementId)) return false;
  state.achievements.push(achievementId);
  save();
  return true;
}

// Returns true if this set is a new PR for the exercise.
// First entry for a movement is a baseline, not a "PR".
export function checkPR(exId, type, weight, reps) {
  const prev = state.prs[exId];
  const beats = type === "weighted"
    ? !prev || weight > prev.weight || (weight === prev.weight && reps > prev.reps)
    : !prev || reps > prev.reps;
  if (beats) {
    state.prs[exId] = { weight: type === "weighted" ? weight : 0, reps };
    save();
  }
  return beats && !!prev;
}
