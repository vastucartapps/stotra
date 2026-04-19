# Claude Code — stotra.vastucart.in Consolidated Single-Go Rollout

**Subdomain:** stotra.vastucart.in
**Branch:** create `ship/consolidated-2026-04` from `main`
**Mode:** single consolidated PR, NOT bundled, NOT soaked between sections
**Goal:** clear every AdSense-application blocker, ship enterprise-grade schema per the updated `06-stotra-vastucart-in.md`, and put the site in a defensible state for organic traffic growth — all in one coordinated ship.

## Read Before You Touch Anything

1. Read `00-shared-contracts.md` in full. It is read-only. §5.1 (content-schema coupling), §5.3 (JSON-LD injection pattern), §5.4 (i18n canonical), §5.5 (schema module structure), §5.6 (CI validation), §5.10 (property legality), §5.11 (Brand reverse flow) all apply without exception.
2. Read the updated `06-stotra-vastucart-in.md` in full. It is the authoritative spec for every schema emission on this subdomain. Any TypeScript in this prompt is illustrative only — when in doubt, 06 wins.
3. Read this prompt in full before starting any work. Do not begin coding until you can state in your own words: (a) what content-safety fixes ship first and why, (b) the two-node pattern for stotra pages, (c) what is explicitly forbidden on this subdomain.

When you have read all three, reply with a short acknowledgment and the planned commit sequence. Then start with P0.

## Commit Sequence and Branching

One PR, many commits. Commit discipline matters — we want rollback granularity. Use `[content/...]`, `[schema/...]`, `[infra/...]` prefixes per `00-shared-contracts.md` §5.7.

All schema code changes go behind an environment variable `NEXT_PUBLIC_SCHEMA_ENABLED` (default `true`). Individual schema types are further gated per `00-shared-contracts.md` §5.1 (content-schema coupling) so a single missing data field suppresses a single schema block, never the whole graph.

Open the PR in draft mode until the staging gate in P5 passes. Only then mark ready for review and merge.

---

## P0 — Content Safety (AdSense Application Blockers)

### P0.1 Remove the fabricated "Acharya Pushyadant Mishra" everywhere

This persona does not exist in any scholarly, academic, or web index outside of stotra.vastucart.in itself. It was a mistake to introduce. It is a direct AdSense misrepresentation risk and a Helpful Content System violation. Remove every reference in a single atomic commit.

What to do:
- Delete the `/about-translations` page and its route.
- Add a 301 redirect from `/about-translations` to a new page at `/editorial-process` (authored by VastuCart Editorial).
- Write `/editorial-process` content as a genuine editorial-process description. Describe the actual methodology: source verification against classical texts, bilingual presentation, no invented individual. State it plainly in VastuCart Editorial's collective voice. No fake names, no fabricated credentials, no invented institutional affiliations. Voice and style must match the `content voice brief` in the project instructions — classical Jyotish register, Sanskrit-first, cite only what you can verify.
- Global codebase search for the strings "Pushyadant", "Kashimath Stotra Parishad", and "Rameshwar Datta Shastri". Delete every occurrence — comments, metadata, footers, content files, JSON datasets. Replace any required author attribution with the canonical `@id` reference `https://blog.vastucart.in/authors/vastucart-editorial#person`.
- Add a CI assertion (see P5) that fails the build if any of those three strings reappears.

The new `/editorial-process` page needs: a clear statement that translations are editorial work produced in-house by VastuCart Editorial, a plain-English description of the sourcing approach (which classical texts the site draws on — Puranas, Itihasas, Agamas, Tulsidas, Adi Shankaracharya where applicable), a correction-and-feedback section pointing to `hi@vastucart.in`. No invented biography. No invented scholar. No credentials the business cannot prove.

Commit: `[content/p0] remove fabricated translator persona, replace with editorial-process page`

### P0.2 Global Benefits-language rewrite across all stotras

Every stotra page currently carries a "Benefits" section that makes hard claims ("Cures diseases and removes all suffering", "Fulfills all wishes when recited with devotion", "Removes all fears and obstacles from life"). These are medical/outcome claims on a devotional content site. They are incompatible with the site's own `/disclaimer` and they are an AdSense review-failure pattern.

