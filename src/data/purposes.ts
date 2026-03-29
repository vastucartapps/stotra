import type { Purpose } from "@/types";

export const PURPOSES: Purpose[] = [
  { id: "protection", name: "Protection", nameHi: "सुरक्षा", slug: "protection" },
  { id: "wealth", name: "Wealth & Prosperity", nameHi: "धन एवं समृद्धि", slug: "wealth" },
  { id: "health", name: "Health & Healing", nameHi: "स्वास्थ्य", slug: "health" },
  { id: "peace", name: "Peace & Harmony", nameHi: "शांति", slug: "peace" },
  { id: "knowledge", name: "Knowledge & Wisdom", nameHi: "ज्ञान एवं विद्या", slug: "knowledge" },
  { id: "devotion", name: "Devotion & Bhakti", nameHi: "भक्ति", slug: "devotion" },
  {
    id: "removal-of-obstacles",
    name: "Removal of Obstacles",
    nameHi: "विघ्न निवारण",
    slug: "removal-of-obstacles",
  },
  { id: "marriage", name: "Marriage & Relationships", nameHi: "विवाह", slug: "marriage" },
  { id: "children", name: "Children & Family", nameHi: "संतान", slug: "children" },
  { id: "career", name: "Career & Success", nameHi: "करियर एवं सफलता", slug: "career" },
  {
    id: "spiritual-growth",
    name: "Spiritual Growth",
    nameHi: "आध्यात्मिक उन्नति",
    slug: "spiritual-growth",
  },
  {
    id: "planetary-remedy",
    name: "Planetary Remedies",
    nameHi: "ग्रह शांति",
    slug: "planetary-remedy",
  },
];

export function getPurposeById(id: string): Purpose | undefined {
  return PURPOSES.find((p) => p.id === id);
}

export function getPurposeBySlug(slug: string): Purpose | undefined {
  return PURPOSES.find((p) => p.slug === slug);
}
