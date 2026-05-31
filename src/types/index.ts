// ── Pada Artha (Word-by-Word) ──
export interface PadaArthaWord {
  word: string;
  transliteration: string;
  meaning: string;
}

export interface PadaArthaVerse {
  verse: number;
  words: PadaArthaWord[];
}

// ── Stotra ──
export interface Stotra {
  id: string;
  title: string;
  titleEn: string;
  slug: string;
  devanagariText: string;
  transliteration: string;
  hindiMeaning: string;
  viniyog: Viniyog | null;
  benefits: string[];
  deity: DeityId;
  secondaryDeities?: DeityId[];
  days: DayId[];
  festivals: FestivalId[];
  purposes: PurposeId[];
  readingTimeMinutes: number;
  description?: string;
  padaartha?: PadaArthaVerse[];
  seoDescription: string;
  verseCount: number;
  source: string;
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
  // ── SEO enrichment (optional, populated by per-stotra SERP research) ──
  /** Additional FAQs harvested from "People Also Ask" — appended to the 5 auto-generated ones */
  seoFaqs?: FAQItem[];
  /** Variant titles, alternate spellings, regional names — surfaced as a subtitle and indexed */
  alsoKnownAs?: string[];
  /** "People also search for" terms — rendered as a related-searches block below the article */
  relatedSearches?: string[];
  /** Wikipedia URL for this stotra (entity-linking → Knowledge Graph + JSON-LD sameAs) */
  wikipediaUrl?: string;
  /** Wikidata URL for this stotra */
  wikidataUrl?: string;
}

/**
 * Minimal "card" shape used at every server→client component boundary that
 * renders a list of stotras (sidebars, related-grids, today-grid, etc.).
 *
 * Why this exists: passing full `Stotra` objects (which carry devanagariText,
 * transliteration, hindiMeaning, padaartha) as props to a "use client"
 * component forces Next.js to serialize the entire object graph into the RSC
 * stream. With 930 stotras that grows the per-page HTML to 10MB+ uncompressed
 * and triggers Googlebot's render-budget rejection — the root cause of the
 * 0/1,767 sitemap-indexed state.
 */
export interface StotraCardSummary {
  slug: string;
  title: string;       // Devanagari
  titleEn: string;
  deity: DeityId;
  verseCount: number;
  readingTimeMinutes: number;
  seoDescription: string;
}

/** Extended card used by the "Stotra of the Day" hero block (homepage). */
export interface StotraOfTheDayCard extends StotraCardSummary {
  source: string;
  benefitPreview: string[]; // first 3 only
  firstVerses: string;      // first 3 non-empty devanagari lines, pre-joined
}

export interface Viniyog {
  rishi: string;
  chhand: string;
  devata: string;
  beej: string;
  shakti: string;
  kilak: string;
  nyasa?: string;
  shloka?: string;
}

// ── Mantra section ──
export type MantraAxis = "planet" | "rashi" | "nakshatra" | "day" | "deity" | "purpose";

/** Provenance tag — NEVER fabricate; every mantra must carry one. */
export type MantraAuthenticity =
  | "confirmed classical"   // stated in a named primary text
  | "modern convention"     // post-classical compiled/popular usage
  | "variable by tradition"; // authentic but sampradaya/region-dependent

export interface MantraEntry {
  /** Devanagari text — validated byte-for-byte against canonical anchors. */
  textDevanagari: string;
  /** IAST/roman transliteration. */
  transliteration: string;
  /** bija | gayatri | naam | dhyana | beej-with-shakti */
  kind: string;
  /** e.g. "Mantra Mahodadhi bija (tantric)" | "Vedic name + shakti" | "Navagraha Gayatri". Lineages are shown side-by-side, never merged. */
  lineage: string;
  /** Named primary/secondary source — required (no fabrication). */
  source: string;
  authenticity: MantraAuthenticity;
  /** Optional syllable → meaning breakdown. */
  syllableMeaning?: { syllable: string; meaning: string }[];
  hindiExplanation?: string;
  englishExplanation?: string;
  /** Full meaning paragraph. */
  meaning?: string;
}

