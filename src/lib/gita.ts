import fs from "fs";
import path from "path";
import type { GitaChapter, GitaVerse } from "@/types";

const GITA_DIR = path.join(process.cwd(), "src/data/gita");

let cachedChapters: GitaChapter[] | null = null;

function loadAllChapters(): GitaChapter[] {
  if (cachedChapters) return cachedChapters;

  const chapters: GitaChapter[] = [];
  for (let i = 1; i <= 18; i++) {
    const filePath = path.join(GITA_DIR, `chapter-${i}.json`);
    try {
      const content = fs.readFileSync(filePath, "utf-8");
      chapters.push(JSON.parse(content) as GitaChapter);
    } catch {
      // Skip missing chapters
    }
  }

  chapters.sort((a, b) => a.chapterNumber - b.chapterNumber);
  cachedChapters = chapters;
  return chapters;
}

export function getAllGitaChapters(): GitaChapter[] {
  return loadAllChapters();
}

export function getGitaChapter(slug: string): GitaChapter | null {
  return loadAllChapters().find((c) => c.slug === slug) || null;
}

export function getGitaVerse(
  chapterSlug: string,
  verseSlug: string
): { chapter: GitaChapter; verse: GitaVerse } | null {
  const chapter = getGitaChapter(chapterSlug);
  if (!chapter) return null;
  const verse = chapter.verses.find((v) => v.slug === verseSlug);
  if (!verse) return null;
  return { chapter, verse };
}

export function getAdjacentVerses(
  chapterNumber: number,
  verseNumber: number
): {
  prev: { chapter: number; verse: number } | null;
  next: { chapter: number; verse: number } | null;
} {
  const chapters = loadAllChapters();
  const currentChapter = chapters.find((c) => c.chapterNumber === chapterNumber);
  if (!currentChapter) return { prev: null, next: null };

  let prev: { chapter: number; verse: number } | null = null;
  let next: { chapter: number; verse: number } | null = null;

  if (verseNumber > 1) {
    prev = { chapter: chapterNumber, verse: verseNumber - 1 };
  } else {
    const prevChapter = chapters.find((c) => c.chapterNumber === chapterNumber - 1);
    if (prevChapter) {
      prev = { chapter: chapterNumber - 1, verse: prevChapter.verseCount };
    }
  }

  if (verseNumber < currentChapter.verseCount) {
    next = { chapter: chapterNumber, verse: verseNumber + 1 };
  } else {
    const nextChapter = chapters.find((c) => c.chapterNumber === chapterNumber + 1);
    if (nextChapter) {
      next = { chapter: chapterNumber + 1, verse: 1 };
    }
  }

  return { prev, next };
}

export function getTotalVerseCount(): number {
  return loadAllChapters().reduce((sum, c) => sum + c.verseCount, 0);
}
