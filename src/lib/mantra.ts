import type { MantraPage, MantraAxis, FAQItem } from "@/types";
import planets from "@/data/mantra/planets.json";
import days from "@/data/mantra/days.json";
import rashis from "@/data/mantra/rashis.json";
import nakshatras from "@/data/mantra/nakshatras.json";

/**
 * Mantra section data access. The five collection JSONs under
 * src/data/mantra/ are the source of truth; their Devanagari is validated
 * byte-for-byte against the canonical anchors by scripts/validate_mantra.mjs.
 */

const COLLECTIONS: Record<MantraAxis, MantraPage[]> = {
  planet: (planets as { planets: MantraPage[] }).planets,
  day: (days as { days: MantraPage[] }).days,
  rashi: (rashis as { rashis: MantraPage[] }).rashis,
  nakshatra: (nakshatras as { nakshatras: MantraPage[] }).nakshatras,
  deity: [],
  purpose: [],
};

/** Axes that have real indexable member pages (Lagna is an explainer, not a list). */
export const MANTRA_AXES: { axis: MantraAxis; label: string; hi: string; blurb: string }[] = [
  { axis: "planet", label: "Planet (Navagraha)", hi: "नवग्रह", blurb: "Bija & Gayatri mantras for the nine planets" },
  { axis: "rashi", label: "Rashi (Zodiac)", hi: "राशि", blurb: "Remedial mantra for each of the 12 moon signs" },
  { axis: "nakshatra", label: "Nakshatra (Birth Star)", hi: "नक्षत्र", blurb: "Mantra for each of the 27 lunar mansions" },
  { axis: "day", label: "Day of the Week", hi: "वार", blurb: "The mantra and deity for each weekday" },
];

export function getMantrasByAxis(axis: MantraAxis): MantraPage[] {
  return COLLECTIONS[axis] ?? [];
}

export function getAllMantras(): MantraPage[] {
  return MANTRA_AXES.flatMap((a) => COLLECTIONS[a.axis]);
}

export function getMantra(axis: MantraAxis, slug: string): MantraPage | null {
  return (COLLECTIONS[axis] ?? []).find((m) => m.slug === slug) ?? null;
}

export function getMantraCount(): number {
  return getAllMantras().length;
}

/** All (axis, slug) pairs for generateStaticParams. */
export function allMantraParams(): { axis: string; slug: string }[] {
  return MANTRA_AXES.flatMap((a) =>
    COLLECTIONS[a.axis].map((m) => ({ axis: a.axis, slug: m.slug }))
  );
}

const kf = (m: MantraPage, label: string): string | undefined =>
  m.keyFacts.find((k) => k.label.toLowerCase().includes(label.toLowerCase()))?.value;

/**
 * Build a full FAQ set (8–10 Q&A) for a mantra page from its OWN validated
 * data — curated faqs first, then deterministic ones derived from the
 * mantra list and vidhi. Every answer is page-specific (names, counts,
 * sources differ per page), so the FAQPage schema is rich, not thin, and
 * not templated. Used by both the page render and the JSON-LD.
 */
export function buildMantraFaqs(m: MantraPage): FAQItem[] {
  const faqs: FAQItem[] = [...(m.faqs ?? [])];
  const seen = new Set(faqs.map((f) => f.question.toLowerCase().trim()));
  const add = (question: string, answer: string) => {
    const key = question.toLowerCase().trim();
    if (seen.has(key)) return;
    seen.add(key);
    faqs.push({ question, answer });
  };

  const name = m.name.en;
  const bija = m.mantras.find((x) => x.kind === "bija");
  const naam = m.mantras.find((x) => x.kind === "naam");
  const gayatri = m.mantras.find((x) => x.kind === "gayatri");
  const v = m.vidhi;

  if (naam || bija) {
    const primary = naam ?? bija!;
    add(
      `What is the ${name} mantra?`,
      `The ${name} mantra is "${primary.transliteration}" (${primary.textDevanagari}). ${primary.englishExplanation ?? ""} It is recorded in the ${primary.lineage} tradition; source: ${primary.source}.`.trim()
    );
  }
  if (bija) {
    add(
      `What is the ${name} beej (seed) mantra?`,
      `The ${name} beej mantra is "${bija.transliteration}" — in Devanagari, ${bija.textDevanagari}. It comes from the ${bija.lineage} (${bija.source}) and is best taken under a qualified guru.`
    );
  }
  if (gayatri) {
    add(
      `What is the ${name} Gayatri mantra?`,
      `The ${name} Gayatri is "${gayatri.transliteration}" (${gayatri.textDevanagari}). It follows the 24-syllable Vidmahe–Dhimahi–Prachodayat structure; the epithets vary by tradition.`
    );
  }
  if (v?.bestDayToStart || kf(m, "best day")) {
    add(
      `Which day is best to chant the ${name} mantra?`,
      `The ${name} mantra is traditionally begun on ${v?.bestDayToStart ?? kf(m, "best day")}. ${v?.bestTime ? `The recommended time is ${v.bestTime}.` : ""}`.trim()
    );
  }
  if (v?.japaCount?.recommended) {
    const tot = v.japaCount.totalSankalpa ? ` For a full observance, a sankalpa of ${v.japaCount.totalSankalpa.toLocaleString("en-IN")} repetitions is undertaken, usually over ${v.durationDays?.recommended ?? 40} days.` : "";
    add(
      `How many times should the ${name} mantra be chanted?`,
      `Traditionally ${v.japaCount.recommended} times a day, counted on a mala.${tot}`
    );
  }
  if (v?.mala) {
    add(
      `Which mala is used for the ${name} mantra?`,
      `A ${v.mala.beads}-bead ${v.mala.type} is traditionally used.${v.mala.why ? ` ${v.mala.why}.` : ""}`
    );
  }
  if (v?.direction) {
    add(
      `Which direction should you face for the ${name} mantra?`,
      `Face ${v.direction.replace(/^Face\s*/i, "")} while chanting the ${name} mantra, seated on ${v.asana ?? "a clean woollen seat"}.`
    );
  }
  if (v?.guruDiksha) {
    const lvl = v.guruDiksha.level;
    const ans =
      lvl === "necessary"
        ? `For ${name}, initiation (guru diksha) is considered necessary before taking up the tantric bija — ${v.guruDiksha.note ?? "work with a qualified teacher"}.`
        : lvl === "not-required"
        ? `No initiation is required to chant the simple name mantra of ${name}; ${v.guruDiksha.note ?? "it is open to all"}.`
        : `The simple name mantra of ${name} is open to all; for the tantric bija, guru diksha is considered ideal. ${v.guruDiksha.note ?? ""}`.trim();
    add(`Do you need guru diksha to chant the ${name} mantra?`, ans);
  }
  if (v?.benefits && v.benefits.length) {
    add(
      `What are the benefits of the ${name} mantra?`,
      `${v.benefits.join("; ")}.${v.impact ? ` ${v.impact}` : ""}`
    );
  }
  if (v?.pujaModes?.minimal) {
    add(
      `What is the simplest way to begin the ${name} mantra?`,
      `Minimal practice: ${v.pujaModes.minimal}. As devotion grows, you can move to the fuller observance${v.pujaModes.full ? ` — ${v.pujaModes.full}` : ""}.`
    );
  }

  return faqs;
}
