import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Returns Y/M/D + weekday in Asia/Kolkata (IST, GMT+5:30) regardless of the
// server timezone. The previous implementation manually added 5.5h with a
// getTimezoneOffset() correction — that only zeroed out on UTC servers and
// silently drifted on any other host (WSL, dev machine in IST, etc.).
export function istParts(d?: Date): { y: number; m: number; d: number; weekday: string } {
  const date = d || new Date();
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "long",
  }).formatToParts(date);
  const get = (k: string) => parts.find((p) => p.type === k)?.value ?? "";
  return {
    y: Number(get("year")),
    m: Number(get("month")),
    d: Number(get("day")),
    weekday: get("weekday").toLowerCase(),
  };
}

// IMPORTANT: on SSG/prerendered pages this freezes to BUILD TIME. For
// per-visit accuracy, call from a client component (`use client`).
export function todayIST(): Date {
  const p = istParts();
  return new Date(Date.UTC(p.y, p.m - 1, p.d));
}

export function getTodayDayName(): string {
  return istParts().weekday;
}

export function formatDate(date: Date, locale = "en-IN"): string {
  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDateISO(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function dailySeed(date?: Date): number {
  const p = istParts(date);
  return p.y * 10000 + p.m * 100 + p.d;
}

export function estimateReadingTime(text: string): number {
  const wordsPerMinute = 100; // slower for Sanskrit/Hindi devotional reading
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "...";
}