Rewrite every Benefits bullet across all 928 stotras into tradition-framed language. The rewrite pattern:

| Before (hard claim) | After (tradition-framed) |
|---|---|
| Cures diseases and removes all suffering | Invoked in classical tradition for protection from ailments and affliction |
| Fulfills all wishes when recited with devotion | Traditionally recited for fulfillment of earnest wishes |
| Removes all fears and obstacles from life | Classical tradition invokes this hymn for removal of fear (bhaya-nashana) and obstacles (vighna-hara) |
| Grants strength, courage, and wisdom | Invokes the deity's qualities of strength, courage, and discernment |
| Protects from evil spirits and negative energies | Traditionally recited for spiritual protection |
| Bestows the blessings of Lord X through Y | Invokes the blessings of Lord X through Y's mediation |
| Cures [specific ailment] | Associated in tradition with healing; not a substitute for medical care |

Implement this as a data-layer rewrite, not a template-level wrapper. The underlying content strings in the stotra dataset change. After the rewrite, render benefits as they are stored — no programmatic hedging at render time.

Do the rewrite script-driven, not manual. Write a one-off migration script that walks the stotra dataset, applies the mapping plus a few hand-curated special cases, and produces a diff report. Human review the diff (the project owner will look), then apply. Store the mapping table in `scripts/benefits-rewrite-map.ts` for auditability.

Commit: `[content/p0] rewrite stotra Benefits into tradition-framed language globally`

### P0.3 Fix Hanuman Chalisa source attribution and audit all stotras

The Hanuman Chalisa page currently shows "Source: Tulsidas – Ramcharitmanas". This is factually wrong. The Hanuman Chalisa is a standalone composition by Tulsidas in Awadhi, distinct from Ramcharitmanas. This error on your highest-traffic page destroys credibility with anyone who knows the field.

Do two things:

1. Fix Hanuman Chalisa specifically. New source attribution: "Goswami Tulsidas · standalone composition in Awadhi, late 16th century". Corresponding schema `classicalSource` value: `"Standalone composition by Tulsidas in Awadhi"`. No `isBasedOn` link to Ramcharitmanas — drop that relationship.

2. Audit the source-attribution field for all 928 stotras. Spot-check at least 50 (including every Chalisa, every Sahasranama, every Kavacham, the Gita Dhyana Shloka, and the top 20 by traditional popularity). Flag every attribution you are not confident about. Produce a CSV report at `reports/source-attribution-audit.csv` with columns `slug, current_source, confidence (high/medium/low), suggested_source, rationale`. For high-confidence corrections, apply them in the same commit. For medium/low, apply conservative defaults: `"Classical Parasari tradition"` for anything of uncertain Puranic provenance, or the safer general tag `"Traditional Hindu devotional literature"` — never invent a specific Purana citation you cannot verify.

If a stotra's source is genuinely unknown, the schema `classicalSource` field stays unset and the page copy reads "Traditional, precise source uncertain" rather than naming a random Purana.

Commit: `[content/p0] fix Hanuman Chalisa source (standalone, not Ramcharitmanas) + audit report`

---

## P1 — Factual Accuracy (E-E-A-T Credibility)

### P1.1 Bhagavad Gita verse count — pin to 701 with editorial note

The site's chapter verse counts sum to 701, matching the Gita Press (Gorakhpur) edition. Keep that count. The contradiction comes from the About paragraph saying "700-verse Hindu scripture" while the header claims 701.

Update the `/gita` page and `/gita/chapter-13` page with an editorial note: "This site follows the Gita Press enumeration (701 verses). The Adi Shankara commentary tradition counts 700, treating the opening verse of chapter 13 as combined with the first regular verse." Keep displayed totals at 701. Keep chapter 13 at 35 verses. Do not change underlying data.

Schema: use `hasPart` (verse-level CreativeWork children per 06 §2.5), NOT `numberOfPages`. `numberOfPages` is the wrong schema property — it refers to a printed book's page count, not verse count.

