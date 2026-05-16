import type { Metadata } from "next";
import Link from "next/link";
import { DEITIES } from "@/data/deities";
import { PURPOSES } from "@/data/purposes";
import { ECOSYSTEM_SITES } from "@/data/ecosystem";
import { getAllStotras, getStotraCountByDeity } from "@/lib/stotras";
import { getStotrasByDayMap, getStotraOfTheDayCandidates } from "@/lib/today-data";
import { FAQSection } from "@/components/pages/HomePage";
import { GitaShlokaCard } from "@/components/pages/GitaShlokaCard";
import { getGitaVerseOfTheDay } from "@/lib/gita";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { TodayDayBadge } from "@/components/today/TodayDayBadge";
import { TodaysStotrasGrid } from "@/components/today/TodaysStotrasGrid";
import { StotraOfTheDay } from "@/components/today/StotraOfTheDay";
import { buildStotraWebsiteSchema } from "@/lib/schema";
import { APP_URL, siteOpenGraph, siteTwitter } from "@/lib/seo-meta";

export function generateMetadata(): Metadata {
  const count = getAllStotras().length;
  const title = `${count}+ Hindu Stotras in Sanskrit & Hindi | VastuCart`;
  const description = `Read ${count} stotras, chalisas, the Bhagavad Gita (701 verses per Gita Press), and vrat kathas in Sanskrit and Hindi with transliteration, meaning, and free PDF. Browse by deity, purpose, or day.`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: "/" },
    openGraph: siteOpenGraph({
      path: "/",
      title,
      description,
      type: "website",
      imageAlt: "Stotra by VastuCart - Sacred Hindu Prayers",
    }),
    twitter: siteTwitter({
      path: "/",
      title,
      description,
    }),
  };
}

