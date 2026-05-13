import type { Metadata } from "next";
import Link from "next/link";
import { HINDU_MONTHS, WEEKLY_VRAT_KATHAS } from "@/data/vrat-katha";
import { getStotraBySlug } from "@/lib/stotras";
import { buildHubPageGraph, STOTRA_BASE } from "@/lib/schema";
import { siteOpenGraph, siteTwitter } from "@/lib/seo-meta";

const PAGE_TITLE = "Vrat Katha — 12 Month Hindu Fasting Stories | VastuCart";
const PAGE_DESC =
  "Complete Hindu Vrat Katha collection organized by month — Satyanarayan, Karwa Chauth, Ekadashi, Navratri, Diwali, and more in Hindi.";

export const metadata: Metadata = {
  title: "Vrat Katha - 12 Month Hindu Fasting Stories in Hindi",
  description:
    "Read all Hindu Vrat Kathas organized by 12 months (Vikram Samvat) — Satyanarayan Katha, Karwa Chauth, Ekadashi, Somvar Vrat, and more. Complete collection in Hindi with transliteration and free PDF download.",
  alternates: { canonical: "/vrat-katha" },
  openGraph: siteOpenGraph({
    path: "/vrat-katha",
    title: PAGE_TITLE,
    description: PAGE_DESC,
    type: "website",
  }),
  twitter: siteTwitter({
    path: "/vrat-katha",
    title: PAGE_TITLE,
    description: PAGE_DESC,
  }),
};

