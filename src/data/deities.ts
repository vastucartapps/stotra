import type { Deity } from "@/types";

export const DEITIES: Deity[] = [
  {
    id: "ganesha",
    name: "Ganesha",
    nameHi: "गणेश",
    slug: "ganesha",
    description:
      "Lord of beginnings and remover of obstacles. Worshipped first before any auspicious activity.",
    iconName: "Sparkles",
    color: "#E8751F",
  },
  {
    id: "shiva",
    name: "Shiva",
    nameHi: "शिव",
    slug: "shiva",
    description:
      "The destroyer and transformer in the Hindu trinity. Lord of meditation and cosmic dance.",
    iconName: "Mountain",
    color: "#013F47",
  },
  {
    id: "vishnu",
    name: "Vishnu",
    nameHi: "विष्णु",
    slug: "vishnu",
    description:
      "The preserver and protector of the universe. Worshipped in many avatars including Rama and Krishna.",
    iconName: "Shield",
    color: "#1A5F7A",
  },
  {
    id: "hanuman",
    name: "Hanuman",
    nameHi: "हनुमान",
    slug: "hanuman",
    description:
      "The mighty devotee of Lord Rama. Symbol of strength, courage, and unwavering devotion.",
    iconName: "Flame",
    color: "#C85103",
  },
  {
    id: "lakshmi",
    name: "Lakshmi",
    nameHi: "लक्ष्मी",
    slug: "lakshmi",
    description:
      "Goddess of wealth, fortune, and prosperity. Consort of Lord Vishnu.",
    iconName: "Crown",
    color: "#DAA520",
  },
  {
    id: "durga",
    name: "Durga",
    nameHi: "दुर्गा",
    slug: "durga",
    description:
      "The invincible goddess and fierce protector. Worshipped during Navratri for courage and victory.",
    iconName: "Swords",
    color: "#B22222",
  },
  {
    id: "krishna",
    name: "Krishna",
    nameHi: "कृष्ण",
    slug: "krishna",
    description:
      "The eighth avatar of Vishnu. Divine teacher of the Bhagavad Gita and embodiment of love.",
    iconName: "Music",
    color: "#2E4057",
  },
  {
    id: "rama",
    name: "Rama",
    nameHi: "राम",
    slug: "rama",
    description:
      "The seventh avatar of Vishnu. The ideal king and embodiment of dharma and righteousness.",
    iconName: "Target",
    color: "#1B5E20",
  },
  {
    id: "saraswati",
    name: "Saraswati",
    nameHi: "सरस्वती",
    slug: "saraswati",
    description:
      "Goddess of knowledge, music, arts, and learning. Worshipped by students and scholars.",
    iconName: "BookOpen",
    color: "#F5F5F5",
  },
  {
    id: "surya",
    name: "Surya",
    nameHi: "सूर्य",
    slug: "surya",
    description:
      "The Sun God and source of all energy. Worshipped for health, vitality, and success.",
    iconName: "Sun",
    color: "#FF9933",
  },
  {
    id: "shani",
    name: "Shani",
    nameHi: "शनि",
    slug: "shani",
    description:
      "The deity of justice and karma. Worshipped on Saturdays for relief from planetary afflictions.",
    iconName: "Scale",
    color: "#2C2C2C",
  },
  {
    id: "navagraha",
    name: "Navagraha",
    nameHi: "नवग्रह",
    slug: "navagraha",
    description:
      "The nine celestial bodies in Hindu astrology. Worshipped for planetary harmony and peace.",
    iconName: "Orbit",
    color: "#4A148C",
  },
  {
    id: "dattatreya",
    name: "Dattatreya",
    nameHi: "दत्तात्रेय",
    slug: "dattatreya",
    description:
      "The combined incarnation of Brahma, Vishnu, and Shiva. Revered as the supreme guru.",
    iconName: "Users",
    color: "#5D4037",
  },
  {
    id: "kartikeya",
    name: "Kartikeya",
    nameHi: "कार्तिकेय",
    slug: "kartikeya",
    description:
      "The god of war and son of Shiva. Commander of the divine armies and bestower of courage.",
    iconName: "Sword",
    color: "#BF360C",
  },
];

export function getDeityById(id: string): Deity | undefined {
  return DEITIES.find((d) => d.id === id);
}

export function getDeityBySlug(slug: string): Deity | undefined {
  return DEITIES.find((d) => d.slug === slug);
}
