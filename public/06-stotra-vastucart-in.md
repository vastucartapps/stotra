# 06 — stotra.vastucart.in (Stotra) — CONSOLIDATED SINGLE-GO ROLLOUT

**Rollout mode:** Single consolidated deployment. Bundle discipline in §5.8 of `00-shared-contracts.md` is explicitly waived for this subdomain per owner decision dated 2026-04-19. All entity, content-type, architecture, and indexing changes ship in ONE coordinated PR, with commit-level granularity for rollback, feature-flagged schema emission, and staging verification before merge. This subdomain-level exception does not modify §5.8 for other subdomains.

**Terminal scope:** Next.js project serving `https://stotra.vastucart.in/`
**Codebase root:** this project's repo only
**Prerequisite:** Read `00-shared-contracts.md` first. All §5.1 (content-schema coupling), §5.3 (JSON-LD injection), §5.4 (i18n canonical), §5.5 (module structure), §5.6 (CI validation), §5.10 (property legality), §5.11 (Brand reverse flow) remain binding.

---

## Out of Scope (DO NOT TOUCH)

- Any file outside this project's repo
- Organization, Person, Concept canonical declarations (owned by vastucart.in and blog.vastucart.in)
- Cross-subdomain codebases

## Canonical Ownership

This project owns:
- `https://stotra.vastucart.in/#website`
- `https://stotra.vastucart.in/#brand`
- Every `https://stotra.vastucart.in/stotra/{slug}#webpage` (the HTML page about the stotra)
- Every `https://stotra.vastucart.in/stotra/{slug}#work` (the ancient stotra text as a distinct CreativeWork)
- Every `https://stotra.vastucart.in/deity/{slug}#page` (32 deity collection pages)
- Every `https://stotra.vastucart.in/deity/{slug}#deity` (the deity Thing node, per-page)
- `https://stotra.vastucart.in/gita#book` (Bhagavad Gita as Book)
- Every `https://stotra.vastucart.in/gita/chapter-{n}#chapter` (18 chapters)
- Every `https://stotra.vastucart.in/gita/chapter-{n}/verse-{m}#verse` (individual verse CreativeWork nodes)
- Every `https://stotra.vastucart.in/vrat-katha/{slug}#webpage`
- Every `https://stotra.vastucart.in/vrat-katha/{slug}#recipe` (conditional on samagri+steps presence)
- Every `https://stotra.vastucart.in/purpose/{slug}#page`
- Every `https://stotra.vastucart.in/day/{slug}#page`
- Every `https://stotra.vastucart.in/festival/{slug}#page`

---

## Rollout Discipline (enterprise single-go)

1. Branch `ship/consolidated-2026-04` from `main`.
2. One commit per logical section below (for rollback granularity). Use prefixes per §5.7 (`[schema/...]`, `[content/...]`, `[infra/...]`).
3. Schema emission gated behind env var `NEXT_PUBLIC_SCHEMA_ENABLED` (default `true`), so any single type can be disabled without revert.
4. Pre-merge on staging URL: validator.schema.org = 0 errors and 0 warnings on 10 sampled URLs (homepage, 3 stotras, 1 Gita chapter, 1 Gita verse, 1 deity hub, 1 purpose hub, 1 vrat katha, 1 festival hub); Google Rich Results Test shows eligibility for FAQ, Breadcrumb, Book (Gita), Recipe (vrat with samagri); Lighthouse SEO score does not drop.
5. Merge to `main`; Coolify auto-deploy to production.
6. Post-deploy: three-checkpoint stack per `00-shared-contracts.md` §5.9, extended to 20 sampled URLs. Log final SHA in `soak-log.md`.
7. No 48-hour gated soak between sub-sections. A single 48-hour post-deploy observation window applies to the whole PR for GSC error monitoring.

---

## FORBIDDEN ENTITIES AND PROPERTIES (enforced globally on this subdomain)

The following must NEVER be emitted on any page of stotra.vastucart.in:

1. **Any `Person` entity representing "Acharya Pushyadant Mishra"** (fabricated persona, no scholarly provenance). Any existing reference is to be removed.
2. **Any `Person` entity** other than `@id` references to the two canonical Persons in `00-shared-contracts.md` §2.2, plus traditional ancient authors (Tulsidas, Adi Shankaracharya, Valmiki, Vyasa, etc.) as inline Person nodes on the `#work` CreativeWork for the ancient text. Ancient-author Person nodes contain only `name` and optional `sameAs` to Wikipedia/Wikidata — no credentials, no birth years, no institutional affiliations.
3. **`AggregateRating`** on any node, anywhere. No real review corpus exists. Do not stub.
4. **`Review`** on any node. Same reason.
5. **`Product` or `Offer`** on free stotra pages. These are devotional texts, not merchandise.
6. **`HowTo`** on any stotra or chalisa page. Scripture is not an instructional procedure; HowTo is the wrong type and a known spam pattern on devotional sites.
7. **`Course` or `CourseInstance`** on scripture or Gita chapters. These are not courses.
8. **`Brand.parentOrganization`** — invalid property on Brand (Intangible). The reverse relationship is emitted by the canonical Organization on vastucart.in per `00-shared-contracts.md` §5.11.
9. **`author` on a `Brand` node** — invalid.
10. **Any schema with inflated or synthetic counts** (e.g., "1000+ stotras" when actual is 928). Numbers must match the database.

