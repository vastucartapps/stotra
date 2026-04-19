import { urlsetXml, SITEMAP_BASE } from "@/lib/schema/sitemap-utils";

export const dynamic = "force-static";

export async function GET(): Promise<Response> {
  const now = new Date().toISOString();
  const xml = urlsetXml([
    { loc: `${SITEMAP_BASE}/`, lastmod: now, changefreq: "daily", priority: 1.0 },
    { loc: `${SITEMAP_BASE}/stotra`, lastmod: now, changefreq: "weekly", priority: 0.9 },
    { loc: `${SITEMAP_BASE}/deity`, lastmod: now, changefreq: "weekly", priority: 0.9 },
    { loc: `${SITEMAP_BASE}/gita`, lastmod: now, changefreq: "weekly", priority: 0.95 },
    { loc: `${SITEMAP_BASE}/vrat-katha`, lastmod: now, changefreq: "weekly", priority: 0.9 },
    { loc: `${SITEMAP_BASE}/today`, lastmod: now, changefreq: "daily", priority: 0.9 },
    { loc: `${SITEMAP_BASE}/day`, lastmod: now, changefreq: "weekly", priority: 0.7 },
    { loc: `${SITEMAP_BASE}/festival`, lastmod: now, changefreq: "weekly", priority: 0.7 },
    { loc: `${SITEMAP_BASE}/purpose`, lastmod: now, changefreq: "weekly", priority: 0.7 },
    { loc: `${SITEMAP_BASE}/search`, lastmod: now, changefreq: "monthly", priority: 0.5 },
    { loc: `${SITEMAP_BASE}/editorial-process`, lastmod: now, changefreq: "yearly", priority: 0.5 },
    { loc: `${SITEMAP_BASE}/privacy-policy`, lastmod: now, changefreq: "yearly", priority: 0.2 },
    { loc: `${SITEMAP_BASE}/terms`, lastmod: now, changefreq: "yearly", priority: 0.2 },
    { loc: `${SITEMAP_BASE}/disclaimer`, lastmod: now, changefreq: "yearly", priority: 0.2 },
  ]);
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
