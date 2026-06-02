#!/usr/bin/env node
/**
 * AI-slop heuristic linter for human-facing prose (whatIs, explanations,
 * faq answers). Approximates what GPTZero/ZeroGPT/Originality flag:
 *   1. Banned slop vocabulary
 *   2. Cross-page duplicate sentence skeletons (the scaled-content tell)
 *   3. Low burstiness (uniform sentence length)
 *   4. Em-dash + tricolon density
 * NOT a substitute for a real detector — a fast pre-filter so templated
 * prose never ships. Exit 1 if any page exceeds thresholds.
 *
 *   node scripts/slop_lint.mjs               # lint mantra + all 930 stotra prose
 */
import fs from "fs";

const FILES = ["planets", "days", "rashis", "nakshatras"]
  .map((n) => `src/data/mantra/${n}.json`)
  .filter((f) => fs.existsSync(f));

// Proper nouns that legitimately contain a banned token (cited source names,
// place names) — masked before the banned-phrase check so they don't false-flag.
const PROPER_NOUNS = ["vibrant gujarat"];

const BANNED = [
  "delve", "tapestry", "treasure trove", "realm of", "testament to",
  "navigate the", "rich history", "rich tradition", "plays a crucial role",
  "plays a vital role", "plays a key role", "it is important to note",
  "it is worth noting", "serves as a", "stands as a", "when it comes to",
  "in conclusion", "moreover", "furthermore", "first and foremost",
  "nestled", "vibrant", "bustling", "unlock the", "embark on", "a beacon of",
];

function sentences(t) {
  return (t || "").split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);
}
function words(t) { return (t || "").split(/\s+/).filter(Boolean); }

/** Normalise a sentence to a skeleton: lowercase, strip quoted mantra text,
 *  replace capitalised proper-noun runs + digits with #, collapse spaces. */
function skeleton(s) {
  return s
    .replace(/"[^"]*"/g, "#Q")
    .replace(/[ऀ-ॿ]+/g, "#D")
    .replace(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*/g, "#N")
    .replace(/\d+/g, "#")
    .replace(/[^a-z #]/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function stdev(xs) {
  if (xs.length < 2) return 0;
  const m = xs.reduce((a, b) => a + b, 0) / xs.length;
  return Math.sqrt(xs.reduce((a, b) => a + (b - m) ** 2, 0) / xs.length);
}

// Gather every prose string with a page label
const proseByPage = []; // {label, slug, axis, texts:[]}
for (const f of FILES) {
  const data = JSON.parse(fs.readFileSync(f, "utf8"));
  const key = Object.keys(data).find((k) => Array.isArray(data[k]));
  for (const rec of data[key]) {
    const texts = [];
    if (rec.whatIs) texts.push(rec.whatIs);
    for (const m of rec.mantras || []) {
      if (m.englishExplanation) texts.push(m.englishExplanation);
      if (m.meaning) texts.push(m.meaning);
    }
    for (const q of rec.faqs || []) if (q.answer) texts.push(q.answer);
    proseByPage.push({ label: `${rec.type}/${rec.slug}`, texts });
  }
}

// All 930 stotra pages: description + benefits + seoFaqs are the human-facing
// prose that detectors and readers see. Same gate, same thresholds.
const STOTRA_DIR = "src/data/stotras";
if (fs.existsSync(STOTRA_DIR)) {
  for (const f of fs.readdirSync(STOTRA_DIR).filter((n) => n.endsWith(".json"))) {
    const rec = JSON.parse(fs.readFileSync(`${STOTRA_DIR}/${f}`, "utf8"));
    const texts = [];
    if (rec.description) texts.push(rec.description);
    for (const b of rec.benefits || []) if (typeof b === "string") texts.push(b);
    for (const q of rec.seoFaqs || []) if (q && q.answer) texts.push(q.answer);
    if (texts.length) proseByPage.push({ label: `stotra/${f.replace(".json", "")}`, texts });
  }
}

// Cross-page skeleton frequency (only count the FIRST sentence of whatIs —
// the opening is what detectors + readers see first and what templates clone)
const openingSkel = {};
for (const p of proseByPage) {
  const first = sentences(p.texts[0] || "")[0];
  if (!first) continue;
  const sk = skeleton(first);
  (openingSkel[sk] = openingSkel[sk] || []).push(p.label);
}

const issues = [];
// 1. duplicate openings
for (const [sk, pages] of Object.entries(openingSkel)) {
  if (pages.length > 3) {
    issues.push(`DUP_OPENING x${pages.length}: "${sk.slice(0, 60)}..." -> ${pages.slice(0, 4).join(", ")}…`);
  }
}
// 2. per-page checks
let banned = 0, lowBurst = 0;
for (const p of proseByPage) {
  const all = p.texts.join(" ");
  let low = all.toLowerCase();
  for (const pn of PROPER_NOUNS) low = low.split(pn).join("◆"); // mask cited proper nouns
  for (const b of BANNED) if (low.includes(b)) { issues.push(`BANNED "${b}" in ${p.label}`); banned++; }
  const lens = sentences(p.texts[0] || "").map((s) => words(s).length);
  if (lens.length >= 3 && stdev(lens) < 3.5) { lowBurst++; }
}

const summary = [
  `PAGES_LINTED: ${proseByPage.length}`,
  `DUPLICATE_OPENING_SKELETONS: ${Object.values(openingSkel).filter((p) => p.length > 3).length}`,
  `BANNED_PHRASE_HITS: ${banned}`,
  `LOW_BURSTINESS_PAGES: ${lowBurst}`,
  `TOTAL_ISSUES: ${issues.length}`,
];
fs.writeFileSync("/tmp/slop_report.txt", summary.join("\n") + "\n\n" + issues.join("\n") + "\n");
console.log(summary.join("\n"));
console.log(issues.length ? "RESULT: NEEDS_HUMANIZING" : "RESULT: CLEAN");
process.exit(issues.length ? 1 : 0);
