# Phase 5 — Post-deploy re-verify

**Method:** re-ran `audit.sh` against all 1,770 production URLs (same script,
same UA, same parallelism). Two consecutive deploys: `d557f6e` (main fix wave)
and `df32faa` (2 title stragglers).

**Coverage proof:** `audit-phase5-final.tsv` has **1,771 rows** (1 header +
1,770 data). Every URL in `urls.txt` was probed.

## Diff table — Before (Phase 2) → After (Phase 5)

| Class | Before | After | Delta | Status |
|-------|-------:|------:|------:|--------|
| **A** /_next/ blocked        | 1,770 (site-wide) | **0** | −1,770 | ✅ FIXED |
| B  AI bots 403               | 0     | 0   | 0     | clean |
| C  canonical wrong host      | 0     | 0   | 0     | clean |
| D  canonical bleed           | 1     | 1   | 0     | cosmetic homepage (see below) |
| E  missing canonical         | 0     | 0   | 0     | clean |
| F  missing hreflang x-default| 0     | 0   | 0     | N/A (single-locale) |
| G  missing og:url            | 0     | 0   | 0     | clean |
| **H** og:url mismatch        | 4     | 1   | −3    | ✅ 3 fixed; 1 cosmetic remainder |
| **I** missing og:locale      | 1,767 | **0** | −1,767 | ✅ FIXED |
| J  og:locale ≠ html lang     | 0     | 0   | 0     | clean |
| K  missing og:type           | 0     | 0   | 0     | clean |
| L  missing html lang         | 0     | 0   | 0     | clean |
| M  html lang wrong           | 0     | 0   | 0     | clean |
| N  noindex                   | 1     | 1   | 0     | intentional `/search` |
| **O** title length >70       | 795   | **0** | −795 | ✅ FIXED |
| P  h1 missing/multi          | 0     | 0   | 0     | clean |
| **Q** sitemap lastmod churn  | ~841 (site-wide) | **0** | −841 | ✅ FIXED |
| R  no JSON-LD                | 1     | 1   | 0     | intentional `/search` |
| S  HTTP non-200              | 0     | 0   | 0     | clean |
| T  body too small            | 0     | 0   | 0     | clean |
| U  /undefined in canonical   | 0     | 0   | 0     | clean |

**Total fixable failures eliminated:** ≈ 5,170 (1770 + 4 + 1767 + 795 + 841 − 7).

## The 2 remaining flags — both NOT indexing risks

### 1. `https://stotra.vastucart.in/` — D + H (canonical/og:url normalization)

The audit row:
```
url:        https://stotra.vastucart.in/
canonical:  https://stotra.vastucart.in
og:url:     https://stotra.vastucart.in
```

Cause: Next.js's `metadataBase` strips the trailing slash on the root path
when emitting `<link rel="canonical">` and `<meta property="og:url">`. The
URL `https://stotra.vastucart.in` and `https://stotra.vastucart.in/` are
HTTP-equivalent (both serve the root resource) — Google explicitly treats
them as the same URL per their canonicalization documentation. This is
a classifier-side false positive: if the audit script normalised the
trailing slash on the root, the count would drop to 0. We are leaving
the source code as Next intends rather than fighting the framework.

### 2. `https://stotra.vastucart.in/search` — N + R (intentional)

`/search` ships `robots: { index: false, follow: true }` and no JSON-LD by
design — search-result pages should not be indexed and have no schema-eligible
content type.

## Site-wide probes (re-verified)

```
A. /_next/ in robots.txt:  REMOVED (only /admin and /api/ remain)
B. AI/SEO bot 403:          14 bots all return HTTP 200 (Googlebot, Bingbot,
                            GPTBot, ChatGPT-User, OAI-SearchBot, anthropic-ai,
                            Claude-Web, ClaudeBot, PerplexityBot, CCBot,
                            Applebot-Extended, Google-Extended, Amazonbot,
                            Bytespider)
Q. sitemap lastmod:         All 4 sub-sitemaps now use siteContentLastmod()
                            derived from max(stotras.updatedAt) floored to UTC
                            day; stable across requests, only changes when a
                            stotra is updated. 1-hour CDN cache layered on top.
```

## Files

- `audit-phase5-final.tsv` — full per-URL audit data (1,770 rows)
- `classified-summary-phase5.txt` — final per-class counts
- `audit.sh`, `classify.py`, `urls.txt` — reusable harness for next audit
