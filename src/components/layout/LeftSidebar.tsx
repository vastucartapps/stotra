import Link from "next/link";
import { DEITIES } from "@/data/deities";
import { getTodayDay } from "@/data/days";
import { getTodaysStotras, getAllStotras } from "@/lib/stotras";

export function LeftSidebar() {
  const todayDay = getTodayDay();
  const todaysStotras = getTodaysStotras();
  const allStotras = getAllStotras();
  const recentStotras = [...allStotras]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <aside className="space-y-6">
      {/* Today's Stotras */}
      {todaysStotras.length > 0 && (
        <div className="bg-white rounded-xl border border-border-light p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-saffron" />
            <h3 className="font-serif text-sm font-semibold text-brand uppercase tracking-wider">
              {todayDay.name}&apos;s Stotras
            </h3>
          </div>
          <ul className="space-y-2">
            {todaysStotras.slice(0, 5).map((stotra) => (
              <li key={stotra.slug}>
                <Link
                  href={`/stotra/${stotra.slug}`}
                  className="block px-3 py-2 rounded-lg text-sm text-text hover:bg-cream-mid hover:text-brand transition-colors duration-150"
                >
                  <span className="devanagari-heading text-xs block leading-snug">
                    {stotra.title}
                  </span>
                  <span className="text-xs text-text-muted">{stotra.titleEn}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* By Deity */}
      <div className="bg-white rounded-xl border border-border-light p-5">
        <h3 className="font-serif text-sm font-semibold text-brand uppercase tracking-wider mb-4">
          By Deity
        </h3>
        <ul className="space-y-1">
          {DEITIES.map((deity) => (
            <li key={deity.id}>
              <Link
                href={`/deity/${deity.slug}`}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-text hover:bg-cream-mid hover:text-brand transition-colors duration-150"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: deity.color }}
                />
                <span>{deity.name}</span>
                <span className="text-xs text-text-muted ml-auto">
                  {deity.nameHi}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Recently Added */}
      {recentStotras.length > 0 && (
        <div className="bg-white rounded-xl border border-border-light p-5">
          <h3 className="font-serif text-sm font-semibold text-brand uppercase tracking-wider mb-4">
            Recently Added
          </h3>
          <ul className="space-y-2">
            {recentStotras.map((stotra) => (
              <li key={stotra.slug}>
                <Link
                  href={`/stotra/${stotra.slug}`}
                  className="block px-3 py-2 rounded-lg text-sm text-text hover:bg-cream-mid hover:text-brand transition-colors duration-150"
                >
                  {stotra.titleEn}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
