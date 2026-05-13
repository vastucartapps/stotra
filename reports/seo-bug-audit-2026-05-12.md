# SEO Indexing-Killer Bug Audit — 2026-05-12

Property: stotra.vastucart.in (single-locale, English-only Next.js 16 site)
Scope: every URL in production sitemap (1,770) — no sampling.

## Phase 1: URL enumeration

```
sitemap-static.xml      14
sitemap-stotras.xml    930
sitemap-gita.xml       719   (1 hub + 18 chapters + 700 verses)
sitemap-taxonomies.xml 107   (35 deity + 8 day + 40 festival + 24 purpose hubs)
─────────────────────────
TOTAL                 1770
```

`/tmp/urls.txt` — full list.

## Phase 2: Per-URL audit

`/tmp/audit.sh` invoked via `xargs -P 15` against all 1,770 URLs as Googlebot UA. Captured: HTTP status, content-type, x-robots-tag, canonical link, hreflang count + x-default presence, og:url / og:locale / og:type, html lang, robots meta, title length, h1 count, JSON-LD count + types, "/undefined" leak in canonical, body size, server.

Result: **1,770 rows / 1,770 URLs** (100% coverage). `/tmp/audit.tsv`.

## Phase 3: Classification (21 classes)

| Class | Count | Severity | Description |
|-------|------:|:--------:|-------------|
| **A** | site-wide (1,770) | **HIGH** | `/_next/` in robots disallow → blocks Googlebot rendering JS/CSS bundles |
| **B** | 0 | OK | AI/SEO bots 403 in middleware — verified clean for 14 bots |
| **C** | 0 | OK | Canonical wrong host/scheme |
| **D** | 1 | LOW | Canonical bleed (only homepage `/` vs `""`) |
| **E** | 0 | OK | Missing canonical |
| **F** | 0 | N/A | Missing hreflang x-default (single-locale, no hreflangs declared) |
| **G** | 0 | OK | Missing og:url |
| **H** | 4 | MEDIUM | og:url doesn't match URL — homepage + /disclaimer + /privacy-policy + /terms |
| **I** | 1,767 | **MEDIUM** | Missing og:locale — child pages override root layout's `locale: "en_IN"` |
| **J** | 0 | OK | og:locale ≠ html lang |
| **K** | 0 | OK | Missing og:type |
| **L** | 0 | OK | Missing html lang |
| **M** | 0 | OK | html lang ≠ "en" |
| **N** | 1 | EXPECTED | noindex — only `/search` (intentional) |
| **O** | 795 | **MEDIUM** | Title length >70 (Google truncation risk) |
| **P** | 0 | OK | Missing or multiple H1 |
| **Q** | site-wide (~841) | MEDIUM | Sitemap lastmod regenerates per-request in 3 of 4 sub-sitemaps |
| **R** | 1 | EXPECTED | Missing JSON-LD — only `/search` (intentional) |
| **S** | 0 | OK | HTTP non-200 |
| **T** | 0 | OK | Body suspiciously small |
| **U** | 0 | OK | `/undefined` in canonical (Next 15 params Promise leak) |

### Detail tables

**Class A (site-wide):** Every URL on the property is affected because `src/app/robots.ts:9` declares `disallow: ["/admin", "/api/", "/_next/"]`. The `/_next/` block prevents Googlebot from fetching hashed JS/CSS bundles, which causes the GSC "Page resources couldn't be loaded" warning — a major contributor to the 918 "Discovered, not indexed" backlog.

**Class B:** Probed with 14 bot UAs (Googlebot, Bingbot, GPTBot, ChatGPT-User, OAI-SearchBot, anthropic-ai, Claude-Web, ClaudeBot, PerplexityBot, CCBot, Applebot-Extended, Google-Extended, Amazonbot, Bytespider). All returned HTTP 200. `src/middleware.ts` only protects `/admin` and `/api/admin` — no UA-based 403s. Clean.

