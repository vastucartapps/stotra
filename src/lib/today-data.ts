/**
 * Server-side helper: build the per-day stotra map ONCE at build time and
 * hand the whole map to client components, which then pick the current
 * IST day at runtime. This preserves SSG (all data is in the prerendered
 * HTML/JSON) while fixing the "today" UI freezing on the build day.
 */
import type { DayId, Stotra } from "@/types";
import { DAYS } from "@/data/days";
import { getAllStotras, getStotrasByDay } from "@/lib/stotras";

export interface DayMeta {
  id: DayId;
  name: string;
  nameHi: string;
}

export interface ByDayMap {
  days: DayMeta[];
  stotras: Record<DayId, Stotra[]>;
}

export function getStotrasByDayMap(): ByDayMap {
  const days: DayMeta[] = DAYS.map((d) => ({ id: d.id, name: d.name, nameHi: d.nameHi }));
  const stotras = {} as Record<DayId, Stotra[]>;
  for (const d of DAYS) {
    stotras[d.id] = getStotrasByDay(d.id);
  }
  return { days, stotras };
}

/** Compact list for the "stotra of the day" picker — only what the card renders. */
export function getStotraOfTheDayCandidates(): Stotra[] {
  return getAllStotras();
}
