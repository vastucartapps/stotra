import type { Metadata } from "next";
import Link from "next/link";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { DAYS, getTodayDay } from "@/data/days";
import { getDeityById } from "@/data/deities";
import { getStotrasByDay } from "@/lib/stotras";
import { buildHubPageGraph, STOTRA_BASE } from "@/lib/schema";
import { siteOpenGraph, siteTwitter } from "@/lib/seo-meta";

const PAGE_TITLE = "Stotras by Day of the Week | Stotra by VastuCart";
const PAGE_DESC =
  "Find which stotras to recite each day of the week. Monday for Shiva, Tuesday for Hanuman, Wednesday for Ganesha, and more.";

export const metadata: Metadata = {
  title: "Stotras by Day of the Week",
  description: PAGE_DESC,
  alternates: { canonical: "/day" },
  openGraph: siteOpenGraph({
    path: "/day",
    title: PAGE_TITLE,
    description: PAGE_DESC,
    type: "website",
    imageAlt: "Stotras by Day of the Week - Stotra by VastuCart",
  }),
  twitter: siteTwitter({
    path: "/day",
    title: PAGE_TITLE,
    description: PAGE_DESC,
  }),
};

export default function DayListPage() {
  const todayDay = getTodayDay();

  const graph = buildHubPageGraph({
    path: "/day",
    name: "Stotras by Day of the Week",
    description:
      "Find which stotras to recite each day of the week — Monday for Shiva, Tuesday for Hanuman, Wednesday for Ganesha, and more.",
    breadcrumbName: "Days",
    items: DAYS.map((d) => ({
      name: `${d.name} (${d.nameHi})`,
      url: `${STOTRA_BASE}/day/${d.slug}`,
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
          Stotras by Day
        </h1>
        <p className="text-text-light max-w-lg mx-auto">
          Each day of the week is sacred to specific deities. Find the right stotras for today.
        </p>
        <div className="mt-4 mx-auto w-24 h-1 rounded-full bg-gradient-to-r from-brand via-gold to-saffron" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {DAYS.map((day) => {
          const isToday = day.id === todayDay.id;
          const stotras = getStotrasByDay(day.id);
          return (
            <Link
              key={day.id}
              href={`/day/${day.slug}`}
              className={`group bg-white rounded-xl p-5 border transition-all duration-300 ${
                isToday
                  ? "border-gold/50 shadow-glow-gold ring-1 ring-gold/20"
                  : "border-border-light hover:border-gold/30 hover:shadow-card-hover"
              }`}
            >
              {isToday && (
                <span className="text-xs font-semibold text-gold uppercase tracking-wider mb-2 block">
                  &#9733; Today
                </span>
              )}
              <div className="flex items-center gap-3 mb-2">
                <CategoryIcon type="day" id={day.id} size="lg" className="rounded-xl bg-brand/10" />
                <div>
                  <h2 className="font-serif text-xl font-semibold text-brand group-hover:text-brand-light transition-colors">
                    {day.name}
                  </h2>
                  <p className="devanagari-heading text-sm text-text-muted">
                    {day.nameHi}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {day.deities.map((deityId) => {
                  const deity = getDeityById(deityId);
                  return deity ? (
                    <span
                      key={deityId}
                      className="text-xs px-2 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: deity.color }}
                    >
                      {deity.name}
                    </span>
                  ) : null;
                })}
              </div>
              <p className="text-xs text-text-muted">
                {stotras.length} stotras
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
