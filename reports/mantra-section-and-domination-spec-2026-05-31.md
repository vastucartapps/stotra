# Mantra Section + Topical Domination — Build Spec (2026-05-31)

Status: **AWAITING APPROVAL before page generation.** Authenticity-sensitive (religious content) + defines a data model expensive to change later.

Backed by: `reports/research-ai-mode-2026-05-31.md`, `reports/keyword-wheel-mantra-research-2026-05-31.md`, live GSC 90d (`reports/gsc-data-2026-05-31/`).

---

## 0. Guiding mandate (from user)
Full / enterprise / disruptor. No thin pages. Every page, when indexed, must be the most complete, most citable answer on the web. No fabrication on any mantra/scripture association.

---

## 1. Three work-streams (in priority order)

### STREAM A — Optimize what we already have (highest ROI, no new pages)
The 930 are indexed but rank page 3–6. Make each the flagship answer.

**A1. New on-page blocks (template-level, all 930 + applied richest to top-40 GSC pages):**
- **"What is X" passage** — self-contained ~150-word answer-first paragraph naming deity + scripture + chapter/sarga + composer + verse count. (AI-citation unit.)
- **TL;DR / Key Facts box** — deity · source scripture · best day & time · verse count · primary benefit · reading time. Top 150 words.
- **Question-shaped FAQs** mapped to fan-out sub-queries (meaning / when / benefits / who composed / how many times / which day). Keep FAQPage JSON-LD for AI parsing (no SERP star post-May-2026).
- **Verse table** (verse № → Sanskrit → IAST → translation) — heavily lifted for "[stotra] meaning".
- **DefinedTerm schema** for the "what is" definition + alternateName variants.

**A2. Alias / secondary-term capture (no new pages):**
Add spelling/transliteration variants to each page's `alsoKnownAs` so the EXISTING page ranks for them: adityahridayam, bhisma/bhishm stuti, siva stuti/shivstuti, kanakadara, shivmahimna, kalabhairavashtakam, etc. (from GSC gap report).

**A3. Fix wrong-page-ranks (intent mismatch):**
- `devi kavacham` → ensure `devi-kavacham` outranks `ashta-lakshmi-kavacham` (title/H1/passage/internal-anchor tuning).
- `vishnu gayatri mantra` → `vishnu-gayatri` should beat `dhanvantari-mantra`.
- `shiv stuti` → a Shiva stuti page should beat `markandeya-stuti`.

### STREAM B — New Mantra section (`/mantra`) — the topical-authority wheel
Bounded, deep, single-axis pages only. **Lagna = filter, NOT pages** (mantra-identical to Rashi). No cross-axis intersection URLs (noindex/canonical).

**Indexable page set (~50–60 pages, each one verifiably-sourced classical mantra):**

| Hub | Member pages | Count | Source basis |
|---|---|---:|---|
| `/mantra` (pillar) | — | 1 | overview, the axes, how to choose |
| `/mantra/planet` | surya, chandra, mangal, budha, guru, shukra, shani, rahu, ketu | 9 + 1 hub | Mantra Mahodadhi bija + Navagraha Gayatri (both lineages shown) |
| `/mantra/rashi` | mesha…meena (12) | 12 + 1 hub | BPHS rulership → ruling-planet remedy [modern convention on confirmed rulership] |
| `/mantra/day` | sunday…saturday (7) | 7 + 1 hub | vāra→planet [classical]; →deity [variable]; cross-links /day |
| `/mantra/nakshatra` | 27 birth stars | 27 + 1 hub | nakshatra→ruling planet→mantra; high solution-intent |
| `/mantra/deity/*` | maps to existing /deity | (cross-link, not dup) | links to deity + its stotras |
| `/mantra/purpose/*` | maps to existing /purpose | (cross-link, not dup) | |

**Lagna:** single explainer page `/mantra/lagna` that says "ascendant remedy = your lagna lord's mantra" and routes to the 12 rashi/9 planet pages. NOT 12 indexable pages.

**Bloat controls:** only single-axis set in sitemap; intersections `noindex,follow` or canonical; ≥5-item threshold to index; Lagna folded.

