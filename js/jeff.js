// ============================================================
// JEFF — the man, the myth, the beard.
// A stylized SVG character with moods, idle blinking, and a
// typewriter speech bubble ("Jeff is typing…" included).
// ============================================================

import { pick } from "./dialogue.js";

export const MOODS = ["neutral", "smirk", "hyped", "proud", "shocked", "unimpressed", "thinking"];

// Face geometry per mood: brows, eyes, mouth swapped as groups.
const FACE = {
  neutral: {
    browL: "M62 82 q10 -7 21 -4", browR: "M117 78 q11 -3 21 4",
    eyes: "open",
    mouth: `<path d="M85 134 q15 9 30 0" class="j-mouth"/>`,
  },
  smirk: {
    browL: "M62 84 q10 -5 21 -3", browR: "M115 74 q12 -5 23 2",
    eyes: "open",
    mouth: `<path d="M88 137 q14 6 26 -4" class="j-mouth"/>`,
  },
  hyped: {
    browL: "M60 76 q11 -9 23 -5", browR: "M115 71 q12 -4 24 6",
    eyes: "wide",
    mouth: `<path d="M83 131 q17 16 34 0 q-17 8 -34 0 z" class="j-mouth-open"/>`,
  },
  proud: {
    browL: "M62 80 q10 -7 21 -4", browR: "M117 76 q11 -3 21 5",
    eyes: "closed",
    mouth: `<path d="M83 132 q17 12 34 0" class="j-mouth"/>`,
  },
  shocked: {
    browL: "M60 72 q11 -9 23 -6", browR: "M115 66 q12 -4 24 8",
    eyes: "wide",
    mouth: `<ellipse cx="100" cy="137" rx="9" ry="10" class="j-mouth-open"/>`,
  },
  unimpressed: {
    browL: "M62 86 q10 -2 21 0", browR: "M115 72 q12 -6 23 1",
    eyes: "flat",
    mouth: `<path d="M87 136 h26" class="j-mouth"/>`,
  },
  thinking: {
    browL: "M62 84 q10 -4 21 -2", browR: "M115 70 q12 -7 23 0",
    eyes: "side",
    mouth: `<path d="M89 136 q10 4 22 -2" class="j-mouth"/>`,
  },
};

function eyes(kind) {
  switch (kind) {
    case "wide":
      return `<circle cx="76" cy="94" r="7.5" class="j-eye-white"/><circle cx="124" cy="92" r="7.5" class="j-eye-white"/>
              <circle cx="76" cy="94" r="3.6" class="j-pupil"/><circle cx="124" cy="92" r="3.6" class="j-pupil"/>`;
    case "closed":
      return `<path d="M69 95 q7 5 14 0" class="j-lid"/><path d="M117 93 q7 5 14 0" class="j-lid"/>`;
    case "flat":
      return `<path d="M69 93 h14" class="j-lid"/><path d="M117 91 h14" class="j-lid"/>`;
    case "side":
      return `<circle cx="76" cy="94" r="6.5" class="j-eye-white"/><circle cx="124" cy="92" r="6.5" class="j-eye-white"/>
              <circle cx="79.5" cy="94" r="3" class="j-pupil"/><circle cx="127.5" cy="92" r="3" class="j-pupil"/>`;
    default: // open
      return `<circle cx="76" cy="94" r="6.5" class="j-eye-white"/><circle cx="124" cy="92" r="6.5" class="j-eye-white"/>
              <circle cx="76" cy="94" r="3.2" class="j-pupil"/><circle cx="124" cy="92" r="3.2" class="j-pupil"/>`;
  }
}

