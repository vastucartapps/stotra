"use client";

import { useEffect, useState } from "react";
import type { DayId } from "@/types";
import { DAYS } from "@/data/days";
import { DEITIES } from "@/data/deities";
import { getCurrentISTDayId } from "@/lib/today-client";

/** Renders the deity pill chips for the current IST day. */
export function TodayDeitiesBadges() {
  const [dayId, setDayId] = useState<DayId | null>(null);
  useEffect(() => {
    setDayId(getCurrentISTDayId());
  }, []);

  if (!dayId) return <div className="h-7" aria-hidden suppressHydrationWarning />;

  const day = DAYS.find((d) => d.id === dayId);
  if (!day) return null;
  const deities = day.deities.map((id) => DEITIES.find((d) => d.id === id)).filter(Boolean);

  return (
    <div className="flex justify-center flex-wrap gap-2" suppressHydrationWarning>
      {deities.map(
        (deity) =>
          deity && (
            <span
              key={deity.id}
              className="text-xs font-medium px-3 py-1 rounded-full text-white"
              style={{ backgroundColor: deity.color }}
            >
              {deity.name} ({deity.nameHi})
            </span>
          )
      )}
    </div>
  );
}
