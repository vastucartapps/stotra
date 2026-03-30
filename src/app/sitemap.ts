import type { MetadataRoute } from "next";
import { getAllStotras } from "@/lib/stotras";
import { DEITIES } from "@/data/deities";
import { DAYS } from "@/data/days";
import { FESTIVALS } from "@/data/festivals";
import { PURPOSES } from "@/data/purposes";

const BASE_URL = "https://stotra.vastucart.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const stotras = getAllStotras();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/stotra`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/deity`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/day`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE_URL}/festival`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE_URL}/purpose`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/gita`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.95 },
    { url: `${BASE_URL}/vrat-katha`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.95 },
    { url: `${BASE_URL}/today`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/search`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/privacy-policy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/disclaimer`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  const stotraPages: MetadataRoute.Sitemap = stotras.map((s) => ({
    url: `${BASE_URL}/stotra/${s.slug}`,
    lastModified: new Date(s.updatedAt),
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  const deityPages: MetadataRoute.Sitemap = DEITIES.map((d) => ({
    url: `${BASE_URL}/deity/${d.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  const dayPages: MetadataRoute.Sitemap = DAYS.map((d) => ({
    url: `${BASE_URL}/day/${d.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const festivalPages: MetadataRoute.Sitemap = FESTIVALS.map((f) => ({
    url: `${BASE_URL}/festival/${f.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const purposePages: MetadataRoute.Sitemap = PURPOSES.map((p) => ({
    url: `${BASE_URL}/purpose/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  return [
    ...staticPages,
    ...stotraPages,
    ...deityPages,
    ...dayPages,
    ...festivalPages,
    ...purposePages,
  ];
}
