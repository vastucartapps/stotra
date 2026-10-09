import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { buildQuickTakeaway } from "./quick-takeaway.ts";

// A visible, answer-first sentence group at the top of each stotra page, built only from
// that stotra's own data fields (no invented claims).
const base = { titleEn: "Hanuman Chalisa", verseCount: 43, readingTimeMinutes: 15, days: ["tuesday", "saturday"] };

test("builds the answer from verse count, deity, recital days and reading time", () => {
  const t = buildQuickTakeaway(base, "Shree Hanuman");
  assert.equal(
    t,
    "Hanuman Chalisa has 43 verses and is dedicated to Shree Hanuman. It is traditionally recited on Tuesday and Saturday and takes about 15 minutes to read. Below you will find the Sanskrit text with transliteration, Hindi meaning and English, plus a free PDF."
  );
});

test("leaves out what the data does not have instead of guessing", () => {
  const t = buildQuickTakeaway({ ...base, days: [] }, null);
  assert.equal(t, "Hanuman Chalisa has 43 verses and takes about 15 minutes to read. Below you will find the Sanskrit text with transliteration, Hindi meaning and English, plus a free PDF.");
});

test("one recital day, and three days, read naturally", () => {
  assert.match(buildQuickTakeaway({ ...base, days: ["monday"] }, "Shiva"), /recited on Monday and takes/);
  assert.match(buildQuickTakeaway({ ...base, days: ["monday", "thursday", "friday"] }, "Shiva"), /recited on Monday, Thursday and Friday and takes/);
});

test("one-minute and one-verse grammar", () => {
  const t = buildQuickTakeaway({ ...base, verseCount: 1, readingTimeMinutes: 1 }, "Ganesha");
  assert.match(t, /has 1 verse and/);
  assert.match(t, /about 1 minute to read/);
});

const DIR = "src/data/stotras";
const published = readdirSync(DIR)
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(readFileSync(`${DIR}/${f}`, "utf8")))
  .filter((s) => s.isPublished);

test("every published stotra gets a clean, factual takeaway", () => {
  const bad: string[] = [];
  for (const s of published) {
    const t = buildQuickTakeaway(s, "Deity Name");
    if (t.length < 100 || t.length > 330) bad.push(`${s.slug}: ${t.length}`);
    if (/undefined|null|NaN|\s{2,}/.test(t)) bad.push(`${s.slug}: bad text`);
    if (!t.includes(`${s.verseCount} verse`)) bad.push(`${s.slug}: verse count missing`);
    if (!t.startsWith(s.titleEn)) bad.push(`${s.slug}: does not start with the title`);
  }
  assert.deepEqual(bad.slice(0, 10), []);
});

test("the stotra page shows it visibly, labelled 'Quick Takeaway' (never the abbreviation)", () => {
  const src = readFileSync("src/components/stotra/StotraContent.tsx", "utf8");
  assert.match(src, /buildQuickTakeaway\(/);
  assert.match(src, /Quick Takeaway/);
  assert.doesNotMatch(src.slice(src.indexOf("Key Facts")), /TL;DR<|>TL;DR/);
});