**Class D:** `/` only. Canonical is `https://stotra.vastucart.in` (no trailing slash); URL is `https://stotra.vastucart.in/`. Google treats them equivalent, but normalizing prevents downstream confusion.

**Class H (4 URLs):** All inherit root layout's `openGraph.url = APP_URL` because their per-page metadata doesn't override it:
- `https://stotra.vastucart.in/`            — explicitly sets `url: APP_URL` (no trailing slash)
- `https://stotra.vastucart.in/disclaimer`  — inherits APP_URL
- `https://stotra.vastucart.in/privacy-policy` — inherits APP_URL
- `https://stotra.vastucart.in/terms`       — inherits APP_URL

**Class I (1,767 URLs):** Only `/disclaimer`, `/privacy-policy`, `/terms` correctly inherit `og:locale = en_IN` from `src/app/layout.tsx:57`. Every other page defines a `generateMetadata()` openGraph block and **shallow-merges** with the layout, dropping the locale. Affected page types:
- `/stotra/[slug]` × 928
- `/deity/[slug]` × 35 + `/deity` hub
- `/festival/[slug]` × 40 + `/festival` hub
- `/purpose/[slug]` × 24 + `/purpose` hub
- `/day/[slug]` × 8 + `/day` hub
- `/gita`, `/gita/[chapter]` × 18, `/gita/[chapter]/[verse]` × 700
- `/`, `/today`, `/vrat-katha`, `/search`, `/editorial-process`, `/stotra` hub

**Class O (795 URLs) — title length >70:**
- 69 over 85 chars (definitely truncated by Google)
- 726 in 71–85 chars (likely truncated)
- All 18 Gita chapter pages over 95 chars (template includes long English subtitle)
- 50+ stotra pages over 85 chars (Devanagari title pushes past limit)

Worst offenders:
```
142  /gita/chapter-16   "Bhagavad Gita Chapter 16 - Daivasura Sampad Vibhaga Yoga - …"
139  /gita/chapter-13   "… - Kshetra-Kshetrajna Vibhaga Yoga - …"
102  /stotra/guru-sahasranama
101  /stotra/shani-stotram-dasharatha
```

**Class Q (3 of 4 sub-sitemaps):** `sitemap-stotras.xml` correctly uses `s.updatedAt`. The other three (`sitemap-static.xml`, `sitemap-taxonomies.xml`, `sitemap-gita.xml`) and the `sitemap.xml` index all use `new Date().toISOString()` at request time. Stable for the 1-hour CDN cache TTL, but rotates on every cache miss → ~841 hub/Gita URLs get fresh "lastmod" without content change → Google may down-prioritize the freshness signal.

## Phase 4 plan: root-cause fixes (no per-URL patches)

1. **A:** `src/app/robots.ts` — drop `/_next/` from disallow.
2. **I + H + D:** new `src/lib/seo-meta.ts` exposing `siteOpenGraph({ path, title, description, type })` that always emits `locale: "en_IN"`, `siteName`, and absolute `url`. Apply to all 19 pages with `openGraph:`.
3. **O:** 
   - `src/app/gita/[chapter]/page.tsx` — title becomes `"Bhagavad Gita Chapter N (Sanskrit) — Sloka, Hindi Translation, PDF"` (≤ 75 chars).
   - `src/app/stotra/[slug]/page.tsx` — add `titleVeryShort = "${name} | Stotra by VastuCart"` fallback when `titleShort` > 70.
4. **Q:** `src/app/sitemap-static.xml/route.ts`, `sitemap-taxonomies.xml/route.ts`, `sitemap-gita.xml/route.ts`, `sitemap.xml/route.ts` — replace `new Date()` with a build-time-pinned constant from a single source.

## Phase 5: re-verification (post-deploy)

Re-run `/tmp/audit.sh` against all 1,770 URLs. Each non-zero class above must become zero (except N/R for `/search`, which is intentional). Print row counts proving every URL was checked.