---

# SECTION 1 — Entity Foundation

## 1.1 WebSite + Brand

**File:** `lib/schema/website.ts`

```ts
export function buildStotraWebsiteSchema(): object {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://stotra.vastucart.in/#website",
        "url": "https://stotra.vastucart.in/",
        "name": "Stotra by VastuCart",
        "description": "Collection of Hindu stotras, chalisas, the Bhagavad Gita (18 chapters, 701 verses per Gita Press edition), and Vrat Katha in Sanskrit and Hindi with transliteration and meaning.",
        "inLanguage": ["sa", "hi", "en"],
        "publisher": { "@id": "https://www.vastucart.in/#organization" },
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://stotra.vastucart.in/search?q={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Brand",
        "@id": "https://stotra.vastucart.in/#brand",
        "name": "Stotra",
        "logo": "https://www.vastucart.in/logo.png",
        "slogan": "Divinely Perfect"
      }
    ]
  };
}
```

**Description copy rule:** when database count crosses 1,000 stotras, update the description in this module to read "Collection of 1,000+ Hindu stotras…" — not before. Do not precede the real count.

Inject on homepage (`app/page.tsx`) only. WebSite schema is scoped to homepage per §5.3 convention.

---

# SECTION 2 — Content-Type Schemas

## 2.1 Stotra Page (per stotra) — TWO-NODE PATTERN

The single most important correction vs. prior spec: the webpage and the ancient text are two separate CreativeWork nodes with two separate `@id`s and two separate authors.

- **`#webpage` node** = the Next.js HTML page about the stotra. `@type: Article`. Author = VastuCart Editorial (reference via `@id` to blog.vastucart.in Person). Publisher = vastucart.in Organization.
- **`#work` node** = the ancient stotra text itself. `@type: CreativeWork`. Author = traditional author if known (Tulsidas, Adi Shankaracharya, Valmiki, Vyasa) as an inline Person node with only `name` + optional `sameAs`. When the author is uncertain or anonymous, omit the `author` property entirely — do NOT write "Traditional" or "Unknown" as a Person name.

**File:** `lib/schema/creativeWork.ts`

