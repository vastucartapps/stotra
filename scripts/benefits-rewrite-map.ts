/**
 * Benefits rewrite mapping — from hard outcome claims → tradition-framed language.
 *
 * Rationale: stotra pages are devotional-text pages on a free consumer site.
 * Hard claims ("cures diseases", "fulfills all wishes", "removes all fears")
 * are incompatible with our /disclaimer and create an AdSense review-failure
 * pattern. Google's Helpful Content System flags outcome promises on free
 * religious/spiritual sites as a YMYL misrepresentation risk.
 *
 * The rewrite keeps the devotional spirit of the original (what the tradition
 * invokes) but strips the first-person outcome guarantee.
 *
 * Mapping source: CLAUDE_CODE_PROMPT_stotra.md § P0.2, plus verb-level
 * softening for the same underlying pattern.
 *
 * Applied: 2026-04-19 consolidated rollout. Script at scripts/rewrite-benefits.py.
 */

export const EXACT_REWRITES: Record<string, string> = {
  // From the prompt's mapping table
  "Cures diseases and removes all suffering":
    "Invoked in classical tradition for protection from ailments and affliction; not a substitute for medical care",
  "Fulfills all wishes when recited with devotion":
    "Traditionally recited for fulfillment of earnest wishes",
  "Removes all fears and obstacles from life":
    "Classical tradition invokes this hymn for removal of fear (bhaya-nashana) and obstacles (vighna-hara)",
  "Grants strength, courage, and wisdom":
    "Invokes the deity's qualities of strength, courage, and discernment",
  "Protects from evil spirits and negative energies":
    "Traditionally recited for spiritual protection",
  "Bestows the blessings of Lord Rama through Hanuman":
    "Invokes the blessings of Lord Rama through Hanuman's mediation",
};

// Verb-level softening applied in order. First match per benefit wins.
export const VERB_PATTERNS: Array<[RegExp, string]> = [
  // Medical / healing language must include the disclaimer tag
  [
    /^(Cures?|Heals?)\s+(.+)$/i,
    "Associated in tradition with $2; not a substitute for medical care",
  ],
  // "Grants X" → "Invokes X" (softer, devotional)
  [/^Grants?\s+(.+)$/i, "Invokes $1"],
  // "Bestows X" → "Invokes the blessing of X"
  [/^Bestows?\s+(.+)$/i, "Invokes the blessing of $1"],
  // "Destroys X" / "Destroys all X"
  [/^Destroys?\s+all\s+(.+)$/i, "Traditionally recited for removal of $1"],
  [/^Destroys?\s+(.+)$/i, "Traditionally recited for removal of $1"],
  // "Removes all/every X"
  [/^Removes?\s+(all|every)\s+(.+)$/i, "Classical tradition invokes this for removal of $2"],
  // Plain "Removes X"
  [/^Removes?\s+(.+)$/i, "Traditionally recited for removal of $1"],
  // "Eliminates X"
  [/^Eliminates?\s+(.+)$/i, "Traditionally invoked for removal of $1"],
  // "Fulfills all X"
  [/^Fulfill?s?\s+(all|every)\s+(.+)$/i, "Traditionally recited for fulfillment of $2"],
  [/^Fulfill?s?\s+(.+)$/i, "Traditionally recited for fulfillment of $1"],
  // "Guarantees X" — strong claim, soft
  [/^Guarantees?\s+(.+)$/i, "Traditionally associated with $1"],
  // "Ensures X"
  [/^Ensures?\s+(.+)$/i, "Traditionally recited to invoke $1"],
  // "Protects from X"
  [/^Protects?\s+from\s+(.+)$/i, "Traditionally invoked for protection from $1"],
  [/^Protection\s+from\s+(.+)$/i, "Traditional invocation for protection from $1"],
  // "Brings X" — weaker claim but still outcome-language
  [/^Brings?\s+(.+)$/i, "Traditionally associated with $1"],
  // "Creates X"
  [/^Creates?\s+(.+)$/i, "Traditionally invoked to establish $1"],
];
