import type { Metadata } from "next";
import { getAllStotras } from "@/lib/stotras";
import { StotraCard } from "@/components/stotra/StotraCard";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://stotra.vastucart.in";

export const metadata: Metadata = {
  title: "All Stotras - Complete Collection",
  description: "Browse our complete collection of Hindu stotras, chalisa, and sacred hymns in Sanskrit and Hindi with transliteration and meaning.",
  alternates: {
    canonical: "/stotra",
  },
  openGraph: {
    title: "All Stotras - Complete Collection | Stotra by VastuCart",
    description: "Browse our complete collection of Hindu stotras, chalisa, and sacred hymns in Sanskrit and Hindi with transliteration and meaning.",
    url: `${APP_URL}/stotra`,
    type: "website",
    images: [
      {
        url: `${APP_URL}/og-default.jpg`,
        width: 1200,
        height: 630,
        alt: "All Stotras - Stotra by VastuCart",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "All Stotras - Complete Collection | Stotra by VastuCart",
    description: "Browse our complete collection of Hindu stotras, chalisa, and sacred hymns in Sanskrit and Hindi with transliteration and meaning.",
    images: [`${APP_URL}/og-default.jpg`],
  },
};

export default function AllStotraPage() {
  const stotras = getAllStotras();

  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "All Stotras - Complete Collection",
    description: "Browse our complete collection of Hindu stotras, chalisa, and sacred hymns.",
    url: `${APP_URL}/stotra`,
    isPartOf: { "@id": `${APP_URL}/#website` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: stotras.length,
      itemListElement: stotras.map((stotra, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: stotra.titleEn,
        url: `${APP_URL}/stotra/${stotra.slug}`,
      })),
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: APP_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "All Stotras",
        item: `${APP_URL}/stotra`,
      },
    ],
  };

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
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
