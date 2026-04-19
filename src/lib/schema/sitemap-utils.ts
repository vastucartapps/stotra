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
