import type { Metadata } from "next";
import Link from "next/link";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { FESTIVALS } from "@/data/festivals";
import { getDeityById } from "@/data/deities";
import { getStotrasByFestival } from "@/lib/stotras";
import { buildHubPageGraph, STOTRA_BASE } from "@/lib/schema";
import { siteOpenGraph, siteTwitter } from "@/lib/seo-meta";

const PAGE_TITLE = "Stotras by Festival | Stotra by VastuCart";
const PAGE_DESC =
  "Find the right stotras for Hindu festivals - Navratri, Diwali, Maha Shivaratri, Ganesh Chaturthi, Janmashtami, and more.";

export const metadata: Metadata = {
  title: "Stotras by Festival",
  description: PAGE_DESC,
  alternates: { canonical: "/festival" },
  openGraph: siteOpenGraph({
    path: "/festival",
    title: PAGE_TITLE,
    description: PAGE_DESC,
    type: "website",
    imageAlt: "Stotras by Festival - Stotra by VastuCart",
  }),
  twitter: siteTwitter({
    path: "/festival",
    title: PAGE_TITLE,
    description: PAGE_DESC,
  }),
};

export default function FestivalListPage() {
  const graph = buildHubPageGraph({
    path: "/festival",
    name: "Stotras by Festival",
    description:
      "Sacred hymns and prayers for Hindu festivals — Navratri, Diwali, Maha Shivaratri, Ganesh Chaturthi, Janmashtami, and more.",
    breadcrumbName: "Festivals",
    items: FESTIVALS.map((f) => ({
      name: `${f.name} (${f.nameHi})`,
      url: `${STOTRA_BASE}/festival/${f.slug}`,
    })),
  });

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
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
