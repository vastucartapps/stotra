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

/**
 * Reject homoglyph corruption: any codepoint inside a Devanagari string that
 * is NOT Devanagari (U+0900–U+097F), ASCII, or allowed punctuation/space.
 * This catches the Thai/Latin look-alikes the display layer can inject
 * (e.g. Thai U+0E15 ต masquerading as Devanagari त).
 */
function devanagariStray(s) {
  if (typeof s !== "string") return [];
  const out = [];
  for (let i = 0; i < s.length; i++) {
    const cp = s.codePointAt(i);
    if (cp < 0x80) continue;
    if (cp >= 0x0900 && cp <= 0x097f) continue;
    if ([0x2014, 0x2013, 0x2018, 0x2019, 0x201c, 0x201d, 0x2026].includes(cp)) continue;
    out.push("U+" + cp.toString(16));
  }
  return out;
}

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
  // If a planet page, its bija AND gayatri MUST byte-match the anchors.
  if (rec.type === "planet") {
    const ab = bija.planets[rec.slug];
    const ag = gayatri.planets[rec.slug];
    ok(ab, `${f}: planet slug '${rec.slug}' not in bija anchor`);
    if (ab) {
      ok(rec.mantras.some((m) => m.kind === "bija" && m.textDevanagari === ab.bija_devanagari && m.transliteration === ab.bija_iast),
        `${f}: bija does NOT byte-match canonical anchor for ${rec.slug}`);
    }
    const mg = rec.mantras.find((m) => m.kind === "gayatri");
    if (mg && ag) {
      ok(mg.textDevanagari === ag.devanagari, `${f}: gayatri devanagari does NOT byte-match anchor for ${rec.slug}`);
      ok(mg.transliteration === ag.iast, `${f}: gayatri iast does NOT byte-match anchor for ${rec.slug}`);
    }
  }
  // Every mantra must carry a lineage label + source (no fabrication) and
  // contain NO homoglyph corruption in its Devanagari.
  for (const [i, m] of (rec.mantras || []).entries()) {
    ok(m.textDevanagari, `${f}: mantra[${i}] no textDevanagari`);
    ok(m.transliteration, `${f}: mantra[${i}] no transliteration`);
    ok(m.lineage, `${f}: mantra[${i}] no lineage label`);
    ok(m.source, `${f}: mantra[${i}] no source citation`);
    ok(m.authenticity, `${f}: mantra[${i}] no authenticity tag`);
    const stray = devanagariStray(m.textDevanagari);
    ok(stray.length === 0, `${f}: mantra[${i}] homoglyph/foreign char(s) in Devanagari: ${stray.join(",")}`);
  }
  // Entity URLs must be well-formed (catches display-corrupted QIDs like "Q102ioned").
  if (rec.entity?.wikidata) {
    ok(/^https:\/\/www\.wikidata\.org\/wiki\/Q\d+$/.test(rec.entity.wikidata),
      `${f}: malformed wikidata URL: ${rec.entity.wikidata}`);
  }
  if (rec.entity?.wikipedia) {
    ok(/^https:\/\/en\.wikipedia\.org\/wiki\/\S+$/.test(rec.entity.wikipedia),
      `${f}: malformed wikipedia URL: ${rec.entity.wikipedia}`);
  }
}

// Anchors themselves must be homoglyph-clean.
for (const p of PLANETS) {
  for (const [src, val] of [["bija", bija.planets[p]?.bija_devanagari], ["vedic", vedic.planets[p]?.name_devanagari], ["gayatri", gayatri.planets[p]?.devanagari]]) {
    const stray = devanagariStray(val);
    ok(stray.length === 0, `anchor ${src}.${p} homoglyph(s): ${stray.join(",")}`);
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
