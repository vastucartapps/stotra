import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { buildMantraTitle, buildMantraDescription, MAX_TITLE, MAX_DESCRIPTION } from "./mantra-meta.ts";

const thursday = {
  axis: "day",
  name: { en: "Thursday (Guruvar)" },
  whatIs: "Guruvar carries the name of the teacher. The day belongs to Brihaspati.",
  mantras: [{ textDevanagari: "ॐ गुरवे नमः", transliteration: "Om Gurave Namah" }],
  vidhi: { benefits: ["Traditionally chanted for wisdom, education, and prosperity"] },
};

test("a day page leads with the searched phrase and shows the real mantra", () => {
  const t = buildMantraTitle(thursday);
  assert.equal(t, "Thursday Mantra: Om Gurave Namah — Meaning, Vidhi & Benefits");
  assert.ok(t.toLowerCase().startsWith("thursday mantra"));
});

test("description quotes the mantra in both scripts and ends cleanly", () => {
  const d = buildMantraDescription(thursday);
  assert.ok(d.includes("Om Gurave Namah") && d.includes("ॐ गुरवे नमः"));
  assert.ok(d.length <= MAX_DESCRIPTION && d.endsWith("."));
  assert.ok(!d.includes("…"));
});

test("a long mantra falls back to a shorter title instead of overflowing", () => {
  const shani = {
    axis: "planet",
    name: { en: "Shani (Saturn)" },
    whatIs: "x".repeat(50),
    mantras: [{ textDevanagari: "ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः", transliteration: "Om Praam Preem Praum Sah Shanaischaraya Namah" }],
    vidhi: { benefits: ["Traditionally chanted for relief from Sade Sati"] },
  };
  const t = buildMantraTitle(shani);
  assert.ok(t.length <= MAX_TITLE);
  assert.equal(t, "Shani (Saturn) Mantra — Meaning, Vidhi & Benefits");
});

test("missing mantra or benefit data degrades gracefully", () => {
  const bare = { axis: "day", name: { en: "Sunday (Ravivar)" }, whatIs: "The day of the Sun, ruled by Surya, for vitality and clarity of purpose.", mantras: [], vidhi: {} };
  assert.equal(buildMantraTitle(bare), "Sunday Mantra — Meaning, Vidhi & Benefits");
  const d = buildMantraDescription(bare);
  assert.ok(d.length >= 40 && d.length <= MAX_DESCRIPTION);
});

const FILES: [string, string][] = [["days", "day"], ["planets", "planet"], ["nakshatras", "nakshatra"], ["rashis", "rashi"]];
const members = FILES.flatMap(([f, axis]) => {
  const d = JSON.parse(readFileSync(`src/data/mantra/${f}.json`, "utf8"));
  const list = d[f] ?? d[Object.keys(d).pop() as string];
  return (list as Record<string, unknown>[]).map((m) => ({ ...m, axis }) as typeof thursday & { slug: string });
});

test("all 55 day, planet, nakshatra and rashi pages get a clean title and description", () => {
  assert.equal(members.length, 55);
  const bad: string[] = [];
  for (const m of members) {
    const t = buildMantraTitle(m);
    const d = buildMantraDescription(m);
    if (t.length > MAX_TITLE) bad.push(`${m.slug}: title ${t.length}`);
    if (!/ Mantra/.test(t)) bad.push(`${m.slug}: title lacks 'Mantra'`);
    if (d.length < 60 || d.length > MAX_DESCRIPTION) bad.push(`${m.slug}: description ${d.length}`);
    if (d.includes("…") || /\s{2,}/.test(d) || !/[.!?]$/.test(d)) bad.push(`${m.slug}: description text`);
  }
  assert.deepEqual(bad, []);
});

test("the mantra page metadata uses the builders (no mid-sentence truncation)", () => {
  const src = readFileSync("src/app/mantra/[axis]/[slug]/page.tsx", "utf8");
  assert.match(src, /buildMantraTitle\(/);
  assert.match(src, /buildMantraDescription\(/);
  assert.doesNotMatch(src, /slice\(0, 152\)/);
});
