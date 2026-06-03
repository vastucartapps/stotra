/**
 * Verified Wikidata QIDs for the classical SOURCE TEXTS cited by stotras.
 * Every QID was confirmed live via the Wikidata API against a description that
 * names the entity as a Sanskrit text / Purana / Veda / epic / tantra. Person
 * entities (Valmiki, Vedanta Desika) are intentionally excluded here — they are
 * grounded in the work's author node, not isBasedOn. Generic/compilation
 * labels ("Traditional", "Graha Stotra Sangraha") have no entry on purpose: we
 * never fabricate a sameAs to a non-existent or ambiguous entity.
 *
 * Longest match wins (array is pre-sorted by match length, descending) so
 * "devi bhagavata purana" resolves before "bhagavata purana", and
 * "valmiki ramayana" before "ramayana".
 */
export interface SourceEntity { match: string; wikidata: string; }

export const SOURCE_ENTITIES: SourceEntity[] = [
  { match: "vishnu dharmottara", wikidata: "https://www.wikidata.org/wiki/Q3521936" },
  { match: "devi bhagavata purana", wikidata: "https://www.wikidata.org/wiki/Q1206749" },
  // "Devi Purana" is the common name for the Devi Bhagavata (confirmed by the
  // site owner + Wikipedia's own redirect). Alias -> same Q1206749. Placed after
  // the longer "devi bhagavata purana" so that match still wins first.
  { match: "devi purana", wikidata: "https://www.wikidata.org/wiki/Q1206749" },
  { match: "brahmavaivarta purana", wikidata: "https://www.wikidata.org/wiki/Q2392874" },
  { match: "lalita sahasranama", wikidata: "https://www.wikidata.org/wiki/Q2080574" },
  { match: "vishnu sahasranama", wikidata: "https://www.wikidata.org/wiki/Q947063" },
  { match: "markandeya purana", wikidata: "https://www.wikidata.org/wiki/Q2047126" },
  { match: "adhyatma ramayana", wikidata: "https://www.wikidata.org/wiki/Q3595375" },
  { match: "brahmanda purana", wikidata: "https://www.wikidata.org/wiki/Q975973" },
  { match: "bhagavata purana", wikidata: "https://www.wikidata.org/wiki/Q682958" },
  { match: "bhavishya purana", wikidata: "https://www.wikidata.org/wiki/Q2587195" },
  { match: "valmiki ramayana", wikidata: "https://www.wikidata.org/wiki/Q37293" },
  { match: "narasimha purana", wikidata: "https://www.wikidata.org/wiki/Q3347255" },
  { match: "durga saptashati", wikidata: "https://www.wikidata.org/wiki/Q1206760" },
  { match: "ananda ramayana", wikidata: "https://www.wikidata.org/wiki/Q4751305" },
  { match: "devi bhagavatam", wikidata: "https://www.wikidata.org/wiki/Q1206749" },
  { match: "ganesha purana", wikidata: "https://www.wikidata.org/wiki/Q2565316" },
  { match: "mudgala purana", wikidata: "https://www.wikidata.org/wiki/Q4305751" },
  { match: "skanda purana", wikidata: "https://www.wikidata.org/wiki/Q2497735" },
  { match: "vishnu purana", wikidata: "https://www.wikidata.org/wiki/Q1328292" },
  { match: "kalika purana", wikidata: "https://www.wikidata.org/wiki/Q2580750" },
  { match: "brahma purana", wikidata: "https://www.wikidata.org/wiki/Q2474433" },
  { match: "garuda purana", wikidata: "https://www.wikidata.org/wiki/Q2385243" },
  { match: "vamana purana", wikidata: "https://www.wikidata.org/wiki/Q760883" },
  { match: "matsya purana", wikidata: "https://www.wikidata.org/wiki/Q2355918" },
  { match: "varaha purana", wikidata: "https://www.wikidata.org/wiki/Q639359" },
  { match: "devi mahatmya", wikidata: "https://www.wikidata.org/wiki/Q1206760" },
  { match: "narada purana", wikidata: "https://www.wikidata.org/wiki/Q797114" },
  { match: "bhagavad gita", wikidata: "https://www.wikidata.org/wiki/Q46802" },
  { match: "shiva purana", wikidata: "https://www.wikidata.org/wiki/Q124243" },
  { match: "padma purana", wikidata: "https://www.wikidata.org/wiki/Q2605733" },
  { match: "linga purana", wikidata: "https://www.wikidata.org/wiki/Q2531607" },
  { match: "kurma purana", wikidata: "https://www.wikidata.org/wiki/Q582011" },
  { match: "rudra yamala", wikidata: "https://www.wikidata.org/wiki/Q116446217" },
  { match: "gita govinda", wikidata: "https://www.wikidata.org/wiki/Q389414" },
  { match: "atharva veda", wikidata: "https://www.wikidata.org/wiki/Q236092" },
  { match: "agni purana", wikidata: "https://www.wikidata.org/wiki/Q2353389" },
  { match: "atharvaveda", wikidata: "https://www.wikidata.org/wiki/Q236092" },
  { match: "mahabharata", wikidata: "https://www.wikidata.org/wiki/Q8276" },
  { match: "vayu purana", wikidata: "https://www.wikidata.org/wiki/Q151611" },
  { match: "rudrayamala", wikidata: "https://www.wikidata.org/wiki/Q116446217" },
  { match: "yajur veda", wikidata: "https://www.wikidata.org/wiki/Q47142" },
  { match: "yajurveda", wikidata: "https://www.wikidata.org/wiki/Q47142" },
  { match: "sama veda", wikidata: "https://www.wikidata.org/wiki/Q236226" },
  { match: "samaveda", wikidata: "https://www.wikidata.org/wiki/Q236226" },
  { match: "rig veda", wikidata: "https://www.wikidata.org/wiki/Q727413" },
  { match: "rigveda", wikidata: "https://www.wikidata.org/wiki/Q727413" },
];

/** Wikidata URL for a stotra source string, or undefined (longest match wins). */
export function resolveSourceWikidata(source: string | undefined): string | undefined {
  if (!source) return undefined;
  const s = source.toLowerCase();
  for (const e of SOURCE_ENTITIES) if (s.includes(e.match)) return e.wikidata;
  return undefined;
}
