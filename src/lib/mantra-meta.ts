/**
 * Search-result title and description for the /mantra/<axis>/<slug> pages.
 * Search Console shows people typing "thursday mantra" or "friday mantra":
 * they want the mantra itself, so it goes in the title and snippet.
 *
 * Dependency-free (unit-testable under plain node). `fit` is a deliberate copy
 * of the helper in stotra-meta.ts: lib files cannot import each other both in
 * Next (no .ts extension) and in the node test runner (needs one).
 */

export const MAX_TITLE = 70;
export const MAX_DESCRIPTION = 160;

interface MantraMetaInput {
  axis: string;
  name: { en: string };
  whatIs: string;
  mantras?: { textDevanagari: string; transliteration: string }[];
  vidhi?: { benefits?: string[] };
}

/** "Thursday (Guruvar)" → "Thursday" for days (people search the English day); other axes keep both names. */
function shortName(m: MantraMetaInput): string {
  const en = m.name.en.trim();
  return m.axis === "day" ? en.replace(/\s*\([^)]*\)\s*/g, " ").trim() : en;
}

export function buildMantraTitle(m: MantraMetaInput): string {
  const name = shortName(m);
  const mantra = m.mantras?.[0]?.transliteration;
  const candidates = [
    mantra ? `${name} Mantra: ${mantra} — Meaning, Vidhi & Benefits` : "",
    mantra ? `${name} Mantra: ${mantra} — Meaning & Benefits` : "",
    `${name} Mantra — Meaning, Vidhi & Benefits`,
    `${name} Mantra`,
  ];
  return candidates.find((t) => t && t.length <= MAX_TITLE) ?? `${name} Mantra`;
}

/** Cut at the last full sentence inside the limit; fall back to a word boundary. */
function fit(text: string): string {
  if (text.length <= MAX_DESCRIPTION) return text;
  const window = text.slice(0, MAX_DESCRIPTION);
  const sentence = Math.max(window.lastIndexOf(". "), window.lastIndexOf("! "), window.lastIndexOf("? "));
  if (sentence > 40) return window.slice(0, sentence + 1);
  return window.slice(0, window.lastIndexOf(" ")).replace(/[,;:\s]+$/, "") + "…";
}

export function buildMantraDescription(m: MantraMetaInput): string {
  const name = shortName(m);
  const mantra = m.mantras?.[0];
  if (!mantra) return fit(`${name} mantra: ${m.whatIs.trim()}`);
  const head = `${name} mantra: ${mantra.transliteration} (${mantra.textDevanagari}).`;
  const mid = "Meaning, how to chant it, japa count and benefits.";
  const benefit = (m.vidhi?.benefits?.[0] ?? "").trim().replace(/[.\s]+$/, "");
  const withBenefit = benefit ? `${head} ${mid} ${benefit}.` : "";
  return withBenefit && withBenefit.length <= MAX_DESCRIPTION ? withBenefit : fit(`${head} ${mid}`);
}