export default function Home() {
  const allStotras = getAllStotras();
  const byDay = getStotrasByDayMap();
  const sotdCandidates = getStotraOfTheDayCandidates();

  const websiteSchema = buildStotraWebsiteSchema(allStotras.length);
  const deityItemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Hindu Deity Categories",
    description: "Browse stotras organized by Hindu deities",
    numberOfItems: DEITIES.length,
    itemListElement: DEITIES.map((deity, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: deity.name,
      url: `${APP_URL}/deity/${deity.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(deityItemListSchema) }}
      />

      {/* -- Hero Section -- */}
      <section className="relative overflow-hidden bg-brand">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30Z' fill='none' stroke='%23DAA520' stroke-width='0.8'/%3E%3C/svg%3E")`,
              backgroundSize: "60px 60px",
            }}
          />
        </div>
        <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <TodayDayBadge
              days={byDay.days}
              className="text-saffron text-sm font-semibold uppercase tracking-[0.2em] mb-4 block"
            />
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Sacred Hindu Prayers
              <span className="block mt-2 gradient-text-gold" style={{ WebkitTextFillColor: "transparent", backgroundImage: "linear-gradient(135deg, #DAA520, #FF9933)", WebkitBackgroundClip: "text" }}>
                & Divine Hymns
              </span>
            </h1>
            <p className="text-lg text-white/70 leading-relaxed mb-8 max-w-2xl mx-auto">
              The largest open collection of Hindu stotras, chalisas, aartis, sahasranamas,
              kavachams, and Vedic suktams &mdash; plus the complete Bhagavad Gita and 40 vrat kathas.
              Every text in Devanagari Sanskrit with IAST transliteration, Hindi arth, and free PDF download.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/today"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-gold to-saffron text-brand-dark font-semibold px-7 py-3.5 rounded-xl hover:shadow-glow-gold transition-all duration-300 text-sm"
              >
                Today&apos;s Stotras
              </Link>
              <Link
                href="/deity"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium px-7 py-3.5 rounded-xl border border-white/20 transition-all duration-300 text-sm"
              >
                Browse by Deity
              </Link>
            </div>
            {allStotras.length > 0 && (
              <p className="mt-6 text-sm text-white/40">
                {allStotras.length} stotras across {DEITIES.length} deities
              </p>
            )}
          </div>
        </div>
        {/* Bottom wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full">
            <path
              d="M0 60V20C360 50 720 0 1080 30C1260 45 1380 55 1440 60H0Z"
              fill="#FFFBF5"
            />
          </svg>
        </div>
      </section>

      {/* -- About Stotra by VastuCart -- */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand mb-3">
                About Stotra by VastuCart
              </h2>
              <div className="mx-auto w-24 h-1 rounded-full bg-gradient-to-r from-brand via-gold to-saffron" />
            </div>

            <div className="prose prose-sm md:prose-base text-text-light leading-relaxed space-y-4 max-w-none">
              <p>
                <strong>Stotra by VastuCart</strong> is the largest open reference library of
                Hindu devotional texts on the web. Every stotra, chalisa, sahasranama, ashtakam,
                kavacham, aarti, and Vedic suktam is presented in Devanagari Sanskrit with
                IAST-style transliteration, Hindi arth, word-by-word meaning where available,
                traditional viniyog (ritual framing), and free PDF download. The site is
                organised by deity, day of the week, festival, ritual purpose, and textual type.
              </p>
              <p>
                Our sources are classical: the Shiva, Vishnu, Bhagavata, Devi Bhagavata,
                Markandeya, and Skanda Puranas; the Vedic Samhitas; the Ramcharitmanas and Vinay
                Patrika of Goswami Tulsidas; the stotra corpus of Adi Shankaracharya; and the
                Agamic and Tantric literature. Where a text's provenance is uncertain we say so
                plainly rather than invent a citation. Every translation is editorial work by
                VastuCart Editorial, sourced from the mula (root) text, not from secondary
                aggregated collections.
              </p>
              <p>
                Beyond the stotra corpus, the complete <strong>Bhagavad Gita</strong> is
                presented verse-by-verse across 18 chapters (701 verses per the Gita Press
                enumeration), and 40 <strong>vrat kathas</strong> cover the 12-month Vikram
                Samvat calendar and the weekly vrats. A daily Stotra of the Day and Gita Shloka
                of the Day are drawn from the same collection.
              </p>
            </div>

            {/* Stats band */}
            <div className="mt-10 grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { n: allStotras.length, label: "Stotras" },
                { n: DEITIES.length, label: "Deities" },
                { n: 701, label: "Gita Verses" },
                { n: 40, label: "Vrat Kathas" },
                { n: 104, label: "Taxonomy Hubs" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-white rounded-xl border border-border-light p-4 text-center"
                >
                  <p className="font-serif text-2xl md:text-3xl font-bold text-brand">
                    {s.n}
                  </p>
                  <p className="text-xs text-text-muted mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* -- Deity Categories -- */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand mb-3">
              Explore by Deity
            </h2>
            <p className="text-text-light max-w-lg mx-auto">
              Find stotras dedicated to your chosen deity
            </p>
            <div className="mt-4 mx-auto w-24 h-1 rounded-full bg-gradient-to-r from-brand via-gold to-saffron" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3 md:gap-4">
            {DEITIES.map((deity) => {
              const count = getStotraCountByDeity(deity.id);
              return (
                <Link
                  key={deity.id}
                  href={`/deity/${deity.slug}`}
                  className="group relative bg-white rounded-xl p-5 border border-border-light hover:border-gold/40 hover:shadow-card-hover transition-all duration-300 text-center"
                >
                  <div className="flex justify-center mb-3">
                    <CategoryIcon type="deity" id={deity.id} color={deity.color} size="md" />
                  </div>
                  <p className="font-semibold text-sm text-text group-hover:text-brand transition-colors">
                    {deity.name}
                  </p>
                  <p className="text-xs text-text-muted mt-0.5">{deity.nameHi}</p>
                  {count > 0 && (
                    <span className="mt-2 inline-block text-xs bg-cream-mid text-text-light px-2 py-0.5 rounded-full">
                      {count} stotras
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* -- Types of Hindu Stotras -- */}
      <section className="py-16 md:py-20 bg-white/40">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand mb-3">
              Types of Hindu Stotras
            </h2>
            <p className="text-text-light max-w-2xl mx-auto">
              Hindu devotional literature spans several classical forms, each with its own
              structure, history, and use in worship.
            </p>
            <div className="mt-4 mx-auto w-24 h-1 rounded-full bg-gradient-to-r from-brand via-gold to-saffron" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                name: "Chalisa",
                devanagari: "चालीसा",
                summary:
                  "A forty-verse devotional hymn (chalis = forty) in vernacular Hindi or Awadhi. The Hanuman Chalisa of Goswami Tulsidas is the most widely recited. Framing dohas bring a full Chalisa recitation to 43 verse-units.",
                link: "/stotra?type=chalisa",
                linkLabel: "Browse Chalisas",
              },
              {
                name: "Sahasranama",
                devanagari: "सहस्रनाम",
                summary:
                  "A thousand-name hymn of a deity, typically drawn from a Purana or Tantra. The Vishnu Sahasranama from the Mahabharata and the Lalita Sahasranama from the Brahmanda Purana are the most recited.",
                link: "/stotra?type=sahasranama",
                linkLabel: "Browse Sahasranamas",
              },
              {
                name: "Ashtakam & Ashtottara",
                devanagari: "अष्टकम् / अष्टोत्तरशतनामावली",
                summary:
                  "An ashtakam is an eight-verse hymn; an ashtottara-shatanamavali lists 108 sacred names. Most classical composers — Adi Shankaracharya above all — worked extensively in both forms.",
                link: "/stotra?type=ashtakam",
                linkLabel: "Browse Ashtakams",
              },
              {
                name: "Kavacham",
                devanagari: "कवचम्",
                summary:
                  "A devotional armour text invoking the deity as a protective shield over each part of the body. Kavachas are ritually recited before undertaking a major task or journey.",
                link: "/stotra?type=kavacham",
                linkLabel: "Browse Kavachams",
              },
              {
                name: "Aarti",
                devanagari: "आरती",
                summary:
                  "A short sung prayer accompanying the waving of lamps before a deity. Aartis close most Hindu temple and home worship rituals and are among the most popular sung Hindu prayers.",
                link: "/stotra?type=aarti",
                linkLabel: "Browse Aartis",
              },
              {
                name: "Suktam",
                devanagari: "सूक्तम्",
                summary:
                  "A Vedic hymn from the Rigveda, Atharvaveda, or Yajurveda. The Purusha Suktam, Shri Suktam, and Rudram are foundational Vedic chants recited in all traditional Hindu rituals.",
                link: "/stotra?type=suktam",
                linkLabel: "Browse Suktams",
              },
            ].map((t) => (
              <div
                key={t.name}
                className="bg-white rounded-xl border border-border-light p-6 hover:border-gold/40 hover:shadow-card-hover transition-all duration-300"
              >
                <div className="flex items-baseline gap-3 mb-3">
                  <h3 className="font-serif text-xl font-semibold text-brand">{t.name}</h3>
                  <span className="devanagari-heading text-sm text-text-muted">
                    {t.devanagari}
                  </span>
                </div>
                <p className="text-sm text-text-light leading-relaxed mb-4">{t.summary}</p>
                <Link
                  href={t.link}
                  className="text-sm font-medium text-saffron hover:text-orange transition-colors"
                >
                  {t.linkLabel} &rarr;
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -- Featured: Bhagavad Gita + Vrat Katha -- */}
      <section className="py-12 md:py-16 bg-cream-mid/50">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Bhagavad Gita Card */}
            <Link
              href="/gita"
              className="group relative overflow-hidden rounded-2xl p-8 md:p-10 border-2 border-gold/20 hover:border-gold/50 hover:shadow-glow-gold transition-all duration-300"
              style={{ background: 'linear-gradient(135deg, #013f47 0%, #01303a 100%)' }}
            >
              <div className="absolute inset-0 opacity-[0.07]">
                <div className="absolute inset-0" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30Z' fill='none' stroke='%23DAA520' stroke-width='0.6'/%3E%3C/svg%3E")`, backgroundSize: "60px 60px" }} />
              </div>
              <div className="absolute top-0 right-0 w-48 h-48 opacity-[0.04] pointer-events-none">
                <img src="/images/deities/krishna.svg" alt="" role="presentation" className="w-full h-full" style={{ filter: 'brightness(0) invert(1)' }} />
              </div>
              <div className="relative">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-[2px] bg-gradient-to-r from-gold to-saffron" />
                  <span className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: '#DAA520' }}>श्रीमद्भगवद्गीता</span>
                </div>
                <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-gold transition-colors duration-300">
                  Bhagavad Gita
                </h3>
                <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-sm">
                  All 18 chapters of the divine song of Lord Krishna — 700 verses in Sanskrit with Hindi meaning and transliteration.
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all duration-200" style={{ color: '#DAA520' }}>
                  Read All Chapters <span>&rarr;</span>
                </span>
              </div>
            </Link>

            {/* Vrat Katha Card */}
            <Link
              href="/vrat-katha"
              className="group relative overflow-hidden rounded-2xl p-8 md:p-10 border-2 border-gold/20 hover:border-gold/50 hover:shadow-glow-gold transition-all duration-300"
              style={{ background: 'linear-gradient(135deg, #013f47 0%, #01303a 100%)' }}
            >
              <div className="absolute inset-0 opacity-[0.07]">
                <div className="absolute inset-0" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30Z' fill='none' stroke='%23DAA520' stroke-width='0.6'/%3E%3C/svg%3E")`, backgroundSize: "60px 60px" }} />
              </div>
              <div className="absolute top-0 right-0 w-48 h-48 opacity-[0.04] pointer-events-none">
                <img src="/images/festivals/diwali.svg" alt="" role="presentation" className="w-full h-full" style={{ filter: 'brightness(0) invert(1)' }} />
              </div>
              <div className="relative">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-[2px] bg-gradient-to-r from-gold to-saffron" />
                  <span className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: '#DAA520' }}>व्रत कथा संग्रह</span>
                </div>
                <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-gold transition-colors duration-300">
                  Vrat Katha
                </h3>
                <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-sm">
                  Complete collection of Hindu fasting stories — 7 weekly vrats, 12-month festival kathas, and special occasion kathas in Hindi.
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all duration-200" style={{ color: '#DAA520' }}>
                  Browse All Kathas <span>&rarr;</span>
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* -- Gita Shloka of the Day -- */}
      {(() => {
        const gitaVotd = getGitaVerseOfTheDay();
        if (!gitaVotd) return null;
        const { chapter: gCh, verse: gV } = gitaVotd;
        return (
          <GitaShlokaCard
            devanagari={gV.devanagari}
            transliteration={gV.transliteration}
            englishTranslation={gV.englishTranslation}
            hindiTranslation={gV.hindiTranslation}
            commentary={gV.commentary}
            chapterNumber={gCh.chapterNumber}
            verseNumber={gV.verseNumber}
            chapterSlug={gCh.slug}
            verseSlug={gV.slug}
            chapterTitle={gCh.titleEnglish}
            appUrl={APP_URL}
          />
        );
      })()}

      {/* -- Most Recited Hindu Stotras -- */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand mb-3">
              Most Recited Hindu Stotras
            </h2>
            <p className="text-text-light max-w-2xl mx-auto">
              The eight most widely recited stotras across Hindu tradition — every home, temple, and devotee knows these.
            </p>
            <div className="mt-4 mx-auto w-24 h-1 rounded-full bg-gradient-to-r from-brand via-gold to-saffron" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { slug: "hanuman-chalisa", name: "Hanuman Chalisa", devanagari: "हनुमान चालीसा", meta: "Tulsidas · 43 verses" },
              { slug: "vishnu-sahasranama", name: "Vishnu Sahasranama", devanagari: "विष्णु सहस्रनाम", meta: "Mahabharata · 108 verses" },
              { slug: "shiv-tandav-stotram", name: "Shiv Tandav Stotram", devanagari: "शिव ताण्डव स्तोत्रम्", meta: "Ravana · 17 verses" },
              { slug: "lalita-sahasranama", name: "Lalita Sahasranama", devanagari: "ललिता सहस्रनाम", meta: "Brahmanda Purana" },
              { slug: "durga-kavach", name: "Durga Kavach", devanagari: "दुर्गा कवच", meta: "Markandeya Purana" },
              { slug: "ganesh-atharvashirsha", name: "Ganesh Atharvashirsha", devanagari: "गणेश अथर्वशीर्ष", meta: "Atharvaveda Upanishad" },
              { slug: "aditya-hridayam", name: "Aditya Hridayam", devanagari: "आदित्य हृदयम्", meta: "Valmiki Ramayana" },
              { slug: "ramraksha-stotra", name: "Ramraksha Stotra", devanagari: "राम रक्षा स्तोत्र", meta: "Budha Kaushika" },
            ].map((s) => (
              <Link
                key={s.slug}
                href={`/stotra/${s.slug}`}
                className="group block bg-white rounded-xl p-5 border border-border-light hover:border-gold/40 hover:shadow-card-hover transition-all duration-300"
              >
                <p className="devanagari-heading text-lg text-brand group-hover:text-brand-light transition-colors leading-tight">
                  {s.devanagari}
                </p>
                <p className="font-serif text-sm font-semibold text-text mt-1">{s.name}</p>
                <p className="text-[11px] text-text-muted mt-2">{s.meta}</p>
                <span className="text-xs font-medium text-saffron group-hover:text-orange transition-colors mt-3 inline-block">
                  Read {s.name} &rarr;
                </span>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/stotra"
              className="text-sm font-medium text-brand hover:text-brand-light transition-colors"
            >
              View all {allStotras.length} stotras in the collection &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* -- Today's Stotras (client-resolved IST day to avoid SSG freeze) -- */}
      <section className="py-16 bg-cream-mid/50">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <TodayDayBadge
              days={byDay.days}
              className="text-saffron text-sm font-semibold uppercase tracking-wider mb-2 block"
            />
            <h2 className="font-serif text-3xl font-bold text-brand">
              Today&apos;s Recommended Stotras
            </h2>
          </div>
          <TodaysStotrasGrid byDay={byDay} variant="homepage-card" limit={6} />
          <div className="text-center mt-8">
            <Link
              href="/today"
              className="text-sm font-medium text-brand hover:text-brand-light transition-colors"
            >
              View all stotras for today &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* -- Stotra of the Day (client-resolved IST date to avoid SSG freeze) -- */}
      <StotraOfTheDay stotras={sotdCandidates} />

      {/* -- Browse by Purpose -- */}
      <section className="py-16 bg-cream-mid/50">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl font-bold text-brand mb-3">
              Browse by Purpose
            </h2>
            <p className="text-text-light">Find stotras that serve your spiritual needs</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {PURPOSES.map((purpose) => (
              <Link
                key={purpose.id}
                href={`/purpose/${purpose.slug}`}
                className="inline-flex items-center gap-2 bg-white border border-border-light hover:border-gold/40 hover:shadow-card px-5 py-2.5 rounded-full text-sm font-medium text-text hover:text-brand transition-all duration-200"
              >
                <CategoryIcon type="purpose" id={purpose.id} size="sm" className="rounded-lg bg-brand/10" />
                {purpose.name}
                <span className="text-text-muted text-xs">{purpose.nameHi}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* -- Ecosystem Section -- */}
      <section className="py-16">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl font-bold text-brand mb-3">
              VastuCart Spiritual Ecosystem
            </h2>
            <p className="text-text-light max-w-lg mx-auto">
              Explore our complete range of authentic spiritual services and products
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ECOSYSTEM_SITES.slice(0, 4).map((site) => (
              <a
                key={site.name}
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white rounded-xl p-6 border border-border-light hover:border-brand/30 hover:shadow-card-hover transition-all duration-300"
              >
                <h3 className="font-serif text-lg font-semibold text-brand group-hover:text-brand-light transition-colors mb-2">
                  {site.name}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed mb-3">
                  {site.description}
                </p>
                <span className="text-xs font-medium text-saffron group-hover:text-orange transition-colors">
                  {site.tagline} &rarr;
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* -- FAQ Section -- */}
      {/* -- How We Prepare Translations (E-E-A-T) -- */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-border-light p-6 md:p-8 text-center">
            <h2 className="font-serif text-2xl font-bold text-brand mb-3">
              How We Prepare Our Translations
            </h2>
            <p className="text-sm md:text-[15px] text-text-light leading-relaxed">
              Every stotra, Gita verse, and vrat katha on this site is transcribed from classical
              printed or digital editions by <strong>VastuCart Editorial</strong>. Our primary
              references are the Gita Press (Gorakhpur) editions, the Ramcharitmanas of Tulsidas,
              the Adi Shankaracharya stotra corpus, and the Vedic Samhitas. Where a text&apos;s
              provenance is uncertain, we say so plainly rather than invent a citation.
            </p>
            <Link
              href="/editorial-process"
              className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-brand hover:text-brand-light transition-colors"
            >
              Read our full editorial process &rarr;
            </Link>
          </div>
        </div>
      </section>

      <FAQSection />
    </>
  );
}
