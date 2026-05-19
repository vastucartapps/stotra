/**
 * Server-side helper: build the per-day stotra map ONCE at build time and
 * hand the whole map to client components, which then pick the current
 * IST day at runtime. This preserves SSG (all data is in the prerendered
 * HTML/JSON) while fixing the "today" UI freezing on the build day.
 *
 * The map is intentionally typed as StotraCardSummary[] (not Stotra[]):
 * passing full Stotra objects to a "use client" component forces Next.js
 * to serialize the entire object graph (devanagariText, transliteration,
 * hindiMeaning, padaartha) into the RSC stream on every page that mounts
 * the consumer (LeftSidebar mounts on EVERY page). That bloats the HTML
 * to multi-MB and trips Googlebot's render-budget rejection.
 */
import type { DayId, StotraCardSummary, StotraOfTheDayCard } from "@/types";
import { DAYS } from "@/data/days";
import {
  getAllStotras,
  getStotrasByDay,
  toStotraCard,
  toStotraOfTheDayCard,
} from "@/lib/stotras";
import { dailySeed, seededRandom } from "@/lib/utils";

export interface DayMeta {
  id: DayId;
  name: string;
  nameHi: string;
}

export interface ByDayMap {
  days: DayMeta[];
  stotras: Record<DayId, StotraCardSummary[]>;
}

export function getStotrasByDayMap(): ByDayMap {
  const days: DayMeta[] = DAYS.map((d) => ({ id: d.id, name: d.name, nameHi: d.nameHi }));
  const stotras = {} as Record<DayId, StotraCardSummary[]>;
  for (const d of DAYS) {
    stotras[d.id] = getStotrasByDay(d.id).map(toStotraCard);
  }
  return { days, stotras };
}

/**
 * Sidebar variant of the by-day map: caps each day at `perDayLimit` cards.
 * The full map carries ~1,300 cards (130/day × 7 days × duplication across
 * deities) and ships in the RSC stream on EVERY page via LeftSidebar — even
 * though the sidebar only renders 5 cards. Trim server-side so we ship
 * `perDayLimit × 7` cards instead of all 1,300.
 */
export function getSidebarStotrasByDayMap(perDayLimit = 5): ByDayMap {
  const days: DayMeta[] = DAYS.map((d) => ({ id: d.id, name: d.name, nameHi: d.nameHi }));
  const stotras = {} as Record<DayId, StotraCardSummary[]>;
  for (const d of DAYS) {
    stotras[d.id] = getStotrasByDay(d.id).slice(0, perDayLimit).map(toStotraCard);
  }
  return { days, stotras };
}

/**
 * Pre-computed "Stotra of the Day" calendar covering the next N days.
 *
 * Why: the previous design shipped all 930 stotra candidates into the RSC
 * stream so a "use client" component could pick today's pick at runtime.
 * That bloated the homepage HTML to 1.6MB. Instead we pre-resolve the
 * seed → slug → card mapping for the next 90 days at build time and ship
 * only those 90 cards (≈45KB). The client still picks via IST date but
 * just looks up the prebuilt card.
 *
 * If a visitor lands more than `daysAhead` days after the last build, the
 * calendar serves `fallback` (today's pick at build time) — a recovery
 * path that beats hard-failing the hero. Re-build at least quarterly to
 * keep the rotation fresh.
 */
export interface SOTDCalendar {
  byDate: Record<number, StotraOfTheDayCard>;
  fallback: StotraOfTheDayCard;
}

export function getSOTDCalendar(daysAhead = 90): SOTDCalendar {
  const all = getAllStotras();
  if (all.length === 0) {
    throw new Error("getSOTDCalendar: no stotras available");
  }
  const byDate: Record<number, StotraOfTheDayCard> = {};
  const now = new Date();
  for (let i = -1; i <= daysAhead; i++) {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() + i);
    const seed = dailySeed(d);
    if (byDate[seed] !== undefined) continue;
    const idx = Math.floor(seededRandom(seed) * all.length);
    byDate[seed] = toStotraOfTheDayCard(all[idx]);
  }
  const todaySeed = dailySeed(now);
  const fallback = byDate[todaySeed] ?? toStotraOfTheDayCard(all[0]);
  return { byDate, fallback };
}

