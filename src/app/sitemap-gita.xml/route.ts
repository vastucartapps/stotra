import { urlsetXml, SITEMAP_BASE } from "@/lib/schema/sitemap-utils";
import { getAllGitaChapters } from "@/lib/gita";

export const dynamic = "force-static";

export async function GET(): Promise<Response> {
  const now = new Date().toISOString();
  const urls: Array<{ loc: string; lastmod: string; changefreq: "monthly"; priority: number }> = [];
  const chapters = getAllGitaChapters();
  for (const ch of chapters) {
    urls.push({
      loc: `${SITEMAP_BASE}/gita/${ch.slug}`,
      lastmod: now,
      changefreq: "monthly",
      priority: 0.8,
    });
    for (const v of ch.verses) {
      urls.push({
        loc: `${SITEMAP_BASE}/gita/${ch.slug}/${v.slug}`,
        lastmod: now,
        changefreq: "monthly",
        priority: 0.7,
      });
    }
  }
  return new Response(urlsetXml(urls), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
