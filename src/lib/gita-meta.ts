/**
 * Meta descriptions for the Bhagavad Gita pages. They used to be ~270 characters
 * on verse pages, up to 1,095 on chapter pages (the whole summary) and 236 on the
 * index, all cut off in results. Dependency-free so it is unit-testable; `cut` is a
 * deliberate copy of the helper in stotra-meta.ts (see the note in mantra-meta.ts).
 */

export const MAX_DESCRIPTION = 160;

const VERSE_SUFFIX = " Sanskrit, word-by-word meaning, Hindi & English.";

export const GITA_INDEX_DESCRIPTION =
  "Read the complete Bhagavad Gita verse by verse: 18 chapters, 701 shlokas in Sanskrit with word-by-word meaning, Hindi and English translation, and commentary.";

/** Largest prefix of `text` within `limit`: whole sentences when possible, else whole words plus an ellipsis. */
function cut(text: string, limit: number): string {
  const t = text.trim().replace(/\s+/g, " ");
  if (t.length <= limit) return t;
  const window = t.slice(0, limit);
  const sentence = Math.max(window.lastIndexOf(". "), window.lastIndexOf("! "), window.lastIndexOf("? "));
  if (sentence > 40) return window.slice(0, sentence + 1);
  // room for the ellipsis character
  const words = t.slice(0, limit - 1);
  return words.slice(0, words.lastIndexOf(" ")).replace(/[,;:\s—-]+$/, "") + "…";
}

export function buildGitaVerseDescription(verse: { englishTranslation: string }): string {
  const lead = cut(verse.englishTranslation, MAX_DESCRIPTION - VERSE_SUFFIX.length);
  return `${lead}${VERSE_SUFFIX}`;
}

export function buildGitaChapterDescription(chapter: { description: string }): string {
  return cut(chapter.description, MAX_DESCRIPTION);
}
