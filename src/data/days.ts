import type { Day } from "@/types";

export const DAYS: Day[] = [
  {
    id: "sunday",
    name: "Sunday",
    nameHi: "रविवार",
    slug: "sunday",
    deities: ["surya", "vishnu", "rama"],
  },
  {
    id: "monday",
    name: "Monday",
    nameHi: "सोमवार",
    slug: "monday",
    deities: ["shiva"],
  },
  {
    id: "tuesday",
    name: "Tuesday",
    nameHi: "मंगलवार",
    slug: "tuesday",
    deities: ["hanuman", "kartikeya", "durga"],
  },
  {
    id: "wednesday",
    name: "Wednesday",
    nameHi: "बुधवार",
    slug: "wednesday",
    deities: ["ganesha", "krishna", "vishnu"],
  },
  {
    id: "thursday",
    name: "Thursday",
    nameHi: "गुरुवार",
    slug: "thursday",
    deities: ["vishnu", "dattatreya"],
  },
  {
    id: "friday",
    name: "Friday",
    nameHi: "शुक्रवार",
    slug: "friday",
    deities: ["lakshmi", "durga", "saraswati"],
  },
  {
    id: "saturday",
    name: "Saturday",
    nameHi: "शनिवार",
    slug: "saturday",
    deities: ["shani", "hanuman"],
  },
];

export function getDayById(id: string): Day | undefined {
  return DAYS.find((d) => d.id === id);
}

export function getDayBySlug(slug: string): Day | undefined {
  return DAYS.find((d) => d.slug === slug);
}

export function getTodayDay(): Day {
  const dayNames = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const ist = new Date(now.getTime() + istOffset + now.getTimezoneOffset() * 60 * 1000);
  const dayId = dayNames[ist.getDay()];
  return DAYS.find((d) => d.id === dayId)!;
}
