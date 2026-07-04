// ============================================================
// GARAGE JEFF — the engine.
// Screens, workout state machine, timers, plate math, chalk
// confetti, achievements, and one extremely opinionated trainer.
// ============================================================

import { Jeff } from "./jeff.js";
import { pick, ACHIEVEMENTS, VOLUME_UNITS } from "./dialogue.js";
import { EXERCISES, PROGRAMS, programById, suggestProgram } from "./workouts.js";
import * as store from "./storage.js";

const $ = (sel) => document.querySelector(sel);

// ---------- Jeff instances (home / onboard / workout) ----------
const jeffHome = new Jeff($("#jeff-home"), $("#bubble-home"));
const jeffOnboard = new Jeff($("#jeff-onboard"), $("#bubble-onboard"));
const jeffWork = new Jeff($("#jeff-workout"), $("#bubble-workout"));
const jeffs = [jeffHome, jeffOnboard, jeffWork];

function syncName() {
  const name = store.get().name || "Champ";
  jeffs.forEach((j) => j.setVars({ name }));
}
syncName();

// ============================================================
// SCREEN ROUTER
// ============================================================
let currentScreen = null;
function show(id) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  $(`#screen-${id}`).classList.add("active");
  currentScreen = id;
  document.body.classList.toggle("in-workout", id === "workout");
}

document.querySelectorAll("[data-back]").forEach((btn) =>
  btn.addEventListener("click", () => {
    show(btn.dataset.back);
    if (btn.dataset.back === "home") greet(true);
  })
);

// ============================================================
// GARAGE DOOR INTRO
// ============================================================
const door = $("#garage-door");
$("#door-open-btn").addEventListener("click", openDoor);
door.addEventListener("click", (e) => { if (e.target === door) openDoor(); });

let doorOpened = false;
function openDoor() {
  if (doorOpened) return;
  doorOpened = true;
  door.classList.add("open");
  tick(140);
  setTimeout(() => door.classList.add("gone"), 1250);
  setTimeout(() => {
    if (!store.get().onboarded) startOnboarding();
    else { show("home"); refreshHome(); greet(); }
  }, 750);
}

// ============================================================
// ONBOARDING
// ============================================================
function startOnboarding() {
  show("onboard");
  jeffOnboard.say("onboardingHello", { mood: "smirk" });
  setTimeout(() => {
    jeffOnboard.say("onboardingName", { mood: "thinking" });
    $("#onboard-form").hidden = false;
    $("#name-input").focus();
  }, 3800);
}

$("#btn-name-go").addEventListener("click", finishOnboarding);
$("#name-input").addEventListener("keydown", (e) => { if (e.key === "Enter") finishOnboarding(); });

function finishOnboarding() {
  const name = ($("#name-input").value.trim() || "Champ").slice(0, 16);
  store.set({ name, onboarded: true });
  syncName();
  jeffOnboard.say("onboardingNamed", { mood: "proud" });
  setTimeout(() => { show("home"); refreshHome(); greet(); }, 2600);
}

// ============================================================
// HOME
// ============================================================
let pokeCount = 0;

function refreshHome() {
  const s = store.get();
  $("#streak-num").textContent = s.streak;
  $("#chip-workouts").textContent = s.totalWorkouts;
  const vol = s.totalVolume;
  $("#volume-num").textContent = vol >= 10000 ? `${(vol / 1000).toFixed(0)}k` : vol.toLocaleString();
  const prog = suggestProgram(s.lastProgramId);
  $("#today-title").textContent = prog.title;
  $("#today-sub").textContent = prog.subtitle;
  $("#btn-start-today").dataset.program = prog.id;
}

function greet(short = false) {
  const s = store.get();
  const h = new Date().getHours();
  let cat;
  if (s.totalWorkouts === 0) cat = "greetFirstWorkout";
  else if (s.streak >= 3 && store.daysSinceLastWorkout() <= 1 && Math.random() < 0.5) cat = "greetStreak";
  else if (store.daysSinceLastWorkout() >= 4 && !short) cat = "greetComeback";
  else if (h < 5) cat = "greetLate";
  else if (h < 12) cat = "greetMorning";
  else if (h < 17) cat = "greetAfternoon";
  else if (h < 22) cat = "greetEvening";
  else cat = "greetLate";
  jeffHome.say(cat, { mood: cat === "greetComeback" ? "unimpressed" : "smirk", vars: { streak: s.streak } });
}

$("#jeff-home").addEventListener("click", () => {
  pokeCount++;
  bounce($("#jeff-home"));
  jeffHome.say("poke", { mood: pokeCount > 3 ? "unimpressed" : "smirk" });
  tick(600);
  if (pokeCount === 5 && store.unlock("chatty")) toastAchievement("chatty");
});

