"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Stotra } from "@/types";
import { DEITIES } from "@/data/deities";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { currentISTDailySeed, seededRandom } from "@/lib/today-client";

interface Props {
  stotras: Stotra[];
}

/**
 * Picks the daily rotating "Stotra of the Day" at runtime in the browser so
 * SSG cannot freeze the selection to the build day. Uses the same
 * `seed = YYYYMMDD-in-IST` algorithm as the server `dailySeed()` so the choice
 * is stable for everyone within the same IST day.
 */
export function StotraOfTheDay({ stotras }: Props) {
  const [seed, setSeed] = useState<number | null>(null);
  useEffect(() => {
    setSeed(currentISTDailySeed());
  }, []);

  const sotd = useMemo<Stotra | null>(() => {
    if (seed == null || stotras.length === 0) return null;
    const idx = Math.floor(seededRandom(seed) * stotras.length);
    return stotras[idx] ?? null;
  }, [seed, stotras]);

  if (!sotd) {
    return <div className="bg-brand" style={{ minHeight: 520 }} aria-hidden suppressHydrationWarning />;
  }

  const sotdDeity = DEITIES.find((d) => d.id === sotd.deity);
  const firstVerses = sotd.devanagariText
    .split("\n")
    .filter((l) => l.trim().length > 0)
    .slice(0, 3)
    .join("\n");

  return (
    <section className="relative overflow-hidden bg-brand" suppressHydrationWarning>
      <div className="absolute inset-0 opacity-[0.08]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30Z' fill='none' stroke='%23DAA520' stroke-width='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-16 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 lg:gap-16 items-start">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-[2px] bg-saffron" />
              <span className="text-saffron text-xs font-bold uppercase tracking-[0.2em]">
                Stotra of the Day
              </span>
            </div>

            <h3 className="font-serif text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-white leading-[1.15] mb-2">
              {sotd.titleEn}
            </h3>
            <p className="devanagari-heading text-2xl md:text-3xl mb-8" style={{ color: "#FF9933" }}>
              {sotd.title}
            </p>

            <p className="text-white/70 text-base md:text-lg leading-relaxed mb-8 max-w-xl">
              {sotd.seoDescription}
            </p>

            {sotd.benefits.length > 0 && (
              <ul className="space-y-3 mb-10">
                {sotd.benefits.slice(0, 3).map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1.5 w-2 h-2 rounded-full bg-saffron flex-shrink-0" />
                    <span className="text-white/80 text-sm md:text-[15px]">{benefit}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="flex flex-col sm:flex-row items-start gap-3">
              <Link
                href={`/stotra/${sotd.slug}`}
                className="group inline-flex items-center gap-2 bg-gradient-to-r from-saffron to-orange text-white font-semibold px-7 py-3.5 rounded-xl hover:shadow-glow-gold transition-all duration-300 text-sm"
              >
                Read Full Stotra
                <span className="group-hover:translate-x-1 transition-transform duration-200">&rarr;</span>
              </Link>
              <Link
                href={`/deity/${sotdDeity?.slug || sotd.deity}`}
                className="inline-flex items-center gap-2 bg-transparent border border-white/25 text-white/80 hover:text-white hover:border-white/50 font-medium px-7 py-3.5 rounded-xl transition-all duration-200 text-sm"
              >
                More {sotdDeity?.name} Stotras
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white/[0.07] backdrop-blur-sm rounded-2xl border border-white/[0.1] p-6">
              <div className="flex items-center gap-4 mb-4">
                {sotdDeity && (
                  <CategoryIcon
                    type="deity"
                    id={sotdDeity.id}
                    color="transparent"
                    size="lg"
                    className="!rounded-xl bg-white/10"
                  />
                )}
                <div>
                  <p className="text-white font-serif text-2xl font-bold">{sotdDeity?.name}</p>
                  <p className="text-white/50 text-sm">{sotdDeity?.nameHi}</p>
                </div>
              </div>
              <p className="text-white/60 text-sm leading-relaxed line-clamp-2">
                {sotdDeity?.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-saffron/20 backdrop-blur-sm rounded-2xl border border-saffron/20 p-5">
                <p className="text-saffron text-3xl font-bold font-serif">{sotd.verseCount}</p>
                <p className="text-white/60 text-xs mt-1">Sacred verses</p>
              </div>
              <div className="bg-white/[0.07] backdrop-blur-sm rounded-2xl border border-white/[0.1] p-5">
                <p className="text-white text-3xl font-bold font-serif">
                  {sotd.readingTimeMinutes}
                  <span className="text-lg">m</span>
                </p>
                <p className="text-white/60 text-xs mt-1">Reading time</p>
              </div>
            </div>

            <div className="bg-white/[0.05] backdrop-blur-sm rounded-2xl border border-white/[0.08] p-6">
              <p className="devanagari text-saffron/80 text-base leading-[2] italic line-clamp-4">
                &ldquo;{firstVerses}&rdquo;
              </p>
              <p className="text-saffron text-xs font-medium mt-3">&mdash; {sotd.source}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
