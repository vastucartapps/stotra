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
  seoDescription: string;
  verseCount: number;
  source: string;
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
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
  | "ganesha" | "shiva" | "vishnu" | "hanuman" | "lakshmi"
  | "durga" | "krishna" | "rama" | "saraswati" | "surya"
  | "shani" | "navagraha" | "dattatreya" | "kartikeya"
  | "kali" | "narasimha" | "radha" | "parvati" | "sita"
  | "bhairava" | "ayyappa" | "jagannath" | "kubera"
  | "dhanvantari" | "gayatri" | "ganga" | "vitthal"
  | "brahma" | "agni" | "indra" | "vayu" | "saibaba";

export interface Deity {
  id: DeityId;
  name: string;
  nameHi: string;
  slug: string;
  description: string;
  iconName: string;
  color: string;
  image?: string;
}

// ── Day ──
export type DayId =
  | "sunday" | "monday" | "tuesday" | "wednesday"
  | "thursday" | "friday" | "saturday";

export interface Day {
  id: DayId;
  name: string;
  nameHi: string;
  slug: string;
  deities: DeityId[];
}

// ── Festival ──
export type FestivalId =
  | "navratri" | "diwali" | "maha-shivaratri" | "ganesh-chaturthi"
  | "hanuman-jayanti" | "janmashtami" | "ram-navami" | "saraswati-puja"
  | "makar-sankranti" | "holi" | "guru-purnima" | "ekadashi"
  | "kartik-purnima" | "nag-panchami"
  | "chhath-puja" | "raksha-bandhan" | "karva-chauth" | "sharad-purnima"
  | "akshaya-tritiya" | "vasant-panchami" | "dussehra"
  | "govardhan-puja" | "dhanteras" | "dev-deepawali" | "tulsi-vivah"
  | "vivaha-panchami" | "pradosha" | "purnima" | "amavasya"
  | "ratha-saptami" | "skanda-shashthi" | "dattatreya-jayanti"
  | "narasimha-jayanti" | "vaikuntha-ekadashi" | "gita-jayanti"
  | "holika-dahan" | "maha-navami" | "anant-chaturdashi";

// ── Purpose ──
export type PurposeId =
  | "protection" | "wealth" | "health" | "peace" | "knowledge"
  | "devotion" | "removal-of-obstacles" | "marriage" | "children"
  | "career" | "spiritual-growth" | "planetary-remedy"
  | "victory" | "education" | "travel-safety" | "debt-removal"
  | "enemy-protection" | "legal-victory" | "pregnancy" | "longevity"
  | "mental-peace" | "vastu-dosh" | "kaal-sarp-dosh" | "mangal-dosh"
  | "pitru-dosh" | "fear-removal" | "moksha";

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
export interface EcosystemSite {
  name: string;
  url: string;
  description: string;
  tagline: string;
}
