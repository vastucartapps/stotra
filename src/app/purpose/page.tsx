import type { Metadata } from "next";
import Link from "next/link";
import { PURPOSES } from "@/data/purposes";
import { getStotrasByPurpose } from "@/lib/stotras";
import { CategoryIcon } from "@/components/ui/CategoryIcon";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://stotra.vastucart.in";

export const metadata: Metadata = {
  title: "Stotras by Purpose",
  description: "Find stotras for protection, wealth, health, peace, knowledge, spiritual growth, and more.",
  alternates: {
    canonical: "/purpose",
  },
  openGraph: {
    title: "Stotras by Purpose | Stotra by VastuCart",
    description: "Find stotras for protection, wealth, health, peace, knowledge, spiritual growth, and more.",
    url: `${APP_URL}/purpose`,
    type: "website",
    images: [
      {
        url: `${APP_URL}/og-default.jpg`,
        width: 1200,
        height: 630,
        alt: "Stotras by Purpose - Stotra by VastuCart",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stotras by Purpose | Stotra by VastuCart",
    description: "Find stotras for protection, wealth, health, peace, knowledge, spiritual growth, and more.",
    images: [`${APP_URL}/og-default.jpg`],
  },
};

export default function PurposeListPage() {
  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Stotras by Purpose",
    description: "Find stotras that serve your spiritual needs, organized by purpose.",
    url: `${APP_URL}/purpose`,
    isPartOf: { "@id": `${APP_URL}/#website` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: PURPOSES.length,
      itemListElement: PURPOSES.map((purpose, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: `${purpose.name} (${purpose.nameHi})`,
        url: `${APP_URL}/purpose/${purpose.slug}`,
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
        name: "Purpose",
        item: `${APP_URL}/purpose`,
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
        <h1 className="font-serif text-4xl font-bold text-brand mb-3">Stotras by Purpose</h1>
        <p className="text-text-light max-w-lg mx-auto">Find stotras that serve your spiritual needs</p>
        <div className="mt-4 mx-auto w-24 h-1 rounded-full bg-gradient-to-r from-brand via-gold to-saffron" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PURPOSES.map((purpose) => {
          const count = getStotrasByPurpose(purpose.id).length;
          return (
            <Link key={purpose.id} href={`/purpose/${purpose.slug}`}
              className="group bg-white rounded-xl p-6 border border-border-light hover:border-gold/30 hover:shadow-card-hover transition-all duration-300">
              <div className="flex items-center gap-3 mb-2">
                <CategoryIcon type="purpose" id={purpose.id} size="lg" className="rounded-xl bg-brand/10" />
                <div>
                  <h2 className="font-serif text-xl font-semibold text-brand group-hover:text-brand-light transition-colors">{purpose.name}</h2>
                  <p className="devanagari-heading text-sm text-text-muted">{purpose.nameHi}</p>
                </div>
              </div>
              {count > 0 && <p className="text-xs text-text-muted">{count} stotras</p>}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
