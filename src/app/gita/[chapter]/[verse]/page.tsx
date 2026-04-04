import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getAllGitaChapters, getGitaVerse, getAdjacentVerses } from "@/lib/gita";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://stotra.vastucart.in";

export function generateStaticParams() {
  const params: { chapter: string; verse: string }[] = [];
  for (const ch of getAllGitaChapters()) {
    for (const v of ch.verses) {
      params.push({ chapter: ch.slug, verse: v.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ chapter: string; verse: string }>;
}): Promise<Metadata> {
  const { chapter: chSlug, verse: vSlug } = await params;
  const result = getGitaVerse(chSlug, vSlug);
  if (!result) return {};
  const { chapter, verse } = result;

  const firstWords = verse.devanagari.split("\n")[0].slice(0, 40);
  const title = `Bhagavad Gita ${chapter.chapterNumber}.${verse.verseNumber} - ${firstWords}`;
  const description = `${verse.englishTranslation.slice(0, 150)}... Read with Sanskrit text, transliteration, word-by-word meaning, Hindi & English translation.`;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/gita/${chSlug}/${vSlug}` },
    openGraph: {
      title,
      description,
      url: `${APP_URL}/gita/${chSlug}/${vSlug}`,
      type: "article",
      siteName: "Stotra by VastuCart",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function GitaVersePage({
  params,
}: {
  params: Promise<{ chapter: string; verse: string }>;
}) {
  const { chapter: chSlug, verse: vSlug } = await params;
  const result = getGitaVerse(chSlug, vSlug);
  if (!result) notFound();
  const { chapter, verse } = result;

  const { prev, next } = getAdjacentVerses(chapter.chapterNumber, verse.verseNumber);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: `Bhagavad Gita ${chapter.chapterNumber}.${verse.verseNumber}`,
    description: verse.englishTranslation,
    inLanguage: ["sa", "hi", "en"],
    isPartOf: {
      "@type": "CreativeWork",
      name: `Bhagavad Gita - ${chapter.titleEnglish}`,
      url: `${APP_URL}/gita/${chapter.slug}`,
    },
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-text-muted mb-6 flex-wrap">
        <Link href="/" className="hover:text-brand transition-colors">Home</Link>
        <span>/</span>
        <Link href="/gita" className="hover:text-brand transition-colors">Bhagavad Gita</Link>
        <span>/</span>
        <Link href={`/gita/${chapter.slug}`} className="hover:text-brand transition-colors">
          Chapter {chapter.chapterNumber}
        </Link>
        <span>/</span>
        <span className="text-text">Verse {verse.verseNumber}</span>
      </nav>

      {/* Top Prev/Next Bar */}
      <div className="flex items-center justify-between mb-6">
        {prev ? (
          <Link
            href={`/gita/chapter-${prev.chapter}/verse-${prev.verse}`}
            className="inline-flex items-center gap-2 bg-white border border-border-light hover:border-brand/30 text-brand text-sm font-medium px-4 py-2.5 rounded-xl transition-all duration-200 hover:shadow-card"
          >
            <span>&larr;</span>
            <span>{prev.chapter}.{prev.verse}</span>
          </Link>
        ) : <span />}

        <Link
          href={`/gita/${chapter.slug}`}
          className="text-xs text-text-muted hover:text-brand transition-colors px-3 py-2 rounded-lg bg-cream-mid border border-border-light"
        >
          Ch {chapter.chapterNumber} &middot; {chapter.titleEnglish}
        </Link>

        {next ? (
          <Link
            href={`/gita/chapter-${next.chapter}/verse-${next.verse}`}
            className="inline-flex items-center gap-2 bg-white border border-border-light hover:border-brand/30 text-brand text-sm font-medium px-4 py-2.5 rounded-xl transition-all duration-200 hover:shadow-card"
          >
            <span>{next.chapter}.{next.verse}</span>
            <span>&rarr;</span>
          </Link>
        ) : <span />}
      </div>

      {/* Main Verse Card */}
      <article className="bg-white rounded-2xl border border-border-light shadow-card overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-brand via-gold to-saffron" />

        {/* Header */}
        <div className="p-6 md:p-8 border-b border-border-light">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs bg-brand/10 text-brand px-3 py-1 rounded-full font-medium">
              Chapter {chapter.chapterNumber} &middot; {chapter.titleEnglish}
            </span>
            <span className="text-xs bg-cream-mid text-text-muted px-2.5 py-1 rounded-full capitalize">
              {verse.speaker}
            </span>
          </div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-brand">
            Verse {verse.verseNumber}
          </h1>
          <p className="text-sm text-text-muted mt-1">
            श्रीमद्भगवद्गीता अध्याय {chapter.chapterNumber}, श्लोक {verse.verseNumber}
          </p>
        </div>

        {/* Devanagari Shloka */}
        <div className="p-6 md:p-8">
          <h2 className="font-serif text-sm font-semibold text-brand uppercase tracking-wider mb-4">
            Sanskrit Shloka (श्लोक)
          </h2>
          <div className="devanagari text-xl md:text-2xl leading-[2.2] text-text bg-cream/50 rounded-xl p-6 border border-border-light text-center">
            {verse.devanagari.split("\n").map((line, i) => (
              <p key={i} className={line.trim() === "" ? "h-4" : ""}>{line}</p>
            ))}
          </div>
        </div>

        {/* Transliteration */}
        <div className="px-6 md:px-8 pb-6">
          <h2 className="font-serif text-sm font-semibold text-brand uppercase tracking-wider mb-3">
            Transliteration
          </h2>
          <div className="text-base leading-[2] text-text-light italic bg-cream-mid/30 rounded-xl p-5 border border-border-light">
            {verse.transliteration.split("\n").map((line, i) => (
              <p key={i} className={line.trim() === "" ? "h-4" : ""}>{line}</p>
            ))}
          </div>
        </div>

        {/* Word-by-Word Meaning */}
        {verse.wordByWord.length > 0 && (
          <div className="px-6 md:px-8 pb-6">
            <h2 className="font-serif text-sm font-semibold text-brand uppercase tracking-wider mb-3">
              Word-by-Word Meaning (अन्वय)
            </h2>
            <div className="bg-white rounded-xl border border-border-light overflow-hidden">
              <div className="divide-y divide-border-light">
                {verse.wordByWord.map((w, i) => (
                  <div key={i} className="flex items-center gap-4 px-4 py-3 even:bg-cream/30">
                    <span className="devanagari text-sm text-brand font-semibold min-w-[80px]">{w.word}</span>
                    <span className="text-xs text-text-muted italic min-w-[100px]">{w.transliteration}</span>
                    <span className="text-sm text-text-light flex-1">{w.meaning}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Hindi Translation */}
        <div className="px-6 md:px-8 pb-6">
          <h2 className="font-serif text-sm font-semibold text-brand uppercase tracking-wider mb-3">
            Hindi Translation (हिन्दी अर्थ)
          </h2>
          <div className="devanagari text-base leading-[1.9] text-text-light bg-cream-mid/30 rounded-xl p-5 border border-border-light">
            {verse.hindiTranslation}
          </div>
        </div>

        {/* English Translation */}
        <div className="px-6 md:px-8 pb-6">
          <h2 className="font-serif text-sm font-semibold text-brand uppercase tracking-wider mb-3">
            English Translation
          </h2>
          <div className="text-base leading-relaxed text-text-light bg-cream-mid/30 rounded-xl p-5 border border-border-light">
            {verse.englishTranslation}
          </div>
        </div>

        {/* Commentary */}
        {verse.commentary && (
          <div className="px-6 md:px-8 pb-6">
            <h2 className="font-serif text-sm font-semibold text-brand uppercase tracking-wider mb-3">
              Commentary (टीका)
            </h2>
            <div className="text-sm leading-relaxed text-text-light bg-gold/5 border border-gold/20 rounded-xl p-5">
              {verse.commentary}
            </div>
          </div>
        )}
      </article>

      {/* Bottom Prev/Next Navigation — Prominent */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        {prev ? (
          <Link
            href={`/gita/chapter-${prev.chapter}/verse-${prev.verse}`}
            className="group bg-white rounded-xl border border-border-light hover:border-gold/40 hover:shadow-card-hover p-5 transition-all duration-300"
          >
            <span className="text-xs text-text-muted block mb-1">Previous Verse</span>
            <span className="font-serif text-lg font-semibold text-brand group-hover:text-brand-light transition-colors flex items-center gap-2">
              <span className="group-hover:-translate-x-1 transition-transform">&larr;</span>
              Chapter {prev.chapter}, Verse {prev.verse}
            </span>
          </Link>
        ) : <div />}

        {next ? (
          <Link
            href={`/gita/chapter-${next.chapter}/verse-${next.verse}`}
            className="group bg-white rounded-xl border border-border-light hover:border-gold/40 hover:shadow-card-hover p-5 transition-all duration-300 text-right"
          >
            <span className="text-xs text-text-muted block mb-1">Next Verse</span>
            <span className="font-serif text-lg font-semibold text-brand group-hover:text-brand-light transition-colors flex items-center gap-2 justify-end">
              Chapter {next.chapter}, Verse {next.verse}
              <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
            </span>
          </Link>
        ) : <div />}
      </div>

      {/* Quick Links */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <Link href={`/gita/${chapter.slug}`} className="text-sm text-brand hover:text-brand-light transition-colors font-medium">
          All Verses in Chapter {chapter.chapterNumber} &rarr;
        </Link>
        <span className="text-border-light">|</span>
        <Link href="/gita" className="text-sm text-brand hover:text-brand-light transition-colors font-medium">
          All 18 Chapters &rarr;
        </Link>
      </div>
    </div>
  );
}
