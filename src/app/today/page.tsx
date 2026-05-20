import type { Metadata } from "next";
import { DAYS } from "@/data/days";
import { getStotrasByDay } from "@/lib/stotras";
import { getSidebarStotrasByDayMap } from "@/lib/today-data";
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
  // Page-grid cap: 30 cards/day × 7 = 210 cards in RSC stream instead of
  // ~1,300 (the full map carries duplicates across days for stotras
  // recited on multiple weekdays). Was 60/day = 1.9MB total, now ~600KB.
  // 30 cards covers what most visitors scroll past in one session;
  // the full union still seeds the ItemList schema below.
  const byDay = getSidebarStotrasByDayMap(30);

  // Full per-day union (no cap) — server-rendered into JSON-LD only.
  // Goes into the prerendered HTML once, not the client component prop tree.
  const allItems = DAYS.flatMap((d) =>
    getStotrasByDay(d.id).map((s) => ({
      name: s.titleEn,
      url: `${STOTRA_BASE}/stotra/${s.slug}`,
      description: s.seoDescription,
      deity: s.deity,
      verseCount: s.verseCount,
    }))
  );
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
