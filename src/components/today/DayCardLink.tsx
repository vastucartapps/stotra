"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import type { DayId } from "@/types";
import { getCurrentISTDayId } from "@/lib/today-client";

interface Props {
  dayId: DayId;
  href: string;
  children: ReactNode;
}

/**
 * Wraps each day card so that "is this today" gets resolved in the browser at
 * mount time, not at build time. Adds the gold ring + "★ Today" pill only to
 * the card whose dayId matches the current IST weekday.
 */
export function DayCardLink({ dayId, href, children }: Props) {
  const [isToday, setIsToday] = useState(false);
  useEffect(() => {
    setIsToday(getCurrentISTDayId() === dayId);
  }, [dayId]);

  return (
    <Link
      href={href}
      className={`group bg-white rounded-xl p-5 border transition-all duration-300 block ${
        isToday
          ? "border-gold/50 shadow-glow-gold ring-1 ring-gold/20"
          : "border-border-light hover:border-gold/30 hover:shadow-card-hover"
      }`}
      suppressHydrationWarning
    >
      {isToday && (
        <span className="text-xs font-semibold text-gold uppercase tracking-wider mb-2 block">
          &#9733; Today
        </span>
      )}
      {children}
    </Link>
  );
}