```ts
interface StotraData {
  slug: string;
  name: string;                   // "Hanuman Chalisa"
  devanagariName: string;         // "हनुमान चालीसा"
  description: string;            // factual, no outcome promises
  verseCount: number;
  readingTimeMinutes: number;
  deitySlug: string;              // "hanuman"
  deityName: string;              // "Hanuman"
  deityWikipediaUrl?: string;     // optional — only if verified
  deityWikidataUrl?: string;      // optional — only if verified
  traditionalAuthor?: string;     // "Tulsidas", "Adi Shankaracharya", "Valmiki". Omit if unknown.
  traditionalAuthorWikipediaUrl?: string;  // optional, verified only
  traditionalAuthorWikidataUrl?: string;   // optional, verified only
  classicalSource?: string;       // e.g. "Standalone composition in Awadhi, c. 16th century"
                                  // For Hanuman Chalisa: "Standalone composition by Tulsidas in Awadhi"
                                  // NOT "Ramcharitmanas" — Hanuman Chalisa is not part of Ramcharitmanas
  classicalSourceIsBasedOnUrl?: string;  // only when pointing to a real source text node
  language: 'sa' | 'hi' | 'sa-hi';
  hasPdf: boolean;
  pdfUrl?: string;
  hasAudio: boolean;
  audioUrl?: string;
  audioDurationSeconds?: number;
  purposeTags: string[];
  publishedAt: string;            // ISO 8601
  updatedAt: string;              // ISO 8601
  faqs?: Array<{ question: string; answer: string }>;  // only if DOM-visible
}

export function buildStotraPageGraph(stotra: StotraData): object | null {
  if (!stotra.name || stotra.verseCount < 1) return null;

  const pageId = `https://stotra.vastucart.in/stotra/${stotra.slug}#webpage`;
  const workId = `https://stotra.vastucart.in/stotra/${stotra.slug}#work`;
  const breadcrumbId = `https://stotra.vastucart.in/stotra/${stotra.slug}#breadcrumb`;

  const graph: any[] = [];

  // The webpage node (Article)
  graph.push({
    "@type": "Article",
    "@id": pageId,
    "url": `https://stotra.vastucart.in/stotra/${stotra.slug}`,
    "mainEntityOfPage": pageId,
    "headline": `${stotra.name} — ${stotra.devanagariName}`,
    "description": stotra.description,
    "inLanguage": "en",
    "isPartOf": { "@id": "https://stotra.vastucart.in/#website" },
    "about": { "@id": workId },
    "author": { "@id": "https://blog.vastucart.in/authors/vastucart-editorial#person" },
    "publisher": { "@id": "https://www.vastucart.in/#organization" },
    "datePublished": stotra.publishedAt,
    "dateModified": stotra.updatedAt,
    "breadcrumb": { "@id": breadcrumbId }
  });

  // The ancient stotra text node (CreativeWork)
  const workNode: any = {
    "@type": "CreativeWork",
    "@id": workId,
    "name": stotra.name,
    "alternateName": stotra.devanagariName,
    "inLanguage": ["sa", "hi"],
    "genre": "Hindu devotional hymn",
    "about": { "@id": `https://www.vastucart.in/concepts/${stotra.deitySlug}#entity` }
  };

  if (stotra.traditionalAuthor) {
    const authorNode: any = {
      "@type": "Person",
      "name": stotra.traditionalAuthor
    };
    const sameAs: string[] = [];
    if (stotra.traditionalAuthorWikipediaUrl) sameAs.push(stotra.traditionalAuthorWikipediaUrl);
    if (stotra.traditionalAuthorWikidataUrl) sameAs.push(stotra.traditionalAuthorWikidataUrl);
    if (sameAs.length) authorNode.sameAs = sameAs;
    workNode.author = authorNode;
  }

  if (stotra.classicalSource) {
    workNode.isBasedOn = { "@type": "CreativeWork", "name": stotra.classicalSource };
  }

  // PDF encoding — only when a real PDF URL exists
  if (stotra.hasPdf && stotra.pdfUrl) {
    workNode.encoding = [{
      "@type": "MediaObject",
      "contentUrl": stotra.pdfUrl,
      "encodingFormat": "application/pdf"
    }];
  }

  graph.push(workNode);

  // Breadcrumb
  graph.push({
    "@type": "BreadcrumbList",
    "@id": breadcrumbId,
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://stotra.vastucart.in/" },
      { "@type": "ListItem", "position": 2, "name": stotra.deityName, "item": `https://stotra.vastucart.in/deity/${stotra.deitySlug}` },
      { "@type": "ListItem", "position": 3, "name": stotra.name }
    ]
  });

  return { "@context": "https://schema.org", "@graph": graph };
}
```

**Inject at:** `app/stotra/[slug]/page.tsx`

## 2.2 FAQPage (conditional on DOM-visible answers)

**Critical rule:** FAQPage schema is emitted ONLY if the answer text is present in initial server-rendered HTML. Accordion UIs that hydrate the answer into the DOM on expand DO NOT qualify. Either render answers as always-visible prose, or as `<details>/<summary>` HTML (which is SSR and crawlable), or skip the schema.

**File:** `lib/schema/faqPage.ts`

```ts
export function buildFaqPageSchema(
  faqs: Array<{ question: string; answer: string }>,
  pageUrl: string
): object | null {
  if (!faqs?.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    "mainEntity": faqs.map(f => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": { "@type": "Answer", "text": f.answer }
    }))
  };
}
```

**Consumer requirement:** the page component that calls this MUST also render the same Q&A pairs in visible HTML. No schema-only FAQ.

## 2.3 AudioObject + PodcastEpisode (conditional — skip if no real audio)

Keep the existing design from prior spec: emit both only when `hasAudio && audioUrl && audioDurationSeconds > 0`. Fake-audio or placeholder-duration emission is a hard prohibition.

**File:** `lib/schema/audio.ts`

```ts
export function buildStotraAudioGraph(stotra: StotraData): object | null {
  if (!stotra.hasAudio || !stotra.audioUrl || !stotra.audioDurationSeconds) return null;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AudioObject",
        "@id": `https://stotra.vastucart.in/stotra/${stotra.slug}#audio`,
        "name": `${stotra.name} (audio recitation)`,
        "contentUrl": stotra.audioUrl,
        "duration": `PT${stotra.audioDurationSeconds}S`,
        "encodingFormat": "audio/mpeg",
        "inLanguage": stotra.language,
        "isPartOf": { "@id": `https://stotra.vastucart.in/stotra/${stotra.slug}#work` }
      },
      {
        "@type": "PodcastEpisode",
        "@id": `https://stotra.vastucart.in/stotra/${stotra.slug}#podcast`,
        "name": stotra.name,
        "url": `https://stotra.vastucart.in/stotra/${stotra.slug}`,
        "datePublished": stotra.publishedAt,
        "duration": `PT${stotra.audioDurationSeconds}S`,
        "associatedMedia": { "@id": `https://stotra.vastucart.in/stotra/${stotra.slug}#audio` },
        "partOfSeries": {
          "@type": "PodcastSeries",
          "@id": "https://stotra.vastucart.in/podcast#series",
          "name": "VastuCart Stotra Recitations",
          "url": "https://stotra.vastucart.in/podcast"
        }
      }
    ]
  };
}
```

If any stotras have real audio, build `/podcast` with PodcastSeries schema listing all episodes. If zero stotras have audio today, do NOT build the podcast hub and do NOT emit PodcastSeries anywhere.

## 2.4 Deity CollectionPage + Deity Thing (with verified sameAs)

The deity hub page emits two nodes: the CollectionPage (about the hub itself) and a `Thing` for the deity identified via Wikipedia + Wikidata `sameAs`.

**File:** `lib/schema/collectionPage.ts`

```ts
interface DeityData {
  slug: string;                   // "hanuman"
  name: string;                   // "Hanuman"
  devanagariName: string;         // "हनुमान"
  description: string;
  wikipediaUrl?: string;          // REQUIRED for sameAs emission; verify URL resolves before setting
  wikidataUrl?: string;           // REQUIRED for sameAs emission; verify URL resolves before setting
  stotras: Array<{ slug: string; name: string }>;
}

