import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /_next/ MUST remain crawlable so Googlebot can fetch hashed JS/CSS
        // bundles when rendering pages — blocking it triggers GSC's
        // "Page resources couldn't be loaded" indexing rejection.
        disallow: ["/admin", "/api/"],
      },
    ],
    sitemap: "https://stotra.vastucart.in/sitemap.xml",
    host: "https://stotra.vastucart.in",
  };
}
