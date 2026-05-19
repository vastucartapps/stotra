import Link from "next/link";
import { DEITIES } from "@/data/deities";
import { getAllStotras, toStotraCard } from "@/lib/stotras";
import { getSidebarStotrasByDayMap } from "@/lib/today-data";
import { TodayDayBadge } from "@/components/today/TodayDayBadge";
import { TodaysStotrasGrid } from "@/components/today/TodaysStotrasGrid";

export function LeftSidebar() {
  // Trimmed map (5 cards/day × 7 = 35) — the full map (~1,300 cards) would
  // serialize into the RSC stream on EVERY page that mounts this sidebar.
  const byDay = getSidebarStotrasByDayMap(5);
  const recentStotras = [...getAllStotras()]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
    .map(toStotraCard);

  return (
    <aside className="space-y-6">
      {/* Today's Stotras — client-resolved IST day (avoids SSG freeze) */}
      <div className="bg-white rounded-xl border border-border-light p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-saffron" />
          <h3 className="font-serif text-sm font-semibold text-brand uppercase tracking-wider">
            <TodayDayBadge days={byDay.days} variant="name-possessive" /> Stotras
          </h3>
        </div>
        <TodaysStotrasGrid byDay={byDay} variant="sidebar-list" limit={5} />
      </div>

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