export function buildDeityPageGraph(deity: DeityData): object | null {
  if (deity.stotras.length === 0) return null;

  const pageId = `https://stotra.vastucart.in/deity/${deity.slug}#page`;
  const deityId = `https://stotra.vastucart.in/deity/${deity.slug}#deity`;
  const breadcrumbId = `https://stotra.vastucart.in/deity/${deity.slug}#breadcrumb`;

  const deityNode: any = {
    "@type": "Thing",
    "@id": deityId,
    "name": deity.name,
    "alternateName": deity.devanagariName,
    "description": deity.description
  };
  const sameAs: string[] = [];
  if (deity.wikipediaUrl) sameAs.push(deity.wikipediaUrl);
  if (deity.wikidataUrl) sameAs.push(deity.wikidataUrl);
  if (sameAs.length) deityNode.sameAs = sameAs;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": pageId,
        "url": `https://stotra.vastucart.in/deity/${deity.slug}`,
        "name": `${deity.name} Stotras`,
        "description": deity.description,
        "isPartOf": { "@id": "https://stotra.vastucart.in/#website" },
        "about": { "@id": deityId },
        "mainEntity": {
          "@type": "ItemList",
          "numberOfItems": deity.stotras.length,
          "itemListElement": deity.stotras.map((s, i) => ({
            "@type": "ListItem",
            "position": i + 1,
            "name": s.name,
            "url": `https://stotra.vastucart.in/stotra/${s.slug}`
          }))
        },
        "breadcrumb": { "@id": breadcrumbId }
      },
      deityNode,
      {
        "@type": "BreadcrumbList",
        "@id": breadcrumbId,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://stotra.vastucart.in/" },
          { "@type": "ListItem", "position": 2, "name": "Deities", "item": "https://stotra.vastucart.in/deity" },
          { "@type": "ListItem", "position": 3, "name": deity.name }
        ]
      }
    ]
  };
}
```

**Deity `sameAs` verification rule:** Wikipedia URL and Wikidata URL are populated per deity from the data source. Each URL MUST resolve (HTTP 200) before being included. Do not guess Q-numbers. Use Wikipedia's sidebar "Wikidata item" link to fetch the Q-id, and verify the Wikipedia page exists at the English URL. Starting set — the implementer verifies each before enabling:

| Slug | English Wikipedia (verify) | Wikidata (verify) |
|---|---|---|
| ganesha | https://en.wikipedia.org/wiki/Ganesha | https://www.wikidata.org/wiki/Q41428 |
| shiva | https://en.wikipedia.org/wiki/Shiva | https://www.wikidata.org/wiki/Q11378 |
| vishnu | https://en.wikipedia.org/wiki/Vishnu | https://www.wikidata.org/wiki/Q9598 |
| hanuman | https://en.wikipedia.org/wiki/Hanuman | https://www.wikidata.org/wiki/Q207177 |
| lakshmi | https://en.wikipedia.org/wiki/Lakshmi | https://www.wikidata.org/wiki/Q188685 |
| durga | https://en.wikipedia.org/wiki/Durga | https://www.wikidata.org/wiki/Q181018 |
| krishna | https://en.wikipedia.org/wiki/Krishna | https://www.wikidata.org/wiki/Q9441 |
| rama | https://en.wikipedia.org/wiki/Rama | https://www.wikidata.org/wiki/Q9550 |
| saraswati | https://en.wikipedia.org/wiki/Saraswati | https://www.wikidata.org/wiki/Q177856 |
| surya | https://en.wikipedia.org/wiki/Surya | (verify Q-id on Wikipedia page) |
| shani | https://en.wikipedia.org/wiki/Shani | (verify Q-id — Shani deity is distinct from Saturn planet Q193) |
| navagraha | https://en.wikipedia.org/wiki/Navagraha | (verify) |
| dattatreya | https://en.wikipedia.org/wiki/Dattatreya | (verify) |
| kartikeya | https://en.wikipedia.org/wiki/Kartikeya | (verify) |
| kali | https://en.wikipedia.org/wiki/Kali | (verify) |
| narasimha | https://en.wikipedia.org/wiki/Narasimha | (verify) |
| radha | https://en.wikipedia.org/wiki/Radha | (verify) |
| parvati | https://en.wikipedia.org/wiki/Parvati | (verify) |
| sita | https://en.wikipedia.org/wiki/Sita | (verify) |
| bhairava | https://en.wikipedia.org/wiki/Bhairava | (verify) |
| ayyappa | https://en.wikipedia.org/wiki/Ayyappan | (verify) |
| jagannath | https://en.wikipedia.org/wiki/Jagannath | (verify) |
| kubera | https://en.wikipedia.org/wiki/Kubera | (verify) |
| dhanvantari | https://en.wikipedia.org/wiki/Dhanvantari | (verify) |
| gayatri | https://en.wikipedia.org/wiki/Gayatri | (verify) |
| ganga | https://en.wikipedia.org/wiki/Ganga_in_Hinduism | (verify) |
| vitthal | https://en.wikipedia.org/wiki/Vithoba | (verify) |
| brahma | https://en.wikipedia.org/wiki/Brahma | (verify) |
| agni | https://en.wikipedia.org/wiki/Agni | (verify) |
| indra | https://en.wikipedia.org/wiki/Indra | (verify) |
| vayu | https://en.wikipedia.org/wiki/Vayu | (verify) |
| saibaba | https://en.wikipedia.org/wiki/Sai_Baba_of_Shirdi | (verify) |

**Persist the deity metadata** (slug, name, devanagariName, wikipediaUrl, wikidataUrl, short description) in a content file `data/deities.json` so both the deity page and any future cross-subdomain reference (e.g., blog, panchang) can consume the same verified URIs.

## 2.5 Bhagavad Gita — Book + Chapter + Verse

**Canonical verse count decision:** the site follows the Gita Press (Gorakhpur) edition, which counts 701 verses (chapter 13 has an extra opening verse in this edition). Display "701 verses" in UI and schema, with an explanatory note on the `/gita` page and the `/gita/chapter-13` page: "This edition follows the Gita Press enumeration. The Adi Shankara commentary tradition counts 700 verses, combining or omitting verse 13.0."

Schema does NOT use `numberOfPages` (wrong property — `numberOfPages` = printed page count of a physical book). Use `hasPart` to express the 18 chapters and verse-level child nodes.

**File:** `lib/schema/book.ts`

```ts
interface ChapterData {
  number: number;                 // 1..18
  name: string;                   // "Arjuna Vishada Yoga — The Yoga of Arjuna's Despondency"
  devanagariName: string;         // "अर्जुनविषादयोगः"
  verses: Array<{ number: number }>;  // length equals the actual verse count per Gita Press
}

