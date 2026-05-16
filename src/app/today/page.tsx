import type { Metadata } from "next";
import { DAYS } from "@/data/days";
import { getStotrasByDayMap } from "@/lib/today-data";
import { TodayDayBadge } from "@/components/today/TodayDayBadge";
import { TodaysStotrasGrid } from "@/components/today/TodaysStotrasGrid";
import { TodayDeitiesBadges } from "@/components/today/TodayDeitiesBadges";
import { buildHubPageGraph, STOTRA_BASE } from "@/lib/schema";
import { siteOpenGraph, siteTwitter } from "@/lib/seo-meta";

const PAGE_TITLE = "Today's Stotras — Daily Recommended Prayers | VastuCart";
const PAGE_DESC =
  "Discover which stotras to recite today based on the day of the week. Daily recommendations for your spiritual practice.";

export const metadata: Metadata = {
  title: "Today's Stotras - Daily Recommended Prayers",
  description: PAGE_DESC,
  alternates: { canonical: "/today" },
  openGraph: siteOpenGraph({
    path: "/today",
    title: PAGE_TITLE,
    description: PAGE_DESC,
    type: "website",
    imageAlt: "Today's Stotras - Stotra by VastuCart",
  }),
  twitter: siteTwitter({
    path: "/today",
    title: PAGE_TITLE,
    description: PAGE_DESC,
  }),
};

export default function TodayPage() {
  const byDay = getStotrasByDayMap();
  // Union of all stotras across the week, used to populate the listing schema
  // since per-day selection is now client-side.
  const allItems = DAYS.flatMap((d) => byDay.stotras[d.id]).map((s) => ({
    name: s.titleEn,
    url: `${STOTRA_BASE}/stotra/${s.slug}`,
  }));
  const graph = buildHubPageGraph({
    path: "/today",
    name: "Today's Stotras",
    description: "Stotras recommended for each day of the week (auto-selected for today in IST).",
    breadcrumbName: "Today's Stotras",
    items: allItems,
  });

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
      />

      <div className="text-center mb-12">
        <TodayDayBadge
          days={byDay.days}
          className="text-saffron text-sm font-semibold uppercase tracking-[0.15em] mb-3 block"
        />
        <h1 className="font-serif text-4xl font-bold text-brand mb-3">Today&apos;s Stotras</h1>
        <p className="text-text-light max-w-lg mx-auto mb-4">
          Recommended stotras for today, selected from the day-of-the-week recitation tradition.
        </p>
        <TodayDeitiesBadges />
      </div>

      <TodaysStotrasGrid byDay={byDay} variant="grid" />
    </div>
  );
}
