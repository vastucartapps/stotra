import type { MetadataRoute } from "next";

/**
 * AI-aware robots policy (mirrors vastucart.in main, see commit c016cb4):
 *   ALLOW citation bots that send referral traffic back (ChatGPT-User,
 *   OAI-SearchBot, PerplexityBot, Claude-User/SearchBot, Google-Extended,
 *   Applebot-Extended, etc.) so AI search surfaces can cite stotra pages.
 *   BLOCK training-only bots that consume content with no traffic exchange
 *   (GPTBot, ClaudeBot, anthropic-ai, CCBot, Bytespider, Diffbot, etc.).
 *   BLOCK SEO scrapers (Ahrefs, Semrush, MJ12) — they cost crawl budget.
 *
 * /admin and /api/ are gated for every bot. /_next/ MUST remain crawlable so
 * Googlebot can fetch hashed JS/CSS bundles when rendering — blocking it
 * triggers GSC's "Page resources couldn't be loaded" indexing rejection
 * (the prior 9-bug-class audit's Class A finding).
 */
const SITE_URL = "https://stotra.vastucart.in";
const COMMON_DISALLOW = ["/admin", "/api/"];

const ALLOWED_CITATION_BOTS = [
  "Googlebot",
  "Bingbot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "Claude-User",
  "Claude-Web",
  "Claude-SearchBot",
  "DuckAssistBot",
  "YouBot",
  "PhindBot",
  "MistralAI-User",
  "Meta-ExternalFetcher",
  "Google-Extended",
  "Applebot-Extended",
];

const BLOCKED_TRAINING_BOTS = [
  "GPTBot",
  "ClaudeBot",
  "anthropic-ai",
  "CCBot",
  "Bytespider",
  "Amazonbot",
  "Meta-ExternalAgent",
  "Diffbot",
  "cohere-ai",
  "ImagesiftBot",
  "Omgilibot",
];

const BLOCKED_SEO_SCRAPERS = ["AhrefsBot", "SemrushBot", "MJ12bot"];

export default function robots(): MetadataRoute.Robots {
  const rules: MetadataRoute.Robots["rules"] = [
    ...ALLOWED_CITATION_BOTS.map((userAgent) => ({
      userAgent,
      allow: "/",
      disallow: COMMON_DISALLOW,
    })),
    ...BLOCKED_TRAINING_BOTS.map((userAgent) => ({
      userAgent,
      disallow: "/",
    })),
    ...BLOCKED_SEO_SCRAPERS.map((userAgent) => ({
      userAgent,
      disallow: "/",
    })),
    // Default catch-all: allow with the same gating as named good bots.
    { userAgent: "*", allow: "/", disallow: COMMON_DISALLOW },
  ];

  return {
    rules,
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