$("#btn-start-today").addEventListener("click", (e) => startWorkout(e.currentTarget.dataset.program));
$("#btn-choose").addEventListener("click", () => { renderPrograms(); show("programs"); });
$("#btn-history").addEventListener("click", () => { renderHistory(); show("history"); });

// ============================================================
// PROGRAM PICKER
// ============================================================
function renderPrograms() {
  const list = $("#program-list");
  list.innerHTML = "";
  for (const p of PROGRAMS) {
    const card = document.createElement("button");
    card.className = "program-card";
    card.style.setProperty("--pc", p.accent);
    const meta = p.blocks
      .map((b) => `<span>${EXERCISES[b.ex].name}</span>`)
      .join("");
    card.innerHTML = `
      <div class="program-title">${p.title}</div>
      <div class="program-sub">${p.subtitle} · ${p.blocks.length} exercises</div>
      <div class="program-tagline">"${p.tagline}"</div>
      <div class="program-meta">${meta}</div>`;
    card.addEventListener("click", () => startWorkout(p.id));
    list.appendChild(card);
  }
}

// ============================================================
// WORKOUT STATE MACHINE
// ============================================================
// Phases: warmup(i) -> for each block: intro -> set(n) -> rest -> ... -> done
const W = {
  program: null,
  phase: null,          // "warmup" | "exercise" | "rest" | "timed"
  warmupIndex: 0,
  blockIndex: 0,
  setIndex: 0,
  startedAt: 0,
  clockTimer: null,
  restTimer: null,
  restLeft: 0,
  restTotal: 0,
  restChirped: false,
  idleTimer: null,
  currentReps: 0,
  currentWeight: 45,
  // session stats
  stats: null,
};

function freshStats() {
  return {
    volume: 0, setsDone: 0, setsTotal: 0, prCount: 0,
    overTarget: 0, underTarget: 0, restSkips: 0, idleNudges: 0,
    maxLoad: 0,
  };
}

function startWorkout(programId) {
  const p = programById(programId);
  if (!p) return;
  W.finished = false;
  W.program = p;
  W.warmupIndex = 0;
  W.blockIndex = 0;
  W.setIndex = 0;
  W.startedAt = Date.now();
  W.stats = freshStats();
  W.stats.setsTotal = p.blocks.reduce((n, b) => n + b.sets, 0);

  $("#wo-title").textContent = p.title;
  updateProgress();
  show("workout");
  startClock();
  jeffWork.say("workoutStart", { mood: "hyped" });
  setTimeout(() => beginWarmup(), 3600);
}

function startClock() {
  clearInterval(W.clockTimer);
  W.clockTimer = setInterval(() => {
    const s = Math.floor((Date.now() - W.startedAt) / 1000);
    $("#wo-clock").textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  }, 1000);
}

function updateProgress() {
  const totalSteps = W.program.warmup.length + W.stats.setsTotal;
  let done = Math.min(W.warmupIndex, W.program.warmup.length);
  done += W.program.blocks.slice(0, W.blockIndex).reduce((n, b) => n + b.sets, 0);
  done += W.setIndex;
  $("#wo-progress").style.width = `${Math.min(100, (done / totalSteps) * 100)}%`;
}

// ---------- idle detection (during active exercise only) ----------
function armIdle() {
  clearTimeout(W.idleTimer);
  W.idleTimer = setTimeout(() => {
    if (W.phase === "exercise") {
      W.stats.idleNudges++;
      jeffWork.say("idle", { mood: "unimpressed" });
      armIdle();
    }
  }, 50000);
}
["click", "touchstart"].forEach((ev) =>
  $("#screen-workout").addEventListener(ev, () => { if (W.phase === "exercise") armIdle(); }, { passive: true })
);

// ============================================================
// WARM-UP
// ============================================================
function beginWarmup() {
  if (W.warmupIndex >= W.program.warmup.length) {
    jeffWork.say("warmupDone", { mood: "proud" });
    setTimeout(() => beginBlock(), 2400);
    return;
  }
  W.phase = "warmup";
  const move = W.program.warmup[W.warmupIndex];
  if (W.warmupIndex === 0) jeffWork.say("warmupStart", { mood: "neutral" });
  else jeffWork.say("warmupDuring", { mood: "smirk" });

  renderTimerCard({
    eyebrow: `WARM-UP · ${W.warmupIndex + 1} OF ${W.program.warmup.length}`,
    title: move.name,
    secs: move.secs,
    rest: false,
    onDone: () => {
      W.warmupIndex++;
      updateProgress();
      beginWarmup();
    },
    skipLabel: "DONE EARLY",
  });
}

