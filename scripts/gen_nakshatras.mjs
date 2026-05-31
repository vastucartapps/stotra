#!/usr/bin/env node
/**
 * Generate nakshatras.json by COPYING mantra Devanagari programmatically
 * from the validated anchors. No Devanagari is hand-typed here — only the
 * ASCII nakshatra->lord mapping — so corruption is structurally impossible.
 * Nakshatra -> Vimshottari lord is [confirmed classical] (BPHS).
 */
import fs from "fs";

const bija = JSON.parse(fs.readFileSync("src/data/mantra/_canonical_bija.json", "utf8")).planets;
const vedic = JSON.parse(fs.readFileSync("src/data/mantra/_canonical_bija_vedic.json", "utf8")).planets;

// 27 nakshatras: [slug, English, IAST, Vimshottari lord planet-slug]
const N = [
  ["ashwini", "Ashwini", "Aśvinī", "ketu"],
  ["bharani", "Bharani", "Bharaṇī", "shukra"],
  ["krittika", "Krittika", "Kṛttikā", "surya"],
  ["rohini", "Rohini", "Rohiṇī", "chandra"],
  ["mrigashira", "Mrigashira", "Mṛgaśīrṣa", "mangal"],
  ["ardra", "Ardra", "Ārdrā", "rahu"],
  ["punarvasu", "Punarvasu", "Punarvasu", "guru"],
  ["pushya", "Pushya", "Puṣya", "shani"],
  ["ashlesha", "Ashlesha", "Āśleṣā", "budha"],
  ["magha", "Magha", "Maghā", "ketu"],
  ["purva-phalguni", "Purva Phalguni", "Pūrva Phalgunī", "shukra"],
  ["uttara-phalguni", "Uttara Phalguni", "Uttara Phalgunī", "surya"],
  ["hasta", "Hasta", "Hasta", "chandra"],
  ["chitra", "Chitra", "Citrā", "mangal"],
  ["swati", "Swati", "Svātī", "rahu"],
  ["vishakha", "Vishakha", "Viśākhā", "guru"],
  ["anuradha", "Anuradha", "Anurādhā", "shani"],
  ["jyeshtha", "Jyeshtha", "Jyeṣṭhā", "budha"],
  ["mula", "Mula", "Mūla", "ketu"],
  ["purva-ashadha", "Purva Ashadha", "Pūrvāṣāḍhā", "shukra"],
  ["uttara-ashadha", "Uttara Ashadha", "Uttarāṣāḍhā", "surya"],
  ["shravana", "Shravana", "Śravaṇa", "chandra"],
  ["dhanishta", "Dhanishta", "Dhaniṣṭhā", "mangal"],
  ["shatabhisha", "Shatabhisha", "Śatabhiṣā", "rahu"],
  ["purva-bhadrapada", "Purva Bhadrapada", "Pūrva Bhādrapadā", "guru"],
  ["uttara-bhadrapada", "Uttara Bhadrapada", "Uttara Bhādrapadā", "shani"],
  ["revati", "Revati", "Revatī", "budha"],
];

// Planet display + day + presiding deity hints (ASCII only)
const P = {
  surya: { en: "Surya (Sun)", day: "Sunday", deity: "surya", stotras: ["aditya-hridayam", "surya-kavacham"] },
  chandra: { en: "Chandra (Moon)", day: "Monday", deity: "shiva", stotras: ["shiva-chalisa", "chandra-kavacham"] },
  mangal: { en: "Mangal (Mars)", day: "Tuesday", deity: "hanuman", stotras: ["hanuman-chalisa", "mangal-chalisa"] },
  budha: { en: "Budha (Mercury)", day: "Wednesday", deity: "vishnu", stotras: ["vishnu-sahasranama", "ganesh-chalisa"] },
  guru: { en: "Guru (Jupiter)", day: "Thursday", deity: "vishnu", stotras: ["vishnu-sahasranama", "vishnu-mangalashtakam"] },
  shukra: { en: "Shukra (Venus)", day: "Friday", deity: "lakshmi", stotras: ["mahalakshmi-ashtakam", "lakshmi-chalisa"] },
  shani: { en: "Shani (Saturn)", day: "Saturday", deity: "shani", stotras: ["shani-chalisa", "hanuman-chalisa"] },
  rahu: { en: "Rahu (North Node)", day: "Saturday", deity: "durga", stotras: ["durga-kavach", "navagraha-stotra"] },
  ketu: { en: "Ketu (South Node)", day: "Tuesday", deity: "ganesha", stotras: ["ganesh-chalisa", "navagraha-stotra"] },
};