Commit: `[content/p1] reconcile Gita 700 vs 701 with editorial note, pin to Gita Press count`

### P1.2 Homepage stotra count — honest number

Homepage title currently says "1000+ Hindu Prayers"; the body shows 928. Replace "1000+" with the real count from the database. Title tag and H1 must use the same number. Update copy that says "comprehensive collection of stotras" to accurately describe scale. When real count crosses 1,000, a separate update will change the description.

Commit: `[content/p1] replace inflated homepage count with real number`

### P1.3 Deity hub page count — fix the mismatch

`/deity/hanuman` currently displays "64 stotras" in the header but lists dozens of entries including stotras primarily addressed to other deities (Rama, Vishnu, Shani, Shiva, Vayu, Navagraha). Either the filter is wrong, the count is wrong, or both. Pick one of two paths:

Path A (preferred): the `/deity/{slug}` page shows stotras whose primary deity is that slug. Count and list match. Related stotras featuring that deity but primarily addressed elsewhere appear in a separate "Related" section below, clearly labeled. This path requires every stotra to carry a single `primaryDeity` field plus a `secondaryDeities` array.

Path B: the page shows all stotras tagged with that deity in any role. Count matches total. Header wording clarifies: "64 stotras featuring Hanuman" rather than "64 Hanuman stotras".

Go with Path A. Write the primaryDeity/secondaryDeities migration, update the filter, fix the count. Apply to all 32 deity hubs.

Commit: `[content/p1] add primary/secondary deity fields, fix deity hub counts and filtering`

### P1.4 "43 verses" on Chalisa pages — explanatory gloss

Every chalisa page's introduction sentence should explain the naming: "The 40 chaupais give the Chalisa its name (chalis = forty); framing dohas bring the full recitation to 43 verse-units." Apply to all chalisas globally — Hanuman Chalisa, Shiv Chalisa, Durga Chalisa, etc. The stored verseCount remains 43 (matching actual content); the copy explains why.

Commit: `[content/p1] add verse-count explanatory gloss to all Chalisa intros`

---

## P2 — Schema Implementation

Follow `06-stotra-vastucart-in.md` exactly. Do not deviate from the two-node pattern (`#webpage` Article + `#work` CreativeWork) on stotra pages. Do not emit any of the forbidden types listed in the `FORBIDDEN ENTITIES AND PROPERTIES` section of 06.

Sequence within P2, one commit per step:

1. Scaffold `lib/schema/` module structure per `00-shared-contracts.md` §5.5 and 06 §5.5. Each file: `website.ts`, `creativeWork.ts`, `faqPage.ts`, `audio.ts`, `collectionPage.ts`, `book.ts`, `recipe.ts`, `taxonomyPage.ts`. Each builder returns `object | null` per content-schema coupling rule.

2. Build `website.ts` and inject on homepage. Schema validates. Commit.

3. Build `creativeWork.ts` with the two-node pattern. Inject on `app/stotra/[slug]/page.tsx`. Validate on 5 sample stotras. Commit.

4. Build `collectionPage.ts` with Thing-node support and the deity sameAs table. Populate `data/deities.json` with slug, names, wikipediaUrl, wikidataUrl, description for all 32 deities. Verify every Wikipedia and Wikidata URL resolves (HTTP 200) before enabling sameAs emission for that deity — a failed URL means the deity's `sameAs` array is empty, not that the schema breaks. Inject on `app/deity/[slug]/page.tsx`. Commit.

5. Build `book.ts` for Gita Book + Chapter + Verse. Inject on `/gita`, `/gita/chapter-[n]`, `/gita/chapter-[n]/verse-[m]`. Commit.

6. Build `recipe.ts` with strict samagri+steps gating. Inject on vrat katha pages. Confirm kathas without samagri emit Article+Breadcrumb only, no Recipe. Commit.

7. Build `faqPage.ts`. Inject only on pages where FAQ answer text is in SSR HTML. If current FAQ accordion is JS-hydrated, fix it first in P4.2 before emitting the schema here. Commit.