// ============================================================
// EXERCISE BLOCKS
// ============================================================
function currentBlock() { return W.program.blocks[W.blockIndex]; }
function currentEx() { return EXERCISES[currentBlock().ex]; }

function beginBlock() {
  if (W.blockIndex >= W.program.blocks.length) return finishWorkout();
  W.setIndex = 0;
  const block = currentBlock();
  const ex = currentEx();
  // remembered weight for weighted movements
  if (ex.type === "weighted") {
    W.currentWeight = store.get().lastWeights[block.ex] || 45;
  }
  const introCat = ex.intro && Math.random() < 0.75 ? ex.intro : "exerciseIntro";
  jeffWork.say(introCat, { mood: "smirk", vars: { exercise: ex.name, sets: block.sets } });
  beginSet();
}

function beginSet() {
  const block = currentBlock();
  const ex = currentEx();
  W.phase = "exercise";
  armIdle();

  if (W.setIndex === block.sets - 1 && block.sets > 1) {
    setTimeout(() => { if (W.phase === "exercise") jeffWork.say("lastSet", { mood: "hyped" }); }, 4200);
  }

  if (ex.type === "timed") {
    renderTimedSet(block, ex);
  } else if (ex.type === "weighted") {
    renderWeightedSet(block, ex);
  } else {
    renderRepSet(block, ex);
  }
  updateProgress();
}

// ---------- set card renderers ----------
function setDots(block) {
  let html = `<div class="set-dots">`;
  for (let i = 0; i < block.sets; i++) {
    const cls = i < W.setIndex ? "done" : i === W.setIndex ? "current" : "";
    html += `<div class="set-dot ${cls}">${i < W.setIndex ? "✓" : i + 1}</div>`;
  }
  return html + `</div>`;
}

function renderWeightedSet(block, ex) {
  W.currentReps = block.reps;
  const card = $("#work-card");
  card.innerHTML = `
    <div class="wc-eyebrow">EXERCISE ${W.blockIndex + 1} OF ${W.program.blocks.length}</div>
    <div class="wc-title">${ex.name}</div>
    <div class="wc-gear">📍 ${ex.gear}</div>
    ${setDots(block)}
    <div class="barbell-viz">
      <div id="barbell-render"></div>
      <div class="bb-weight-label"><span id="bb-total">${W.currentWeight}</span> <small>LB TOTAL</small></div>
    </div>
    <div class="plate-hint">TAP A PLATE TO LOAD A PAIR · BAR = 45</div>
    <div class="plate-picker">
      <button class="plate-chip" data-plate="45">45</button>
      <button class="plate-chip" data-plate="25">25</button>
      <button class="plate-chip" data-plate="10">10</button>
      <button class="plate-chip" data-plate="5">5</button>
      <button class="plate-chip strip" data-plate="strip">STRIP</button>
    </div>
    <div class="rep-stepper">
      <button class="rep-btn" id="rep-minus">−</button>
      <div class="rep-value" id="rep-value">${W.currentReps}</div>
      <button class="rep-btn" id="rep-plus">+</button>
    </div>
    <div class="plate-hint">TARGET: ${block.reps} REPS</div>
    <button class="btn-primary btn-log" id="btn-log">LOG SET ${W.setIndex + 1}</button>`;
  restartCardAnim(card);
  drawBarbell();
  wirePlates(block, ex);
  wireReps(block);
  $("#btn-log").addEventListener("click", () => logSet(block, ex));
}

function renderRepSet(block, ex) {
  W.currentReps = block.reps;
  W.currentWeight = 0;
  const card = $("#work-card");
  card.innerHTML = `
    <div class="wc-eyebrow">EXERCISE ${W.blockIndex + 1} OF ${W.program.blocks.length}</div>
    <div class="wc-title">${ex.name}</div>
    <div class="wc-gear">📍 ${ex.gear}</div>
    ${setDots(block)}
    <div class="target-row"><div class="target-big">${block.reps}</div><div class="target-unit">TARGET REPS</div></div>
    <div class="rep-stepper">
      <button class="rep-btn" id="rep-minus">−</button>
      <div class="rep-value" id="rep-value">${W.currentReps}</div>
      <button class="rep-btn" id="rep-plus">+</button>
    </div>
    <button class="btn-primary btn-log" id="btn-log">LOG SET ${W.setIndex + 1}</button>`;
  restartCardAnim(card);
  wireReps(block);
  $("#btn-log").addEventListener("click", () => logSet(block, ex));
}