export function jeffSVG(mood = "neutral") {
  const f = FACE[mood] || FACE.neutral;
  return `
<svg viewBox="0 0 200 250" class="jeff-svg" role="img" aria-label="Jeff, your trainer">
  <!-- body: gray tee -->
  <path d="M40 250 q0 -62 24 -74 q16 -9 36 -9 q20 0 36 9 q24 12 24 74 z" fill="#8d99a6"/>
  <path d="M40 250 q0 -62 24 -74 l8 -4 q-14 30 -12 78 z" fill="#7c8894"/>
  <!-- collar -->
  <path d="M84 170 q16 14 32 0 l-6 14 q-10 8 -20 0 z" fill="#6e7a86"/>
  <!-- chest hair peek -->
  <path d="M96 176 l4 8 l4 -8" stroke="#4a3625" stroke-width="2" fill="none" stroke-linecap="round"/>
  <!-- left arm (viewer left), crossed forearm -->
  <path d="M46 196 q-14 20 -8 54 l26 0 q-4 -30 4 -46 z" fill="#e8b990"/>
  <!-- right arm: tattoo sleeve -->
  <g>
    <path d="M154 196 q14 20 8 54 l-26 0 q4 -30 -4 -46 z" fill="#e8b990"/>
    <path d="M154 196 q14 20 8 54 l-26 0 q4 -30 -4 -46 z" fill="#7a8ba0" opacity="0.55"/>
    <path d="M142 210 q8 4 14 0 M140 222 q9 5 17 1 M139 234 q9 4 18 1" stroke="#3d4c5e" stroke-width="2.4" fill="none" stroke-linecap="round" opacity="0.8"/>
  </g>
  <!-- wristband -->
  <rect x="134" y="242" width="30" height="9" rx="4" fill="#efe8dc"/>

  <!-- neck -->
  <rect x="88" y="150" width="24" height="26" rx="10" fill="#e0ad82"/>

  <!-- head -->
  <g class="jeff-head">
    <!-- face -->
    <path d="M58 78 q0 -30 42 -30 q42 0 42 30 l0 34 q0 26 -42 26 q-42 0 -42 -26 z" fill="#eec39a"/>
    <!-- ears -->
    <circle cx="57" cy="102" r="8" fill="#eec39a"/>
    <circle cx="143" cy="100" r="8" fill="#eec39a"/>
    <circle cx="143" cy="106" r="2" fill="#2d3138"/><!-- earring -->
    <!-- beard: the legend -->
    <path d="M58 100 q-4 44 14 58 q12 10 28 10 q16 0 28 -10 q18 -14 14 -58 q-2 26 -10 32 q-4 -12 -32 -12 q-28 0 -32 12 q-8 -6 -10 -32 z"
          fill="#5b4330"/>
    <path d="M72 132 q28 -14 56 0 q-6 34 -28 34 q-22 0 -28 -34 z" fill="#5b4330"/>
    <path d="M77 148 q3 10 6 14 M123 148 q-3 10 -6 14" stroke="#4a3625" stroke-width="2" stroke-linecap="round" fill="none"/>
    <!-- mustache above the mouth -->
    <path d="M83 118 q17 -8 34 0 q-3 7 -17 7 q-14 0 -17 -7 z" fill="#4a3625"/>
    <g class="jeff-mouth">${f.mouth}</g>
    <!-- nose -->
    <path d="M97 100 q3 10 -2 14 q5 3 10 0 q-5 -4 -2 -14 z" fill="#dfa477"/>
    <circle cx="106" cy="112" r="1.6" fill="#c9c9c9"/><!-- nose ring glint -->
    <!-- eyes & brows -->
    <g class="jeff-eyes">${eyes(f.eyes)}</g>
    <g class="jeff-eyes-blink" style="display:none">${eyes("closed")}</g>
    <path d="${f.browL}" class="j-brow"/>
    <path d="${f.browR}" class="j-brow"/>
    <!-- red cap -->
    <path d="M56 80 q-2 -38 44 -38 q46 0 44 38 l-2 4 q-42 -12 -84 0 z" fill="#d33a2f"/>
    <path d="M56 80 q-2 -38 44 -38 q10 0 17 2 q-30 4 -37 36 z" fill="#b92e24"/>
    <path d="M140 82 q22 2 26 10 q-14 4 -28 -4 z" fill="#d33a2f"/><!-- brim, worn slightly to side -->
    <path d="M140 82 q22 2 26 10 q-6 2 -12 1 q-6 -6 -14 -11 z" fill="#b92e24"/>
    <!-- cap mark: three tilted bars -->
    <g transform="translate(88 54) rotate(-8)" fill="#f3ede4">
      <rect x="0" y="6" width="4.5" height="8" rx="1.5"/>
      <rect x="7" y="3" width="4.5" height="11" rx="1.5"/>
      <rect x="14" y="0" width="4.5" height="14" rx="1.5"/>
    </g>
  </g>
</svg>`;
}

