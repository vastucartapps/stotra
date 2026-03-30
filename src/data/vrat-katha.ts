export interface HinduMonth {
  id: string;
  name: string;
  nameHi: string;
  englishMonths: string;
  kathas: string[]; // stotra slugs
}

export const HINDU_MONTHS: HinduMonth[] = [
  {
    id: "chaitra",
    name: "Chaitra",
    nameHi: "चैत्र",
    englishMonths: "March – April",
    kathas: ["navratri-vrat-katha", "ram-navami-vrat-katha"],
  },
  {
    id: "vaishakh",
    name: "Vaishakh",
    nameHi: "वैशाख",
    englishMonths: "April – May",
    kathas: ["satyanarayan-katha"],
  },
  {
    id: "jyeshtha",
    name: "Jyeshtha",
    nameHi: "ज्येष्ठ",
    englishMonths: "May – June",
    kathas: ["vat-savitri-vrat-katha", "ekadashi-vrat-katha"],
  },
  {
    id: "ashadh",
    name: "Ashadh",
    nameHi: "आषाढ़",
    englishMonths: "June – July",
    kathas: ["ekadashi-vrat-katha", "dev-uthani-ekadashi-katha"],
  },
  {
    id: "shravan",
    name: "Shravan",
    nameHi: "श्रावण",
    englishMonths: "July – August",
    kathas: ["somvar-vrat-katha", "nag-panchami-vrat-katha", "hartalika-teej-vrat-katha"],
  },
  {
    id: "bhadrapad",
    name: "Bhadrapad",
    nameHi: "भाद्रपद",
    englishMonths: "August – September",
    kathas: ["ganesh-chaturthi-vrat-katha", "janmashtami-vrat-katha", "vinayaka-chaturthi-vrat-katha"],
  },
  {
    id: "ashwin",
    name: "Ashwin",
    nameHi: "आश्विन",
    englishMonths: "September – October",
    kathas: ["navratri-vrat-katha", "karva-chauth-vrat-katha", "sharad-purnima-vrat-katha", "ahoi-ashtami-vrat-katha"],
  },
  {
    id: "kartik",
    name: "Kartik",
    nameHi: "कार्तिक",
    englishMonths: "October – November",
    kathas: ["dhanteras-katha", "diwali-vrat-katha", "chhath-puja-vrat-katha", "tulsi-vivah-katha", "dev-uthani-ekadashi-katha"],
  },
  {
    id: "margashirsha",
    name: "Margashirsha",
    nameHi: "मार्गशीर्ष",
    englishMonths: "November – December",
    kathas: ["satyanarayan-katha", "ekadashi-vrat-katha"],
  },
  {
    id: "paush",
    name: "Paush",
    nameHi: "पौष",
    englishMonths: "December – January",
    kathas: ["makar-sankranti-vrat-katha", "ekadashi-vrat-katha"],
  },
  {
    id: "magh",
    name: "Magh",
    nameHi: "माघ",
    englishMonths: "January – February",
    kathas: ["santoshi-mata-vrat-katha", "vaibhava-lakshmi-vrat-katha"],
  },
  {
    id: "phalgun",
    name: "Phalgun",
    nameHi: "फाल्गुन",
    englishMonths: "February – March",
    kathas: ["pradosh-vrat-katha", "holika-dahan-katha"],
  },
];

export const WEEKLY_VRAT_KATHAS = [
  { day: "Sunday", dayHi: "रविवार", slug: "ravivar-vrat-katha" },
  { day: "Monday", dayHi: "सोमवार", slug: "somvar-vrat-katha" },
  { day: "Tuesday", dayHi: "मंगलवार", slug: "mangalvar-vrat-katha" },
  { day: "Wednesday", dayHi: "बुधवार", slug: "budhvar-vrat-katha" },
  { day: "Thursday", dayHi: "गुरुवार", slug: "guruvar-vrat-katha" },
  { day: "Friday", dayHi: "शुक्रवार", slug: "shukravar-vrat-katha" },
  { day: "Saturday", dayHi: "शनिवार", slug: "shanivar-vrat-katha" },
];
