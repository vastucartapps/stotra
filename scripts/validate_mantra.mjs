#!/usr/bin/env node
/**
 * Mantra data quality gate. Validates every mantra data file against the
 * canonical verified anchors. Run before every commit in the mantra build.
 *
 *   node scripts/validate_mantra.mjs
 *
 * Exit 0 = PASS, 1 = FAIL. Never eyeball Devanagari — this is the source of
 * truth that survives any terminal-display corruption.
 */
import fs from "fs";
import path from "path";

const DIR = "src/data/mantra";
const errs = [];
const ok = (c, m) => { if (!c) errs.push(m); };

const read = (f) => JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8"));

// --- Anchors ---
const bija = read("_canonical_bija.json");
const vedic = read("_canonical_bija_vedic.json");
const gayatri = read("_canonical_gayatri.json");

const PLANETS = ["surya","chandra","mangal","budha","guru","shukra","shani","rahu","ketu"];

// Anchor structural checks
for (const p of PLANETS) {
  const b = bija.planets[p];
  ok(b, `bija missing planet ${p}`);
  if (b) {
    ok(b.bija_iast?.startsWith("Om ") && b.bija_iast?.endsWith("Namah"), `bija iast malformed ${p}`);
    ok(b.bija_devanagari?.startsWith("ॐ ") && b.bija_devanagari?.includes("नमः"), `bija devanagari malformed ${p}`);
  }
  const v = vedic.planets[p];
  ok(v?.name_iast?.startsWith("Om ") && v?.name_iast?.endsWith("Namah"), `vedic iast malformed ${p}`);
  ok(v?.name_devanagari?.includes("नमः"), `vedic devanagari malformed ${p}`);
  const g = gayatri.planets[p];
  ok(g?.iast?.includes("Vidmahe") && g?.iast?.includes("Dhimahi") && g?.iast?.includes("Prachodayat"), `gayatri iast not 24-syllable format ${p}`);
  ok(g?.devanagari?.includes("विद्महे") && g?.devanagari?.includes("धीमहि") && g?.devanagari?.includes("प्रचोदयात्"), `gayatri devanagari malformed ${p}`);
}

// --- Member data files (planet/day/rashi/nakshatra) cross-checked vs anchors ---
// Files may be a single record OR a collection wrapper
// ({ planets:[] } / { days:[] } / { rashis:[] } / { nakshatras:[] }).
const memberFiles = fs.existsSync(DIR)
  ? fs.readdirSync(DIR).filter((f) => f.endsWith(".json") && !f.startsWith("_"))
  : [];

function recordsOf(obj, f) {
  for (const key of ["planets", "days", "rashis", "nakshatras", "members"]) {
    if (Array.isArray(obj[key])) return obj[key].map((r) => [r, `${f}#${r.slug || "?"}`]);
  }
  return [[obj, f]]; // single-record file
}

let memberCount = 0;
const allRecords = [];
for (const f of memberFiles) allRecords.push(...recordsOf(read(f), f));

for (const [rec, label] of allRecords) {
  const f = label;
  memberCount++;
  ok(rec.slug, `${f}: no slug`);
  ok(rec.type, `${f}: no type`);
  ok(rec.name?.en, `${f}: no name.en`);
  ok(Array.isArray(rec.mantras) && rec.mantras.length > 0, `${f}: no mantras[]`);
  // If a planet page, its primary bija MUST byte-match the anchor.
  if (rec.type === "planet") {
    const anchor = bija.planets[rec.slug];
    ok(anchor, `${f}: planet slug '${rec.slug}' not in bija anchor`);
    if (anchor) {
      const hasBija = rec.mantras.some(
        (m) => m.textDevanagari === anchor.bija_devanagari && m.transliteration === anchor.bija_iast
      );
      ok(hasBija, `${f}: bija does NOT byte-match canonical anchor for ${rec.slug}`);
    }
  }
  // Every mantra must carry a lineage label + source (no fabrication).
  for (const [i, m] of (rec.mantras || []).entries()) {
    ok(m.textDevanagari, `${f}: mantra[${i}] no textDevanagari`);
    ok(m.transliteration, `${f}: mantra[${i}] no transliteration`);
    ok(m.lineage, `${f}: mantra[${i}] no lineage label`);
    ok(m.source, `${f}: mantra[${i}] no source citation`);
    ok(m.authenticity, `${f}: mantra[${i}] no authenticity tag`);
  }
}

console.log(`ANCHORS: bija=${Object.keys(bija.planets).length} vedic=${Object.keys(vedic.planets).length} gayatri=${Object.keys(gayatri.planets).length}`);
console.log(`MEMBER_FILES: ${memberCount}`);
console.log(`RESULT: ${errs.length === 0 ? "PASS" : "FAIL"}`);
if (errs.length) {
  console.log("ERRORS:");
  for (const e of errs) console.log("  - " + e);
  process.exit(1);
}