function renderTimedSet(block, ex) {
  W.phase = "exercise";
  jeffTimedChirp();
  renderTimerCard({
    eyebrow: `EXERCISE ${W.blockIndex + 1} OF ${W.program.blocks.length} · SET ${W.setIndex + 1}/${block.sets}`,
    title: ex.name,
    secs: block.secs,
    rest: false,
    dots: setDots(block),
    onDone: () => completeTimedSet(block, ex),
    skipLabel: "I COLLAPSED",
  });
}

function jeffTimedChirp() {
  setTimeout(() => { if (W.phase === "exercise") jeffWork.say("warmupDuring", { mood: "smirk" }); }, 12000);
}

function completeTimedSet(block, ex) {
  W.stats.setsDone++;
  W.setIndex++;
  jeffWork.say("setGood", { mood: "proud" });
  tick(500);
  afterSet(block, ex);
}

function restartCardAnim(card) {
  card.style.animation = "none";
  void card.offsetWidth;
  card.style.animation = "";
}

// ---------- barbell / plates ----------
function platePairsFromWeight(total) {
  let perSide = (total - 45) / 2;
  const pairs = [];
  for (const p of [45, 25, 10, 5]) {
    while (perSide >= p) { pairs.push(p); perSide -= p; }
  }
  return pairs;
}

function drawBarbell() {
  const pairs = platePairsFromWeight(W.currentWeight);
  const plateStyle = {
    45: { h: 58, w: 11, c: "#2b2f35" },
    25: { h: 44, w: 10, c: "#2f6a44" },
    10: { h: 32, w: 8,  c: "#6a5a2f" },
    5:  { h: 24, w: 7,  c: "#2f4d6a" },
  };
  const cx = 160, cy = 37;
  let inner = `
    <rect x="20" y="${cy - 3}" width="280" height="6" rx="3" fill="#b9bec6"/>
    <rect x="98" y="${cy - 6}" width="10" height="12" rx="2" fill="#8d939c"/>
    <rect x="212" y="${cy - 6}" width="10" height="12" rx="2" fill="#8d939c"/>`;
  let offL = 96, offR = 224;
  for (const p of pairs) {
    const s = plateStyle[p];
    offL -= s.w + 2;
    inner += `<rect x="${offL}" y="${cy - s.h / 2}" width="${s.w}" height="${s.h}" rx="3.5" fill="${s.c}" stroke="rgba(255,255,255,.12)" class="bb-plate"/>`;
    inner += `<rect x="${offR}" y="${cy - s.h / 2}" width="${s.w}" height="${s.h}" rx="3.5" fill="${s.c}" stroke="rgba(255,255,255,.12)" class="bb-plate"/>`;
    offR += s.w + 2;
  }
  $("#barbell-render").innerHTML =
    `<svg class="barbell-svg" viewBox="0 0 ${cx * 2} 74">${inner}</svg>`;
}

function wirePlates(block, ex) {
  document.querySelectorAll(".plate-chip").forEach((chip) =>
    chip.addEventListener("click", () => {
      const v = chip.dataset.plate;
      if (v === "strip") {
        W.currentWeight = 45;
      } else {
        const add = Number(v) * 2;
        if (W.currentWeight + add <= 585) W.currentWeight += add;
      }
      $("#bb-total").textContent = W.currentWeight;
      drawBarbell();
      tick(700);
      reactToWeight(block, ex);
    })
  );
}

let weightReactTimer = null;
function reactToWeight(block, ex) {
  clearTimeout(weightReactTimer);
  weightReactTimer = setTimeout(() => {
    if (W.phase !== "exercise") return;
    const pr = store.get().prs[block.ex];
    if (pr && W.currentWeight > pr.weight) jeffWork.say("weightPR", { mood: "shocked" });
    else if (W.currentWeight >= 225) jeffWork.say("weightHeavy", { mood: "hyped", vars: { weight: W.currentWeight } });
    else if (W.currentWeight === 45 && Math.random() < 0.6) jeffWork.say("weightEmptyBar", { mood: "unimpressed" });
  }, 900);
}

function wireReps(block) {
  const val = $("#rep-value");
  const clamp = (n) => Math.max(0, Math.min(99, n));
  $("#rep-minus").addEventListener("click", () => { W.currentReps = clamp(W.currentReps - 1); bumpVal(val); });
  $("#rep-plus").addEventListener("click", () => { W.currentReps = clamp(W.currentReps + 1); bumpVal(val); });
  function bumpVal(el) {
    el.textContent = W.currentReps;
    el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump");
    tick(880);
  }
}

