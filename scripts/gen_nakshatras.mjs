#!/usr/bin/env node
/**
 * Generate nakshatras.json. Devanagari is COPIED programmatically from the
 * validated anchors (never hand-typed) so corruption is structurally
 * impossible. Each star gets a hand-written, mythology-led opener (WHATIS)
 * plus a rotating mantra sentence, so no opening skeleton repeats.
 * Nakshatra -> Vimshottari lord is [confirmed classical] (BPHS).
 */
import fs from "fs";

const bija = JSON.parse(fs.readFileSync("src/data/mantra/_canonical_bija.json", "utf8")).planets;
const vedic = JSON.parse(fs.readFileSync("src/data/mantra/_canonical_bija_vedic.json", "utf8")).planets;

// [slug, English, IAST, Vimshottari lord planet-slug]
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

// Hand-written, mythology-led openers — each leads with the star's own
// deity/symbol so no two share an opening skeleton. ASCII prose only.
const WHATIS = {
  ashwini: "Ashwini opens the wheel of nakshatras, and it opens with healers. Its presiding deities are the Ashvini Kumaras, the twin physicians of the gods, and its symbol is a horse's head — speed, fresh starts, the urge to be first. People born here often carry a pioneering, restless energy and a gift for quick recovery. Its Vimshottari lord is Ketu.",
  bharani: "Bharani belongs to Yama, the lord of death and dharma, and its symbol is the yoni, the womb. That pairing is the whole meaning: bearing, restraint, and the hard discipline of carrying something to term. It is a star of transformation through limits rather than ease. Venus is its surprising, sensual lord.",
  krittika: "Krittika is the flame. Its deity is Agni, fire itself, and its star-cluster is the Pleiades, the six mothers who nursed the war-god Kartikeya. The symbol is a blade or razor, cutting, purifying, burning away what is false. There is sharpness and ambition in anyone born here. The Sun rules it.",
  rohini: "Rohini was the Moon's favourite among his wives, and the star keeps that glow of being beloved. Its deity is Brahma the creator, its symbol an ox-cart heavy with harvest, beauty, fertility, growth, the pleasures of the material world. It is often called the most charming of the nakshatras. The Moon itself is its lord.",
  mrigashira: "The symbol of Mrigashira is a deer's head, and the image fits: a gentle, searching curiosity, always scenting the next thing. Its deity is Soma, the nectar of the moon. Natives tend to be seekers, soft-spoken and inquisitive, easily restless. Mars, unusually, is its lord, lending a quiet drive beneath the gentleness.",
  ardra: "Ardra is the storm before the clearing. Its deity is Rudra, the howling, untamed form of Shiva, and its symbol is a single teardrop. This is a star of upheaval that washes the ground clean for something new, so lives touched by it often pass through difficulty into renewal. Rahu, the shadow node, is its lord.",
  punarvasu: "The name means 'return of the light', and that is Punarvasu's gift: recovery, homecoming, the second chance after loss. Its deity is Aditi, the boundless mother of the gods, and its symbol is a quiver of arrows, readiness held in reserve. There is an easy optimism here. Jupiter, the great benefic, rules it.",
  pushya: "Pushya is widely held to be the most auspicious of all 27 nakshatras. Its deity is Brihaspati, teacher of the gods, and its symbol is a cow's udder, pure nourishment freely given. It is a star of care, steadiness and spiritual feeding, the one many traditions choose to begin good work. Saturn, the disciplinarian, is its lord.",
  ashlesha: "Ashlesha is the coiled serpent. Its deities are the Nagas, the snake-beings of the deep, and the star carries their double nature: the clinging embrace and the hidden venom, hypnotic charm and sharp insight. It is tied to kundalini, the serpent power at the base of the spine. Mercury rules it.",
  magha: "Magha seats you on a throne. Its deities are the Pitris, the ancestral fathers, and its symbol is a royal seat, lineage, inheritance, the weight and pride of where one comes from. People born here often feel a pull toward tradition, status and honouring those who came before. Ketu, keeper of the past, is its lord.",
  "purva-phalguni": "Purva Phalguni is the star of rest and delight. Its deity is Bhaga, god of fortune and marital happiness, and its symbol is the front legs of a bed, leisure, romance, the enjoyment of what has been earned. There is creativity and easy charm in natives here. Venus, fittingly, rules it.",
  "uttara-phalguni": "Where its sister-star plays, Uttara Phalguni commits. Its deity is Aryaman, god of patronage, contracts and friendship, and the symbol is the back legs of the bed, the steadiness after the romance, partnership made lasting. It favours generosity and dependable bonds. The Sun is its lord.",
  hasta: "Hasta means 'the hand', and the whole star is about what skilled hands can do: craft, dexterity, the healing touch, things made well. Its deity is Savitar, the Sun in its creative, life-stirring aspect, the one who blesses good work. Natives often have a knack others lack. The Moon rules it.",
  chitra: "Chitra is the bright jewel of the sky; its single star is the brilliant Spica. The name means 'the dazzling one', and its deity is Tvashtar, the celestial architect who fashions beautiful forms. This is a star of design, artistry and striking appearance. Mars, the maker, is its lord.",
  swati: "Swati is the young shoot bending in the wind without breaking. Its deity is Vayu, the wind itself, and its symbol is a blade of grass swaying, independence, flexibility, the strength that comes from yielding. Natives prize their freedom and self-reliance. Rahu, the boundary-crosser, rules it.",
  vishakha: "Vishakha is the star of focused ambition, a forked branch where two paths converge on one goal. Its deities are Indra and Agni together, raw power joined to transforming fire. It drives the determined pursuit of an aim, sometimes single-mindedly. Jupiter, planet of purpose, is its lord.",
  anuradha: "Anuradha is devotion that holds through hardship. Its deity is Mitra, god of friendship, contracts and the warmth between people, and its symbol is a lotus blooming in difficult ground. It blesses cooperation, loyalty and success found far from home. Saturn, who rewards steadfastness, rules it.",
  jyeshtha: "Jyeshtha means 'the eldest', the senior who has earned authority and carries its burden. Its deity is Indra, king of the gods, and its symbol is a protective amulet or umbrella. It speaks of seniority, responsibility and a certain hard-won eminence. Mercury is its lord.",
  mula: "Mula means 'the root'. Its deity is Nirriti, goddess of dissolution, and its symbol is a tied bunch of roots, getting to the bottom of things, tearing up the old to reach the foundation. It is a star of deep inquiry and sometimes painful endings that clear the way. Ketu, the node of release, rules it.",
  "purva-ashadha": "Purva Ashadha is 'the invincible', the early victory before any setback. Its deity is Apas, the cosmic waters, and its symbol is a winnowing fan. It carries unstoppable enthusiasm, the confidence of a tide coming in. Venus, planet of charm and persuasion, is its lord.",
  "uttara-ashadha": "Uttara Ashadha is the lasting victory, the one that holds. Its deities are the Vishvadevas, the universal gods, and its symbol is an elephant's tusk, strength and integrity built to endure. Natives are often principled and patient, winning slowly and keeping it. The Sun rules it.",
  shravana: "Shravana is the star of listening. Its deity is Vishnu, and its symbol is an ear, or three footprints, the receptive attention through which knowledge and tradition pass down. It favours learning, scholarship and the careful keeping of what is heard. The Moon, ruler of the receptive mind, is its lord.",
  dhanishta: "Dhanishta beats like a drum. Its deities are the eight Vasus, gods of abundance and the elements, and its symbol is a drum or flute, rhythm, wealth, fame, the pulse that moves a crowd. Natives often have a feel for music, timing and prosperity. Mars, the energetic lord, governs it.",
  shatabhisha: "Shatabhisha means 'the hundred healers', or the hundred stars, a veil of faint lights. Its deity is Varuna, god of the cosmic waters and of hidden law, and its symbol is an empty circle. It is a star of secrecy, medicine and solitary insight, drawn to what lies beneath the surface. Rahu rules it.",
  "purva-bhadrapada": "Purva Bhadrapada carries a fierce, otherworldly fire. Its deity is Aja Ekapada, the one-footed serpent of the depths, and its symbol is a two-faced figure, intensity, idealism, the readiness to burn for a cause. It looks past the comfortable toward the absolute. Jupiter is its lord.",
  "uttara-bhadrapada": "Where its sister-star flares, Uttara Bhadrapada goes still. Its deity is Ahir Budhnya, the serpent of the deep ocean, and its symbol is the back of a funeral cot, depth, calm wisdom, the peace that comes after intensity has settled. It favours patience and quiet spiritual strength. Saturn rules it.",
  revati: "Revati closes the circle. The last of the 27, its deity is Pushan, the shepherd who guides travellers and souls safely home, and its symbol is a fish swimming. It is a star of nourishment, safe journeys and gentle endings that become beginnings. Mercury is its lord.",
};

