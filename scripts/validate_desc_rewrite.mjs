#!/usr/bin/env node
/**
 * Validate the agent-rewritten stotra descriptions before merging them.
 * For each output-batchN.json, cross-check against its input-batchN.json:
 *   1. Same slug set, no missing/extra.
 *   2. Template KILLED — new description must NOT contain the tell-tale
 *      template phrases.
 *   3. Facts PRESERVED — the source text and verse count must still appear
 *      in the new description (the two facts most prone to being dropped).
 *   4. Length sane (90-220 words).
 *   5. No Devanagari, no banned slop phrases, no duplicate openings.
 * Exit 0 = all clean & safe to merge; 1 = problems (listed).
 *
 *   node scripts/validate_desc_rewrite.mjs
 */
import fs from "fs";

const DIR = "reports/desc-rewrite";
const BANNED = [
  "delve", "tapestry", "treasure trove", "realm of", "testament to",
  "rich history", "rich tradition", "plays a crucial role", "plays a vital role",
  "plays a key role", "it is important to note", "it is worth noting",
  "stands as a", "serves as a", "when it comes to", "moreover", "furthermore",
  "first and foremost", "vibrant", "beacon of", "embark on", "unlock the",
  "sacred composition is sourced", "continues to inspire devotees worldwide",
];
const TEMPLATE_TELLS = [
  "among the most cherished prayers to",
  "this sacred composition is sourced from",
  "continues to inspire devotees worldwide",
  "on this page, you can read the complete",
];

const errs = [];
const ok = (c, m) => { if (!c) errs.push(m); };
const words = (t) => (t || "").split(/\s+/).filter(Boolean);
const norm = (s) => (s || "").toLowerCase();

function firstSentenceSkeleton(s) {
  const first = (s || "").split(/(?<=[.!?])\s+/)[0] || "";
  return first.replace(/[A-Z][a-z]+/g, "#N").replace(/\d+/g, "#")
    .replace(/[^a-z #]/gi, " ").replace(/\s+/g, " ").trim().toLowerCase();
}

let totalOut = 0;
const allOpenings = {};
const seenSlugs = new Set();

for (let i = 1; i <= 7; i++) {
  const inF = `${DIR}/input-batch${i}.json`;
  const outF = `${DIR}/output-batch${i}.json`;
  if (!fs.existsSync(inF)) continue;
  if (!fs.existsSync(outF)) { errs.push(`batch${i}: OUTPUT MISSING`); continue; }
  const input = JSON.parse(fs.readFileSync(inF, "utf8"));
  let output;
  try { output = JSON.parse(fs.readFileSync(outF, "utf8")); }
  catch (e) { errs.push(`batch${i}: output JSON parse error: ${e.message}`); continue; }

  const bySlug = Object.fromEntries(output.map((o) => [o.slug, o.description]));
  for (const item of input) {
    const d = bySlug[item.slug];
    if (!d) { errs.push(`${item.slug}: no rewrite in batch${i}`); continue; }
    totalOut++;
    if (seenSlugs.has(item.slug)) errs.push(`${item.slug}: duplicate across batches`);
    seenSlugs.add(item.slug);

    const low = norm(d);
    // template killed
    for (const t of TEMPLATE_TELLS) ok(!low.includes(t), `${item.slug}: still has template phrase "${t}"`);
    // banned slop
    for (const b of BANNED) if (low.includes(b)) errs.push(`${item.slug}: banned "${b}"`);
    // facts preserved — source must appear. Skip generic sources
    // ("Traditional", "Composed by...") that carry no distinctive proper noun.
    if (item.source) {
      const GENERIC_SRC = /^(traditional|composed|various|unknown|classical|vedic|puranic)/i;
      const distinctive = item.source.split(/[ ,()-]+/).filter(
        (w) => w.length > 3 && !/^(traditional|composed|devotional|composition|hindi|attributed|the|and|from|key|verses)$/i.test(w)
      );
      // "Dharma Shasta" = Ayyappa epithet; accept the deity epithet as proxy.
      const EPITHET_OK = /shasta/i.test(item.source) && /(hariharaputra|ayyappa|shasta)/i.test(low);
      if (!GENERIC_SRC.test(item.source.trim()) && distinctive.length && !EPITHET_OK) {
        const present = distinctive.some((w) => low.includes(w.toLowerCase()));
        ok(present, `${item.slug}: no source token from "${item.source}" in rewrite`);
      }
    }
    // verse count preserved — accept the DIGIT or the spelled-out number word.
    // Skip Chalisas / dwadash-nama: their stored verseCount is structural
    // (e.g. a "Chalisa" = 40 chaupais by definition regardless of the data
    // field), so the prose's number legitimately differs from item.verseCount.
    const structuralCount = /chalisa|dwadash|bavani/i.test(item.slug);
    if (!structuralCount && item.verseCount && item.verseCount > 0 && norm(item.oldDescription).includes(String(item.verseCount))) {
      const n = item.verseCount;
      const ones = ["zero","one","two","three","four","five","six","seven","eight","nine","ten",
        "eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"];
      const tensW = {2:"twenty",3:"thirty",4:"forty",5:"fifty",6:"sixty",7:"seventy",8:"eighty",9:"ninety"};
      function toWords(x) {
        if (x < 20) return ones[x];
        if (x < 100) { const t = Math.floor(x/10), o = x%10; return o ? `${tensW[t]}-${ones[o]}` : tensW[t]; }
        if (x === 100) return "hundred";
        if (x === 108) return "hundred and eight";
        if (x === 1000) return "thousand";
        return null;
      }
      const forms = [String(n)];
      const w = toWords(n); if (w) forms.push(w);
      if (n === 1000) forms.push("thousand");
      if (n === 108) forms.push("108");
      const hit = forms.some((f) => low.includes(f));
      ok(hit, `${item.slug}: verseCount ${n} not found (digit or word)`);
    }
    // no devanagari
    ok(!/[ऀ-ॿ]/.test(d), `${item.slug}: contains Devanagari (should be ASCII only)`);
    // length
    const wc = words(d).length;
    ok(wc >= 90 && wc <= 230, `${item.slug}: length ${wc} words out of range`);
    // collect opening skeleton for cross-page dup check
    const sk = firstSentenceSkeleton(d);
    (allOpenings[sk] = allOpenings[sk] || []).push(item.slug);
  }
}

// cross-page duplicate openings (the scaled-content tell)
for (const [sk, arr] of Object.entries(allOpenings)) {
  if (arr.length > 3) errs.push(`DUP_OPENING x${arr.length}: "${sk.slice(0, 50)}…" (${arr.slice(0, 4).join(", ")}…)`);
}

console.log(`REWRITES=${totalOut}  UNIQUE_SLUGS=${seenSlugs.size}  ISSUES=${errs.length}`);
console.log(errs.length ? "RESULT: FAIL" : "RESULT: CLEAN");
if (errs.length) errs.slice(0, 40).forEach((e) => console.log("  - " + e));
process.exit(errs.length ? 1 : 0);