// ============================================================
// The Jeff controller: owns an avatar element + a speech bubble.
// ============================================================
export class Jeff {
  constructor(avatarEl, bubbleEl) {
    this.avatarEl = avatarEl;
    this.bubbleEl = bubbleEl;
    this.mood = "neutral";
    this.vars = {};
    this._typeTimer = null;
    this._blinkTimer = null;
    this._sayToken = 0;
    this.render();
    this._startBlinking();
  }

  setVars(vars) { this.vars = { ...this.vars, ...vars }; }

  render() {
    this.avatarEl.innerHTML = jeffSVG(this.mood);
  }

  setMood(mood) {
    if (!MOODS.includes(mood)) mood = "neutral";
    if (mood === this.mood) return;
    this.mood = mood;
    this.render();
  }

  _startBlinking() {
    const blink = () => {
      const eyesEl = this.avatarEl.querySelector(".jeff-eyes");
      const lidEl = this.avatarEl.querySelector(".jeff-eyes-blink");
      if (eyesEl && lidEl && this.mood !== "proud") {
        eyesEl.style.display = "none";
        lidEl.style.display = "";
        setTimeout(() => {
          const e2 = this.avatarEl.querySelector(".jeff-eyes");
          const l2 = this.avatarEl.querySelector(".jeff-eyes-blink");
          if (e2 && l2) { e2.style.display = ""; l2.style.display = "none"; }
        }, 140);
      }
      this._blinkTimer = setTimeout(blink, 2200 + Math.random() * 3200);
    };
    this._blinkTimer = setTimeout(blink, 1800);
  }

  // Say a line from a dialogue category (or raw text with {raw:true}).
  // Shows a brief "typing…" beat, then typewriters the text.
  say(categoryOrText, { mood, vars = {}, raw = false, instant = false } = {}) {
    const token = ++this._sayToken;
    if (mood) this.setMood(mood);
    const text = raw ? categoryOrText : pick(categoryOrText, { ...this.vars, ...vars });
    if (!text) return;

    clearTimeout(this._typeTimer);
    const bubble = this.bubbleEl;
    bubble.classList.remove("pop");
    void bubble.offsetWidth; // restart animation
    bubble.classList.add("pop");

    if (instant) {
      bubble.innerHTML = `<span class="bubble-text">${escapeHTML(text)}</span>`;
      return;
    }

    bubble.innerHTML = `<span class="typing"><i></i><i></i><i></i></span>`;
    const beat = Math.min(650, 250 + text.length * 2);
    this._typeTimer = setTimeout(() => {
      if (token !== this._sayToken) return;
      const span = document.createElement("span");
      span.className = "bubble-text";
      bubble.innerHTML = "";
      bubble.appendChild(span);
      let i = 0;
      const step = () => {
        if (token !== this._sayToken) return;
        // type in chunks so long lines don't drag
        i = Math.min(text.length, i + 1 + (text.length > 90 ? 1 : 0));
        span.textContent = text.slice(0, i);
        if (i < text.length) this._typeTimer = setTimeout(step, 16);
      };
      step();
    }, beat);
  }
}

function escapeHTML(s) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
