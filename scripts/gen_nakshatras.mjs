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

// Hand-written, mythology-led openers (kills the templated-skeleton tell).
// Each leads with the star's own deity/symbol/significations; ASCII prose only.
const WHATIS = {
  ashwini: "Ashwini opens the wheel of nakshatras, and it opens with healers. Its presiding deities are the Ashvini Kumaras, the twin physicians of the gods, and its symbol is a horse's head — speed, fresh starts, the urge to be first. People born here often carry a pioneering, restless energy and a gift for quick recovery. Its Vimshottari lord is Ketu.",
  bharani: "Bharani belongs to Yama, the lord of death and dharma, and its symbol is the yoni — the womb. That pairing is the whole meaning: bearing, restraint, and the hard discipline of carrying something to term. It is a star of transformation through limits rather than ease. Venus is its surprising, sensual lord.",
  krittika: "Krittika is the flame. Its deity is Agni, fire itself, and its star-cluster is the Pleiades, the six mothers who nursed the war-god Kartikeya. The symbol is a blade or razor — cutting, purifying, burning away what is false. There is sharpness and ambition in anyone born here. The Sun rules it.",
  rohini: "Rohini was the Moon's favourite among his wives, and the star keeps that glow of being beloved. Its deity is Brahma the creator, its symbol an ox-cart heavy with harvest — beauty, fertility, growth, the pleasures of the material world. It is often called the most charming of the nakshatras. The Moon itself is its lord.",
  mrigashira: "The symbol of Mrigashira is a deer's head, and the image fits: a gentle, searching curiosity, always scenting the next thing. Its deity is Soma, the nectar of the moon. Natives tend to be seekers — soft-spoken, inquisitive, easily restless. Mars, unusually, is its lord, lending a quiet drive beneath the gentleness.",
  ardra: "Ardra is the storm before the clearing. Its deity is Rudra, the howling, untamed form of Shiva, and its symbol is a single teardrop. This is a star of upheaval that washes the ground clean for something new, so lives touched by it often pass through difficulty into renewal. Rahu, the shadow node, is its lord.",
  punarvasu: "The name means 'return of the light', and that is Punarvasu's gift — recovery, homecoming, the second chance after loss. Its deity is Aditi, the boundless mother of the gods, and its symbol is a quiver of arrows, readiness held in reserve. There is an easy optimism here. Jupiter, the great benefic, rules it.",
  pushya: "Pushya is widely held to be the most auspicious of all 27 nakshatras. Its deity is Brihaspati, teacher of the gods, and its symbol is a cow's udder — pure nourishment freely given. It is a star of care, steadiness and spiritual feeding, the one many traditions choose to begin good work. Saturn, the disciplinarian, is its lord.",
  ashlesha: "Ashlesha is the coiled serpent. Its deities are the Nagas, the snake-beings of the deep, and the star carries their double nature — the clinging embrace and the hidden venom, hypnotic charm and sharp insight. It is tied to kundalini, the serpent power at the base of the spine. Mercury rules it.",
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