// Rotating mantra-sentence phrasings keyed by index — keeps the second
// sentence from repeating a skeleton either. IAST pulled from anchors.
function mantraSentence(idx, planetWord, nameIast, bijaIast) {
  const forms = [
    `Strengthening that lord is the traditional support, so the mantra is ${planetWord}'s — "${nameIast}", or the seed form "${bijaIast}".`,
    `The remedy follows the lord: the ${planetWord} mantra "${nameIast}", or in bija form "${bijaIast}".`,
    `To support a birth here, tradition turns to ${planetWord}'s mantra, "${nameIast}", or the tantric seed "${bijaIast}".`,
    `Natives are guided toward the ${planetWord} mantra "${nameIast}", with the seed "${bijaIast}" for deeper practice.`,
    `Its remedial mantra is ${planetWord}'s own, "${nameIast}", and the bija "${bijaIast}" for those under a teacher.`,
  ];
  return forms[idx % forms.length];
}

const out = N.map(([slug, en, iast, lord], idx) => {
  const p = P[lord];
  const nameM = vedic[lord];
  const bijaM = bija[lord];
  const planetWord = p.en.split(" ")[0];
  const opener = WHATIS[slug];
  const ms = mantraSentence(idx, planetWord, nameM.name_iast, bijaM.bija_iast);
  const whatIs = `${opener} ${ms} (The lord-to-mantra link follows the classical Vimshottari lordship; the lordship is classical, the remedial use is traditional convention.)`;

  return {
    slug,
    type: "nakshatra",
    name: { en: `${en} Nakshatra`, hi: "", iast },
    alsoKnownAs: [en, `${en} nakshatra`, `${slug.replace(/-/g, " ")} mantra`, `${en} birth star mantra`],
    whatIs,
    keyFacts: [
      { label: "Nakshatra", value: en },
      { label: "Ruling planet (Vimshottari)", value: p.en },
      { label: "Remedial mantra", value: `${planetWord} mantra` },
      { label: "Best day", value: `${p.day} (lord's day)` },
      { label: "Basis", value: "BPHS / Vimshottari lordship" },
    ],
    mantras: [
      {
        textDevanagari: nameM.name_devanagari,
        transliteration: nameM.name_iast,
        kind: "naam",
        lineage: "Vedic name + shakti",
        source: `Ruling planet ${planetWord} (Vimshottari lord of ${en}, BPHS)`,
        authenticity: "modern convention",
        englishExplanation: `The name mantra of ${p.en}, Vimshottari lord of ${en} nakshatra.`,
      },
      {
        textDevanagari: bijaM.bija_devanagari,
        transliteration: bijaM.bija_iast,
        kind: "bija",
        lineage: "Mantra Mahodadhi bija (tantric)",
        source: `Mantra Mahodadhi (${planetWord} bija)`,
        authenticity: "confirmed classical",
        englishExplanation: `The tantric seed mantra of ${p.en}, the lord of ${en}, best practised under a guru.`,
      },
    ],
    vidhi: {
      benefits: [`Strengthens the nakshatra lord ${planetWord}`, "Traditionally chanted for the significations of one's birth star"],
      bestDayToStart: `${p.day} (the lord's weekday)`,
      japaCount: { recommended: 108 },
      guruDiksha: { level: "ideal", note: "Name mantra is open to all; the tantric bija is best taken under a qualified guru." },
    },
    relatedStotraSlugs: p.stotras,
    relatedDeitySlug: p.deity,
    links: [
      { label: `Full ${planetWord} mantra & vidhi`, url: `/mantra/planet/${lord}`, rel: "internal" },
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

fs.writeFileSync(
  "src/data/mantra/nakshatras.json",
  JSON.stringify(
    {
      _note:
        "27 nakshatra mantra pages. GENERATED by scripts/gen_nakshatras.mjs — Devanagari copied programmatically from validated anchors (never hand-typed). Nakshatra->Vimshottari lord is [confirmed classical] (BPHS); remedial application is traditional convention.",
      nakshatras: out,
    },
    null,
    2
  ) + "\n"
);
console.log("WROTE nakshatras.json count=" + out.length);
