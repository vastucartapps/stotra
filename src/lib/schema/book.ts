/**
 * Bhagavad Gita — Book + Chapter + Verse schemas per 06 §2.5.
 * Uses hasPart for the 18 chapters → 701 verses graph.
 * NOT numberOfPages (wrong property for verse count).
 */
import {
  STOTRA_BASE,
  STOTRA_WEBSITE_ID,
  ORG_ID,
  EDITORIAL_PERSON_ID,
} from "./ids";
import type { GitaChapter, GitaVerse } from "@/types";

const VYASA_PERSON = {
  "@type": "Person" as const,
  name: "Vyasa",
  sameAs: [
    "https://en.wikipedia.org/wiki/Vyasa",
    "https://www.wikidata.org/wiki/Q193563",
  ],
};

const BHAGAVAD_GITA_BOOK_ID = `${STOTRA_BASE}/gita#book`;

export function buildGitaBookSchema(chapters: GitaChapter[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "Book",
    "@id": BHAGAVAD_GITA_BOOK_ID,
    name: "Bhagavad Gita",
    alternateName: "श्रीमद्भगवद्गीता",
    url: `${STOTRA_BASE}/gita`,
    inLanguage: ["sa", "hi", "en"],
    genre: "Hindu scripture",
    bookFormat: "https://schema.org/EBook",
    isPartOf: { "@id": STOTRA_WEBSITE_ID },
    publisher: { "@id": ORG_ID },
    author: VYASA_PERSON,
    hasPart: chapters.map((c) => ({
      "@id": `${STOTRA_BASE}/gita/${c.slug}#chapter`,
    })),
  };
}

export function buildGitaChapterGraph(chapter: GitaChapter): object {
  const chapterId = `${STOTRA_BASE}/gita/${chapter.slug}#chapter`;
  const breadcrumbId = `${STOTRA_BASE}/gita/${chapter.slug}#breadcrumb`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Chapter",
        "@id": chapterId,
        name: chapter.titleEnglish,
        alternateName: chapter.titleSanskrit,
        url: `${STOTRA_BASE}/gita/${chapter.slug}`,
        position: chapter.chapterNumber,
        isPartOf: { "@id": BHAGAVAD_GITA_BOOK_ID },
        hasPart: chapter.verses.map((v) => ({
          "@id": `${STOTRA_BASE}/gita/${chapter.slug}/${v.slug}#verse`,
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": breadcrumbId,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${STOTRA_BASE}/` },
          {
            "@type": "ListItem",
            position: 2,
            name: "Bhagavad Gita",
            item: `${STOTRA_BASE}/gita`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: `Chapter ${chapter.chapterNumber} — ${chapter.titleEnglish}`,
          },
        ],
      },
    ],
  };
}

export function buildGitaVerseGraph(
  chapter: GitaChapter,
  verse: GitaVerse
): object {
  const verseId = `${STOTRA_BASE}/gita/${chapter.slug}/${verse.slug}#verse`;
  const pageId = `${STOTRA_BASE}/gita/${chapter.slug}/${verse.slug}#webpage`;
  const breadcrumbId = `${STOTRA_BASE}/gita/${chapter.slug}/${verse.slug}#breadcrumb`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": verseId,
        name: `Bhagavad Gita Chapter ${chapter.chapterNumber}, Verse ${verse.verseNumber}`,
        alternateName: verse.devanagari.split("\n")[0],
        url: `${STOTRA_BASE}/gita/${chapter.slug}/${verse.slug}`,
        inLanguage: ["sa", "hi", "en"],
        isPartOf: {
          "@id": `${STOTRA_BASE}/gita/${chapter.slug}#chapter`,
        },
        position: verse.verseNumber,
        publisher: { "@id": ORG_ID },
      },
      {
        "@type": "Article",
        "@id": pageId,
        url: `${STOTRA_BASE}/gita/${chapter.slug}/${verse.slug}`,
        mainEntityOfPage: pageId,
        headline: `Bhagavad Gita ${chapter.chapterNumber}.${verse.verseNumber} — Sanskrit, Transliteration, Hindi and English Meaning`,
        description: verse.englishTranslation?.slice(0, 300),
        image: `${STOTRA_BASE}/og-default.jpg`,
        inLanguage: "en",
        about: { "@id": verseId },
        isPartOf: { "@id": STOTRA_WEBSITE_ID },
        author: { "@id": EDITORIAL_PERSON_ID },
        publisher: { "@id": ORG_ID },
        breadcrumb: { "@id": breadcrumbId },
      },
      {
        "@type": "BreadcrumbList",
        "@id": breadcrumbId,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${STOTRA_BASE}/` },
          {
            "@type": "ListItem",
            position: 2,
            name: "Bhagavad Gita",
            item: `${STOTRA_BASE}/gita`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: `Chapter ${chapter.chapterNumber}`,
            item: `${STOTRA_BASE}/gita/${chapter.slug}`,
          },
          {
            "@type": "ListItem",
            position: 4,
            name: `Verse ${verse.verseNumber}`,
          },
        ],
      },
    ],
  };
}
