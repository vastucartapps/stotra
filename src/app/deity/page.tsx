import type { Metadata } from "next";
import Link from "next/link";
import { DEITIES } from "@/data/deities";
import { getStotraCountByDeity } from "@/lib/stotras";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { buildHubPageGraph, STOTRA_BASE } from "@/lib/schema";

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
  const graph = buildHubPageGraph({
    path: "/deity",
    name: "Stotras by Deity",
    description:
      "Browse Hindu stotras organized by deity — Ganesha, Shiva, Vishnu, Hanuman, Lakshmi, Durga, Krishna, Rama, and more.",
    breadcrumbName: "Deities",
    items: DEITIES.map((d) => ({
      name: d.name,
      url: `${STOTRA_BASE}/deity/${d.slug}`,
    })),
  });

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
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
                <CategoryIcon type="deity" id={deity.id} color={deity.color} size="lg" />
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
