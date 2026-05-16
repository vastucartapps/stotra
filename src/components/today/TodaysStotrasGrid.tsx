"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { DayId } from "@/types";
import { getCurrentISTDayId } from "@/lib/today-client";
import { StotraCard } from "@/components/stotra/StotraCard";
import type { ByDayMap } from "@/lib/today-data";

interface Props {
  byDay: ByDayMap;
  /** Cap of cards rendered. */
  limit?: number;
  /** Render shape — defaults to a 3-col grid of StotraCards. */
  variant?: "grid" | "sidebar-list" | "homepage-card";
}

export function TodaysStotrasGrid({ byDay, limit, variant = "grid" }: Props) {
  const [dayId, setDayId] = useState<DayId | null>(null);
  useEffect(() => {
    setDayId(getCurrentISTDayId());
  }, []);

  const stotras = useMemo(() => {
    if (!dayId) return [];
    const all = byDay.stotras[dayId] || [];
    return limit ? all.slice(0, limit) : all;
  }, [byDay, dayId, limit]);

  if (!dayId) {
    return (
      <div className="text-center py-8 text-text-muted text-sm" suppressHydrationWarning>
        &nbsp;
      </div>
    );
  }

  if (stotras.length === 0) {
    return (
      <div className="text-center py-8 bg-white rounded-xl border border-border-light">
        <p className="text-text-muted text-sm">No stotras for today yet.</p>
      </div>
    );
  }

  if (variant === "homepage-card") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" suppressHydrationWarning>
        {stotras.map((stotra) => (
          <Link
            key={stotra.slug}
            href={`/stotra/${stotra.slug}`}
            className="group block bg-white rounded-xl p-6 border border-border-light hover:border-gold/30 hover:shadow-card-hover transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="devanagari-heading text-lg text-brand group-hover:text-brand-light transition-colors">
                  {stotra.title}
                </h3>
                <p className="text-sm text-text-light mt-0.5">{stotra.titleEn}</p>
              </div>
              <span className="text-xs bg-cream-mid text-text-muted px-2 py-1 rounded-full whitespace-nowrap">
                {stotra.readingTimeMinutes} min
              </span>
            </div>
            <p className="text-sm text-text-muted line-clamp-2">{stotra.seoDescription}</p>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs bg-brand/10 text-brand px-2 py-0.5 rounded-full capitalize">
                  {stotra.deity}
                </span>
                <span className="text-xs text-text-muted">{stotra.verseCount} verses</span>
              </div>
              <span className="text-xs font-medium text-saffron group-hover:text-orange transition-colors">
                Read &rarr;
              </span>
            </div>
          </Link>
        ))}
      </div>
    );
  }

  if (variant === "sidebar-list") {
    return (
      <ul className="space-y-2" suppressHydrationWarning>
        {stotras.map((stotra) => (
          <li key={stotra.slug}>
            <Link
              href={`/stotra/${stotra.slug}`}
              className="block px-3 py-2 rounded-lg text-sm text-text hover:bg-cream-mid hover:text-brand transition-colors duration-150"
            >
              <span className="devanagari-heading text-xs block leading-snug">{stotra.title}</span>
              <span className="text-xs text-text-muted">{stotra.titleEn}</span>
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" suppressHydrationWarning>
      {stotras.map((s) => (
        <StotraCard key={s.slug} stotra={s} />
      ))}
    </div>
  );
}
