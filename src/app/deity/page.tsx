import type { Metadata } from "next";
import Link from "next/link";
import { DEITIES } from "@/data/deities";
import { getStotraCountByDeity } from "@/lib/stotras";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://stotra.vastucart.in";

export const metadata: Metadata = {
  title: "Stotras by Deity",
  description:
    "Browse our complete collection of Hindu stotras organized by deity - Ganesha, Shiva, Vishnu, Hanuman, Lakshmi, Durga, Krishna, Rama, and more.",
  alternates: {
    canonical: "/deity",
  },
  openGraph: {
    title: "Stotras by Deity | Stotra by VastuCart",
    description:
      "Browse our complete collection of Hindu stotras organized by deity - Ganesha, Shiva, Vishnu, Hanuman, Lakshmi, Durga, Krishna, Rama, and more.",
    url: `${APP_URL}/deity`,
    type: "website",
    images: [
      {
        url: `${APP_URL}/og-default.jpg`,
        width: 1200,
        height: 630,
        alt: "Browse Stotras by Deity - Stotra by VastuCart",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stotras by Deity | Stotra by VastuCart",
    description:
      "Browse our complete collection of Hindu stotras organized by deity - Ganesha, Shiva, Vishnu, Hanuman, Lakshmi, Durga, Krishna, Rama, and more.",
    images: [`${APP_URL}/og-default.jpg`],
  },
};

export default function DeityListPage() {
  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Stotras by Deity",
    description:
      "Browse our complete collection of Hindu stotras organized by deity.",
    url: `${APP_URL}/deity`,
    isPartOf: { "@id": `${APP_URL}/#website` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: DEITIES.length,
      itemListElement: DEITIES.map((deity, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: deity.name,
        url: `${APP_URL}/deity/${deity.slug}`,
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
        name: "Deities",
        item: `${APP_URL}/deity`,
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
        <h1 className="font-serif text-4xl font-bold text-brand mb-3">
          Browse Stotras by Deity
        </h1>
        <p className="text-text-light max-w-lg mx-auto">
          Explore our collection of sacred stotras dedicated to Hindu deities
        </p>
        <div className="mt-4 mx-auto w-24 h-1 rounded-full bg-gradient-to-r from-brand via-gold to-saffron" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {DEITIES.map((deity) => {
          const count = getStotraCountByDeity(deity.id);
          return (
            <Link
              key={deity.id}
              href={`/deity/${deity.slug}`}
              className="group bg-white rounded-xl p-6 border border-border-light hover:border-gold/30 hover:shadow-card-hover transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-3">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-2xl font-bold font-serif"
                  style={{ backgroundColor: deity.color }}
                >
                  {deity.nameHi.charAt(0)}
                </div>
                <div>
                  <h2 className="font-serif text-xl font-semibold text-brand group-hover:text-brand-light transition-colors">
                    {deity.name}
                  </h2>
                  <p className="devanagari-heading text-sm text-text-muted">
                    {deity.nameHi}
                  </p>
                </div>
              </div>
              <p className="text-sm text-text-muted line-clamp-2 mb-3">
                {deity.description}
              </p>
              {count > 0 && (
                <span className="text-xs bg-cream-mid text-text-light px-3 py-1 rounded-full">
                  {count} stotras available
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
