# GARAGE JEFF

**Your trainer. Your garage. No excuses.**

A premium mobile web app where your personal trainer, Jeff, is *physically in
your garage*. He greets you when the garage door rolls up, runs your session,
trash-talks you through rest timers, interrupts when you stall, celebrates
your PRs with chalk dust, and grades you on an official Report Card when it's
over. He is sarcastic, relentless, and completely on your side.

## The experience

- **Garage door intro** — the app opens with an actual roll-up garage door.
  Tap the handle. It never gets old (it auto-opens for regulars).
- **Jeff** — an animated character with seven moods, idle blinking, a
  "Jeff is typing…" beat, and **300+ contextual lines** that react to the time
  of day, your streak, your weight selection, your rep count, your rest-skipping
  habits, and how long you've been staring at your phone mid-set. Lines are
  dealt from shuffled decks so he doesn't repeat himself until he's used
  everything.
- **The garage** — a living backdrop built from the real setup: PRx-style
  fold-out rack (it swings off the wall when a workout starts), multi-grip
  pull-up bar, bumper plates, 20 lb med ball, bands, 24" plyo box, turf strip.
- **Plate-loading weight picker** — tap bumper plates to load a visual barbell.
  Jeff comments on empty-bar sets and 225+ alike.
- **Warm-ups, sets, reps, rest timers** — with mid-rest trash talk, a +30s
  button Jeff judges you for, and skip-rest reactions.
- **Report Card** — letter grade (S through "see me after class" D), session
  stats, Jeff's remarks, and your volume converted into dairy cows, hippos,
  sedans, or T-Rexes.
- **Jeff's Notebook** — workout history written as his session notes, plus a
  Trophy Shelf of sarcastic achievements ("Jeff Hasn't Texted You",
  "No Rest for the Wicked", "Before the Sun Has Coffee").
- **Streaks** — measured in *days without Jeff having to text you*.

## The programming

Four sessions on the whiteboard, built around the garage equipment:

| Session | Focus |
|---|---|
| **Rack Day** | Squat, RDL, lunges, plank |
| **Press Conference** | Bench, OHP, push-ups, band pull-aparts |
| **Pull Rank** | Pull-ups, rows, RDL, bands |
| **The Engine Room** | Wall balls, box jumps, burpees, plank |

Jeff picks the next one for you each day; you can overrule him from the
whiteboard. He remembers your last weights and your PRs per movement.

## Running it

Zero build step, zero dependencies. It's plain HTML/CSS/ES modules.

```bash
python3 -m http.server 8000
# open http://localhost:8000 on your phone (or a mobile viewport)
```

Deploys as-is to GitHub Pages, Netlify, or any static host. All progress is
stored in `localStorage` on the device.

## Stack

- Vanilla ES modules — `js/app.js` (engine), `js/jeff.js` (the character),
  `js/dialogue.js` (his brain), `js/workouts.js` (programming),
  `js/storage.js` (persistence)
- Hand-drawn SVG character and equipment, CSS animations, canvas chalk
  confetti, WebAudio micro-sounds (no assets, no network calls beyond fonts)
- Mobile-first; on desktop it stays phone-shaped, like a good demo should
