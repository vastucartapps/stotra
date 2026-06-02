#!/usr/bin/env node
/**
 * Standalone AI-slop checker for an arbitrary set of prose strings.
 *   node scripts/slop_check_file.mjs <file.json> [field-pointers...]
 *
 * Reads a JSON file, pulls every prose string it can find (deep walk of
 * string values longer than 40 chars), and runs the same heuristics as
 * slop_lint.mjs: banned vocabulary, duplicate opening skeletons across the
 * strings, and low burstiness. Exit 0 = CLEAN, 1 = NEEDS_HUMANIZING.
 *
 * Used to validate agent-drafted deity essays before they are merged into
 * src/data/deities.ts.
 */
import fs from "fs";

const BANNED = [
  "delve", "tapestry", "treasure trove", "realm of", "testament to",
  "rich history", "rich tradition", "rich cultural", "plays a crucial role",
  "plays a vital role", "plays a key role", "plays a significant role",
  "it is important to note", "it is worth noting", "serves as a",
  "stands as a", "when it comes to", "in conclusion", "moreover",
  "furthermore", "first and foremost", "nestled", "vibrant", "bustling",
  "unlock the", "embark on", "a beacon of", "in the realm", "navigating the",
  "ever-evolving", "ever-changing", "at its core", "needless to say",
];

function sentences(t) {
  return (t || "").split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);
}
function words(t) { return (t || "").split(/\s+/).filter(Boolean); }
function skeleton(s) {
  return s
    .replace(/"[^"]*"/g, "#Q")
    .replace(/[ऀ-ॿ]+/g, "#D")
    .replace(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*/g, "#N")
    .replace(/\d+/g, "#")
    .replace(/[^a-z #]/gi, " ")
    .replace(/\s+/g, " ").trim().toLowerCase();
}
function stdev(xs) {
  if (xs.length < 2) return 0;
  const m = xs.reduce((a, b) => a + b, 0) / xs.length;
  return Math.sqrt(xs.reduce((a, b) => a + (b - m) ** 2, 0) / xs.length);
}

function walkStrings(node, out) {
  if (typeof node === "string") { if (node.length > 40) out.push(node); return; }
  if (Array.isArray(node)) { node.forEach((n) => walkStrings(n, out)); return; }
  if (node && typeof node === "object") { Object.values(node).forEach((n) => walkStrings(n, out)); }
}

const file = process.argv[2];
if (!file || !fs.existsSync(file)) {
  console.log("usage: node scripts/slop_check_file.mjs <file.json>");
  process.exit(2);
}
const data = JSON.parse(fs.readFileSync(file, "utf8"));
const proseUnits = [];          // each is one "paragraph" string
walkStrings(data, proseUnits);

const issues = [];
// 1. banned phrases
let banned = 0;
for (const p of proseUnits) {
  const low = p.toLowerCase();
  for (const b of BANNED) if (low.includes(b)) { issues.push(`BANNED "${b}": ${p.slice(0, 60)}…`); banned++; }
}
// 2. duplicate opening skeletons (the templated-content tell) — first sentence of each unit
const openings = {};
for (const p of proseUnits) {
  const first = sentences(p)[0];
  if (!first) continue;
  const sk = skeleton(first);
  (openings[sk] = openings[sk] || []).push(p.slice(0, 40));
}
let dup = 0;
for (const [sk, arr] of Object.entries(openings)) {
  if (arr.length > 2) { issues.push(`DUP_OPENING x${arr.length}: "${sk.slice(0, 50)}…"`); dup++; }
}
// 3. low burstiness per unit (only flag units of 3+ sentences)
let lowBurst = 0;
for (const p of proseUnits) {
  const lens = sentences(p).map((s) => words(s).length);
  if (lens.length >= 3 && stdev(lens) < 3.0) { lowBurst++; }
}

console.log(`UNITS=${proseUnits.length} BANNED=${banned} DUP_OPENINGS=${dup} LOW_BURST=${lowBurst}`);
console.log(issues.length ? "RESULT: NEEDS_HUMANIZING" : "RESULT: CLEAN");
if (issues.length) { issues.slice(0, 25).forEach((i) => console.log("  - " + i)); }
process.exit(issues.length ? 1 : 0);
