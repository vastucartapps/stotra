import type { Festival } from "@/types";

export const FESTIVALS: Festival[] = [
  { id: "navratri", name: "Navratri", nameHi: "नवरात्रि", slug: "navratri", deities: ["durga"] },
  { id: "diwali", name: "Diwali", nameHi: "दीपावली", slug: "diwali", deities: ["lakshmi", "ganesha"] },
  { id: "maha-shivaratri", name: "Maha Shivaratri", nameHi: "महाशिवरात्रि", slug: "maha-shivaratri", deities: ["shiva"] },
  { id: "ganesh-chaturthi", name: "Ganesh Chaturthi", nameHi: "गणेश चतुर्थी", slug: "ganesh-chaturthi", deities: ["ganesha"] },
  { id: "hanuman-jayanti", name: "Hanuman Jayanti", nameHi: "हनुमान जयंती", slug: "hanuman-jayanti", deities: ["hanuman"] },
  { id: "janmashtami", name: "Janmashtami", nameHi: "जन्माष्टमी", slug: "janmashtami", deities: ["krishna"] },
  { id: "ram-navami", name: "Ram Navami", nameHi: "राम नवमी", slug: "ram-navami", deities: ["rama"] },
  { id: "saraswati-puja", name: "Saraswati Puja", nameHi: "सरस्वती पूजा", slug: "saraswati-puja", deities: ["saraswati"] },
  { id: "makar-sankranti", name: "Makar Sankranti", nameHi: "मकर संक्रांति", slug: "makar-sankranti", deities: ["surya"] },
  { id: "holi", name: "Holi", nameHi: "होली", slug: "holi", deities: ["krishna", "vishnu"] },
  { id: "guru-purnima", name: "Guru Purnima", nameHi: "गुरु पूर्णिमा", slug: "guru-purnima", deities: ["dattatreya", "vishnu"] },
  { id: "ekadashi", name: "Ekadashi", nameHi: "एकादशी", slug: "ekadashi", deities: ["vishnu"] },
  { id: "kartik-purnima", name: "Kartik Purnima", nameHi: "कार्तिक पूर्णिमा", slug: "kartik-purnima", deities: ["kartikeya", "shiva"] },
  { id: "nag-panchami", name: "Nag Panchami", nameHi: "नाग पंचमी", slug: "nag-panchami", deities: ["shiva"] },
  // ── New Festivals ──
  { id: "chhath-puja", name: "Chhath Puja", nameHi: "छठ पूजा", slug: "chhath-puja", deities: ["surya"] },
  { id: "raksha-bandhan", name: "Raksha Bandhan", nameHi: "रक्षा बंधन", slug: "raksha-bandhan", deities: ["vishnu", "lakshmi"] },
  { id: "karva-chauth", name: "Karva Chauth", nameHi: "करवा चौथ", slug: "karva-chauth", deities: ["shiva", "parvati", "ganesha"] },
  { id: "sharad-purnima", name: "Sharad Purnima", nameHi: "शरद पूर्णिमा", slug: "sharad-purnima", deities: ["lakshmi", "krishna"] },
  { id: "akshaya-tritiya", name: "Akshaya Tritiya", nameHi: "अक्षय तृतीया", slug: "akshaya-tritiya", deities: ["vishnu", "lakshmi"] },
  { id: "vasant-panchami", name: "Vasant Panchami", nameHi: "वसंत पंचमी", slug: "vasant-panchami", deities: ["saraswati"] },
  { id: "dussehra", name: "Dussehra", nameHi: "दशहरा / विजयादशमी", slug: "dussehra", deities: ["rama", "durga"] },
  { id: "govardhan-puja", name: "Govardhan Puja", nameHi: "गोवर्धन पूजा", slug: "govardhan-puja", deities: ["krishna"] },
  { id: "dhanteras", name: "Dhanteras", nameHi: "धनतेरस", slug: "dhanteras", deities: ["lakshmi", "dhanvantari", "kubera"] },
  { id: "dev-deepawali", name: "Dev Deepawali", nameHi: "देव दीपावली", slug: "dev-deepawali", deities: ["shiva"] },
  { id: "tulsi-vivah", name: "Tulsi Vivah", nameHi: "तुलसी विवाह", slug: "tulsi-vivah", deities: ["vishnu", "lakshmi"] },
  { id: "vivaha-panchami", name: "Vivaha Panchami", nameHi: "विवाह पंचमी", slug: "vivaha-panchami", deities: ["rama", "sita"] },
  { id: "pradosha", name: "Pradosha", nameHi: "प्रदोष", slug: "pradosha", deities: ["shiva"] },
  { id: "purnima", name: "Purnima", nameHi: "पूर्णिमा", slug: "purnima", deities: ["vishnu", "lakshmi"] },
  { id: "amavasya", name: "Amavasya", nameHi: "अमावस्या", slug: "amavasya", deities: ["shani", "hanuman"] },
  { id: "ratha-saptami", name: "Ratha Saptami", nameHi: "रथ सप्तमी", slug: "ratha-saptami", deities: ["surya"] },
  { id: "skanda-shashthi", name: "Skanda Shashthi", nameHi: "स्कंद षष्ठी", slug: "skanda-shashthi", deities: ["kartikeya"] },
  { id: "dattatreya-jayanti", name: "Dattatreya Jayanti", nameHi: "दत्तात्रेय जयंती", slug: "dattatreya-jayanti", deities: ["dattatreya"] },
  { id: "narasimha-jayanti", name: "Narasimha Jayanti", nameHi: "नरसिंह जयंती", slug: "narasimha-jayanti", deities: ["narasimha"] },
  { id: "vaikuntha-ekadashi", name: "Vaikuntha Ekadashi", nameHi: "वैकुंठ एकादशी", slug: "vaikuntha-ekadashi", deities: ["vishnu"] },
  { id: "gita-jayanti", name: "Gita Jayanti", nameHi: "गीता जयंती", slug: "gita-jayanti", deities: ["krishna"] },
  { id: "holika-dahan", name: "Holika Dahan", nameHi: "होलिका दहन", slug: "holika-dahan", deities: ["vishnu", "narasimha"] },
  { id: "maha-navami", name: "Maha Navami", nameHi: "महानवमी", slug: "maha-navami", deities: ["durga"] },
  { id: "anant-chaturdashi", name: "Anant Chaturdashi", nameHi: "अनंत चतुर्दशी", slug: "anant-chaturdashi", deities: ["vishnu"] },
];

export function getFestivalById(id: string): Festival | undefined {
  return FESTIVALS.find((f) => f.id === id);
}

export function getFestivalBySlug(slug: string): Festival | undefined {
  return FESTIVALS.find((f) => f.slug === slug);
}
