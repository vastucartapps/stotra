import { urlsetXml, SITEMAP_BASE, siteContentLastmod } from "@/lib/schema/sitemap-utils";
import { DEITIES } from "@/data/deities";
import { DAYS } from "@/data/days";
import { FESTIVALS } from "@/data/festivals";
import { PURPOSES } from "@/data/purposes";

export const dynamic = "force-static";

export async function GET(): Promise<Response> {
  const lastmod = siteContentLastmod();
  const urls: Array<{ loc: string; lastmod: string; changefreq: "monthly" | "weekly"; priority: number }> = [];

  for (const d of DEITIES) {
    urls.push({ loc: `${SITEMAP_BASE}/deity/${d.slug}`, lastmod, changefreq: "monthly", priority: 0.8 });
  }
  for (const d of DAYS) {
    urls.push({ loc: `${SITEMAP_BASE}/day/${d.slug}`, lastmod, changefreq: "monthly", priority: 0.5 });
  }
  for (const f of FESTIVALS) {
    urls.push({ loc: `${SITEMAP_BASE}/festival/${f.slug}`, lastmod, changefreq: "weekly", priority: 0.6 });
  }
  for (const p of PURPOSES) {
    urls.push({ loc: `${SITEMAP_BASE}/purpose/${p.slug}`, lastmod, changefreq: "monthly", priority: 0.5 });
  }
  return new Response(urlsetXml(urls), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