export function buildGitaBookSchema(chapters: ChapterData[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "Book",
    "@id": "https://stotra.vastucart.in/gita#book",
    "name": "Bhagavad Gita",
    "alternateName": "श्रीमद्भगवद्गीता",
    "url": "https://stotra.vastucart.in/gita",
    "inLanguage": ["sa", "hi", "en"],
    "genre": "Hindu scripture",
    "bookFormat": "https://schema.org/EBook",
    "isPartOf": { "@id": "https://stotra.vastucart.in/#website" },
    "publisher": { "@id": "https://www.vastucart.in/#organization" },
    "author": {
      "@type": "Person",
      "name": "Vyasa",
      "sameAs": ["https://en.wikipedia.org/wiki/Vyasa", "https://www.wikidata.org/wiki/Q193563"]
    },
    "about": { "@id": "https://www.vastucart.in/concepts/bhagavad-gita#entity" },
    "hasPart": chapters.map(c => ({
      "@id": `https://stotra.vastucart.in/gita/chapter-${c.number}#chapter`
    }))
  };
}

export function buildGitaChapterGraph(chapter: ChapterData): object {
  const chapterId = `https://stotra.vastucart.in/gita/chapter-${chapter.number}#chapter`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Chapter",
        "@id": chapterId,
        "name": chapter.name,
        "alternateName": chapter.devanagariName,
        "url": `https://stotra.vastucart.in/gita/chapter-${chapter.number}`,
        "position": chapter.number,
        "isPartOf": { "@id": "https://stotra.vastucart.in/gita#book" },
        "hasPart": chapter.verses.map(v => ({
          "@id": `https://stotra.vastucart.in/gita/chapter-${chapter.number}/verse-${v.number}#verse`
        }))
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${chapterId}-breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://stotra.vastucart.in/" },
          { "@type": "ListItem", "position": 2, "name": "Bhagavad Gita", "item": "https://stotra.vastucart.in/gita" },
          { "@type": "ListItem", "position": 3, "name": chapter.name }
        ]
      }
    ]
  };
}

