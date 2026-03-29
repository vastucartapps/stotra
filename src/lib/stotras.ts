import fs from "fs";
import path from "path";
import type { Stotra, DeityId, DayId, FestivalId, PurposeId } from "@/types";
import { dailySeed, seededRandom, getTodayDayName } from "./utils";

const STOTRAS_DIR = path.join(process.cwd(), "src/data/stotras");

// Validate slug to prevent path traversal
function isValidSlug(slug: string): boolean {
  return /^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(slug) && !slug.includes("..");
}

function safeFilePath(slug: string): string | null {
  if (!isValidSlug(slug)) return null;
  const filePath = path.join(STOTRAS_DIR, `${slug}.json`);
  // Ensure resolved path is within STOTRAS_DIR
  const resolved = path.resolve(filePath);
  if (!resolved.startsWith(path.resolve(STOTRAS_DIR))) return null;
  return filePath;
}

let cachedStotras: Stotra[] | null = null;

function loadAllStotras(): Stotra[] {
  if (cachedStotras) return cachedStotras;

  try {
    if (!fs.existsSync(STOTRAS_DIR)) {
      fs.mkdirSync(STOTRAS_DIR, { recursive: true });
      return [];
    }

    const files = fs.readdirSync(STOTRAS_DIR).filter((f) => f.endsWith(".json"));
    const stotras: Stotra[] = [];

    for (const file of files) {
      try {
        const content = fs.readFileSync(path.join(STOTRAS_DIR, file), "utf-8");
        const stotra = JSON.parse(content) as Stotra;
        stotras.push(stotra);
      } catch {
        // Silently skip malformed files
      }
    }

    stotras.sort((a, b) => a.titleEn.localeCompare(b.titleEn));
    cachedStotras = stotras;
    return stotras;
  } catch {
    return [];
  }
}

export function invalidateCache() {
  cachedStotras = null;
}

export function getAllStotras(): Stotra[] {
  return loadAllStotras().filter((s) => s.isPublished);
}

export function getAllStotrasIncludingDrafts(): Stotra[] {
  return loadAllStotras();
}

export function getStotraBySlug(slug: string): Stotra | null {
  return loadAllStotras().find((s) => s.slug === slug) || null;
}

export function getStotrasByDeity(deity: DeityId): Stotra[] {
  return getAllStotras().filter(
    (s) => s.deity === deity || s.secondaryDeities?.includes(deity)
  );
}

export function getStotrasByDay(day: DayId): Stotra[] {
  return getAllStotras().filter((s) => s.days.includes(day));
}

export function getStotrasByFestival(festival: FestivalId): Stotra[] {
  return getAllStotras().filter((s) => s.festivals.includes(festival));
}

export function getStotrasByPurpose(purpose: PurposeId): Stotra[] {
  return getAllStotras().filter((s) => s.purposes.includes(purpose));
}

export function getTodaysStotras(): Stotra[] {
  const todayDay = getTodayDayName() as DayId;
  return getStotrasByDay(todayDay);
}

export function getStotraOfTheDay(): Stotra | null {
  const all = getAllStotras();
  if (all.length === 0) return null;
  const seed = dailySeed();
  const index = Math.floor(seededRandom(seed) * all.length);
  return all[index];
}

export function searchStotras(query: string): Stotra[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  return getAllStotras().filter((s) => {
    return (
      s.title.toLowerCase().includes(q) ||
      s.titleEn.toLowerCase().includes(q) ||
      s.deity.toLowerCase().includes(q) ||
      s.seoDescription.toLowerCase().includes(q) ||
      s.source.toLowerCase().includes(q) ||
      s.devanagariText.includes(query)
    );
  });
}

export function getRelatedStotras(stotra: Stotra, limit = 4): Stotra[] {
  const all = getAllStotras().filter((s) => s.slug !== stotra.slug);

  // Score each stotra by relevance
  const scored = all.map((s) => {
    let score = 0;
    if (s.deity === stotra.deity) score += 5;
    if (stotra.secondaryDeities?.includes(s.deity)) score += 3;
    if (s.secondaryDeities?.includes(stotra.deity)) score += 3;
    for (const day of s.days) {
      if (stotra.days.includes(day)) score += 2;
    }
    for (const purpose of s.purposes) {
      if (stotra.purposes.includes(purpose)) score += 1;
    }
    return { stotra: s, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.stotra);
}

export function getStotraCount(): number {
  return getAllStotras().length;
}

export function getStotraCountByDeity(deity: DeityId): number {
  return getStotrasByDeity(deity).length;
}

// Save a stotra to a JSON file
export function saveStotra(stotra: Stotra): void {
  const filePath = safeFilePath(stotra.slug);
  if (!filePath) throw new Error("Invalid slug format");
  if (!fs.existsSync(STOTRAS_DIR)) {
    fs.mkdirSync(STOTRAS_DIR, { recursive: true });
  }
  fs.writeFileSync(filePath, JSON.stringify(stotra, null, 2), "utf-8");
  invalidateCache();
}

// Delete a stotra JSON file
export function deleteStotra(slug: string): boolean {
  const filePath = safeFilePath(slug);
  if (!filePath) return false;
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    invalidateCache();
    return true;
  }
  return false;
}