// ---------- logging a set ----------
function logSet(block, ex) {
  if (W.phase !== "exercise") return; // double-tap protection
  W.phase = "logged";
  clearTimeout(W.idleTimer);
  const reps = W.currentReps;
  const weight = ex.type === "weighted" ? W.currentWeight : 0;

  W.stats.setsDone++;
  W.stats.volume += (weight || bodyweightEquiv(block.ex)) * reps;
  W.stats.maxLoad = Math.max(W.stats.maxLoad, weight);
  if (ex.type === "weighted") {
    const lw = store.get().lastWeights;
    lw[block.ex] = weight;
    store.set({ lastWeights: lw });
  }

  // PR check
  const isPR = store.checkPR(block.ex, ex.type, weight, reps);
  if (isPR) {
    W.stats.prCount++;
    prCelebration();
    jeffWork.say("setPR", { mood: "shocked" });
    if (store.unlock("pr_machine")) setTimeout(() => toastAchievement("pr_machine"), 1600);
  } else if (reps > block.reps) {
    W.stats.overTarget++;
    jeffWork.say("setOver", { mood: "hyped" });
  } else if (reps < Math.ceil(block.reps * 0.6)) {
    W.stats.underTarget++;
    jeffWork.say("setUnder", { mood: "thinking" });
  } else if (reps < block.reps) {
    W.stats.underTarget++;
    jeffWork.say("setStruggle", { mood: "smirk" });
  } else {
    jeffWork.say("setGood", { mood: "proud" });
  }

  if (weight >= 225 && store.unlock("heavy_metal")) setTimeout(() => toastAchievement("heavy_metal"), 2200);

  chalkBurst(isPR ? 90 : 26);
  tick(isPR ? 300 : 480);
  W.setIndex++;
  afterSet(block, ex);
}

function bodyweightEquiv(exId) {
  // rough effective load for volume math on bodyweight moves
  return { pullup: 150, pushup: 100, wallball: 20, boxjump: 60, band: 10, burpee: 80, lunge: 50, plank: 0 }[exId] || 0;
}

function afterSet(block, ex) {
  updateProgress();
  const lastSetOfBlock = W.setIndex >= block.sets;
  const lastBlock = W.blockIndex >= W.program.blocks.length - 1;

  if (lastSetOfBlock && lastBlock) return setTimeout(finishWorkout, 1600);

  setTimeout(() => {
    startRest(ex.rest, () => {
      if (lastSetOfBlock) {
        jeffWork.say("exerciseDone", { mood: "proud", vars: { exercise: ex.name } });
        W.blockIndex++;
        setTimeout(() => beginBlock(), 2600);
      } else {
        beginSet();
      }
    });
  }, 1400);
}

// ============================================================
// REST
// ============================================================
function startRest(secs, onDone) {
  W.phase = "rest";
  W.restChirped = false;
  jeffWork.say("restStart", { mood: "neutral" });
  renderTimerCard({
    eyebrow: "REST",
    title: "Breathe.",
    secs,
    rest: true,
    onDone: () => { W.phase = null; onDone(); },
    skipLabel: "SKIP REST",
    onSkip: () => {
      W.stats.restSkips++;
      jeffWork.say("restSkipped", { mood: "shocked" });
      if (W.stats.restSkips === 3 && store.unlock("no_rest")) toastAchievement("no_rest");
    },
    extendable: true,
    upNext: upNextLabel(),
  });
  // mid-rest trash talk
  const chirpAt = Math.max(6, Math.floor(secs / 2));
  setTimeout(() => {
    if (W.phase === "rest" && !W.restChirped) {
      W.restChirped = true;
      jeffWork.say("restDuring", { mood: "smirk" });
    }
  }, chirpAt * 1000);
}

function upNextLabel() {
  const block = currentBlock();
  const ex = currentEx();
  if (W.setIndex < block.sets) {
    return `Up next: <b>${ex.name}</b> — set ${W.setIndex + 1} of ${block.sets}`;
  }
  const next = W.program.blocks[W.blockIndex + 1];
  return next ? `Up next: <b>${EXERCISES[next.ex].name}</b>` : "";
}