8. Build `taxonomyPage.ts`. Inject on `/purpose/[slug]`, `/day/[slug]`, `/festival/[slug]`. Commit.

9. BreadcrumbList is emitted inline in each builder above — no separate file. Verify every non-homepage page has a valid breadcrumb graph node.

10. Wire `mentions` sparingly per 06 §3.1. Do not bulk-link. Only emit `mentions` when a stotra explicitly addresses a concept.

After all schema emitters ship, run the validator against 10 sampled URLs. Zero errors, zero warnings required. Fix anything that fails before proceeding to P3.

---

## P3 — Technical SEO

### P3.1 Sitemap infrastructure per 06 §4.1

Replace whatever sitemap exists with the new structure: a sitemap index at `/sitemap.xml` and per-content-type child sitemaps. Every URL carries a real `<lastmod>` from the database. Until Hindi localization ships, do NOT emit hreflang alternates in the sitemap — only English URLs. When Hindi ships later, a separate change adds the hreflang pairs.

Submit the sitemap index in GSC after deploy. If the GSC indexed-page count is dramatically lower than the sitemap URL count after 2 weeks, that is a quality signal problem, not a sitemap problem — separate diagnostic.

Commit: `[infra/p3] sitemap index with per-content-type child sitemaps and real lastmod`

### P3.2 robots.txt per 06 §4.2

Emit at `/robots.txt`. Confirm no legitimate internal link uses query parameters before enabling `Disallow: /*?*` — if the search endpoint or filters rely on query params, either disallow only that endpoint or allow-list specific params.

Commit: `[infra/p3] add production robots.txt pointing to sitemap index`

### P3.3 Canonical and hreflang audit

Every page must emit `<link rel="canonical">` to its own full URL. Spot-check 10 URLs — common Next.js App Router mistake is pointing canonicals to a collection page or homepage.

Hreflang: per `00-shared-contracts.md` §5.4, English default paths are bare, Hindi uses `/hi/` prefix. Since Hindi pages are not yet shipped on this subdomain, do NOT emit hreflang. Emitting hreflang alternates that point to non-existent URLs is a negative signal. When Hindi ships later, hreflang is added as a separate change.

Commit: `[infra/p3] canonical audit across all page templates, no-op on hreflang until Hindi ships`

### P3.4 Image optimization — SVG bypass and responsive widths

Two specific bugs currently:

1. Deity icons at `/images/deities/*.svg` are being routed through Next's raster image optimizer (`/_next/image?url=...`). SVGs should be served directly. Configure the Image component to skip optimization for SVGs (or render plain `<img>` tags for SVG assets).

2. Homepage and detail page images are being served with `w=3840&q=75` regardless of rendered size. A deity icon that renders at 96×96 does not need a 3840px image. Audit the Image component instances, supply the correct `sizes` attribute per responsive breakpoint, and confirm devtools Network tab shows reasonable delivered image sizes.

Commit: `[infra/p3] SVG bypass for Next image optimizer, responsive sizes across templates`

### P3.5 Core Web Vitals baseline and fixes

Run PageSpeed Insights on the following pages before and after the deploy, record LCP/CLS/INP on mobile:
- Homepage
- /stotra/hanuman-chalisa
- /gita
- /gita/chapter-4/verse-19
- /deity/hanuman

Targets after this PR ships: LCP < 2.5s, CLS < 0.1, INP < 200ms on each page at 4G throttling. If FAQ accordion or transliteration toggle are the biggest INP offenders, fix them in P4.2.

Record baseline + target-after numbers in `reports/cwv-baseline.md`.

Commit: `[infra/p3] CWV baseline recorded, image-related LCP fixes applied`

---

## P4 — AEO and On-Page Quality

### P4.1 "About This Stotra" extractable paragraph

Per 06 §3.3. Every stotra detail page renders a 50–100 word factual paragraph above the stotra text, in visible HTML (not collapsed, not behind a tab). Contents: traditional author, approximate century, source text, primary deity, traditional purpose, verse count.

