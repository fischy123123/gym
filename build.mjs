// ============================================================
// BUILD — inline the modular source into a single self-contained
// index.html for deployment.
//
// Why: GitHub Pages serves separate .css/.js files that browsers
// cache aggressively, so pushes can appear "not to work" until the
// cache clears. A single HTML file has no sub-resources to go stale
// (Pages caps HTML caching at ~10 min), so the live site self-heals.
//
// Source of truth: index.template.html + css/style.css + js/*.js
// Output: index.html  (do not hand-edit; run `node build.mjs`)
// ============================================================
import { readFileSync, writeFileSync } from "fs";

const ROOT = new URL(".", import.meta.url).pathname;
const read = (p) => readFileSync(ROOT + p, "utf8");
const stripExports = (s) => s.replace(/^export\s+/gm, "");

// Concatenate the ES modules into one classic script (no imports).
const dialogue = stripExports(read("js/dialogue.js"));
const workouts = stripExports(read("js/workouts.js"));
const storage =
  stripExports(read("js/storage.js")) +
  `\nconst store = { save, get, set, todayKey, bumpStreak, daysSinceLastWorkout, unlock, checkPR };\n`;
const jeff = stripExports(
  read("js/jeff.js").replace(/^import\s+\{[^}]*\}\s+from\s+["'][^"']+["'];\s*$/gm, "")
);
const app = stripExports(
  read("js/app.js").replace(/^import\s+.*from\s+["'][^"']+["'];\s*$/gm, "")
);
const css = read("css/style.css");
const BUILD = new Date().toISOString();

let html = read("index.template.html");
html = html.replace(
  /<link rel="stylesheet" href="css\/style\.css" \/>/,
  `<style>\n${css}\n</style>`
);
html = html.replace(
  /<script[^>]*src="js\/app\.js"[^>]*><\/script>/,
  `<script>\n/* build ${BUILD} */\n` +
    `${dialogue}\n${workouts}\n${storage}\n${jeff}\n${app}\n</script>`
);
html = html.replace("</head>", `  <meta name="build" content="${BUILD}" />\n</head>`);

writeFileSync(ROOT + "index.html", html);
console.log(`built self-contained index.html — ${html.length} bytes — ${BUILD}`);