/** How to practise — the prayoga/vidhi block. All optional; render what exists. */
export interface MantraVidhi {
  benefits?: string[];
  /** What realistically changes — framed as traditional purpose, not a guarantee. */
  impact?: string;
  japaCount?: { minPerDay?: number; recommended?: number; totalSankalpa?: number };
  mala?: { type: string; beads: number; why?: string };
  durationDays?: { minimum?: number; recommended?: number };
  bestTime?: string;
  bestDayToStart?: string;
  direction?: string;
  asana?: string;
  pujaSamagri?: string[];
  pujaModes?: { minimal?: string; medium?: string; full?: string };
  guruDiksha?: { level: "ideal" | "necessary" | "not-required"; note?: string };
  deityImageOrIdol?: string;
  dosAndDonts?: { dos: string[]; donts: string[] };
}

/** A commerce/consultation/ecosystem outbound link (phase-2-ready). */
export interface MantraLink {
  label: string;
  url: string;
  /** product | consultation | ecosystem */
  rel: string;
}

export interface MantraPage {
  slug: string;
  type: MantraAxis;
  name: { en: string; hi: string; iast?: string };
  alsoKnownAs?: string[];
  /** Short self-contained "what is" passage (~150 words) — the AI-citation unit. */
  whatIs: string;
  /** TL;DR / key-facts lines for the summary box. */
  keyFacts: { label: string; value: string }[];
  /** Ruling/associated entity for schema sameAs grounding. */
  entity?: { name: string; wikipedia?: string; wikidata?: string };
  /** The verified mantra(s) — multiple lineages allowed, each labelled. */
  mantras: MantraEntry[];
  vidhi?: MantraVidhi;
  faqs?: FAQItem[];
  /** Cross-links to existing stotra/deity pages (no content duplication). */
  relatedStotraSlugs?: string[];
  relatedDeitySlug?: string;
  /** Outbound ecosystem/commerce/consultation links. */
  links?: MantraLink[];
  createdAt: string;
  updatedAt: string;
}

// ── Deity ──
export type DeityId =
  // Trinity & primary devas
  | "ganesha" | "shiva" | "vishnu" | "brahma" | "rudra"
  // Vishnu avatars & forms
  | "rama" | "krishna" | "narasimha" | "vamana" | "varaha"
  | "hayagriva" | "narayana" | "jagannath" | "balabhadra"
  // Devi forms
  | "durga" | "lakshmi" | "saraswati" | "parvati" | "kali"
  | "radha" | "sita" | "rukmini" | "subhadra" | "tara"
  | "tripurasundari" | "lalita" | "bhudevi" | "savitri"
  | "yamuna" | "ganga" | "narmada" | "gayatri" | "tulsi"
  | "aditi"
  // Bhakti / family of avatars
  | "hanuman" | "lakshmana" | "garuda" | "nandi" | "prahlada"
  | "yashoda" | "devaki" | "gopi" | "arjuna"
  // Shaivite / regional
  | "kartikeya" | "ayyappa" | "vitthal" | "bhairava" | "bhairav"
  | "dattatreya" | "dhanvantari" | "kubera" | "kamadeva"
  // Vedic devas
  | "agni" | "indra" | "vayu" | "varuna" | "yama" | "surya"
  | "ashwini-kumars" | "agastya"
  // Navagraha (planets)
  | "navagraha" | "shani" | "mangal" | "budha" | "brihaspati"
  | "shukra" | "rahu" | "ketu" | "chandra"
  // Ancestors
  | "pitru"
  // Modern saints
  | "saibaba";

export interface Deity {
  id: DeityId;
  name: string;
  nameHi: string;
  slug: string;
  /** One-sentence hub-card summary. Stays short for grids. */
  description: string;
  iconName: string;
  color: string;
  image?: string;
  wikipediaUrl?: string;
  wikidataUrl?: string;
  /**
   * Long-form essay paragraphs rendered on /deity/[slug] above the
   * stotra list. Brings deity hub pages above the 500-word location-page
   * minimum that Google's QRG uses to score authority. Each entry is one
   * paragraph; no HTML, no markdown — rendered as <p>.
   * Sources must be classical (Puranas, Itihasas, Vedas, named acharyas)
   * with no fabrication.
   */
  essay?: string[];
  /** Optional section headings paired with essay paragraphs (parallel index). */
  essayHeadings?: string[];
}

// ── Day ──
export type DayId =
  | "sunday" | "monday" | "tuesday" | "wednesday"
  | "thursday" | "friday" | "saturday" | "daily";

export interface Day {
  id: DayId;
  name: string;
  nameHi: string;
  slug: string;
  deities: DeityId[];
}

