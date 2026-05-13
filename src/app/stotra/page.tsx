import type { Metadata } from "next";
import { getAllStotras } from "@/lib/stotras";
import { StotraCard } from "@/components/stotra/StotraCard";
import { buildHubPageGraph, STOTRA_BASE } from "@/lib/schema";
import { siteOpenGraph, siteTwitter } from "@/lib/seo-meta";

const PAGE_TITLE = "All Stotras — Complete Collection | Stotra by VastuCart";
const PAGE_DESC =
  "Browse our complete collection of Hindu stotras, chalisa, and sacred hymns in Sanskrit and Hindi with transliteration and meaning.";

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

  const graph = buildHubPageGraph({
    path: "/stotra",
    name: "All Stotras — Complete Collection",
    description:
      "Browse our complete collection of Hindu stotras, chalisas, and sacred hymns in Sanskrit and Hindi with transliteration and meaning.",
    breadcrumbName: "All Stotras",
    items: stotras.map((s) => ({
      name: s.titleEn,
      url: `${STOTRA_BASE}/stotra/${s.slug}`,
    })),
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
      </div>
      {stotras.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {stotras.map((s) => <StotraCard key={s.slug} stotra={s} />)}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-border-light">
          <p className="text-text-muted">No stotras available yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
