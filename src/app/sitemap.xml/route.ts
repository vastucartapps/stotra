import { sitemapIndexXml, SITEMAP_BASE } from "@/lib/schema/sitemap-utils";

export const dynamic = "force-static";

export async function GET(): Promise<Response> {
  const now = new Date().toISOString();
  const xml = sitemapIndexXml([
    { loc: `${SITEMAP_BASE}/sitemap-static.xml`, lastmod: now },
    { loc: `${SITEMAP_BASE}/sitemap-stotras.xml`, lastmod: now },
    { loc: `${SITEMAP_BASE}/sitemap-gita.xml`, lastmod: now },
    { loc: `${SITEMAP_BASE}/sitemap-taxonomies.xml`, lastmod: now },
  ]);
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
