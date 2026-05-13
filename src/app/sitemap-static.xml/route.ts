import { urlsetXml, SITEMAP_BASE, siteContentLastmod } from "@/lib/schema/sitemap-utils";

export const dynamic = "force-static";

export async function GET(): Promise<Response> {
  const lastmod = siteContentLastmod();
  const xml = urlsetXml([
    { loc: `${SITEMAP_BASE}/`, lastmod, changefreq: "daily", priority: 1.0 },
    { loc: `${SITEMAP_BASE}/stotra`, lastmod, changefreq: "weekly", priority: 0.9 },
    { loc: `${SITEMAP_BASE}/deity`, lastmod, changefreq: "weekly", priority: 0.9 },
    { loc: `${SITEMAP_BASE}/gita`, lastmod, changefreq: "weekly", priority: 0.95 },
    { loc: `${SITEMAP_BASE}/vrat-katha`, lastmod, changefreq: "weekly", priority: 0.9 },
    { loc: `${SITEMAP_BASE}/today`, lastmod, changefreq: "daily", priority: 0.9 },
    { loc: `${SITEMAP_BASE}/day`, lastmod, changefreq: "weekly", priority: 0.7 },
    { loc: `${SITEMAP_BASE}/festival`, lastmod, changefreq: "weekly", priority: 0.7 },
    { loc: `${SITEMAP_BASE}/purpose`, lastmod, changefreq: "weekly", priority: 0.7 },
    { loc: `${SITEMAP_BASE}/search`, lastmod, changefreq: "monthly", priority: 0.5 },
    { loc: `${SITEMAP_BASE}/editorial-process`, lastmod, changefreq: "yearly", priority: 0.5 },
    { loc: `${SITEMAP_BASE}/privacy-policy`, lastmod, changefreq: "yearly", priority: 0.2 },
    { loc: `${SITEMAP_BASE}/terms`, lastmod, changefreq: "yearly", priority: 0.2 },
    { loc: `${SITEMAP_BASE}/disclaimer`, lastmod, changefreq: "yearly", priority: 0.2 },
  ]);
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
