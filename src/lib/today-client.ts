"use client";

import type { DayId } from "@/types";

/**
 * Resolves the current weekday in Asia/Kolkata (IST) on the client. Identical
 * algorithm to `istParts()` in lib/utils.ts but kept here to avoid pulling
 * server-only imports into the client bundle.
 */
export function getCurrentISTDayId(): DayId {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    weekday: "long",
  })
    .format(new Date())
    .toLowerCase() as DayId;
}

/** YYYYMMDD integer for the current date in IST — same shape as server dailySeed(). */
export function currentISTDailySeed(): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const get = (k: string) => Number(parts.find((p) => p.type === k)?.value ?? "0");
  return get("year") * 10000 + get("month") * 100 + get("day");
}

/** Mirrors seededRandom() in lib/utils.ts — must stay in lockstep. */
export function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}