Implementation approach: add an `aboutParagraph` field to the stotra data model. Populate for the top 100 stotras manually (project owner will review drafts for voice before commit). For the remaining ~828 stotras, generate a template-based paragraph from the existing fields (author, source, deity, verseCount, purposeTags) with a conservative fallback when fields are missing.

Fallback pattern (when author unknown): "This hymn is preserved in the classical Parasari tradition and is traditionally recited for {purpose}. It spans {n} verses and is addressed to {deity}." No fabricated provenance.

Commit: `[content/p4] About-This-Stotra paragraph on all stotra detail pages`

### P4.2 FAQ answers in SSR HTML, not JS-hydrated on expand

Current FAQ accordion likely hydrates answer text on click. That breaks LLM extraction and weakens FAQPage schema validity. Fix one of two ways:

Option A: render FAQs as native `<details>/<summary>` HTML. SSR by default, visually behaves as accordion, answer is in view-source.

Option B: render Q&A as always-visible prose with a smaller secondary heading style. Works fine on mobile, marginally more page length, better for AEO.

Go with Option A unless the design team objects. Confirm post-fix that view-source on a stotra page contains the full answer text, not just the question. Only after this passes should FAQPage schema be emitted (P2.7).

Commit: `[content/p4] FAQ answers rendered SSR via details/summary, schema emission unlocked`

### P4.3 Ecosystem-block pruning per 06 §3.2

On stotra detail pages only: remove the mid-page ecosystem block, condense the top ribbon, keep the footer block. Homepage, deity hubs, Gita pages retain full ecosystem blocks. Contextual cross-subdomain links on stotra pages are allowed but capped at 1–2 per page and must be topically relevant (e.g., a Shani stotra can link to Kundali for Sadhesati; a Hanuman stotra should NOT link to Tarot).

Commit: `[content/p4] prune ecosystem block on stotra detail templates, keep contextual links only`

### P4.4 Title tag differentiation

Current titles follow a flat template. Update the stotra detail title template to: `{Stotra Name} — {Devanagari} | Sanskrit, Hindi, PDF | Stotra by VastuCart`. Keep under 65 characters — trim the trailing "Stotra by VastuCart" if length requires. Validate no title exceeds Google's display truncation threshold (~580px).

Same style for Gita chapter pages: `Bhagavad Gita Chapter {N}: {Name} | {Devanagari} | Stotra by VastuCart`.

Commit: `[content/p4] differentiated title templates across content types`

---

## P5 — Verification and Merge

Before marking the PR ready for review:

1. Local build passes, all tests green, CI schema-validate green.
2. Deploy to staging URL.
3. Run validator.schema.org on 10 URLs: homepage, `/stotra/hanuman-chalisa`, `/stotra/shiv-tandav-stotram`, `/stotra/vishnu-sahasranama`, `/gita`, `/gita/chapter-4`, `/gita/chapter-4/verse-19`, `/deity/hanuman`, `/purpose/protection`, `/vrat-katha/dhanteras-katha`. Zero errors and zero warnings on each.
4. Run Google Rich Results Test on homepage, Hanuman Chalisa, `/gita`, `/deity/hanuman`, a vrat katha with samagri. Confirm eligibility for applicable rich result types (Breadcrumb everywhere; FAQ on pages with FAQ; Book on `/gita`; Recipe on the samagri-carrying vrat katha).
5. Lighthouse on Hanuman Chalisa, `/gita`, homepage. SEO score must not drop vs. pre-deploy baseline. Best Practices score must not drop.
6. Manual DOM checks on 2 stotras: confirm "About this Stotra" paragraph visible, confirm FAQ answer text in view-source, confirm zero occurrences of "Acharya Pushyadant Mishra" / "Pushyadant" / "Kashimath Stotra Parishad" / "Rameshwar Datta Shastri" across the rendered site.
7. Mobile emulator check on Hanuman Chalisa page: Devanagari renders without horizontal scroll at 360px viewport, FAQ expands cleanly, transliteration toggle does not cause visible layout shift.
8. CI has the custom assertions from P5.CI below, and they are green.

When all 8 checks pass, mark PR ready for review. Project owner reviews, merges, Coolify auto-deploys to production.

