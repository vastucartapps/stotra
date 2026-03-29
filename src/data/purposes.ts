import type { Purpose } from "@/types";

export const PURPOSES: Purpose[] = [
  { id: "protection", name: "Protection", nameHi: "सुरक्षा", slug: "protection" },
  { id: "wealth", name: "Wealth & Prosperity", nameHi: "धन एवं समृद्धि", slug: "wealth" },
  { id: "health", name: "Health & Healing", nameHi: "स्वास्थ्य", slug: "health" },
  { id: "peace", name: "Peace & Harmony", nameHi: "शांति", slug: "peace" },
  { id: "knowledge", name: "Knowledge & Wisdom", nameHi: "ज्ञान एवं विद्या", slug: "knowledge" },
  { id: "devotion", name: "Devotion & Bhakti", nameHi: "भक्ति", slug: "devotion" },
  { id: "removal-of-obstacles", name: "Removal of Obstacles", nameHi: "विघ्न निवारण", slug: "removal-of-obstacles" },
  { id: "marriage", name: "Marriage & Relationships", nameHi: "विवाह", slug: "marriage" },
  { id: "children", name: "Children & Family", nameHi: "संतान", slug: "children" },
  { id: "career", name: "Career & Success", nameHi: "करियर एवं सफलता", slug: "career" },
  { id: "spiritual-growth", name: "Spiritual Growth", nameHi: "आध्यात्मिक उन्नति", slug: "spiritual-growth" },
  { id: "planetary-remedy", name: "Planetary Remedies", nameHi: "ग्रह शांति", slug: "planetary-remedy" },
  // ── New Purposes ──
  { id: "victory", name: "Victory & Competition", nameHi: "विजय", slug: "victory" },
  { id: "education", name: "Education & Exams", nameHi: "शिक्षा एवं परीक्षा", slug: "education" },
  { id: "travel-safety", name: "Travel Safety", nameHi: "यात्रा सुरक्षा", slug: "travel-safety" },
  { id: "debt-removal", name: "Debt Removal", nameHi: "ऋण मुक्ति", slug: "debt-removal" },
  { id: "enemy-protection", name: "Enemy Protection", nameHi: "शत्रु नाशक", slug: "enemy-protection" },
  { id: "legal-victory", name: "Legal Victory", nameHi: "न्यायालय में विजय", slug: "legal-victory" },
  { id: "pregnancy", name: "Pregnancy & Safe Delivery", nameHi: "गर्भ रक्षा", slug: "pregnancy" },
  { id: "longevity", name: "Longevity & Long Life", nameHi: "दीर्घायु", slug: "longevity" },
  { id: "mental-peace", name: "Mental Peace & Anxiety Relief", nameHi: "मानसिक शांति", slug: "mental-peace" },
  { id: "vastu-dosh", name: "Vastu Dosh Nivaran", nameHi: "वास्तु दोष निवारण", slug: "vastu-dosh" },
  { id: "kaal-sarp-dosh", name: "Kaal Sarp Dosh", nameHi: "काल सर्प दोष", slug: "kaal-sarp-dosh" },
  { id: "mangal-dosh", name: "Mangal Dosh", nameHi: "मंगल दोष", slug: "mangal-dosh" },
  { id: "pitru-dosh", name: "Pitru Dosh", nameHi: "पितृ दोष निवारण", slug: "pitru-dosh" },
  { id: "fear-removal", name: "Fear Removal", nameHi: "भय निवारण", slug: "fear-removal" },
  { id: "moksha", name: "Moksha & Liberation", nameHi: "मोक्ष", slug: "moksha" },
];

export function getPurposeById(id: string): Purpose | undefined {
  return PURPOSES.find((p) => p.id === id);
}

export function getPurposeBySlug(slug: string): Purpose | undefined {
  return PURPOSES.find((p) => p.slug === slug);
}