interface VerseData {
  chapterNumber: number;
  verseNumber: number;
  devanagari: string;
  transliteration: string;
  hindiMeaning: string;
  englishMeaning: string;
  commentary?: string;
}

export function buildGitaVerseGraph(verse: VerseData): object {
  const verseId = `https://stotra.vastucart.in/gita/chapter-${verse.chapterNumber}/verse-${verse.verseNumber}#verse`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": verseId,
        "name": `Bhagavad Gita Chapter ${verse.chapterNumber}, Verse ${verse.verseNumber}`,
        "url": `https://stotra.vastucart.in/gita/chapter-${verse.chapterNumber}/verse-${verse.verseNumber}`,
        "inLanguage": ["sa", "hi", "en"],
        "isPartOf": { "@id": `https://stotra.vastucart.in/gita/chapter-${verse.chapterNumber}#chapter` },
        "position": verse.verseNumber,
        "publisher": { "@id": "https://www.vastucart.in/#organization" }
      },
      {
        "@type": "Article",
        "@id": `${verseId}-page`,
        "url": `https://stotra.vastucart.in/gita/chapter-${verse.chapterNumber}/verse-${verse.verseNumber}`,
        "mainEntityOfPage": `${verseId}-page`,
        "headline": `Bhagavad Gita ${verse.chapterNumber}.${verse.verseNumber} — Sanskrit, Transliteration, Hindi and English Meaning`,
        "about": { "@id": verseId },
        "isPartOf": { "@id": "https://stotra.vastucart.in/#website" },
        "author": { "@id": "https://blog.vastucart.in/authors/vastucart-editorial#person" },
        "publisher": { "@id": "https://www.vastucart.in/#organization" }
      }
    ]
  };
}
```

## 2.6 Vrat Katha — Recipe + WebPage wrapper (conditional)

Recipe is CreativeWork-legal, so it can hold `about`/`isPartOf`. However, vrat kathas are stories with optional ritual procedures. Emit Recipe ONLY if `samagri.length > 0 && steps.length > 0 && totalDurationHours > 0`. When conditions not met, the page renders as a plain Article with BreadcrumbList — no Recipe.

**File:** `lib/schema/recipe.ts`

```ts
interface VratKathaData {
  slug: string;
  name: string;
  vratType: string;                 // "Ekadashi", "Shanivar", "Ahoi Ashtami"
  totalDurationHours?: number;
  samagri?: string[];
  steps?: string[];
  description: string;
  publishedAt: string;
  updatedAt: string;
}