// ============================================================
// SHARED TIMER CARD
// ============================================================
function renderTimerCard({ eyebrow, title, secs, rest, onDone, skipLabel, onSkip, extendable, dots = "", upNext = "" }) {
  clearInterval(W.restTimer);
  let fired = false; // a timer card completes exactly once, no matter how it ends
  W.restLeft = secs;
  W.restTotal = secs;
  const R = 74, C = 2 * Math.PI * R;
  const card = $("#work-card");
  card.innerHTML = `
    <div class="wc-eyebrow">${eyebrow}</div>
    <div class="wc-title">${title}</div>
    ${dots}
    <div class="timer-wrap">
      <div class="timer-ring ${rest ? "rest" : ""}">
        <svg viewBox="0 0 168 168">
          <circle class="ring-bg" cx="84" cy="84" r="${R}"/>
          <circle class="ring-fg" id="ring-fg" cx="84" cy="84" r="${R}" stroke-dasharray="${C}" stroke-dashoffset="0"/>
        </svg>
        <div class="timer-num" id="timer-num">${secs}</div>
      </div>
      <div class="timer-label">${rest ? "SECONDS OF FREEDOM" : "SECONDS"}</div>
      <div class="timer-actions">
        ${extendable ? `<button class="btn-secondary" id="btn-extend">+30s</button>` : ""}
        <button class="btn-secondary accent" id="btn-skip">${skipLabel}</button>
      </div>
      ${upNext ? `<div class="up-next">${upNext}</div>` : ""}
    </div>`;
  restartCardAnim(card);

  const ring = $("#ring-fg");
  const num = $("#timer-num");

  const finish = () => {
    if (fired) return;
    fired = true;
    clearInterval(W.restTimer);
    tick(980);
    onDone();
  };

  W.restTimer = setInterval(() => {
    W.restLeft--;
    if (W.restLeft <= 0) return finish();
    num.textContent = W.restLeft;
    ring.style.strokeDashoffset = C * (1 - W.restLeft / W.restTotal);
    if (W.restLeft <= 3) tick(1200 + W.restLeft * 100);
  }, 1000);

  $("#btn-skip").addEventListener("click", () => {
    if (fired) return;
    fired = true;
    clearInterval(W.restTimer);
    if (onSkip) onSkip();
    onDone();
  });
  if (extendable) {
    $("#btn-extend").addEventListener("click", () => {
      W.restLeft += 30;
      W.restTotal = Math.max(W.restTotal, W.restLeft);
      num.textContent = W.restLeft;
      jeffWork.say("restExtended", { mood: "unimpressed" });
      tick(500);
    });
  }
}

// ============================================================
// QUIT FLOW
// ============================================================
$("#btn-quit").addEventListener("click", () => {
  jeffWork.say("quitAttempt", { mood: "shocked" });
  const backdrop = document.createElement("div");
  backdrop.className = "sheet-backdrop";
  backdrop.innerHTML = `
    <div class="sheet">
      <p>Jeff is staring at you. The workout isn't finished.</p>
      <div class="row">
        <button class="stay">FINE, I'LL STAY</button>
        <button class="leave">I have a life, Jeff</button>
      </div>
    </div>`;
  document.body.appendChild(backdrop);
  backdrop.querySelector(".stay").addEventListener("click", () => {
    backdrop.remove();
    jeffWork.say("setGood", { mood: "proud" });
  });
  backdrop.querySelector(".leave").addEventListener("click", () => {
    backdrop.remove();
    abandonWorkout();
  });
  backdrop.addEventListener("click", (e) => { if (e.target === backdrop) backdrop.remove(); });
});

function abandonWorkout() {
  clearInterval(W.restTimer);
  clearInterval(W.clockTimer);
  clearTimeout(W.idleTimer);
  W.phase = null;
  if (W.stats && W.stats.setsDone > 0) {
    // partial credit: it still counts, Jeff insists
    finishWorkout(true);
  } else {
    show("home");
    refreshHome();
    jeffHome.say("quitConfirmed", { mood: "thinking" });
  }
}

// ============================================================
// FINISH & REPORT CARD
// ============================================================
function gradeSession(st, abandoned) {
  const completion = st.setsTotal ? st.setsDone / st.setsTotal : 0;
  let score = completion * 70;
  score += Math.min(15, st.prCount * 8);
  score += Math.min(10, st.overTarget * 2.5);
  score -= st.idleNudges * 4;
  score -= st.underTarget * 2;
  if (abandoned) score -= 12;
  if (score >= 92 && completion >= 1) return "S";
  if (score >= 78) return "A";
  if (score >= 60) return "B";
  if (score >= 40) return "C";
  return "D";
}

const GRADE_CAT = { S: "gradeS", A: "gradeA", B: "gradeB", C: "gradeC", D: "gradeD" };