const out = N.map(([slug, en, iast, lord]) => {
  const p = P[lord];
  const nameM = vedic[lord];   // {name_iast, name_devanagari}
  const bijaM = bija[lord];    // {bija_iast, bija_devanagari}
  return {
    slug,
    type: "nakshatra",
    name: { en: `${en} Nakshatra`, hi: "", iast },
    alsoKnownAs: [en, `${en} nakshatra`, `${slug.replace(/-/g, " ")} mantra`, `${en} birth star mantra`],
    whatIs: `${en} (${iast}) is one of the 27 nakshatras (lunar mansions) of Vedic astrology. In the Vimshottari dasha system recorded in the Brihat Parashara Hora Shastra, ${en} is ruled by ${p.en}. For those born under this nakshatra (Janma Nakshatra), the traditional remedial practice is the mantra of its ruling planet — the Vedic name mantra "${nameM.name_iast}" or the tantric seed mantra "${bijaM.bija_iast}". Strengthening the nakshatra lord is held to support the significations of one's birth star. Note: pairing a nakshatra with its lord's mantra follows the classical Vimshottari lordship; the lordship is classical, the remedial application is traditional convention.`,
    keyFacts: [
      { label: "Nakshatra", value: en },
      { label: "Ruling planet (Vimshottari)", value: p.en },
      { label: "Remedial mantra", value: `${p.en.split(" ")[0]} mantra` },
      { label: "Best day", value: `${p.day} (lord's day)` },
      { label: "Basis", value: "BPHS / Vimshottari lordship" },
    ],
    mantras: [
      {
        textDevanagari: nameM.name_devanagari,
        transliteration: nameM.name_iast,
        kind: "naam",
        lineage: "Vedic name + shakti",
        source: `Ruling planet ${p.en.split(" ")[0]} (Vimshottari lord of ${en}, BPHS)`,
        authenticity: "modern convention",
        englishExplanation: `The name mantra of ${p.en}, Vimshottari lord of ${en} nakshatra.`,
      },
      {
        textDevanagari: bijaM.bija_devanagari,
        transliteration: bijaM.bija_iast,
        kind: "bija",
        lineage: "Mantra Mahodadhi bija (tantric)",
        source: `Mantra Mahodadhi (${p.en.split(" ")[0]} bija)`,
        authenticity: "confirmed classical",
        englishExplanation: `The tantric seed mantra of ${p.en}, the lord of ${en}, best practised under a guru.`,
      },
    ],
    vidhi: {
      benefits: [`Strengthens the nakshatra lord ${p.en.split(" ")[0]}`, "Traditionally chanted for the significations of one's birth star"],
      bestDayToStart: `${p.day} (the lord's weekday)`,
      japaCount: { recommended: 108 },
      guruDiksha: { level: "ideal", note: "Name mantra is open to all; the tantric bija is best taken under a qualified guru." },
    },
    relatedStotraSlugs: p.stotras,
    relatedDeitySlug: p.deity,
    links: [
      { label: `Full ${p.en.split(" ")[0]} mantra & vidhi`, url: `/mantra/planet/${lord}`, rel: "internal" },
      { label: "Find your nakshatra (Panchang)", url: "https://panchang.vastucart.in", rel: "consultation" },
    ],
    faqs: [
      { question: `Which mantra is for ${en} nakshatra?`, answer: `${en} is ruled by ${p.en} in the Vimshottari system, so its mantra is used: "${nameM.name_iast}" (Vedic) or the bija "${bijaM.bija_iast}".` },
      { question: `Which planet rules ${en} nakshatra?`, answer: `${p.en} is the Vimshottari dasha lord of ${en} nakshatra, per the Brihat Parashara Hora Shastra.` },
    ],
    createdAt: "2026-05-31",
    updatedAt: "2026-05-31",
  };
});

fs.writeFileSync("src/data/mantra/nakshatras.json", JSON.stringify({ _note: "27 nakshatra mantra pages. GENERATED by scripts/gen_nakshatras.mjs — Devanagari copied programmatically from validated anchors (never hand-typed). Nakshatra->Vimshottari lord is [confirmed classical] (BPHS); remedial application is traditional convention.", nakshatras: out }, null, 2) + "\n");
console.log("WROTE nakshatras.json count=" + out.length);
