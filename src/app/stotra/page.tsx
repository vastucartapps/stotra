import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { getAllStotras } from "@/lib/stotras";
import { StotraCard } from "@/components/stotra/StotraCard";
import { buildHubPageGraph, STOTRA_BASE } from "@/lib/schema";
import { siteOpenGraph, siteTwitter } from "@/lib/seo-meta";

const PAGE_TITLE = "All Stotras — Complete Collection | Stotra by VastuCart";
const PAGE_DESC =
  "Browse our complete collection of Hindu stotras, chalisa, and sacred hymns in Sanskrit and Hindi with transliteration and meaning.";

/**
 * Featured-card cap: a single page rendering 930+ full StotraCards weighs
 * ~4.75MB on the wire and trips Googlebot's render budget. Cap rich cards
 * at FEATURED_LIMIT and emit the remaining titles as a lightweight text
 * index below — preserves crawl discoverability without 930x card chrome.
 */
const FEATURED_LIMIT = 60;

export const metadata: Metadata = {
  title: "All Stotras - Complete Collection",
  description: PAGE_DESC,
  alternates: { canonical: "/stotra" },
  openGraph: siteOpenGraph({
    path: "/stotra",
    title: PAGE_TITLE,
    description: PAGE_DESC,
    type: "website",
    imageAlt: "All Stotras - Stotra by VastuCart",
  }),
  twitter: siteTwitter({
    path: "/stotra",
    title: PAGE_TITLE,
    description: PAGE_DESC,
  }),
};

export default function AllStotraPage() {
  const stotras = getAllStotras();
  const featured = stotras.slice(0, FEATURED_LIMIT);
  const rest = stotras.slice(FEATURED_LIMIT);

  const graph = buildHubPageGraph({
    path: "/stotra",
    name: "All Stotras — Complete Collection",
    description:
      "Browse our complete collection of Hindu stotras, chalisas, and sacred hymns in Sanskrit and Hindi with transliteration and meaning.",
    breadcrumbName: "All Stotras",
    items: stotras.map((s) => ({
      name: s.titleEn,
      url: `${STOTRA_BASE}/stotra/${s.slug}`,
      description: s.seoDescription,
      deity: s.deity,
      verseCount: s.verseCount,
    })),
    about: {
      name: "Hindu Stotras (Sanskrit Devotional Hymns)",
      description:
        "Sanskrit and Hindi devotional verses (stotras, chalisas, ashtakams, kavachams, sahasranamas) addressed to Hindu deities. Preserved in classical traditions from Vedic Suktas through Puranas and Itihasas.",
      sameAs: [
        "https://en.wikipedia.org/wiki/Stotra",
        "https://www.wikidata.org/wiki/Q2666158",
      ],
    },
  });

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
      />

      <div className="text-center mb-12">
        <h1 className="font-serif text-4xl font-bold text-brand mb-3">All Stotras</h1>
        <p className="text-text-light">{stotras.length} sacred prayers and hymns</p>
        <div className="mt-4 mx-auto w-24 h-1 rounded-full bg-gradient-to-r from-brand via-gold to-saffron" />
        <Link
          href="/search"
          className="mt-6 inline-flex items-center gap-2 bg-brand text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-brand-light transition-colors duration-200"
        >
          <Search className="w-4 h-4" />
          Search all {stotras.length} stotras
        </Link>
      </div>

      {featured.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((s) => <StotraCard key={s.slug} stotra={s} />)}
          </div>

          {rest.length > 0 && (
            <section className="mt-16">
              <h2 className="font-serif text-2xl font-semibold text-brand mb-2">
                Complete Index — {rest.length} more stotras
              </h2>
              <p className="text-sm text-text-muted mb-6">
                Listed alphabetically. Use search above to filter by deity, day, or purpose.
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1 text-sm">
                {rest.map((s) => (
                  <li key={s.slug} className="border-b border-border-light/60 py-1.5">
                    <Link
                      href={`/stotra/${s.slug}`}
                      className="block text-text hover:text-brand transition-colors"
                    >
                      <span className="text-text">{s.titleEn}</span>
                      <span className="devanagari-heading text-xs text-text-muted ml-2">
                        {s.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-border-light">
          <p className="text-text-muted">No stotras available yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