function finishWorkout(abandoned = false) {
  if (W.finished) return;
  W.finished = true;
  clearInterval(W.restTimer);
  clearInterval(W.clockTimer);
  clearTimeout(W.idleTimer);
  W.phase = null;

  const st = W.stats;
  const mins = Math.max(1, Math.round((Date.now() - W.startedAt) / 60000));
  const grade = gradeSession(st, abandoned);
  const remark = pick(GRADE_CAT[grade], { name: store.get().name || "Champ" });

  // persist
  const s = store.get();
  const streak = store.bumpStreak();
  const entry = {
    date: store.todayKey(),
    programId: W.program.id,
    title: W.program.title,
    grade,
    volume: st.volume,
    sets: st.setsDone,
    prCount: st.prCount,
    durationMin: mins,
    remark,
  };
  store.set({
    totalWorkouts: s.totalWorkouts + 1,
    totalVolume: s.totalVolume + st.volume,
    lastProgramId: W.program.id,
    history: [entry, ...s.history].slice(0, 100),
  });

  // achievements
  const newly = [];
  const tryUnlock = (id, cond) => { if (cond && store.unlock(id)) newly.push(id); };
  const total = store.get().totalWorkouts;
  const hour = new Date().getHours();
  tryUnlock("showed_up", total >= 1);
  tryUnlock("two_timer", total >= 2);
  tryUnlock("regular", total >= 7);
  tryUnlock("week_streak", streak >= 7);
  tryUnlock("overachiever", st.overTarget >= 5);
  tryUnlock("full_house", !abandoned && st.setsDone >= st.setsTotal);
  tryUnlock("early_bird", hour < 7);
  tryUnlock("night_shift", hour >= 21);
  tryUnlock("perfect", grade === "S");
  tryUnlock("ton_club", st.volume >= 10000);

  renderReportCard(entry, newly, abandoned);
  show("summary");
  if (!abandoned) chalkBurst(120);
  tick(abandoned ? 400 : 200);
}

function renderReportCard(entry, newAchievements, abandoned) {
  $("#report-title").textContent = entry.title;
  $("#report-date").textContent = new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
  const stamp = $("#grade-stamp");
  stamp.textContent = entry.grade;
  stamp.style.animation = "none"; void stamp.offsetWidth; stamp.style.animation = "";

  const st = W.stats;
  const volEq = funnyVolume(entry.volume);
  $("#report-stats").innerHTML = `
    <div class="rs-item"><div class="rs-num">${st.setsDone}/${st.setsTotal}</div><div class="rs-label">Sets done</div></div>
    <div class="rs-item"><div class="rs-num">${entry.durationMin}m</div><div class="rs-label">Duration</div></div>
    <div class="rs-item"><div class="rs-num">${entry.volume.toLocaleString()}</div><div class="rs-label">lbs moved</div></div>
    <div class="rs-item"><div class="rs-num">${st.prCount}</div><div class="rs-label">PRs</div></div>`;

  let remark = entry.remark;
  if (volEq) remark += ` Also — you moved roughly ${volEq} today. In a garage. Casually.`;
  if (abandoned) remark = pick("quitConfirmed", { name: store.get().name || "Champ" }) + " " + remark;
  $("#report-remark").textContent = remark;

  $("#report-achievements").innerHTML = newAchievements
    .map((id) => {
      const a = ACHIEVEMENTS.find((x) => x.id === id);
      return `<div class="report-ach"><div class="icon">${a.icon}</div><div><div class="t">UNLOCKED: ${a.name}</div><div class="d">${a.desc}</div></div></div>`;
    })
    .join("");
}

function funnyVolume(lbs) {
  if (lbs < 300) return "";
  const candidates = VOLUME_UNITS.filter((u) => lbs >= u.lbs * 0.8);
  if (!candidates.length) return "";
  const u = candidates[candidates.length - 1];
  const n = Math.max(1, Math.round(lbs / u.lbs * 10) / 10);
  const label = n === 1 ? u.name : u.plural;
  return `${n % 1 === 0 ? n : n.toFixed(1)} ${label}`;
}

$("#btn-summary-done").addEventListener("click", () => {
  show("home");
  refreshHome();
  jeffHome.say("workoutDone", { mood: "hyped" });
});

// ============================================================
// HISTORY & TROPHIES
// ============================================================
function renderHistory() {
  const s = store.get();
  $("#history-stats").innerHTML = `
    <div class="hs-card"><div class="hs-num">${s.totalWorkouts}</div><div class="hs-label">Sessions</div></div>
    <div class="hs-card"><div class="hs-num">${s.streak}</div><div class="hs-label">Streak</div></div>
    <div class="hs-card"><div class="hs-num">${s.totalVolume >= 1000 ? (s.totalVolume / 1000).toFixed(1) + "k" : s.totalVolume}</div><div class="hs-label">lbs lifetime</div></div>`;

  const eq = funnyVolume(s.totalVolume);
  $("#history-remark").textContent = s.history.length
    ? (eq ? `Lifetime total: about ${eq}. ${pick("historyRemark")}` : pick("historyRemark"))
    : pick("historyEmpty");

  const list = $("#history-list");
  list.innerHTML = s.history.length
    ? s.history
        .map(
          (h) => `
      <div class="history-item">
        <div class="hi-grade">${h.grade}</div>
        <div class="hi-body">
          <div class="hi-title">${h.title}</div>
          <div class="hi-meta">${fmtDate(h.date)} · ${h.sets} sets · ${h.volume.toLocaleString()} lbs · ${h.durationMin}m${h.prCount ? ` · ${h.prCount} PR${h.prCount > 1 ? "s" : ""} 🏆` : ""}</div>
          <div class="hi-remark">"${h.remark}"</div>
        </div>
      </div>`
        )
        .join("")
    : `<div class="history-empty">No sessions yet. The first page of a legend is always blank.</div>`;

  $("#trophy-list").innerHTML = ACHIEVEMENTS.map((a) => {
    const got = s.achievements.includes(a.id);
    return `<div class="trophy ${got ? "" : "locked"}"><div class="icon">${a.icon}</div><div><div class="t">${a.name}</div><div class="d">${got ? a.desc : "???"}</div></div></div>`;
  }).join("");
}

