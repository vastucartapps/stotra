import type { Metadata } from "next";
import Link from "next/link";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { FESTIVALS } from "@/data/festivals";
import { getDeityById } from "@/data/deities";
import { getStotrasByFestival } from "@/lib/stotras";
import { buildHubPageGraph, STOTRA_BASE } from "@/lib/schema";
import { siteOpenGraph, siteTwitter } from "@/lib/seo-meta";
import { getUpcomingFestivals } from "@/lib/festival-calendar-api";
import { formatFestivalDate } from "@/lib/festival-calendar";
import { getFestivalById } from "@/data/festivals";

// Re-check the astroengine dates hourly (also retries after a failed build-time fetch).
export const revalidate = 3600;

const PAGE_TITLE = "Festival Calendar: Stotras to Read | Stotra by VastuCart";
const PAGE_DESC =
  "Upcoming Hindu festival dates with the stotras to read on each - Navratri, Diwali, Maha Shivaratri, Janmashtami and more. Free PDF for every stotra.";

export const metadata: Metadata = {
  title: "Festival Calendar: Stotras to Read",
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

export default async function FestivalListPage() {
  const upcoming = await getUpcomingFestivals(8);
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
      {upcoming.length > 0 && (
        <section className="mb-12" aria-labelledby="upcoming-festivals">
          <h2 id="upcoming-festivals" className="font-serif text-2xl font-bold text-brand mb-1">Upcoming festivals and what to read</h2>
          <p className="text-sm text-text-muted mb-5">Dates are calculated by the VastuCart astroengine for New Delhi (IST). Observance can differ by a day in some regions.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcoming.map((u) => {
              const festival = getFestivalById(u.festivalId);
              if (!festival) return null;
              const picks = getStotrasByFestival(festival.id).slice(0, 4);
              return (
                <div key={`${u.key}-${u.date}`} className="bg-white rounded-xl p-5 border border-border-light">
                  <p className="text-xs font-semibold text-saffron mb-1">
                    {formatFestivalDate(u.date)}
                    {u.vaishnavDate ? ` (Vaishnav: ${formatFestivalDate(u.vaishnavDate)})` : ""}
                  </p>
                  <h3 className="font-serif text-lg font-semibold text-brand">
                    <Link href={`/festival/${festival.slug}`} className="hover:text-brand-light">{u.name}</Link>
                    {u.nameHi ? <span className="devanagari-heading text-sm text-text-muted"> {u.nameHi}</span> : null}
                  </h3>
                  {picks.length > 0 && (
                    <ul className="mt-2 space-y-1 text-sm">
                      {picks.map((s) => (
                        <li key={s.slug}><Link href={`/stotra/${s.slug}`} className="text-text hover:text-brand underline-offset-2 hover:underline">{s.titleEn}</Link></li>
                      ))}
                    </ul>
                  )}
                  <Link href={`/festival/${festival.slug}`} className="inline-block mt-3 text-xs text-brand hover:underline">All {festival.name} stotras</Link>
                </div>
              );
            })}
          </div>
        </section>
      )}
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
