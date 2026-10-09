import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { buildGitaVerseDescription, buildGitaChapterDescription, GITA_INDEX_DESCRIPTION, MAX_DESCRIPTION } from "./gita-meta.ts";

// Search Console tooling found every sampled /gita page with a description far over the
// ~160 characters Google shows: verse pages ~270, chapter pages up to 1,095 (the whole
// chapter summary pasted into the tag), the index 236.
const DIR = "src/data/gita";
const chapters = readdirSync(DIR).filter((f) => /^chapter-\d+\.json$/.test(f)).map((f) => JSON.parse(readFileSync(`${DIR}/${f}`, "utf8")));

test("the full Gita data set is present", () => {
  assert.equal(chapters.length, 18);
  assert.equal(chapters.reduce((n, c) => n + c.verses.length, 0), 701);
});

test("every verse description fits, starts with the verse's own translation, and ends cleanly", () => {
  const bad: string[] = [];
  for (const c of chapters) {
    for (const v of c.verses) {
      const d = buildGitaVerseDescription(v);
      const id = `${c.chapterNumber}.${v.verseNumber}`;
      if (d.length > MAX_DESCRIPTION || d.length < 70) bad.push(`${id}: length ${d.length}`);
      if (!/[.…]$/.test(d)) bad.push(`${id}: ends mid-sentence`);
      if (!d.startsWith(v.englishTranslation.slice(0, 12))) bad.push(`${id}: does not start with the translation`);
      if (!/Hindi/.test(d)) bad.push(`${id}: lost the Hindi/English hook`);
      if (/\s{2,}|\.\.\.\./.test(d)) bad.push(`${id}: formatting`);
    }
  }
  assert.deepEqual(bad.slice(0, 10), []);
});

test("every chapter description fits and is a real summary, cut at a sentence or word boundary", () => {
  const bad: string[] = [];
  for (const c of chapters) {
    const d = buildGitaChapterDescription(c);
    if (d.length > MAX_DESCRIPTION || d.length < 70) bad.push(`chapter ${c.chapterNumber}: length ${d.length}`);
    if (!/[.…]$/.test(d)) bad.push(`chapter ${c.chapterNumber}: ends mid-sentence`);
    if (!c.description.startsWith(d.replace(/…$/, "").slice(0, 40))) bad.push(`chapter ${c.chapterNumber}: not from the summary`);
  }
  assert.deepEqual(bad, []);
});

test("the index description fits and keeps the facts", () => {
  assert.ok(GITA_INDEX_DESCRIPTION.length <= MAX_DESCRIPTION && GITA_INDEX_DESCRIPTION.length >= 100);
  assert.ok(/18 chapters/.test(GITA_INDEX_DESCRIPTION) && /701/.test(GITA_INDEX_DESCRIPTION));
});

test("the three pages use the builders", () => {
  assert.match(readFileSync("src/app/gita/[chapter]/[verse]/page.tsx", "utf8"), /buildGitaVerseDescription\(/);
  assert.match(readFileSync("src/app/gita/[chapter]/page.tsx", "utf8"), /buildGitaChapterDescription\(/);
  assert.match(readFileSync("src/app/gita/page.tsx", "utf8"), /GITA_INDEX_DESCRIPTION/);
  assert.doesNotMatch(readFileSync("src/app/gita/[chapter]/[verse]/page.tsx", "utf8"), /slice\(0, 150\)/);
});
