/**
 * The visible "Quick Takeaway" at the top of a stotra page: a short, answer-first group
 * of sentences a reader, a search snippet or an AI answer can quote. Built only from the
 * stotra's own fields; anything the data does not have is left out, never guessed.
 * Dependency-free so it is unit-testable under plain node.
 */

interface TakeawayInput {
  titleEn: string;
  verseCount: number;
  readingTimeMinutes: number;
  days?: string[];
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

function joinDays(days: string[]): string {
  const d = days.map(cap);
  if (d.length <= 1) return d.join("");
  return `${d.slice(0, -1).join(", ")} and ${d[d.length - 1]}`;
}

export function buildQuickTakeaway(s: TakeawayInput, deityName: string | null): string {
  const verses = `${s.verseCount} verse${s.verseCount === 1 ? "" : "s"}`;
  const minutes = `${s.readingTimeMinutes} minute${s.readingTimeMinutes === 1 ? "" : "s"}`;
  const days = (s.days ?? []).filter(Boolean);

  const first = deityName
    ? `${s.titleEn} has ${verses} and is dedicated to ${deityName}.`
    : null;
  const second = days.length
    ? `It is traditionally recited on ${joinDays(days)} and takes about ${minutes} to read.`
    : null;
  // No deity or days: one honest sentence with what is known.
  const facts = [first, second].filter(Boolean);
  const lead = facts.length
    ? (days.length && !deityName ? `${s.titleEn} has ${verses}. ${second}` : facts.join(" "))
    : `${s.titleEn} has ${verses} and takes about ${minutes} to read.`;

  return `${lead} Below you will find the Sanskrit text with transliteration, Hindi meaning and English, plus a free PDF.`;
}
