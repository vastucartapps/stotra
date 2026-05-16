"use client";

import { useEffect, useState } from "react";
import type { DayId } from "@/types";
import { getCurrentISTDayId } from "@/lib/today-client";
import type { DayMeta } from "@/lib/today-data";

interface Props {
  days: DayMeta[];
  className?: string;
  /**
   * Render shape:
   *   "hindi-dot-name" (default) → "रविवार · Sunday"
   *   "name-possessive"          → "Sunday's"
   *   "name-only"                → "Sunday"
   */
  variant?: "hindi-dot-name" | "name-possessive" | "name-only";
}

/**
 * Renders the current IST day's name strip. Resolves on mount, so SSG/prerender
 * cannot freeze the wrong day. SSR fallback: a width-stable placeholder so the
 * layout doesn't shift on hydration. Function props are intentionally avoided
 * because Next.js forbids passing them across the server → client boundary.
 */
export function TodayDayBadge({ days, className, variant = "hindi-dot-name" }: Props) {
  const [dayId, setDayId] = useState<DayId | null>(null);
  useEffect(() => {
    setDayId(getCurrentISTDayId());
  }, []);

  const meta = dayId ? days.find((d) => d.id === dayId) : null;
  if (!meta) {
    return <span className={className} aria-hidden suppressHydrationWarning>&nbsp;</span>;
  }
  let body: React.ReactNode;
  if (variant === "name-possessive") body = <>{meta.name}&apos;s</>;
  else if (variant === "name-only") body = meta.name;
  else body = <>{meta.nameHi} &middot; {meta.name}</>;
  return (
    <span className={className} suppressHydrationWarning>
      {body}
    </span>
  );
}