export function buildVratKathaGraph(vrat: VratKathaData): object {
  const webpageId = `https://stotra.vastucart.in/vrat-katha/${vrat.slug}#webpage`;
  const recipeId = `https://stotra.vastucart.in/vrat-katha/${vrat.slug}#recipe`;

  const graph: any[] = [
    {
      "@type": "Article",
      "@id": webpageId,
      "url": `https://stotra.vastucart.in/vrat-katha/${vrat.slug}`,
      "mainEntityOfPage": webpageId,
      "headline": vrat.name,
      "description": vrat.description,
      "isPartOf": { "@id": "https://stotra.vastucart.in/#website" },
      "author": { "@id": "https://blog.vastucart.in/authors/vastucart-editorial#person" },
      "publisher": { "@id": "https://www.vastucart.in/#organization" },
      "datePublished": vrat.publishedAt,
      "dateModified": vrat.updatedAt
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${webpageId}-breadcrumb`,
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://stotra.vastucart.in/" },
        { "@type": "ListItem", "position": 2, "name": "Vrat Katha", "item": "https://stotra.vastucart.in/vrat-katha" },
        { "@type": "ListItem", "position": 3, "name": vrat.name }
      ]
    }
  ];

  if (vrat.samagri?.length && vrat.steps?.length && vrat.totalDurationHours) {
    graph.push({
      "@type": "Recipe",
      "@id": recipeId,
      "name": vrat.name,
      "url": `https://stotra.vastucart.in/vrat-katha/${vrat.slug}`,
      "recipeCategory": `${vrat.vratType} Vrat`,
      "recipeCuisine": "Hindu ritual",
      "recipeIngredient": vrat.samagri,
      "recipeInstructions": vrat.steps.map((s, i) => ({
        "@type": "HowToStep",
        "position": i + 1,
        "text": s
      })),
      "totalTime": `PT${vrat.totalDurationHours}H`,
      "datePublished": vrat.publishedAt,
      "dateModified": vrat.updatedAt,
      "author": { "@id": "https://blog.vastucart.in/authors/vastucart-editorial#person" },
      "publisher": { "@id": "https://www.vastucart.in/#organization" }
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}
```

## 2.7 Purpose / Day / Festival Collection Pages

All three follow the same CollectionPage + ItemList pattern as deity, minus the Thing node (purpose/day/festival are not entities with Wikipedia pages). Break down:

- `/purpose/{slug}` — 27 purposes (protection, wealth, health, etc.)
- `/day/{slug}` — 7 weekdays
- `/festival/{slug}` — festival pages

**File:** `lib/schema/taxonomyPage.ts`

```ts
interface TaxonomyPageData {
  kind: 'purpose' | 'day' | 'festival';
  slug: string;
  name: string;                 // "Protection", "Tuesday", "Diwali"
  devanagariOrHindi?: string;   // "सुरक्षा", "मंगलवार", "दीपावली"
  description: string;
  stotras: Array<{ slug: string; name: string }>;
}

export function buildTaxonomyPageGraph(data: TaxonomyPageData): object | null {
  if (data.stotras.length === 0) return null;

  const pageId = `https://stotra.vastucart.in/${data.kind}/${data.slug}#page`;
  const path = `/${data.kind}/${data.slug}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": pageId,
        "url": `https://stotra.vastucart.in${path}`,
        "name": data.name,
        "description": data.description,
        "isPartOf": { "@id": "https://stotra.vastucart.in/#website" },
        "mainEntity": {
          "@type": "ItemList",
          "numberOfItems": data.stotras.length,
          "itemListElement": data.stotras.map((s, i) => ({
            "@type": "ListItem",
            "position": i + 1,
            "name": s.name,
            "url": `https://stotra.vastucart.in/stotra/${s.slug}`
          }))
        }
      }
    ]
  };
}
```

## 2.8 BreadcrumbList

Emitted inline as part of every page graph (see 2.1, 2.4, 2.5, 2.6). No separate module — breadcrumbs are always page-scoped.

---

# SECTION 3 — Architecture & Internal Linking

## 3.1 Cross-Cluster `mentions` (only on CreativeWork-legal types)

Per `00-shared-contracts.md` §5.10, `mentions` is valid on CreativeWork and subtypes. The stotra `#work` node MAY emit `mentions` to related concept entities — but ONLY if the relationship is accurate and narrow.

**Rule:** a stotra `mentions` a concept entity if and only if the stotra text explicitly invokes or addresses that concept. Examples:
- Shani Sahasranama `mentions` `https://www.vastucart.in/concepts/shani#entity` (concept of the graha)
- Shani Sahasranama does NOT `mentions` `https://www.vastucart.in/concepts/mangala#entity` just because they're both grahas
- Mangal Dosh Nivaran Stotram `mentions` both `mangal-dosha` (the concept) and `mangala` (the graha)

Do NOT bulk-link every stotra to every planet/sign. That is the spam pattern §5.1 exists to prevent.

## 3.2 Ecosystem link pruning on stotra detail pages

The current layout emits the VastuCart Ecosystem block (Store / Kundali / Panchang / Horoscope / Tarot / Blog / Muhurta / Wedding) at least three times per stotra detail page. This dilutes topical focus.

**New rule for stotra detail pages only** (`app/stotra/[slug]/page.tsx`):
- Footer ecosystem block: keep
- Mid-page ecosystem block: remove
- Top ribbon ecosystem block: keep but condense
- "Related Stotras" section: keep
- Contextual cross-subdomain links (e.g., Kundali for a Shani stotra, Store for a Rudraksha-related stotra): allowed, 1–2 per page max, contextually relevant only

Homepage, deity hubs, and `/gita` retain the full ecosystem block.

## 3.3 "About This Stotra" extractable paragraph

Every stotra detail page must render a 50–100 word "About this Stotra" paragraph in plain, visible HTML above the text. Factual, cite-ready, LLM-extractable. Contents: traditional author (or "anonymous composition in the Parasari tradition" if unknown — never invent), approximate century, source text, primary deity, traditional purpose, verse count.

Example for Hanuman Chalisa:

> The Hanuman Chalisa is a forty-verse devotional hymn to Hanuman, composed by Goswami Tulsidas in Awadhi in the late 16th century. It stands as a standalone composition, distinct from Tulsidas's longer Ramcharitmanas. The full recitation spans 43 verse-units (2 opening dohas, 40 chaupais, 1 closing doha) and is traditionally recited on Tuesdays, Saturdays, and during Hanuman Jayanti in the Hanuman upasana tradition.

This paragraph is the body Google SGE, ChatGPT browse, and Perplexity will quote when citing the page. Factual density is the point. Do not include benefit promises here.

