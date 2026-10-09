/**
 * Search-result title and description for a stotra page. Dependency-free so it
 * is unit-testable and shared by the page metadata.
 */

export const MAX_TITLE = 70;
export const MAX_DESCRIPTION = 160;
const PDF_HOOK = " Free PDF download.";

interface TitleInput {
  titleEn: string;
  title: string;
  /** Optional per-stotra override (Search Console CTR work). */
  metaTitle?: string;
}

interface DescriptionInput {
  titleEn: string;
  seoDescription?: string;
  verseCount: number;
  source: string;
  benefits?: string[];
  /** Optional per-stotra override (Search Console CTR work). */
  metaDescription?: string;
}

export function buildStotraTitle(s: TitleInput): string {
  if (s.metaTitle) return s.metaTitle;
  // Name without a subtitle after " - " / " — " or a trailing parenthetical.
  const name = s.titleEn
    .split(/\s[-—]\s/)[0]
    .replace(/\s*\([^)]*\)\s*$/, "")
    .trim();
  // Cascade keeps the title inside Google's ~70-character display window.
  const full = `${name} — ${s.title} | Sanskrit, Hindi, PDF | Stotra by VastuCart`;
  const short = `${name} — ${s.title} | Sanskrit, Hindi, PDF`;
  const medium = `${name} | Sanskrit, Hindi, PDF | Stotra`;
  const minimal = `${name} | Stotra by VastuCart`;
  return [full, short, medium].find((t) => t.length <= MAX_TITLE) ?? minimal;
}

/** Cut at the last full sentence inside the limit; fall back to a word boundary. */
function fit(text: string): string {
  if (text.length <= MAX_DESCRIPTION) return text;
  const window = text.slice(0, MAX_DESCRIPTION);
  const sentence = Math.max(window.lastIndexOf(". "), window.lastIndexOf("! "), window.lastIndexOf("? "));
  if (sentence > 40) return window.slice(0, sentence + 1);
  return window.slice(0, window.lastIndexOf(" ")).replace(/[,;:\s]+$/, "") + "…";
}

/**
 * Uses the curated per-stotra seoDescription (the old template appended
 * "Recite for <benefit>", which read as broken English whenever the benefit
 * started with a verb, e.g. "Recite for Invokes saubhagya…").
 */
export function buildStotraDescription(s: DescriptionInput): string {
  if (s.metaDescription) return s.metaDescription;
  const curated = (s.seoDescription ?? "").trim();
  if (curated.length >= 40) {
    const base = fit(curated);
    return !/pdf/i.test(base) && base.length + PDF_HOOK.length <= MAX_DESCRIPTION ? base + PDF_HOOK : base;
  }
  return fit(
    `Read ${s.titleEn} in Sanskrit with Hindi meaning and English transliteration, with a free PDF download. ${s.verseCount} verses from ${s.source}.`
  );
}
