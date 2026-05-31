# AI-Synthesized Search: Actionable Brief for stotra.vastucart.in

**Date:** 2026-05-31 · **Goal:** Get a 930+ stotra devotional site CITED and surfaced inside Google AI Mode / AI Overviews and LLM answer engines, not just classic blue links.

Legend: **[Confirmed]** = documented by Google/Schema.org/peer-reviewed source · **[Observed]** = replicated industry study (treat as directional, vendor-funded) · **[Speculation]** = inference.

---

## 1. What actually changed

Search moved from *retrieve-and-rank ten links* to *decompose the question, retrieve passages from many sources, and synthesize one cited answer*. Three surfaces matter:

- **AI Overviews** — AI summary block atop normal results (SGE rebrand, I/O 2024; broad expansion through 2024-25). As of 2026 it appears on roughly half of queries by various counts. **[Confirmed/Observed]**
- **AI Mode** — full conversational generative search. Entered Labs **March 5, 2025**, rolled out to all US users **May 20, 2025** (no Labs sign-up), expanded to UK/India mid-2025 and **180+ countries Aug 2025**. Powered by a **custom Gemini 2.5** (now upgraded to Gemini 3). **[Confirmed]** ([blog.google AI Mode update](https://blog.google/products-and-platforms/products/search/google-search-ai-mode-update/), [TechCrunch May 20 2025](https://techcrunch.com/2025/05/20/googles-ai-mode-rolls-out-to-us-will-add-support-for-deeper-research-comparison-shopping-and-more/))

**Query fan-out is the core mechanism.** Google's own description: AI Mode "uses a query fan-out technique, breaking down your question into subtopics and issuing a multitude of queries simultaneously." A typical question fans into **~8-12 sub-queries** (hundreds for *Deep Search*, powered by Gemini 2.5 Pro, which returns a cited report in ~5 min). The system runs them in parallel across the live web, **Knowledge Graph**, and structured data, then synthesizes one answer with inline citations. **[Confirmed]** ([blog.google AI Mode update](https://blog.google/products-and-platforms/products/search/google-search-ai-mode-update/); [Search Engine Journal: fan-out details from Google](https://www.searchenginejournal.com/query-fan-out-technique-in-ai-mode-new-details-from-google/552532/); [Search Engine Land: query fan-out](https://searchengineland.com/guide/query-fan-out))

**How a page/passage gets selected:**
1. **Be retrievable / rank-worthy for a sub-query.** Top-10 ranking strongly correlates with citation, though its dominance is falling — one analysis cites top-10 rankers as ~76% of AIO citations mid-2025 dropping toward ~38% by early 2026, meaning a page at position 5-8 with a cleaner passage can be cited over #1. **[Observed]** ([Search Engine Journal: top-page citations drop](https://www.searchenginejournal.com/google-ai-overview-citations-from-top-ranking-pages-drop-sharply/568637/))
2. **Passage-level, not page-level, extraction.** Selection happens at the passage level; the cleanest self-contained passage matching a sub-query wins. **[Confirmed direction]** ([Search Engine Land: chunks & passages in AI Mode](https://searchengineland.com/chunks-passages-and-micro-answer-engine-optimization-wins-in-google-ai-mode-456850))
3. **Entity/Knowledge-Graph grounding + corroboration** — facts that match the KG and recur across reputable sources are favored. **[Observed]**

---

## 2. On-page structures that get lifted and cited

| Structure | Why it gets cited | Priority |
|---|---|---|
| **Passage-level "What is X" block** (2-4 self-contained sentences right under an H2) | Lifted verbatim for "what is" fan-out sub-queries | **Highest** |
| **TL;DR / key-takeaway box** in first 150-200 words | "55% of AIO citations come from the top 30% of a page"; first 150-200 words are a citation target | **Highest** |
| **FAQ blocks** (question heading + crisp answer) | Each Q maps 1:1 to a fan-out sub-query (meaning / when / benefits / who composed) | **Highest** |
| **Tables, ordered/unordered lists** | Format-rich content reported ~44% more likely to be cited than prose | High |
| **"Also known as" / alternate-name lines** | Capture spelling/transliteration variants + aid entity disambiguation | High |
| **Entity markup (`sameAs` Wikidata/Wikipedia)** | Grounds page to a KG entity → trust + corroboration; "entity clarity tells Google which top-10 result is authoritative" | High |

**[Observed] Optimal citable-passage length: ~134-167 words**, self-contained, answer-first — multiple 2025-26 studies converge here (vendor research, treat as directional). ([Wellows: AIO ranking factors](https://wellows.com/blog/google-ai-overviews-ranking-factors/); [AI Mode Boost study](https://aimodeboost.com/resources/research/ai-overview-ranking-factors-2025/))

**[Confirmed - peer reviewed] GEO levers.** The Princeton/GaTech/Allen-AI study (Aggarwal et al., KDD 2024, 9 methods × 10k queries) found the strongest visibility gains came from **adding cited sources, expert quotations, and statistics** (up to ~40% visibility lift; biggest benefit to ~position-5 pages, +115%); keyword stuffing performed poorly. For devotional content this maps directly to **quoting the source scripture and naming chapter/sarga**. ([Princeton publication](https://collaborate.princeton.edu/en/publications/geo-generative-engine-optimization/); [arXiv 2311.09735](https://arxiv.org/pdf/2311.09735))

---

## 3. Schema.org: what helps vs. dead weight (current status)

- **FAQPage** — **Rich result FULLY removed**: per Google Search Central, "As of **May 7, 2026**, FAQ rich results are no longer appearing in Google Search" (search appearance, Rich Results Test, and Search Console reporting retired in stages through Aug 2026). Markup remains **valid**; Google says it **still parses FAQ structured data to understand pages** and unused schema causes no harm. Evidence that it *aids AI citation* is **mixed**: some vendor studies claim 2.7-3.2× higher AIO citation with FAQPage, but a Dec-2024 Search Atlas study found **no correlation** between schema coverage and AI citation — the active ingredient is the clean Q&A *content*, not the tag. **Verdict: keep FAQPage as machine-readable Q&A structure; expect zero SERP rich result; do not over-invest.** **[Confirmed deprecation; Observed/mixed on AI value]** ([Google: FAQ docs](https://developers.google.com/search/docs/appearance/structured-data/faqpage); [Search Engine Land: rise & fall of FAQ schema](https://searchengineland.com/faq-schema-rise-fall-seo-today-463993); [SEJ](https://www.searchenginejournal.com/google-drops-faq-rich-results-from-search/574429/))
- **HowTo** — rich result fully deprecated (2023). Skip. ([Google 2023 changes](https://developers.google.com/search/blog/2023/08/howto-faq-changes))
- **QAPage** — still supported, but **only for user-submitted, forum-style Q&A** (one question, multiple user answers). **Wrong type for editorial FAQs** — don't substitute it for FAQPage. **[Confirmed]** ([Google QAPage docs](https://developers.google.com/search/docs/appearance/structured-data/qapage))
- **Article / CreativeWork** — core, supported, recommended. Carries author / `datePublished` / `dateModified` E-E-A-T signals. **Keep and strengthen.** ([Google Article docs](https://developers.google.com/search/docs/appearance/structured-data/article))
- **DefinedTerm / DefinedTermSet** — actively supported, **not deprecated**; no rich result but a clean semantic way to mark a definition + `alternateName`. Useful for glossary/"what is" entity grounding. **[Confirmed supported; Observed value]** ([schema.org/DefinedTerm](https://schema.org/DefinedTerm))
- **Speakable** — still **beta, news-focused, English-heavy**; no general rich result. Micro-optimization at best — skip for now. **[Confirmed limited]**
- **ClaimReview** — being scaled back as a SERP feature (part of Google's 7 retired structured-data features) and is for fact-check publishers only. **Not relevant** to devotional content. Skip. **[Confirmed deprecated as rich result]** ([WebFX: 7 schema types dropped](https://www.webfx.com/blog/seo/google-schema-updates/))

**Ship this stack:** `Article`/`CreativeWork` + `BreadcrumbList` + `FAQPage` (for parsing only) + entity `sameAs` (deity as `Person`/`Thing`, scripture as `Book`/`CreativeWork`) + optional `DefinedTerm`. Matches your existing "always-emit + entity-linked" direction.

---

## 4. Chunk / passage optimization

AI engines retrieve and cite **chunks**, not pages. A chunk is citable only when **self-contained** — it answers one question without surrounding context.

1. **One H2 = one question = one answer.** Phrase the heading as the real query ("When should you recite Hanuman Chalisa?").
2. **Front-load a standalone answer** in the first sentence, naming the entity — no "it"/"this hymn" pronouns that break when lifted: *"Aditya Hridayam is a Sanskrit hymn to the Sun god Surya that sage Agastya taught Rama in the Yuddha Kanda of Valmiki's Ramayana."*
3. **Keep the citable passage ~134-167 words [Observed]**, factual, no marketing fluff.
4. **Repeat the entity name** in each major chunk so any lifted passage is unambiguous.
5. **Include the discriminating facts** fan-out needs: source scripture + chapter/sarga, attributed sage/author, deity, recommended day/time, verse count, benefit.
6. **Server-render the critical text** (you already fixed hydration/data-leak — keep the answer text non-JS-gated so crawlers and LLMs read it).

---

## 5. Prioritized recommendations for stotra.vastucart.in

**P0 — Citable passage layer (highest ROI)**
- Top of every stotra page: a **"What is [Stotra]?"** definition block, 134-167 words, self-contained, naming deity + source scripture/chapter + attributed sage + verse count. Targets "what is aditya hridayam", "bhishma stuti meaning".
- Add a **TL;DR / Key Facts** box (deity · scripture source · best day & time · number of verses · primary benefit) — quotable, parse-friendly, in the top 150-200 words.

**P0 — Question-shaped FAQs mapped to fan-out sub-queries**
- 5-7 standardized FAQs per stotra phrased as real queries: *meaning · when/what time to recite · benefits · who composed it · how many times · which day*. Crisp 40-80-word answers, answer in the first sentence. Wrap in `FAQPage` JSON-LD for AI parsing (no SERP star expected). Directly targets "when to recite hanuman chalisa".

**P1 — Entity grounding**
- `sameAs` to **Wikidata + Wikipedia** for the **deity** and the **source scripture** (and the stotra where an entity exists). Add an **"Also known as"** line listing transliteration/spelling variants (Hridayam/Hrudayam, Stuti/Stotram, Devanagari + IAST) to capture variant fan-out queries.

**P1 — Structured verse data**
- A **verse table** per stotra (verse no. → Sanskrit → transliteration → translation). Tables are heavily lifted for "[stotra] meaning" and enable line-level citation.

**P2 — Authority / corroboration (slower, durable)**
- Strengthen `Article` author + reviewer + `dateModified` (your "last reviewed" date is a good start; ~85% of AIO citations are from content < 3 years old, so visible freshness matters). **Quote and name the primary scripture for every factual claim** — corroboration is what flips a page from "ranked" to "cited" (Princeton GEO finding).
- Earn a few authoritative inbound mentions; keep entity naming consistent across the VastuCart ecosystem.

**P2 — Multi-engine reach**
- Maintain `llms.txt` / clean AI-crawler access (already in progress). GEO levers (quotes, named sources, stats) lift citation share on ChatGPT/Perplexity too.

**Measurement:** Google does not expose AI-Mode citation data in GSC **[Confirmed gap]**. Manually track AIO/AI-Mode citations for ~10 head stotras (Hanuman Chalisa, Aditya Hridayam, Bhishma Stuti…) and watch GSC impressions; expect measurable movement in ~90 days per vendor benchmarks.

---

### Key sources
- Google AI Mode update / query fan-out — https://blog.google/products-and-platforms/products/search/google-search-ai-mode-update/
- AI Mode US rollout (May 20 2025) — https://techcrunch.com/2025/05/20/googles-ai-mode-rolls-out-to-us-will-add-support-for-deeper-research-comparison-shopping-and-more/
- Query fan-out, details from Google — https://www.searchenginejournal.com/query-fan-out-technique-in-ai-mode-new-details-from-google/552532/
- Query fan-out guide — https://searchengineland.com/guide/query-fan-out
- Chunks/passages in AI Mode — https://searchengineland.com/chunks-passages-and-micro-answer-engine-optimization-wins-in-google-ai-mode-456850
- Top-page AIO citations dropping — https://www.searchenginejournal.com/google-ai-overview-citations-from-top-ranking-pages-drop-sharply/568637/
- FAQ rich-result removal (Google docs) — https://developers.google.com/search/docs/appearance/structured-data/faqpage
- Rise & fall of FAQ schema — https://searchengineland.com/faq-schema-rise-fall-seo-today-463993
- HowTo/FAQ 2023 changes — https://developers.google.com/search/blog/2023/08/howto-faq-changes
- QAPage docs — https://developers.google.com/search/docs/appearance/structured-data/qapage
- Article structured data — https://developers.google.com/search/docs/appearance/structured-data/article
- DefinedTerm — https://schema.org/DefinedTerm
- Google retiring 7 structured-data features — https://www.webfx.com/blog/seo/google-schema-updates/
- Princeton GEO study — https://collaborate.princeton.edu/en/publications/geo-generative-engine-optimization/ · https://arxiv.org/pdf/2311.09735
- AIO ranking factors / passage length — https://wellows.com/blog/google-ai-overviews-ranking-factors/ · https://aimodeboost.com/resources/research/ai-overview-ranking-factors-2025/