## 3.4 Podcast Hub (conditional)

Build `/podcast` only if at least one stotra has real audio. If zero, leave un-built; the route returns 404 or redirects to `/stotra`. No placeholder page.

---

# SECTION 4 — Indexing and Distribution

## 4.1 Sitemap structure

Sitemap index at `/sitemap.xml`, pointing to child sitemaps split by content type:
- `/sitemap-stotras.xml` (all `/stotra/{slug}` URLs with per-stotra `<lastmod>`)
- `/sitemap-gita.xml` (`/gita` + 18 chapters + 701 verse pages)
- `/sitemap-taxonomies.xml` (32 deity + 27 purpose + 7 day + all festival pages)
- `/sitemap-vrat.xml` (all vrat katha pages)
- `/sitemap-static.xml` (homepage, `/deity`, `/gita`, `/vrat-katha`, `/today`, `/search`, `/about-translations`, `/privacy-policy`, `/terms`, `/disclaimer`)

Every URL includes `<lastmod>` from the database `updatedAt` field. `<changefreq>` and `<priority>` are optional and de-emphasized — Google mostly ignores them.

When Hindi localization ships later, each URL entry gains paired `<xhtml:link rel="alternate" hreflang="...">` entries per §5.4. Until Hindi ships, sitemap emits English URLs only and no hreflang alternates.

## 4.2 robots.txt

```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /search
Disallow: /*?*

Sitemap: https://stotra.vastucart.in/sitemap.xml
```

The `/*?*` disallow prevents parameter-based crawl traps. Confirm no legitimate internal navigation uses query params before enabling.

## 4.3 IndexNow on publish

Ping IndexNow (Bing + Yandex, soon potentially Google) whenever a new stotra is published or an existing stotra's audio, PDF, or meaning is updated. `INDEXNOW_KEY` env var set in Coolify. If key is missing, skip the ping and log — do not fail the publish.

## 4.4 RSS Feeds

- `/feed/stotras.xml` — recently added or updated stotras (last 100)
- `/feed/gita.xml` — Gita verse-of-the-day feed
- `/feed/podcast.xml` — Apple Podcasts-compatible RSS, conditional on real audio

Podcast feed must validate against Apple Podcasts spec before submission to directories.

---

# SECTION 5 — Validation and Acceptance

## 5.1 CI schema validation

Follow `00-shared-contracts.md` §5.6. Every PR must pass:
- `schema-dts` TypeScript type checks (compile time)
- `structured-data-testing-tool` runtime validation against sampled routes
- Lighthouse SEO score does not decrease

Add to CI: a custom assertion that no emitted JSON-LD contains:
- A `Person` node whose `name` equals "Acharya Pushyadant Mishra" (belt-and-suspenders against regression)
- An `AggregateRating`, `Review`, `Product`, `Offer`, `HowTo`, `Course`, `CourseInstance` node
- A `Brand` node with `parentOrganization`

## 5.2 Pre-merge staging gate

On staging URL:
1. Sample 10 URLs (defined in §Rollout Discipline above) → validator.schema.org: 0 errors, 0 warnings each.
2. Google Rich Results Test on each of: homepage, a stotra, a Gita chapter, a deity hub, a vrat katha → eligible for applicable rich result types.
3. Lighthouse SEO + Best Practices on 3 representative pages → scores not decreased vs. pre-deploy baseline.
4. Manual DOM inspection on 2 stotras: confirm FAQ answer text is in initial HTML (view-source), confirm "About this Stotra" paragraph is visible, confirm no "Acharya Pushyadant Mishra" string appears anywhere.
5. PSI Core Web Vitals on Hanuman Chalisa page (highest-traffic): LCP < 2.5s, CLS < 0.1, INP < 200ms on mobile.

## 5.3 Post-deploy observation

48-hour observation window after merge:
- GSC → Enhancements → Unparsable structured data: must remain 0
- GSC → Coverage → Errors: no new errors
- GSC → Core Web Vitals: no regression > 10%
- Random sample: 5 URLs per day for 2 days, validator.schema.org check, all pass

If any post-deploy check fails, roll back to the pre-merge commit SHA recorded in `soak-log.md`, debug on a branch, re-ship.

---

*File 06 · Consolidated single-go revision · 2026-04-19 · Bundle discipline waived for this subdomain by owner decision; universal §5.8 remains binding for all other subdomains · Emits: WebSite, Brand, Article (per stotra webpage), CreativeWork (per stotra text), BreadcrumbList, FAQPage (conditional on DOM-visible answers), AudioObject + PodcastEpisode (conditional on real audio), Book + Chapter + verse-level CreativeWork (Gita), Recipe (per vrat katha conditional on samagri+steps), CollectionPage + Thing (per deity × 32), CollectionPage (per purpose × 27, per day × 7, per festival).*
