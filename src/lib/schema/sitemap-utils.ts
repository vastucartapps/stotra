/**
 * Sitemap XML helpers — shared between the sitemap index and child sitemaps.
 */
import { STOTRA_BASE } from "./ids";

export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number;
}

export function urlsetXml(urls: SitemapUrl[]): string {
  const items = urls
    .map((u) => {
      const parts: string[] = [`    <loc>${u.loc}</loc>`];
      if (u.lastmod) parts.push(`    <lastmod>${u.lastmod}</lastmod>`);
      if (u.changefreq) parts.push(`    <changefreq>${u.changefreq}</changefreq>`);
      if (u.priority !== undefined)
        parts.push(`    <priority>${u.priority.toFixed(1)}</priority>`);
      return `  <url>\n${parts.join("\n")}\n  </url>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</urlset>\n`;
}

export function sitemapIndexXml(children: { loc: string; lastmod?: string }[]): string {
  const items = children
    .map((c) => {
      const parts: string[] = [`    <loc>${c.loc}</loc>`];
      if (c.lastmod) parts.push(`    <lastmod>${c.lastmod}</lastmod>`);
      return `  <sitemap>\n${parts.join("\n")}\n  </sitemap>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</sitemapindex>\n`;
}

export const SITEMAP_BASE = STOTRA_BASE;

/**
 * Stable lastmod for hub/static/Gita sitemaps. Derived from the most recent
 * stotra `updatedAt` so a no-content redeploy doesn't churn the timestamp.
 * Cached after first call so all sitemaps emit identical lastmods within a build.
 */
let _siteContentLastmod: string | null = null;
export function siteContentLastmod(): string {
  if (_siteContentLastmod) return _siteContentLastmod;
  // Lazy require to avoid circular dependency with @/lib/stotras (which imports schema).
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { getAllStotras } = require("@/lib/stotras") as typeof import("@/lib/stotras");
  const stotras = getAllStotras();
  let max = 0;
  for (const s of stotras) {
    const t = Date.parse(s.updatedAt);
    if (!Number.isNaN(t) && t > max) max = t;
  }
  // Floor to the day so multiple deploys on the same day produce identical lastmod.
  const d = new Date(max || Date.now());
  d.setUTCHours(0, 0, 0, 0);
  _siteContentLastmod = d.toISOString();
  return _siteContentLastmod;
}