### STREAM C — Authority + plumbing
- Dynamic stotra count everywhere (no hardcoded 930) — search & replace with a `getStotraCount()`/build-time constant.
- Central ecosystem link config (`src/data/ecosystem.ts` extension) → future-proof cross-links to all 9 live sites; mantra remedy pages link to kundali (find rashi/lagna), panchang (today's tithi/nakshatra), store (yantra/rudraksha/mala for the remedy), muhurta (start-time). Bidirectional hooks noted as cross-repo tasks.
- Wikidata/Wikipedia sameAs on planet/rashi/nakshatra entities.
- Force re-index top ~40 pages + daily GSC/GA4 snapshot.

---

## 2. Mantra page DATA MODEL (the rich spec the user asked for)

Each `/mantra/*` member page carries (fields optional unless marked ✓):

```
slug ✓, type (planet|rashi|day|nakshatra) ✓, name ✓ (En + Devanagari + IAST)
alsoKnownAs[]                         // variants for secondary-term capture
deity / planet / ruler entity ✓ (+ sameAs Wikidata/Wikipedia)

— THE MANTRA(S) ✓ —
mantras[]: {
  text (Devanagari) ✓, transliteration (IAST) ✓,
  lineage  // "Mantra Mahodadhi bija" | "Vedic name/shakti" | "Navagraha Gayatri" — shown side by side, never merged
  type     // bija | gayatri | naam | stotra-seed
  syllableMeaning[]   // syllable → meaning (user request)
  hindiExplanation ✓, englishExplanation ✓
  composer / rishi / sourceText ✓ (BPHS / Mantra Mahodadhi / Veda — cited)
  meaning (full) ✓
}

— PRAYOGA / VIDHI (how to practice) ✓ —
purpose / benefits[] ✓ (+ impact: what changes, realistic framing)
japaCount: { minPerDay, recommended (e.g. 108), totalSankalpa (e.g. 125,000) }
mala: { type (rudraksha/tulsi/sphatika/etc), beads (108), why }
durationDays: { minimum, recommended }
bestTime (Brahma Muhurta / sunrise / planet hora), bestDayToStart
direction (facing east/north…), asana (which seat/cloth)
pujaSamagri[]   // items needed
pujaModes: { minimal, medium, full/sankalpita }   // 3 tiers
guruDiksha: { ideal | necessary | not-required + explanation }
deityImageOrIdol   // ideal murti/photo for the altar
dosAndDonts: { dos[], donts[] }   // "proven" framed as traditional rules

— COMMERCE / CONSULTATION HOOKS (phase-2-ready, render only if target live) —
productLinks[]      // store.vastucart.in: mala, yantra, rudraksha, idol
consultationLinks[] // kundali / muhurta: "find your rashi", "ideal start muhurta"
ecosystemLinks[]    // panchang (tithi/nakshatra today), horoscope (your rashi)
```

**Authenticity rules baked in:** every mantra labeled `[confirmed classical]` / `[modern convention]` / `[variable by tradition]`; both bija lineages shown separately; Rahu/Ketu carry NO sign-rulership (flagged); weekday→deity marked variable. Sources named on-page (BPHS tr. Santhanam; Mantra Mahodadhi, Mahidhara; Purohit Darpan).

---

## 3. Schema per mantra page (AI-Mode aggressive)
`@graph`: WebPage/Article + DefinedTerm (the mantra) + Thing (planet/rashi/nakshatra entity w/ sameAs) + HowTo-style steps rendered as content (HowTo rich-result is dead, so render as on-page ordered list, not HowTo schema) + BreadcrumbList + FAQPage (parse-only) + ItemList (the mantra variants) + isPartOf WebSite. "Speakable" skipped (beta/news-only).

---

## 4. Rollout phases
1. **Stream A** template blocks + aliases + intent fixes → reindex (fastest measurable lift).
2. **Stream B** data model + `/mantra` pillar + planet (9) + day (7) first (highest demand, fully classical), then rashi (12) + nakshatra (27).
3. **Stream C** dynamic count, ecosystem config, authority, daily tracking.

Each phase: build → local size/schema audit → commit → push → reindex.

---

## 5. Decisions LOCKED (user, 2026-05-31)
- D1: **Nakshatra 27 pages IN v1.** Full coverage.
- D2: **Sequencing = PARALLEL** — Stream A on-page template + Stream B mantra pillar shipped together on branch `feat/geo-domination-wave1`.
- D3: **Multi-modal = OG SVG → WebP now.** Every mantra + key stotra/deity page gets a beautiful generated OG image (SVG authored, converted to WebP), with explicit share links (WhatsApp/X/FB/Pinterest/copy) — user shares daily to seed traffic. Audio = phase 2.
- D4: All ecosystem sites are LIVE (vastucart.in, store, kundali, panchang, horoscope, muhurta, tarot, wedding, blog). Build central link config; mantra remedy pages link out to kundali (rashi/lagna), panchang (tithi/nakshatra), muhurta (start time), store (mala/yantra/rudraksha). Stotra-repo scope first, in full.
- D5: Product/consultation hooks render as real ecosystem links now (sites are live); deep product-SKU deep-links refined when store URL pattern is mapped.
- D6: **Enterprise/full mandate** — no thin pages, no minimal stubs. Each page = the most complete, most citable answer on the web.
- D7: **Upgrade llms.txt** to GEO-grade: entity declarations, authority statements, full taxonomy + per-section content endpoints.

## 6. GEO alignment (user's Gemini briefing, folded in)
Zero-click → we become the cited source: "What is X" passage + TL;DR are the lift units.
GEO core tactics → cited sources/stats/quotes (Princeton GEO study), info density (tables, no fluff), structured formatting, entity/schema domination (DefinedTerm + Thing + sameAs Wikidata/Wikipedia).
Conversational long-tail → FAQs phrased as real spoken questions mapped to query fan-out.
Multi-modal → OG WebP images + ImageObject schema (D3).
Monetization → product/consultation/ecosystem hooks built into the data model (D5).
Publisher-GEO (NOT local-lead GEO): our authority = entity grounding + scripture citations + ecosystem links + consistent naming. (Local-review tactics in the briefing don't apply to a content/publisher entity.)
