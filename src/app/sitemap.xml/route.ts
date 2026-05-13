import { sitemapIndexXml, SITEMAP_BASE, siteContentLastmod } from "@/lib/schema/sitemap-utils";

export const dynamic = "force-static";

export async function GET(): Promise<Response> {
  const lastmod = siteContentLastmod();
  const xml = sitemapIndexXml([
    { loc: `${SITEMAP_BASE}/sitemap-static.xml`, lastmod },
    { loc: `${SITEMAP_BASE}/sitemap-stotras.xml`, lastmod },
    { loc: `${SITEMAP_BASE}/sitemap-gita.xml`, lastmod },
    { loc: `${SITEMAP_BASE}/sitemap-taxonomies.xml`, lastmod },
  ]);
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
