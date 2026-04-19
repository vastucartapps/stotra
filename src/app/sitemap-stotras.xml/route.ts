import { urlsetXml, SITEMAP_BASE } from "@/lib/schema/sitemap-utils";
import { getAllStotras } from "@/lib/stotras";
import type { Stotra } from "@/types";

export const dynamic = "force-static";

const POPULAR_BOOST = new Set([
  "hanuman-chalisa", "vishnu-sahasranama", "ganesh-atharvashirsha",
  "shiv-tandav-stotram", "lalita-sahasranama", "aditya-hridayam",
  "ramraksha-stotra", "durga-kavach", "hanuman-bahuk", "bajrang-baan",
  "sundarkand-hanuman-stuti", "gayatri-mantra", "satyanarayan-katha",
  "krishna-chalisa", "shiv-chalisa", "durga-chalisa", "hanuman-ashtak",
  "ganesh-chalisa", "lakshmi-chalisa",
]);

function topSlugs(stotras: Stotra[]): Set<string> {
  const scored = stotras.map((s) => {
    let score = 1;
    score += s.secondaryDeities?.length || 0;
    score += s.days.length;
    score += s.festivals.length;
    score += s.purposes.length;
    if (POPULAR_BOOST.has(s.slug)) score += 10;
    return [s.slug, score] as const;
  });
  scored.sort((a, b) => b[1] - a[1]);
  return new Set(scored.slice(0, 50).map(([slug]) => slug));
}

export async function GET(): Promise<Response> {
  const stotras = getAllStotras();
  const tops = topSlugs(stotras);
  const urls = stotras.map((s) => ({
    loc: `${SITEMAP_BASE}/stotra/${s.slug}`,
    lastmod: new Date(s.updatedAt).toISOString(),
    changefreq: "monthly" as const,
    priority: tops.has(s.slug) ? 0.9 : 0.7,
  }));
  return new Response(urlsetXml(urls), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
