import type { MetadataRoute } from "next";
import { getAllStotras } from "@/lib/stotras";
import { getAllGitaChapters } from "@/lib/gita";
import { DEITIES } from "@/data/deities";
import { DAYS } from "@/data/days";
import { FESTIVALS } from "@/data/festivals";
import { PURPOSES } from "@/data/purposes";
import type { Stotra } from "@/types";

const BASE_URL = "https://stotra.vastucart.in";

/**
 * Top stotras by blended score: internal link frequency + known search volume.
 * These get priority 0.9; all others get 0.7.
 * Computed from: category associations (deity, days, festivals, purposes, secondaryDeities)
 * + manual boost for universally high-traffic stotras.
 */
function getTopStotraSlugs(stotras: Stotra[]): Set<string> {
  const scores = new Map<string, number>();

  // Known high-search-volume stotras get a boost
  const popularBoost = new Set([
    "hanuman-chalisa", "vishnu-sahasranama", "ganesh-atharvashirsha",
    "shiv-tandav-stotram", "lalita-sahasranama", "aditya-hridayam",
    "ramraksha-stotra", "durga-kavach", "hanuman-bahuk", "bajrang-baan",
    "sundarkand-hanuman-stuti", "gayatri-mantra", "satyanarayan-katha",
    "krishna-chalisa", "shiv-chalisa", "durga-chalisa", "hanuman-ashtak",
    "ganesh-chalisa", "lakshmi-chalisa",
  ]);

  for (const s of stotras) {
    let score = 1;
    score += (s.secondaryDeities?.length || 0);
    score += s.days.length;
    score += s.festivals.length;
    score += s.purposes.length;
    if (popularBoost.has(s.slug)) score += 10;
    scores.set(s.slug, score);
  }

  const sorted = [...scores.entries()].sort((a, b) => b[1] - a[1]);
  return new Set(sorted.slice(0, 50).map(([slug]) => slug));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const stotras = getAllStotras();
  const topSlugs = getTopStotraSlugs(stotras);

  // ── Static pages ──
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/stotra`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/deity`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/gita`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.95 },
    { url: `${BASE_URL}/vrat-katha`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/today`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/day`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/festival`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/purpose`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/search`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/editorial-process`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
    { url: `${BASE_URL}/privacy-policy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE_URL}/disclaimer`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
  ];

  // ── Stotra pages: top 50 = 0.9, rest = 0.7 ──
  const stotraPages: MetadataRoute.Sitemap = stotras.map((s) => ({
    url: `${BASE_URL}/stotra/${s.slug}`,
    lastModified: new Date(s.updatedAt),
    changeFrequency: "monthly" as const,
    priority: topSlugs.has(s.slug) ? 0.9 : 0.7,
  }));

  // ── Deity pages: 0.8 ──
  const deityPages: MetadataRoute.Sitemap = DEITIES.map((d) => ({
    url: `${BASE_URL}/deity/${d.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // ── Day pages: 0.5 ──
  const dayPages: MetadataRoute.Sitemap = DAYS.map((d) => ({
    url: `${BASE_URL}/day/${d.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  // ── Festival pages: weekly, 0.6 ──
  const festivalPages: MetadataRoute.Sitemap = FESTIVALS.map((f) => ({
    url: `${BASE_URL}/festival/${f.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // ── Purpose pages: 0.5 ──
  const purposePages: MetadataRoute.Sitemap = PURPOSES.map((p) => ({
    url: `${BASE_URL}/purpose/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  // ── Gita chapter + verse pages ──
  const gitaChapters = getAllGitaChapters();
  const gitaPages: MetadataRoute.Sitemap = [];
  for (const ch of gitaChapters) {
    gitaPages.push({
      url: `${BASE_URL}/gita/${ch.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    });
    for (const v of ch.verses) {
      gitaPages.push({
        url: `${BASE_URL}/gita/${ch.slug}/${v.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  return [
    ...staticPages,
    ...stotraPages,
    ...deityPages,
    ...dayPages,
    ...festivalPages,
    ...purposePages,
    ...gitaPages,
  ];
}