### P5.CI — Custom CI assertions to add

Add to the schema-validate workflow:

- Fail build if rendered JSON-LD on any URL contains a `Person` node with `name` equal to any of: `"Acharya Pushyadant Mishra"`, `"Pushyadant Mishra"`, `"Pushyadant"`.
- Fail build if rendered JSON-LD contains any `@type` of `AggregateRating`, `Review`, `Product`, `Offer`, `HowTo`, `Course`, `CourseInstance` on this subdomain.
- Fail build if any `Brand` node contains a `parentOrganization` property.
- Fail build if any emitted JSON-LD contains the exact strings `"TODO"`, `"TBD"`, `"lorem"`, `"placeholder"`.

### P5.Post-deploy — 48-hour observation

After merge and production deploy:

- Record the production SHA in `soak-log.md`.
- Watch GSC → Enhancements → Unparsable structured data for 48 hours. Must stay at 0.
- Watch GSC → Coverage → Errors for 48 hours. No new URL errors.
- Re-run validator.schema.org on 5 random URLs daily for 2 days.
- Monitor Lighthouse SEO score via GSC's Core Web Vitals tab — no regression.

If anything fails: `git revert` the production SHA, re-deploy, debug on a branch, re-ship once green.

---

## What You Are NOT Authorized To Do

- Do not modify `00-shared-contracts.md`. Read-only.
- Do not modify files outside this project's repo. Other subdomain codebases are off-limits.
- Do not redefine the canonical Organization or Persons. Reference via `@id` string only.
- Do not invent author credentials, translator biographies, institutional affiliations, or scholarly endorsements. If a real-person attribution is required, project owner supplies it with documentation.
- Do not invent Wikidata Q-numbers. If a Q-number is not verified, leave `sameAs` absent for that entity.
- Do not emit `AggregateRating`, `Review`, `Product`, `Offer`, `HowTo`, `Course`, `CourseInstance`, `Brand.parentOrganization` on this subdomain.
- Do not fabricate classical citations. If the chapter/adhyāya is unknown, write "preserved in the classical Parasari tradition" or equivalent.
- Do not inflate counts. Homepage says what the database contains.
- Do not emit schema for content that does not exist. If samagri is empty, no Recipe. If audio is missing, no AudioObject or PodcastEpisode.
- Do not rename or redefine any canonical `@id` string. They are locked per `00-shared-contracts.md`.

## Acceptance Criteria Summary

- Zero references to the fabricated persona anywhere in code, content, or schema.
- Every stotra Benefits bullet rewritten to tradition-framed language.
- Hanuman Chalisa source corrected; 50+ stotras audited and reported.
- Gita count reconciled with editorial note; homepage count matches database; deity hub counts match filter.
- Every page type emits its correct schema per `06-stotra-vastucart-in.md`, with zero validator errors on the 10 sampled URLs.
- Every stotra detail page has an "About this Stotra" paragraph visible in HTML.
- FAQ answers present in SSR HTML on every page that emits FAQPage schema.
- Sitemap index + child sitemaps live with real lastmod; robots.txt points to sitemap.
- CWV baseline recorded; SVG bypass shipped; title tags differentiated.
- CI assertions block regression on all forbidden strings and types.
- 48-hour post-deploy observation clean.

## Rollback Plan

If any post-deploy check fails: `git revert` the merge commit on main, redeploy. The feature flag `NEXT_PUBLIC_SCHEMA_ENABLED=false` can disable all schema emission as a softer fallback while debugging. Schema module per-type gates allow disabling a single type without reverting the whole PR — set the corresponding data field to empty and the builder returns `null` per §5.1.

---

## One Final Rule

If you encounter ambiguity between this prompt, `00-shared-contracts.md`, and `06-stotra-vastucart-in.md`: 00 wins universally. 06 wins for this subdomain's specifics. This prompt wins for the execution sequence and content fixes. When unsure, stop and ask the project owner — do not guess.

This is the single most important site in the ecosystem for content authenticity. AdSense approval and organic survival both depend on it being real, not spammy, not inflated, not invented. Execute carefully.
