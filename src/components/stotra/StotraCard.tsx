import Link from "next/link";
import { Clock, BookOpen } from "lucide-react";
import type { Stotra } from "@/types";
import { getDeityById } from "@/data/deities";

export function StotraCard({ stotra }: { stotra: Stotra }) {
  const deity = getDeityById(stotra.deity);

  return (
    <Link
      href={`/stotra/${stotra.slug}`}
      className="group bg-white rounded-xl p-6 border border-border-light hover:border-gold/30 hover:shadow-card-hover transition-all duration-300"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <h3 className="devanagari-heading text-lg text-brand group-hover:text-brand-light transition-colors leading-snug">
            {stotra.title}
          </h3>
          <p className="text-sm text-text-light mt-0.5">{stotra.titleEn}</p>
        </div>
        {deity && (
          <span
            className="flex-shrink-0 text-xs font-medium px-2.5 py-1 rounded-full text-white"
            style={{ backgroundColor: deity.color }}
          >
            {deity.name}
          </span>
        )}
      </div>
      <p className="text-sm text-text-muted line-clamp-2 mb-4">
        {stotra.seoDescription}
      </p>
      <div className="flex items-center gap-4 text-xs text-text-muted">
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          {stotra.readingTimeMinutes} min
        </span>
        <span className="flex items-center gap-1">
          <BookOpen className="w-3.5 h-3.5" />
          {stotra.verseCount} verses
        </span>
      </div>
    </Link>
  );
}
