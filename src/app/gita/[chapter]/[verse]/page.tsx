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
    title,
    description,
    alternates: { canonical: `/gita/${chSlug}/${vSlug}` },
    openGraph: {
      title: `${title} | Stotra by VastuCart`,
      description,
      url: `${APP_URL}/gita/${chSlug}/${vSlug}`,
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
      <nav className="flex items-center gap-2 text-xs text-text-muted mb-8 flex-wrap">
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

      {/* Verse Card */}
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
          <div className="text-base leading-[2] text-text-light italic bg-cream-mid/30 rounded-xl p-5">
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
            <div className="bg-cream/50 rounded-xl border border-border-light overflow-hidden">
              <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border-light">
                {verse.wordByWord.map((w, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 even:bg-cream-mid/20">
                    <span className="devanagari text-sm text-brand font-medium whitespace-nowrap">{w.word}</span>
                    <span className="text-xs text-text-muted">({w.transliteration})</span>
                    <span className="text-sm text-text-light ml-auto text-right">{w.meaning}</span>
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
          <div className="devanagari text-base leading-[1.9] text-text-light bg-cream-mid/30 rounded-xl p-5">
            {verse.hindiTranslation}
          </div>
        </div>

        {/* English Translation */}
        <div className="px-6 md:px-8 pb-6">
          <h2 className="font-serif text-sm font-semibold text-brand uppercase tracking-wider mb-3">
            English Translation
          </h2>
          <div className="text-base leading-relaxed text-text-light bg-cream-mid/30 rounded-xl p-5">
            {verse.englishTranslation}
          </div>
        </div>

        {/* Commentary */}
        {verse.commentary && (
          <div className="px-6 md:px-8 pb-6">
            <h2 className="font-serif text-sm font-semibold text-brand uppercase tracking-wider mb-3">
              Commentary (टीका)
            </h2>
            <div className="text-sm leading-relaxed text-text-light bg-gold/5 border border-gold/15 rounded-xl p-5">
              {verse.commentary}
            </div>
          </div>
        )}

        {/* Prev/Next Navigation */}
        <div className="p-6 md:p-8 bg-cream-mid/30 border-t border-border-light">
          <div className="flex items-center justify-between">
            {prev ? (
              <Link
                href={`/gita/chapter-${prev.chapter}/verse-${prev.verse}`}
                className="group flex items-center gap-2 text-sm text-brand hover:text-brand-light transition-colors"
              >
                <span className="group-hover:-translate-x-1 transition-transform">&larr;</span>
                <span>
                  <span className="text-text-muted text-xs block">Previous</span>
                  {prev.chapter}.{prev.verse}
                </span>
              </Link>
            ) : <span />}

            <Link
              href={`/gita/${chapter.slug}`}
              className="text-xs text-text-muted hover:text-brand transition-colors px-3 py-1.5 rounded-lg bg-white border border-border-light"
            >
              Chapter {chapter.chapterNumber}
            </Link>

            {next ? (
              <Link
                href={`/gita/chapter-${next.chapter}/verse-${next.verse}`}
                className="group flex items-center gap-2 text-sm text-brand hover:text-brand-light transition-colors"
              >
                <span className="text-right">
                  <span className="text-text-muted text-xs block">Next</span>
                  {next.chapter}.{next.verse}
                </span>
                <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
              </Link>
            ) : <span />}
          </div>
        </div>
      </article>
    </div>
  );
}
