import type { Metadata } from "next";
import Link from "next/link";
import { DEITIES, getDeityById } from "@/data/deities";
import { getTodayDay } from "@/data/days";
import { PURPOSES } from "@/data/purposes";
import { ECOSYSTEM_SITES } from "@/data/ecosystem";
import { getAllStotras, getTodaysStotras, getStotraOfTheDay, getStotraCountByDeity } from "@/lib/stotras";
import { FAQSection } from "@/components/pages/HomePage";
import { CategoryIcon } from "@/components/ui/CategoryIcon";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://stotra.vastucart.in";

export const metadata: Metadata = {
  title: "Stotra - Sacred Hindu Prayers & Hymns | VastuCart",
  description:
    "Explore a comprehensive collection of Hindu stotras, chalisa, and sacred hymns in Sanskrit and Hindi with transliteration, meaning, and free PDF downloads. Organized by deity, day, and festival.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Stotra - Sacred Hindu Prayers & Hymns | VastuCart",
    description:
      "Complete collection of Hindu stotras, chalisa, and sacred hymns with transliteration, meaning, and free PDF downloads.",
    url: APP_URL,
    type: "website",
    images: [
      {
        url: `${APP_URL}/og-default.jpg`,
        width: 1200,
        height: 630,
        alt: "Stotra by VastuCart - Sacred Hindu Prayers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stotra - Sacred Hindu Prayers & Hymns | VastuCart",
    description:
      "Complete collection of Hindu stotras, chalisa, and sacred hymns with transliteration, meaning, and free PDF downloads.",
    images: [`${APP_URL}/og-default.jpg`],
  },
};

export default function Home() {
  const todayDay = getTodayDay();
  const todaysStotras = getTodaysStotras();
  const stotraOfTheDay = getStotraOfTheDay();
  const allStotras = getAllStotras();

  const itemListSchema = {
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
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
            <p className="text-saffron text-sm font-semibold uppercase tracking-[0.2em] mb-4">
              {todayDay.nameHi} &middot; {todayDay.name}
            </p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Sacred Hindu Prayers
              <span className="block mt-2 gradient-text-gold" style={{ WebkitTextFillColor: "transparent", backgroundImage: "linear-gradient(135deg, #DAA520, #FF9933)", WebkitBackgroundClip: "text" }}>
                & Divine Hymns
              </span>
            </h1>
            <p className="text-lg text-white/70 leading-relaxed mb-8 max-w-2xl mx-auto">
              Explore our comprehensive collection of stotras, chalisa, and sacred hymns
              in Sanskrit and Hindi with transliteration, meaning, and free PDF downloads.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/today"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-gold to-saffron text-brand-dark font-semibold px-7 py-3.5 rounded-xl hover:shadow-glow-gold transition-all duration-300 text-sm"
              >
                Today&apos;s Stotras
                <span className="text-xs bg-brand-dark/20 px-2 py-0.5 rounded-full">
                  {todaysStotras.length}
                </span>
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

      {/* -- Today's Stotras -- */}
      {todaysStotras.length > 0 && (
        <section className="py-16 bg-cream-mid/50">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p className="text-saffron text-sm font-semibold uppercase tracking-wider mb-2">
                {todayDay.nameHi} &middot; {todayDay.name}
              </p>
              <h2 className="font-serif text-3xl font-bold text-brand">
                Today&apos;s Recommended Stotras
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {todaysStotras.slice(0, 6).map((stotra) => (
                <Link
                  key={stotra.slug}
                  href={`/stotra/${stotra.slug}`}
                  className="group bg-white rounded-xl p-6 border border-border-light hover:border-gold/30 hover:shadow-card-hover transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="devanagari-heading text-lg text-brand group-hover:text-brand-light transition-colors">
                        {stotra.title}
                      </h3>
                      <p className="text-sm text-text-light mt-0.5">
                        {stotra.titleEn}
                      </p>
                    </div>
                    <span className="text-xs bg-cream-mid text-text-muted px-2 py-1 rounded-full whitespace-nowrap">
                      {stotra.readingTimeMinutes} min
                    </span>
                  </div>
                  <p className="text-sm text-text-muted line-clamp-2">
                    {stotra.seoDescription}
                  </p>
                  <div className="mt-4 flex items-center gap-2 flex-wrap">
                    <span className="text-xs bg-brand/10 text-brand px-2 py-0.5 rounded-full capitalize">
                      {stotra.deity}
                    </span>
                    <span className="text-xs text-text-muted">
                      {stotra.verseCount} verses
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            {todaysStotras.length > 6 && (
              <div className="text-center mt-8">
                <Link
                  href="/today"
                  className="text-sm font-medium text-brand hover:text-brand-light transition-colors"
                >
                  View all {todaysStotras.length} stotras for today &rarr;
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* -- Stotra of the Day -- */}
      {stotraOfTheDay && (() => {
        const sotdDeity = getDeityById(stotraOfTheDay.deity);
        const deityColor = sotdDeity?.color || '#013f47';
        const firstVerses = stotraOfTheDay.devanagariText
          .split("\n")
          .filter((l: string) => l.trim().length > 0)
          .slice(0, 4)
          .join("\n");
        return (
          <section className="relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${deityColor} 0%, ${deityColor}ee 40%, #013f47 100%)` }}>
            {/* Gold shimmer top edge */}
            <div className="h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent" />

            {/* Layer 1: Mandala concentric rings */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute opacity-[0.04]" style={{ width: '800px', height: '800px', top: '50%', right: '-10%', transform: 'translateY(-50%)' }}>
                <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="200" cy="200" r="195" stroke="white" strokeWidth="0.5"/>
                  <circle cx="200" cy="200" r="160" stroke="white" strokeWidth="0.5"/>
                  <circle cx="200" cy="200" r="125" stroke="white" strokeWidth="0.5"/>
                  <circle cx="200" cy="200" r="90" stroke="white" strokeWidth="0.5"/>
                  <circle cx="200" cy="200" r="55" stroke="white" strokeWidth="0.5"/>
                  <path d="M200 5L200 395M5 200L395 200" stroke="white" strokeWidth="0.3"/>
                  <path d="M62 62L338 338M338 62L62 338" stroke="white" strokeWidth="0.3"/>
                  <path d="M200 5L338 338M200 5L62 338M200 395L338 62M200 395L62 62" stroke="white" strokeWidth="0.2"/>
                  <path d="M5 200L338 62M5 200L338 338M395 200L62 62M395 200L62 338" stroke="white" strokeWidth="0.2"/>
                </svg>
              </div>
            </div>

            {/* Layer 2: Warm glow spots */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full opacity-[0.08] pointer-events-none" style={{ background: 'radial-gradient(circle, #DAA520 0%, transparent 70%)' }} />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full opacity-[0.05] pointer-events-none" style={{ background: 'radial-gradient(circle, #FF9933 0%, transparent 70%)' }} />

            {/* Layer 3: Giant watermark deity icon */}
            {sotdDeity && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[15%] opacity-[0.06] pointer-events-none hidden lg:block">
                <img
                  src={`/images/deities/${sotdDeity.id}.svg`}
                  alt=""
                  className="w-[500px] h-[500px]"
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
              </div>
            )}

            {/* Content */}
            <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-16 md:py-24">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

                {/* Left Column: Info */}
                <div className="text-center lg:text-left">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2.5 mb-8">
                    <span className="flex items-center gap-2 bg-gold/20 backdrop-blur-sm rounded-full pl-1.5 pr-4 py-1.5 border border-gold/30">
                      <span className="w-6 h-6 rounded-full bg-gold/30 flex items-center justify-center text-gold text-xs">&#9733;</span>
                      <span className="text-xs font-bold text-gold uppercase tracking-[0.2em]">
                        Stotra of the Day
                      </span>
                    </span>
                    {sotdDeity && (
                      <span className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full pl-1 pr-3 py-1 border border-white/15">
                        <CategoryIcon type="deity" id={sotdDeity.id} color="transparent" size="sm" className="!w-6 !h-6 !rounded-full bg-white/10" />
                        <span className="text-xs font-medium text-white/80">{sotdDeity.name}</span>
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="devanagari-heading text-4xl md:text-5xl lg:text-6xl text-white mb-3 leading-[1.15]">
                    {stotraOfTheDay.title}
                  </h3>
                  <p className="font-serif text-xl md:text-2xl text-white/60 mb-8 italic">
                    {stotraOfTheDay.titleEn}
                  </p>

                  {/* Meta pills */}
                  <div className="flex flex-wrap items-center gap-2 mb-8 justify-center lg:justify-start">
                    <span className="text-xs bg-white/10 text-white/70 px-3 py-1.5 rounded-full border border-white/10">
                      {stotraOfTheDay.verseCount} verses
                    </span>
                    <span className="text-xs bg-white/10 text-white/70 px-3 py-1.5 rounded-full border border-white/10">
                      {stotraOfTheDay.readingTimeMinutes} min read
                    </span>
                    <span className="text-xs bg-white/10 text-white/70 px-3 py-1.5 rounded-full border border-white/10 capitalize">
                      {stotraOfTheDay.source}
                    </span>
                  </div>

                  {/* CTA */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                    <Link
                      href={`/stotra/${stotraOfTheDay.slug}`}
                      className="group inline-flex items-center gap-2 bg-gradient-to-r from-gold to-saffron text-brand-dark font-bold px-8 py-4 rounded-xl hover:shadow-glow-gold transition-all duration-300 text-sm"
                    >
                      Read Full Stotra
                      <span className="group-hover:translate-x-1 transition-transform duration-200">&rarr;</span>
                    </Link>
                    <Link
                      href={`/deity/${sotdDeity?.slug || stotraOfTheDay.deity}`}
                      className="inline-flex items-center gap-2 text-white/50 hover:text-white/80 text-sm font-medium transition-colors duration-200"
                    >
                      More {sotdDeity?.name} Stotras &rarr;
                    </Link>
                  </div>
                </div>

                {/* Right Column: Verse Preview Card */}
                <div className="relative">
                  <div className="relative bg-white/[0.07] backdrop-blur-md rounded-2xl border border-white/[0.12] p-8 md:p-10">
                    {/* Decorative corner accents */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-gold/40 rounded-tl-2xl" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-gold/40 rounded-tr-2xl" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-gold/40 rounded-bl-2xl" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-gold/40 rounded-br-2xl" />

                    {/* Om header */}
                    <div className="text-center mb-6">
                      <span className="text-gold/60 text-3xl font-serif">&#x0950;</span>
                    </div>

                    {/* Verse text */}
                    <p className="devanagari text-white/80 text-lg md:text-xl leading-[2.2] text-center whitespace-pre-line">
                      {firstVerses}
                    </p>

                    {/* Divider */}
                    <div className="mt-6 flex items-center justify-center gap-3">
                      <div className="w-12 h-px bg-gradient-to-r from-transparent to-gold/40" />
                      <span className="text-gold/40 text-xs">&#x0965;</span>
                      <div className="w-12 h-px bg-gradient-to-l from-transparent to-gold/40" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Gold shimmer bottom edge */}
            <div className="h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent" />
          </section>
        );
      })()}

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
      <FAQSection />
    </>
  );
}