// ── Festival ──
export type FestivalId =
  // Major pan-India festivals
  | "navratri" | "chaitra-navratri" | "shakambhari-navratri"
  | "diwali" | "dhanteras" | "govardhan-puja" | "bhai-dooj"
  | "holi" | "holika-dahan" | "dussehra" | "vijayadashami"
  | "maha-shivaratri" | "ganesh-chaturthi" | "anant-chaturdashi"
  | "janmashtami" | "ram-navami" | "hanuman-jayanti"
  // Devi & Shakta calendar
  | "durga-puja" | "durga-ashtami" | "maha-navami" | "kali-puja"
  | "lalita-jayanti" | "lalita-panchami" | "annapurna-jayanti"
  | "gauri-puja" | "gauri-tritiya" | "gangaur" | "teej" | "hartalika-teej"
  | "sita-navami" | "radha-ashtami" | "santoshi-mata-vrat"
  | "saraswati-puja" | "vasant-panchami" | "basant-panchami"
  | "varalakshmi-vrata" | "vaibhav-lakshmi-vrat" | "lakshmi-puja"
  | "baglamukhi-jayanti" | "dhumavati-jayanti" | "shakambhari-navratri"
  | "meenakshi-kalyanam" | "sheetala-saptami" | "basoda"
  // Vishnu & avatar jayantis
  | "narasimha-jayanti" | "narasimha-chaturdashi" | "vamana-jayanti"
  | "varaha-jayanti" | "matsya-jayanti" | "kurma-jayanti"
  | "parashurama-jayanti" | "kalki-jayanti" | "vishnu-jayanti"
  | "hayagriva-jayanti" | "sudarshana-jayanti" | "madhva-navami"
  | "rath-yatra" | "jagannath-rath-yatra" | "snana-yatra"
  // Ekadashi family
  | "ekadashi" | "vaikuntha-ekadashi" | "nirjala-ekadashi"
  | "devshayani-ekadashi" | "devuthani-ekadashi" | "shyam-ekadashi"
  | "ashadhi-ekadashi" | "kartiki-ekadashi"
  // Shiva & Shaivite
  | "pradosha" | "pradosh" | "shravan" | "shravan-somvar"
  | "kaal-bhairav-ashtami" | "kala-bhairava-ashtami" | "bhairav-ashtami"
  | "bhairava-jayanti" | "kalashtami" | "arudra-darshanam"
  | "skanda-shashthi" | "skanda-shashti" | "kartikeya-jayanti"
  | "vaikasi-visakam" | "thaipusam" | "mandala-puja" | "makara-vilakku"
  // Krishna calendar
  | "gita-jayanti" | "radha-ashtami" | "gopashtami"
  // Ganesha
  | "sankashti-chaturthi"
  // Pitru & ancestors
  | "pitru-paksha"
  // Surya
  | "makar-sankranti" | "ratha-saptami" | "chhath-puja"
  // River goddess festivals
  | "ganga-dussehra" | "ganga-jayanti" | "yamuna-jayanti"
  | "yamuna-chhath" | "narmada-jayanti"
  // Marriage / women observances
  | "raksha-bandhan" | "karva-chauth" | "vat-savitri"
  | "ahoi-ashtami" | "rishi-panchami" | "vivaha-panchami" | "vivah-panchami"
  | "tulsi-vivah" | "akshaya-tritiya"
  // Purnima / Amavasya / general
  | "purnima" | "amavasya" | "kartik-purnima" | "sharad-purnima"
  | "budh-purnima" | "guru-purnima" | "dev-deepawali"
  // Saint & acharya jayantis
  | "datta-jayanti" | "dattatreya-jayanti" | "shankaracharya-jayanti"
  | "brahma-jayanti" | "gayatri-jayanti" | "dhanvantari-jayanti"
  // Navagraha jayantis & observances
  | "shani-jayanti" | "shani-amavasya" | "mangal-jayanti" | "shukra-jayanti"
  | "graha-shanti" | "grahan-puja"
  // Naga & serpent
  | "nag-panchami" | "naga-panchami" | "garuda-panchami"
  // Regional & misc
  | "mahalaya" | "onam" | "satyanarayan-puja" | "vishwakarma-jayanti"
  | "annakut" | "kumbh-mela" | "phalguna-mela" | "ambubachi"
  | "brahmotsavam" | "vaishno-devi-yatra" | "badrinath-opening"
  | "margashirsha-month" | "festival-worship" | "griha-pravesh";

