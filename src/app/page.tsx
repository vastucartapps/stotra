import type { Metadata } from "next";
import Link from "next/link";
import { DEITIES } from "@/data/deities";
import { getTodayDay } from "@/data/days";
import { PURPOSES } from "@/data/purposes";
import { ECOSYSTEM_SITES } from "@/data/ecosystem";
import { getAllStotras, getTodaysStotras, getStotraOfTheDay, getStotraCountByDeity } from "@/lib/stotras";
import { FAQSection } from "@/components/pages/HomePage";

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
                  <div
                    className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center text-white text-lg font-bold"
                    style={{ backgroundColor: deity.color }}
                  >
                    {deity.nameHi.charAt(0)}
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
      {stotraOfTheDay && (
        <section className="py-16">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl border-2 border-gold/30 overflow-hidden shadow-card hover:shadow-glow-gold transition-shadow duration-500">
              <div className="gradient-border-top" />
              <div className="p-8 md:p-10">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-gold text-lg">&#9733;</span>
                  <span className="text-xs font-semibold text-gold uppercase tracking-wider">
                    Stotra of the Day
                  </span>
                </div>
                <h3 className="devanagari-heading text-2xl md:text-3xl text-brand mb-1">
                  {stotraOfTheDay.title}
                </h3>
                <p className="text-lg text-text-light mb-4">
                  {stotraOfTheDay.titleEn}
                </p>
                <p className="devanagari text-text-light leading-loose line-clamp-3 mb-6">
                  {stotraOfTheDay.devanagariText.split("\n").slice(0, 3).join("\n")}
                </p>
                <Link
                  href={`/stotra/${stotraOfTheDay.slug}`}
                  className="inline-flex items-center gap-2 bg-brand text-white font-medium px-6 py-3 rounded-xl hover:bg-brand-light transition-colors duration-200 text-sm"
                >
                  Read Full Stotra &rarr;
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

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
                className="bg-white border border-border-light hover:border-gold/40 hover:shadow-card px-5 py-2.5 rounded-full text-sm font-medium text-text hover:text-brand transition-all duration-200"
              >
                {purpose.name}
                <span className="text-text-muted ml-1.5 text-xs">{purpose.nameHi}</span>
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
