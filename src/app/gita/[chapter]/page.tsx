import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getAllGitaChapters, getGitaChapter } from "@/lib/gita";
import { buildGitaChapterGraph } from "@/lib/schema";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://stotra.vastucart.in";

export function generateStaticParams() {
  return getAllGitaChapters().map((c) => ({ chapter: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ chapter: string }>;
}): Promise<Metadata> {
  const { chapter: slug } = await params;
  const chapter = getGitaChapter(slug);
  if (!chapter) return {};
  const title = `Bhagavad Gita Chapter ${chapter.chapterNumber} - ${chapter.titleEnglish} (${chapter.titleSanskrit})`;
  return {
    title: { absolute: title },
    description: chapter.description,
    alternates: { canonical: `/gita/${slug}` },
    openGraph: {
      title,
      description: chapter.description,
      url: `${APP_URL}/gita/${slug}`,
      type: "article",
      siteName: "Stotra by VastuCart",
      images: [{ url: `${APP_URL}/og-default.jpg`, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: chapter.description,
      images: [`${APP_URL}/og-default.jpg`],
    },
  };
}

export default async function GitaChapterPage({
  params,
}: {
  params: Promise<{ chapter: string }>;
}) {
  const { chapter: slug } = await params;
  const chapter = getGitaChapter(slug);
  if (!chapter) notFound();

  const chapters = getAllGitaChapters();
  void chapters;
  const chapterGraph = buildGitaChapterGraph(chapter);

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(chapterGraph) }}
      />
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-text-muted mb-8">
        <Link href="/" className="hover:text-brand transition-colors">Home</Link>
        <span>/</span>
        <Link href="/gita" className="hover:text-brand transition-colors">Bhagavad Gita</Link>
        <span>/</span>
        <span className="text-text">Chapter {chapter.chapterNumber}</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-brand/10 flex items-center justify-center flex-shrink-0">
            <span className="text-brand font-serif text-3xl font-bold">{chapter.chapterNumber}</span>
          </div>
          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-brand">
              {chapter.titleEnglish}
            </h1>
            <p className="devanagari-heading text-xl text-text-muted mt-1">
              {chapter.titleSanskrit} &middot; {chapter.titleHindi}
            </p>
          </div>
        </div>
        <p className="text-text-light max-w-3xl leading-relaxed">{chapter.description}</p>
        {chapter.chapterNumber === 13 && (
          <p className="mt-4 text-xs bg-cream/60 border border-border-light rounded-lg p-4 italic max-w-3xl">
            <strong>Editorial note:</strong> This site follows the Gita Press (Gorakhpur) enumeration,
            which counts 35 verses in chapter 13. The Adi Shankaracharya commentary tradition counts 34,
            combining the opening verse with the first regular verse. The total across 18 chapters is
            701 (Gita Press) or 700 (Shankara).
          </p>
        )}
        <div className="flex items-center gap-3 mt-4">
          <span className="text-xs bg-cream-mid text-text-light px-3 py-1 rounded-full">
            {chapter.verseCount} verses
          </span>
        </div>
      </div>

      {/* Verse List */}
      <div className="space-y-3">
        {chapter.verses.map((verse) => (
          <Link
            key={verse.slug}
            href={`/gita/${chapter.slug}/${verse.slug}`}
            className="group block bg-white rounded-xl border border-border-light hover:border-gold/40 hover:shadow-card-hover transition-all duration-300 overflow-hidden"
          >
            <div className="flex items-start gap-4 p-5">
              {/* Verse number */}
              <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-brand font-serif text-sm font-bold">{verse.verseNumber}</span>
              </div>

              <div className="flex-1 min-w-0">
                {/* Devanagari */}
                <p className="devanagari text-base text-text leading-relaxed line-clamp-2 break-words">
                  {verse.devanagari}
                </p>
                {/* English translation preview */}
                <p className="text-sm text-text-muted mt-2 line-clamp-1">
                  {verse.englishTranslation}
                </p>
                {/* Speaker */}
                <span className="text-[10px] uppercase tracking-wider text-text-muted/70 mt-1 block">
                  {verse.speaker}
                </span>
              </div>

              <span className="text-xs font-medium text-saffron group-hover:text-orange transition-colors flex-shrink-0 mt-2">
                Read &rarr;
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Chapter Navigation */}
      <div className="flex items-center justify-between mt-12 pt-8 border-t border-border-light">
        {chapter.chapterNumber > 1 ? (
          <Link
            href={`/gita/chapter-${chapter.chapterNumber - 1}`}
            className="text-sm text-brand hover:text-brand-light transition-colors"
          >
            &larr; Chapter {chapter.chapterNumber - 1}
          </Link>
        ) : <span />}
        <Link href="/gita" className="text-sm text-text-muted hover:text-brand transition-colors">
          All Chapters
        </Link>
        {chapter.chapterNumber < 18 ? (
          <Link
            href={`/gita/chapter-${chapter.chapterNumber + 1}`}
            className="text-sm text-brand hover:text-brand-light transition-colors"
          >
            Chapter {chapter.chapterNumber + 1} &rarr;
          </Link>
        ) : <span />}
      </div>
    </div>
  );
}
