import type { Metadata } from "next";
import Link from "next/link";
import { getBhagavadGitaChapters, getBhagavadGitaSupportingTexts } from "@/lib/stotras";
import { CategoryIcon } from "@/components/ui/CategoryIcon";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://stotra.vastucart.in";

const CHAPTER_HINDI_NAMES: Record<number, string> = {
  1: "अर्जुन विषाद योग",
  2: "सांख्य योग",
  3: "कर्म योग",
  4: "ज्ञान कर्म संन्यास योग",
  5: "कर्म संन्यास योग",
  6: "ध्यान योग",
  7: "ज्ञान विज्ञान योग",
  8: "अक्षर ब्रह्म योग",
  9: "राजविद्या राजगुह्य योग",
  10: "विभूति योग",
  11: "विश्वरूप दर्शन योग",
  12: "भक्ति योग",
  13: "क्षेत्र क्षेत्रज्ञ विभाग योग",
  14: "गुणत्रय विभाग योग",
  15: "पुरुषोत्तम योग",
  16: "दैवासुर सम्पद् विभाग योग",
  17: "श्रद्धात्रय विभाग योग",
  18: "मोक्ष संन्यास योग",
};

export const metadata: Metadata = {
  title: "Bhagavad Gita - All 18 Chapters in Sanskrit with Hindi Meaning",
  description:
    "Read the complete Bhagavad Gita (श्रीमद्भगवद्गीता) - all 18 chapters in Devanagari Sanskrit with English transliteration, Hindi meaning, and free PDF download. The divine song of Lord Krishna to Arjuna on the battlefield of Kurukshetra.",
  alternates: {
    canonical: "/gita",
  },
  openGraph: {
    title: "Bhagavad Gita - All 18 Chapters | Stotra by VastuCart",
    description:
      "Read the complete Bhagavad Gita - all 18 chapters in Sanskrit with transliteration, Hindi meaning, and free PDF download.",
    url: `${APP_URL}/gita`,
    type: "website",
    images: [
      {
        url: `${APP_URL}/og-default.jpg`,
        width: 1200,
        height: 630,
        alt: "Bhagavad Gita - Stotra by VastuCart",
      },
    ],
  },
};

