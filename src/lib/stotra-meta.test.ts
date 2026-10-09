import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { buildStotraTitle, buildStotraDescription, MAX_TITLE, MAX_DESCRIPTION } from "./stotra-meta.ts";

const base = { titleEn: "Hanuman Chalisa", title: "हनुमान चालीसा" };

test("default title is unchanged for pages without an override (regression guard)", () => {
  // The full form is 79 chars, so the cascade picks the short form, exactly as the page did before.
  assert.equal(buildStotraTitle(base), "Hanuman Chalisa — हनुमान चालीसा | Sanskrit, Hindi, PDF");
  assert.equal(buildStotraTitle({ titleEn: "Om", title: "ॐ" }), "Om — ॐ | Sanskrit, Hindi, PDF | Stotra by VastuCart");
  assert.equal(buildStotraTitle({ titleEn: "A Very Long Stotra Name For Testing Cascade Behaviour Here Now", title: "बहुत लंबा नाम बहुत" }), "A Very Long Stotra Name For Testing Cascade Behaviour Here Now | Stotra by VastuCart");
});

test("a metaTitle override wins", () => {
  assert.equal(buildStotraTitle({ ...base, metaTitle: "Hanuman Chalisa PDF — Hindi Lyrics" }), "Hanuman Chalisa PDF — Hindi Lyrics");
});

test("description uses the curated seoDescription and adds the PDF hook only when it fits", () => {
  const d = buildStotraDescription({ ...base, seoDescription: "Hanuman Chalisa in Hindi with English meaning.", verseCount: 40, source: "Tulsidas", benefits: ["x"] });
  assert.equal(d, "Hanuman Chalisa in Hindi with English meaning. Free PDF download.");
  const long = "A".repeat(150) + ".";
  const d2 = buildStotraDescription({ ...base, seoDescription: long, verseCount: 1, source: "s", benefits: [] });
  assert.equal(d2, long); // no room for the hook
});

test("a description longer than the limit is cut at a sentence boundary", () => {
  const first = "Hanuman Vadvanal Stotra in Sanskrit with Hindi meaning and transliteration.";
  const s = first + " " + "Second sentence goes on and on ".repeat(8) + "and ends.";
  const d = buildStotraDescription({ ...base, seoDescription: s, verseCount: 1, source: "s", benefits: [] });
  assert.ok(d.length <= MAX_DESCRIPTION);
  assert.equal(d, first + " Free PDF download.");
});

test("the old broken template ('Recite for Invokes...') is gone, including the no-seoDescription fallback", () => {
  const d = buildStotraDescription({ ...base, seoDescription: "", verseCount: 7, source: "Traditional", benefits: ["Invokes saubhagya and marital bliss to women"] });
  assert.ok(!/Recite for/.test(d));
  assert.ok(d.length <= MAX_DESCRIPTION && d.length > 40);
});

test("a metaDescription override wins", () => {
  assert.equal(buildStotraDescription({ ...base, seoDescription: "x".repeat(60), verseCount: 1, source: "s", benefits: [], metaDescription: "Custom." }), "Custom.");
});

const DIR = "src/data/stotras";
const all = readdirSync(DIR).filter((f) => f.endsWith(".json")).map((f) => JSON.parse(readFileSync(`${DIR}/${f}`, "utf8")));
const published = all.filter((s) => s.isPublished);

test("every published stotra gets a clean title and description", () => {
  assert.ok(published.length > 900);
  const bad: string[] = [];
  for (const s of published) {
    const t = buildStotraTitle(s);
    const d = buildStotraDescription(s);
    if (t.length > MAX_TITLE) bad.push(`${s.slug}: title ${t.length}`);
    if (d.length < 50 || d.length > MAX_DESCRIPTION) bad.push(`${s.slug}: description ${d.length}`);
    if (/Recite for|\s{2,}/.test(d)) bad.push(`${s.slug}: description text`);
  }
  assert.deepEqual(bad, []);
});

// Batch 1 (G07): the biggest PDF-intent pages in Search Console. Primary query phrase must appear.
const BATCH1: Record<string, string[]> = {
  "hanuman-vadvanal-stotra": ["vadvanal stotra", "PDF"],
  "bajrang-baan": ["Bajrang Baan", "PDF"],
  "krishna-aarti": ["Aarti Kunj Bihari Ki", "PDF"],
  "gauri-chalisa": ["Gori Chalisa", "PDF"],
  "shiv-stuti": ["Shiv Stuti", "PDF"],
  "shani-mahatmya": ["Shani Mahatmya", "PDF"],
  "lingashtakam": ["Lingashtakam", "PDF"],
  "baglamukhi-kavacham": ["Baglamukhi Kavach", "PDF"],
};

test("batch 1 pages carry a PDF-first title and description with the searched phrase", () => {
  for (const [slug, phrases] of Object.entries(BATCH1)) {
    const s = all.find((x) => x.slug === slug);
    assert.ok(s, slug);
    const t = buildStotraTitle(s);
    const d = buildStotraDescription(s);
    assert.ok(s.metaTitle && t === s.metaTitle, `${slug} uses its metaTitle`);
    assert.ok(t.length <= MAX_TITLE, `${slug} title ${t.length}`);
    assert.ok(d.length <= MAX_DESCRIPTION, `${slug} description ${d.length}`);
    for (const p of phrases) assert.ok((t + " " + d).toLowerCase().includes(p.toLowerCase()), `${slug} mentions ${p}`);
    assert.ok(/PDF/.test(t), `${slug} title has PDF`);
  }
});
