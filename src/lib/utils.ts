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

export function todayIST(): Date {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  return new Date(now.getTime() + istOffset + now.getTimezoneOffset() * 60 * 1000);
}

export function getTodayDayName(): string {
  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ] as const;
  return days[todayIST().getDay()];
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
  const d = date || todayIST();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
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