// ── Purpose ──
// NOTE: This union absorbs all values currently used in src/data/stotras/*.json.
// Many entries are duplicate-spellings (obstacle-removal vs removal-of-obstacles,
// liberation vs moksha, abundance vs prosperity etc.) and will be consolidated by
// the purpose-taxonomy migration script. Keep additions alphabetical within
// thematic groups for review-ability.
export type PurposeId =
  // Core spiritual
  | "devotion" | "spiritual-growth" | "moksha" | "liberation"
  | "meditation" | "japa" | "chanting" | "kirtan" | "worship"
  | "daily-worship" | "daily-prayer" | "morning-prayer"
  | "archana-puja" | "abhishek-puja" | "aarti" | "yajna" | "fasting"
  | "pilgrimage" | "festival-worship" | "ritual-success"
  | "purification" | "sin-removal" | "removal-of-sins"
  | "auspiciousness" | "surrender" | "vairagya"
  // Wealth & prosperity
  | "wealth" | "prosperity" | "abundance" | "business" | "business-success"
  | "removal-of-poverty" | "debt-removal" | "debt-relief" | "debt-freedom"
  | "property" | "agriculture"
  // Health & vitality
  | "health" | "healing" | "removal-of-diseases" | "longevity" | "vitality"
  | "energy" | "good-sleep" | "mental-health" | "mental-peace" | "emotional-balance"
  | "peace" | "harmony" | "happiness"
  // Knowledge & wisdom
  | "knowledge" | "wisdom" | "education" | "speech" | "creativity"
  | "arts" | "artistic-talent" | "artistic-mastery" | "skill-enhancement"
  // Family
  | "marriage" | "marital-harmony" | "marital-bliss" | "saubhagya"
  | "love" | "family" | "family-harmony" | "family-happiness" | "family-welfare"
  | "children" | "children-welfare" | "protection-of-children"
  | "fertility" | "pregnancy"
  // Protection & security
  | "protection" | "fear-removal" | "fearlessness" | "courage" | "strength"
  | "enemy-protection" | "enemy-removal" | "removal-of-enemies"
  | "occult-protection" | "evil-eye-removal" | "black-magic-removal"
  | "removal-of-evil" | "travel-safety"
  // Career & success
  | "career" | "success" | "victory" | "leadership" | "power"
  | "stability" | "new-beginnings" | "wish-fulfillment" | "fulfillment-of-desires"
  | "desire-fulfillment" | "siddhi" | "mantra-siddhi"
  // Obstacle removal
  | "removal-of-obstacles" | "obstacle-removal"
  // Legal
  | "legal-victory" | "justice"
  // Astrology / dosha
  | "planetary-remedy" | "graha-shanti" | "vastu-dosh" | "vastu-shanti" | "vastu"
  | "kaal-sarp-dosh" | "mangal-dosh" | "pitru-dosh" | "pitru-tarpan"
  | "dosha-removal" | "removal-of-graha-dosha" | "sarpa-dosha-nivaran"
  | "ancestral-blessings"
  // Karma & guru
  | "karma" | "karmic-healing" | "karmic-relief" | "forgiveness"
  | "guru-kripa"
  // Ethics & character
  | "dharma" | "righteousness" | "truth" | "truthfulness"
  | "ethics" | "moral-values" | "humility" | "patience" | "discipline"
  | "determination" | "character-building" | "brahmacharya"
  | "equality" | "celebration" | "beauty";

export interface Festival {
  id: FestivalId;
  name: string;
  nameHi: string;
  slug: string;
  deities: DeityId[];
  wikipediaUrl?: string;
  wikidataUrl?: string;
}

export interface Purpose {
  id: PurposeId;
  name: string;
  nameHi: string;
  slug: string;
}

// ── FAQ ──
export interface FAQItem {
  question: string;
  answer: string;
}

// ── Ecosystem ──
// ── Bhagavad Gita ──
export interface GitaWordMeaning {
  word: string;
  transliteration: string;
  meaning: string;
}

export interface GitaVerse {
  verseNumber: number;
  slug: string;
  speaker: string;
  devanagari: string;
  transliteration: string;
  wordByWord: GitaWordMeaning[];
  hindiTranslation: string;
  englishTranslation: string;
  commentary: string;
}

export interface GitaChapter {
  chapterNumber: number;
  titleSanskrit: string;
  titleHindi: string;
  titleEnglish: string;
  slug: string;
  description: string;
  verseCount: number;
  verses: GitaVerse[];
}

export interface EcosystemSite {
  name: string;
  url: string;
  description: string;
  tagline: string;
}
