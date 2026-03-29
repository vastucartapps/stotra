import type { Metadata } from "next";
import Link from "next/link";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { FESTIVALS } from "@/data/festivals";
import { getDeityById } from "@/data/deities";
import { getStotrasByFestival } from "@/lib/stotras";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://stotra.vastucart.in";

export const metadata: Metadata = {
  title: "Stotras by Festival",
  description:
    "Find the right stotras for Hindu festivals - Navratri, Diwali, Maha Shivaratri, Ganesh Chaturthi, Janmashtami, and more.",
  alternates: {
    canonical: "/festival",
  },
  openGraph: {
    title: "Stotras by Festival | Stotra by VastuCart",
    description:
      "Find the right stotras for Hindu festivals - Navratri, Diwali, Maha Shivaratri, Ganesh Chaturthi, Janmashtami, and more.",
    url: `${APP_URL}/festival`,
    type: "website",
    images: [
      {
        url: `${APP_URL}/og-default.jpg`,
        width: 1200,
        height: 630,
        alt: "Stotras by Festival - Stotra by VastuCart",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stotras by Festival | Stotra by VastuCart",
    description:
      "Find the right stotras for Hindu festivals - Navratri, Diwali, Maha Shivaratri, Ganesh Chaturthi, Janmashtami, and more.",
    images: [`${APP_URL}/og-default.jpg`],
  },
};

export default function FestivalListPage() {
  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Stotras by Festival",
    description:
      "Sacred hymns and prayers for Hindu festivals and holy occasions.",
    url: `${APP_URL}/festival`,
    isPartOf: { "@id": `${APP_URL}/#website` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: FESTIVALS.length,
      itemListElement: FESTIVALS.map((festival, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: `${festival.name} (${festival.nameHi})`,
        url: `${APP_URL}/festival/${festival.slug}`,
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
        name: "Festivals",
        item: `${APP_URL}/festival`,
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
        <h1 className="font-serif text-4xl font-bold text-brand mb-3">Stotras by Festival</h1>
        <p className="text-text-light max-w-lg mx-auto">
          Sacred hymns and prayers for Hindu festivals and holy occasions
        </p>
        <div className="mt-4 mx-auto w-24 h-1 rounded-full bg-gradient-to-r from-brand via-gold to-saffron" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {FESTIVALS.map((festival) => {
          const count = getStotrasByFestival(festival.id).length;
          return (
            <Link
              key={festival.id}
              href={`/festival/${festival.slug}`}
              className="group bg-white rounded-xl p-6 border border-border-light hover:border-gold/30 hover:shadow-card-hover transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-3">
                <CategoryIcon type="festival" id={festival.id} size="lg" className="rounded-xl bg-saffron/10" />
                <div>
                  <h2 className="font-serif text-xl font-semibold text-brand group-hover:text-brand-light transition-colors">
                    {festival.name}
                  </h2>
                  <p className="devanagari-heading text-sm text-text-muted">{festival.nameHi}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {festival.deities.map((did) => {
                  const d = getDeityById(did);
                  return d ? (
                    <span key={did} className="text-xs px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: d.color }}>
                      {d.name}
                    </span>
                  ) : null;
                })}
              </div>
              {count > 0 && <p className="text-xs text-text-muted">{count} stotras</p>}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
