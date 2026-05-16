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

// Resolves the current day of week in Asia/Kolkata (IST, GMT+5:30) regardless
// of the server's timezone. Uses Intl so it cannot drift on non-UTC hosts.
// WARNING: On SSG/prerendered pages this freezes to the build-time day —
// consumer UI must call this from a client component (`use client`) so the
// browser resolves it at view time, not at build time.
export function getTodayDayId(): Day["id"] {
  const dayId = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    weekday: "long",
  }).format(new Date()).toLowerCase() as Day["id"];
  return dayId;
}

export function getTodayDay(): Day {
  return DAYS.find((d) => d.id === getTodayDayId())!;
}
