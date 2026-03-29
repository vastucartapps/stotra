import type { Festival } from "@/types";

export const FESTIVALS: Festival[] = [
  {
    id: "navratri",
    name: "Navratri",
    nameHi: "नवरात्रि",
    slug: "navratri",
    deities: ["durga"],
  },
  {
    id: "diwali",
    name: "Diwali",
    nameHi: "दीपावली",
    slug: "diwali",
    deities: ["lakshmi", "ganesha"],
  },
  {
    id: "maha-shivaratri",
    name: "Maha Shivaratri",
    nameHi: "महाशिवरात्रि",
    slug: "maha-shivaratri",
    deities: ["shiva"],
  },
  {
    id: "ganesh-chaturthi",
    name: "Ganesh Chaturthi",
    nameHi: "गणेश चतुर्थी",
    slug: "ganesh-chaturthi",
    deities: ["ganesha"],
  },
  {
    id: "hanuman-jayanti",
    name: "Hanuman Jayanti",
    nameHi: "हनुमान जयंती",
    slug: "hanuman-jayanti",
    deities: ["hanuman"],
  },
  {
    id: "janmashtami",
    name: "Janmashtami",
    nameHi: "जन्माष्टमी",
    slug: "janmashtami",
    deities: ["krishna"],
  },
  {
    id: "ram-navami",
    name: "Ram Navami",
    nameHi: "राम नवमी",
    slug: "ram-navami",
    deities: ["rama"],
  },
  {
    id: "saraswati-puja",
    name: "Saraswati Puja",
    nameHi: "सरस्वती पूजा",
    slug: "saraswati-puja",
    deities: ["saraswati"],
  },
  {
    id: "makar-sankranti",
    name: "Makar Sankranti",
    nameHi: "मकर संक्रांति",
    slug: "makar-sankranti",
    deities: ["surya"],
  },
  {
    id: "holi",
    name: "Holi",
    nameHi: "होली",
    slug: "holi",
    deities: ["krishna", "vishnu"],
  },
  {
    id: "guru-purnima",
    name: "Guru Purnima",
    nameHi: "गुरु पूर्णिमा",
    slug: "guru-purnima",
    deities: ["dattatreya", "vishnu"],
  },
  {
    id: "ekadashi",
    name: "Ekadashi",
    nameHi: "एकादशी",
    slug: "ekadashi",
    deities: ["vishnu"],
  },
  {
    id: "kartik-purnima",
    name: "Kartik Purnima",
    nameHi: "कार्तिक पूर्णिमा",
    slug: "kartik-purnima",
    deities: ["kartikeya", "shiva"],
  },
  {
    id: "nag-panchami",
    name: "Nag Panchami",
    nameHi: "नाग पंचमी",
    slug: "nag-panchami",
    deities: ["shiva"],
  },
];

export function getFestivalById(id: string): Festival | undefined {
  return FESTIVALS.find((f) => f.id === id);
}

export function getFestivalBySlug(slug: string): Festival | undefined {
  return FESTIVALS.find((f) => f.slug === slug);
}