export default function GitaPage() {
  const chapters = getBhagavadGitaChapters();
  const supportingTexts = getBhagavadGitaSupportingTexts();
  const totalVerses = chapters.reduce((sum, ch) => sum + ch.verseCount, 0);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: APP_URL },
      { "@type": "ListItem", position: 2, name: "Bhagavad Gita", item: `${APP_URL}/gita` },
    ],
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Bhagavad Gita - All 18 Chapters",
    description: "Complete Bhagavad Gita in Sanskrit with Hindi meaning and English transliteration.",
    url: `${APP_URL}/gita`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: chapters.length,
      itemListElement: chapters.map((ch, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: ch.titleEn,
        url: `${APP_URL}/stotra/${ch.slug}`,
      })),
    },
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-brand">
        <div className="absolute inset-0 opacity-[0.08]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30Z' fill='none' stroke='%23DAA520' stroke-width='0.5'/%3E%3C/svg%3E")`,
              backgroundSize: "60px 60px",
            }}
          />
        </div>
        <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <nav className="flex items-center gap-2 text-xs text-white/50 mb-8">
            <Link href="/" className="hover:text-white/80 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white/80">Bhagavad Gita</span>
          </nav>

          <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-16">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-[2px] bg-saffron" />
                <span className="text-saffron text-xs font-bold uppercase tracking-[0.2em]">
                  श्रीमद्भगवद्गीता
                </span>
              </div>

              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
                Bhagavad Gita
              </h1>
              <p className="devanagari-heading text-2xl md:text-3xl mb-6" style={{ color: '#FF9933' }}>
                श्रीमद्भगवद्गीता
              </p>
              <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-2xl mb-8">
                The divine song of Lord Krishna to Arjuna on the battlefield of Kurukshetra.
                The Bhagavad Gita contains the essence of Vedantic philosophy — 18 chapters,
                700 verses covering Karma Yoga, Bhakti Yoga, and Jnana Yoga. Read all chapters
                in Devanagari Sanskrit with English transliteration and Hindi meaning.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs bg-white/10 text-white/70 px-3 py-1.5 rounded-full border border-white/10">
                  18 Chapters
                </span>
                <span className="text-xs bg-white/10 text-white/70 px-3 py-1.5 rounded-full border border-white/10">
                  {totalVerses} Verses
                </span>
                <span className="text-xs bg-white/10 text-white/70 px-3 py-1.5 rounded-full border border-white/10">
                  Vyasa Maharishi
                </span>
                <span className="text-xs bg-white/10 text-white/70 px-3 py-1.5 rounded-full border border-white/10">
                  Mahabharata (Bhishma Parva)
                </span>
              </div>
            </div>

            {/* Stats Card */}
            <div className="w-full lg:w-80 space-y-4 flex-shrink-0">
              <div className="bg-white/[0.07] backdrop-blur-sm rounded-2xl border border-white/[0.1] p-6">
                <div className="flex items-center gap-4 mb-3">
                  <CategoryIcon type="deity" id="krishna" color="transparent" size="lg" className="!rounded-xl bg-white/10" />
                  <div>
                    <p className="text-white font-serif text-xl font-bold">Lord Krishna</p>
                    <p className="text-white/50 text-sm">श्री कृष्ण</p>
                  </div>
                </div>
                <p className="text-white/60 text-sm leading-relaxed">
                  The Supreme Personality of Godhead, divine teacher of the Bhagavad Gita and charioteer of Arjuna.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-saffron/20 backdrop-blur-sm rounded-xl border border-saffron/20 p-4 text-center">
                  <p className="text-saffron text-2xl font-bold font-serif">18</p>
                  <p className="text-white/60 text-[10px] mt-0.5">Chapters</p>
                </div>
                <div className="bg-white/[0.07] backdrop-blur-sm rounded-xl border border-white/[0.1] p-4 text-center">
                  <p className="text-white text-2xl font-bold font-serif">{totalVerses}</p>
                  <p className="text-white/60 text-[10px] mt-0.5">Verses</p>
                </div>
                <div className="bg-white/[0.07] backdrop-blur-sm rounded-xl border border-white/[0.1] p-4 text-center">
                  <p className="text-white text-2xl font-bold font-serif">3</p>
                  <p className="text-white/60 text-[10px] mt-0.5">Yogas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chapters Grid */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand mb-3">
              All 18 Chapters
            </h2>
            <p className="text-text-light max-w-lg mx-auto">
              Each chapter (Adhyaya) of the Gita focuses on a distinct aspect of spiritual wisdom
            </p>
            <div className="mt-4 mx-auto w-24 h-1 rounded-full bg-gradient-to-r from-brand via-gold to-saffron" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {chapters.map((ch) => {
              const chapterNum = parseInt(ch.slug.replace("bhagavad-gita-chapter-", ""));
              const yogaName = ch.titleEn.split(" - ")[1] || "";
              const hindiName = CHAPTER_HINDI_NAMES[chapterNum] || "";

              return (
                <Link
                  key={ch.slug}
                  href={`/stotra/${ch.slug}`}
                  className="group bg-white rounded-xl border border-border-light hover:border-gold/40 hover:shadow-card-hover transition-all duration-300 overflow-hidden"
                >
                  {/* Chapter number accent bar */}
                  <div className="h-1 bg-gradient-to-r from-brand via-gold to-saffron" />

                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Chapter Number */}
                      <div className="w-14 h-14 rounded-xl bg-brand/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-brand font-serif text-2xl font-bold">{chapterNum}</span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif text-lg font-semibold text-brand group-hover:text-brand-light transition-colors leading-tight">
                          {yogaName}
                        </h3>
                        <p className="devanagari-heading text-sm text-text-muted mt-1">
                          {hindiName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-border-light">
                      <div className="flex items-center gap-3 text-xs text-text-muted">
                        <span>{ch.verseCount} verses</span>
                        <span>&middot;</span>
                        <span>{ch.readingTimeMinutes} min</span>
                      </div>
                      <span className="text-xs font-medium text-saffron group-hover:text-orange transition-colors">
                        Read &rarr;
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Supporting Texts */}
      {supportingTexts.length > 0 && (
        <section className="py-16 bg-cream-mid/50">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="font-serif text-3xl font-bold text-brand mb-3">
                Supporting Texts
              </h2>
              <p className="text-text-light max-w-lg mx-auto">
                Essential prayers and commentaries that complement the study of the Bhagavad Gita
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {supportingTexts.map((text) => (
                <Link
                  key={text.slug}
                  href={`/stotra/${text.slug}`}
                  className="group bg-white rounded-xl p-6 border border-border-light hover:border-gold/30 hover:shadow-card-hover transition-all duration-300"
                >
                  <h3 className="devanagari-heading text-lg text-brand group-hover:text-brand-light transition-colors mb-1">
                    {text.title}
                  </h3>
                  <p className="text-sm text-text-light mb-3">
                    {text.titleEn}
                  </p>
                  <p className="text-sm text-text-muted line-clamp-2 mb-3">
                    {text.seoDescription}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-text-muted">
                    <span>{text.verseCount} verses</span>
                    <span>&middot;</span>
                    <span>{text.readingTimeMinutes} min read</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SEO Content */}
      <section className="py-16">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-2xl font-bold text-brand mb-6">
              About the Bhagavad Gita
            </h2>
            <div className="prose prose-sm text-text-light leading-relaxed space-y-4">
              <p>
                The Bhagavad Gita (श्रीमद्भगवद्गीता), often referred to as the &ldquo;Song of God,&rdquo; is a 700-verse
                Hindu scripture that is part of the Indian epic Mahabharata (Bhishma Parva, chapters 23-40).
                It is a dialogue between Prince Arjuna and Lord Krishna, who serves as his charioteer on
                the battlefield of Kurukshetra.
              </p>
              <p>
                The Gita addresses the moral and philosophical dilemmas faced by Arjuna about fighting in a
                war against his own relatives, teachers, and friends. Through 18 chapters, Lord Krishna
                reveals the path of righteous duty (Dharma), selfless action (Karma Yoga), devotion
                (Bhakti Yoga), and knowledge (Jnana Yoga) as means to attain liberation (Moksha).
              </p>
              <p>
                Composed by Maharishi Vyasa, the Bhagavad Gita is considered one of the most important
                texts in the history of literature and philosophy. It has been translated into every major
                world language and continues to guide millions of seekers on the path of self-realization.
              </p>
              <p>
                On this page, you can read all 18 chapters of the Bhagavad Gita in Devanagari Sanskrit
                with English transliteration, Hindi meaning (arth), and free PDF download for offline study.
                Each chapter is presented with its traditional Yoga name and complete verse count.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