export default function VratKathaPage() {
  const kathaSlugs = new Set<string>();
  WEEKLY_VRAT_KATHAS.forEach((w) => kathaSlugs.add(w.slug));
  HINDU_MONTHS.forEach((m) => m.kathas.forEach((s) => kathaSlugs.add(s)));
  const items = Array.from(kathaSlugs)
    .map((slug) => {
      const k = getStotraBySlug(slug);
      return k ? { name: k.titleEn, url: `${STOTRA_BASE}/stotra/${k.slug}` } : null;
    })
    .filter((x): x is { name: string; url: string } => x !== null);

  const graph = buildHubPageGraph({
    path: "/vrat-katha",
    name: "Vrat Katha — Hindu Fasting Stories",
    description:
      "Complete collection of Hindu Vrat Kathas organized by 12 months (Vikram Samvat) and weekly vrats — Satyanarayan, Karwa Chauth, Ekadashi, Somvar Vrat, and more in Hindi with transliteration and free PDF.",
    breadcrumbName: "Vrat Katha",
    items,
  });

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
      />

      {/* Hero */}
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
            <span className="text-white/80">Vrat Katha</span>
          </nav>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-[2px] bg-saffron" />
            <span className="text-saffron text-xs font-bold uppercase tracking-[0.2em]">
              व्रत कथा संग्रह
            </span>
          </div>

          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
            Vrat Katha
          </h1>
          <p className="devanagari-heading text-2xl md:text-3xl mb-6" style={{ color: '#FF9933' }}>
            सम्पूर्ण व्रत कथा संग्रह
          </p>
          <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-2xl mb-6">
            Complete collection of Hindu Vrat Kathas (fasting stories) organized by the 12 months
            of the Vikram Samvat calendar. Read traditional kathas for weekly vrats, festival vrats,
            and auspicious occasions — in Hindi with English transliteration and free PDF download.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="text-xs bg-white/10 text-white/70 px-3 py-1.5 rounded-full border border-white/10">
              12 Hindu Months
            </span>
            <span className="text-xs bg-white/10 text-white/70 px-3 py-1.5 rounded-full border border-white/10">
              7 Weekly Vrats
            </span>
            <span className="text-xs bg-white/10 text-white/70 px-3 py-1.5 rounded-full border border-white/10">
              20+ Festival Kathas
            </span>
          </div>
        </div>
      </section>

      {/* Weekly Vrat Kathas */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand mb-3">
              Weekly Vrat Kathas
            </h2>
            <p className="text-text-light max-w-lg mx-auto">
              Traditional fasting stories for each day of the week (सप्ताह के व्रत)
            </p>
            <div className="mt-4 mx-auto w-24 h-1 rounded-full bg-gradient-to-r from-brand via-gold to-saffron" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {WEEKLY_VRAT_KATHAS.map((item) => {
              const stotra = getStotraBySlug(item.slug);
              return (
                <Link
                  key={item.slug}
                  href={`/stotra/${item.slug}`}
                  className="group bg-white rounded-xl p-4 border border-border-light hover:border-gold/40 hover:shadow-card-hover transition-all duration-300 text-center"
                >
                  <p className="font-serif text-lg font-semibold text-brand group-hover:text-brand-light transition-colors">
                    {item.day}
                  </p>
                  <p className="devanagari-heading text-sm text-text-muted">{item.dayHi}</p>
                  {stotra && (
                    <p className="text-[10px] text-text-muted mt-2">
                      {stotra.verseCount}v &middot; {stotra.readingTimeMinutes}m
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 12-Month Grid */}
      <section className="py-16 bg-cream-mid/50">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand mb-3">
              12 Months &middot; Festival Vrat Kathas
            </h2>
            <p className="text-text-light max-w-lg mx-auto">
              Organized by Hindu Vikram Samvat months with corresponding English months
            </p>
            <div className="mt-4 mx-auto w-24 h-1 rounded-full bg-gradient-to-r from-brand via-gold to-saffron" />
          </div>

          <div className="space-y-6">
            {HINDU_MONTHS.map((month, idx) => {
              const kathas = month.kathas
                .map((slug) => getStotraBySlug(slug))
                .filter(Boolean);

              return (
                <div
                  key={month.id}
                  className="bg-white rounded-xl border border-border-light overflow-hidden"
                >
                  {/* Month Header */}
                  <div className="flex items-center gap-4 p-5 border-b border-border-light bg-cream/50">
                    <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-brand font-serif text-xl font-bold">{idx + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-baseline gap-2">
                        <h3 className="font-serif text-xl font-semibold text-brand">
                          {month.name}
                        </h3>
                        <span className="devanagari-heading text-base text-text-muted">
                          {month.nameHi}
                        </span>
                      </div>
                      <p className="text-xs text-text-muted mt-0.5">{month.englishMonths}</p>
                    </div>
                    <span className="text-xs bg-cream-mid text-text-light px-2.5 py-1 rounded-full">
                      {kathas.length} {kathas.length === 1 ? "katha" : "kathas"}
                    </span>
                  </div>

                  {/* Kathas List */}
                  <div className="divide-y divide-border-light">
                    {kathas.map((katha) => (
                      <Link
                        key={katha!.slug}
                        href={`/stotra/${katha!.slug}`}
                        className="group flex items-center gap-4 p-4 hover:bg-cream/30 transition-colors duration-200"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="devanagari-heading text-base text-brand group-hover:text-brand-light transition-colors">
                            {katha!.title}
                          </p>
                          <p className="text-sm text-text-light mt-0.5">
                            {katha!.titleEn}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-text-muted flex-shrink-0">
                          <span>{katha!.verseCount}v</span>
                          <span>&middot;</span>
                          <span>{katha!.readingTimeMinutes}m</span>
                        </div>
                        <span className="text-xs font-medium text-saffron group-hover:text-orange transition-colors flex-shrink-0">
                          Read &rarr;
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SEO Content */}
      <section className="py-16">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-2xl font-bold text-brand mb-6">
              About Hindu Vrat Kathas
            </h2>
            <div className="prose prose-sm text-text-light leading-relaxed space-y-4">
              <p>
                Vrat Katha (व्रत कथा) is an integral part of Hindu fasting traditions. Every vrat (fast)
                has a sacred story associated with it that explains its origin, significance, and the
                blessings it bestows upon the observer. Listening to or reading the Vrat Katha is
                considered as important as the fast itself.
              </p>
              <p>
                The Hindu calendar follows the Vikram Samvat system with 12 lunar months, each having
                specific vrats and festivals. From Chaitra (March-April) to Phalgun (February-March),
                every month brings auspicious occasions for worship, fasting, and spiritual growth. Major
                vrat kathas include Satyanarayan Katha, Karwa Chauth Katha, Ekadashi Katha, Somvar
                Vrat Katha, and Navratri Katha among many others.
              </p>
              <p>
                In addition to monthly festival kathas, Hindus observe weekly vrats dedicated to specific
                deities — Monday for Lord Shiva, Tuesday for Hanuman, Wednesday for Ganesha, Thursday
                for Vishnu/Brihaspati, Friday for Lakshmi/Santoshi Mata, Saturday for Shani Dev, and
                Sunday for Surya Dev. Each weekly vrat has its own traditional katha that is read after
                completing the fast.
              </p>
              <p>
                On this page, you can read all major Hindu Vrat Kathas in Hindi with English transliteration
                and free PDF download for offline reading. The kathas are organized both by the Hindu
                Vikram Samvat calendar months and by the day of the week for easy reference.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
