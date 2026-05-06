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
  description: string;
  iconName: string;
  color: string;
  image?: string;
  wikipediaUrl?: string;
  wikidataUrl?: string;
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
