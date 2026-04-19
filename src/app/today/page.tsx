import type { Metadata } from "next";
import { getTodayDay } from "@/data/days";
import { getDeityById } from "@/data/deities";
import { getTodaysStotras } from "@/lib/stotras";
import { StotraCard } from "@/components/stotra/StotraCard";
import { buildHubPageGraph, STOTRA_BASE } from "@/lib/schema";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://stotra.vastucart.in";

export const metadata: Metadata = {
  title: "Today's Stotras - Daily Recommended Prayers",
  description: "Discover which stotras to recite today based on the day of the week. Daily recommendations for your spiritual practice.",
  alternates: {
    canonical: "/today",
  },
  openGraph: {
    title: "Today's Stotras - Daily Recommended Prayers | Stotra by VastuCart",
    description: "Discover which stotras to recite today based on the day of the week. Daily recommendations for your spiritual practice.",
    url: `${APP_URL}/today`,
    type: "website",
    images: [
      {
        url: `${APP_URL}/og-default.jpg`,
        width: 1200,
        height: 630,
        alt: "Today's Stotras - Stotra by VastuCart",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Today's Stotras - Daily Recommended Prayers | Stotra by VastuCart",
    description: "Discover which stotras to recite today based on the day of the week. Daily recommendations for your spiritual practice.",
    images: [`${APP_URL}/og-default.jpg`],
  },
};

export const revalidate = 3600;

export default function TodayPage() {
  const day = getTodayDay();
  const stotras = getTodaysStotras();
  const deities = day.deities.map((id) => getDeityById(id)).filter(Boolean);

  const graph = buildHubPageGraph({
    path: "/today",
    name: `Today's Stotras — ${day.name}`,
    description: `Stotras recommended for today (${day.name} / ${day.nameHi}).`,
    breadcrumbName: "Today's Stotras",
    items: stotras.map((s) => ({
      name: s.titleEn,
      url: `${STOTRA_BASE}/stotra/${s.slug}`,
    })),
  });

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
      />

      <div className="text-center mb-12">
        <p className="text-saffron text-sm font-semibold uppercase tracking-[0.15em] mb-3">
          {day.nameHi} &middot; {day.name}
        </p>
        <h1 className="font-serif text-4xl font-bold text-brand mb-3">Today&apos;s Stotras</h1>
        <p className="text-text-light max-w-lg mx-auto mb-4">
          Recommended stotras for {day.name} ({day.nameHi})
        </p>
        <div className="flex justify-center flex-wrap gap-2">
          {deities.map((deity) => deity && (
            <span key={deity.id} className="text-xs font-medium px-3 py-1 rounded-full text-white" style={{ backgroundColor: deity.color }}>
              {deity.name} ({deity.nameHi})
            </span>
          ))}
        </div>
      </div>

      {stotras.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {stotras.map((s) => <StotraCard key={s.slug} stotra={s} />)}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-border-light">
          <p className="text-text-muted">No stotras available for today yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
