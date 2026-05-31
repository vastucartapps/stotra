import type { MantraPage, MantraAxis } from "@/types";
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
  // deity/purpose are cross-links to existing sections, not standalone data
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