function fmtDate(key) {
  return new Date(key + "T12:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

// ============================================================
// JUICE: toasts, chalk confetti, PR flash, tiny sounds
// ============================================================
function toastAchievement(id) {
  const a = ACHIEVEMENTS.find((x) => x.id === id);
  if (!a) return;
  const t = document.createElement("div");
  t.className = "toast";
  t.innerHTML = `<div class="icon">${a.icon}</div><div><b>UNLOCKED: ${a.name}</b><small>${a.desc}</small></div>`;
  $("#toast-layer").appendChild(t);
  setTimeout(() => t.remove(), 4200);
  tick(400);
}

function bounce(el) {
  el.classList.remove("bounce"); void el.offsetWidth; el.classList.add("bounce");
}

function prCelebration() {
  const flash = document.createElement("div");
  flash.className = "pr-flash";
  flash.innerHTML = `<span>PR!</span>`;
  document.body.appendChild(flash);
  setTimeout(() => flash.remove(), 1100);
  if (navigator.vibrate) navigator.vibrate([40, 60, 40]);
}

// ---------- chalk confetti ----------
const chalkCanvas = $("#chalk");
const cctx = chalkCanvas.getContext("2d");
let chalkParts = [];
let chalkRAF = null;

function sizeChalk() {
  chalkCanvas.width = innerWidth * devicePixelRatio;
  chalkCanvas.height = innerHeight * devicePixelRatio;
}
sizeChalk();
addEventListener("resize", sizeChalk);

function chalkBurst(n) {
  const cx = chalkCanvas.width / 2;
  const cy = chalkCanvas.height * 0.42;
  const colors = ["#f2f0ea", "#e8d9b0", "#ff7a1a", "#c9c9c9"];
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2;
    const v = (2 + Math.random() * 7) * devicePixelRatio;
    chalkParts.push({
      x: cx + (Math.random() - 0.5) * 80,
      y: cy,
      vx: Math.cos(a) * v,
      vy: Math.sin(a) * v - 4 * devicePixelRatio,
      r: (1.5 + Math.random() * 3.5) * devicePixelRatio,
      c: colors[(Math.random() * colors.length) | 0],
      life: 60 + Math.random() * 40,
    });
  }
  if (!chalkRAF) chalkLoop();
}

function chalkLoop() {
  chalkRAF = requestAnimationFrame(chalkLoop);
  cctx.clearRect(0, 0, chalkCanvas.width, chalkCanvas.height);
  chalkParts = chalkParts.filter((p) => p.life > 0);
  if (!chalkParts.length) {
    cancelAnimationFrame(chalkRAF);
    chalkRAF = null;
    return;
  }
  for (const p of chalkParts) {
    p.x += p.vx; p.y += p.vy;
    p.vy += 0.22 * devicePixelRatio;
    p.vx *= 0.985;
    p.life--;
    cctx.globalAlpha = Math.min(1, p.life / 40);
    cctx.fillStyle = p.c;
    cctx.beginPath();
    cctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    cctx.fill();
  }
  cctx.globalAlpha = 1;
}

// ---------- micro sounds (WebAudio, no assets) ----------
let audioCtx = null;
function tick(freq = 600) {
  if (store.get().muted) return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") audioCtx.resume();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = "triangle";
    o.frequency.value = freq;
    g.gain.setValueAtTime(0.06, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.12);
    o.connect(g).connect(audioCtx.destination);
    o.start();
    o.stop(audioCtx.currentTime + 0.13);
  } catch (_) { /* silence is also fine */ }
}

// ============================================================
// BOOT
// ============================================================
// Keep home under the door until it opens; pre-render home so the
// reveal shows a living garage.
show("home");
refreshHome();

// If the user has been here before, still give them the door — it's
// the best part — but auto-open after a beat so it never gets old.
if (store.get().onboarded && store.get().totalWorkouts > 0) {
  setTimeout(() => { if (!doorOpened) openDoor(); }, 2600);
}
