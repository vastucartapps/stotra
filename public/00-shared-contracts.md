# 00 — Shared Contracts (Read-Only Reference)

**Purpose:** This file is a read-only reference consumed by all 10 per-project spec files. It defines the canonical `@id` strings, brand facts, author identities, and concept entities that every subdomain's Claude Code must reference but never redefine.

**No project modifies this file. No project emits the entities canonically declared here as their own — they reference these entities via `@id` string.**

The only project that canonically *emits* the Organization + Person + concept-entity declarations is `vastucart.in` (File 01) and `blog.vastucart.in` (File 04, for the two Person entities only). Every other project consumes `@id` references.

---

## 1. Brand Facts (locked, identical everywhere)

| Field | Value |
|---|---|
| Brand name | `VastuCart` |
| Registered mark | `VastuCart®` |
| Slogan | `Divinely Perfect` |
| Founding year | `2022` |
| Legal structure | Sole Proprietorship (India) |
| Canonical logo URL | `https://www.vastucart.in/logo.png` |
| Canonical home URL | `https://www.vastucart.in/` |
| Country | India (`IN`) |
| City | Jhunjhunu |
| Region | Rajasthan |
| Postal code | 333307 |
| Support email | `hi@vastucart.in` |
| Business email | `business@vastucart.in` |
| Careers email | `careers@vastucart.in` |
| Languages served | English (`en`), Hindi (`hi`) |

---

## 2. Canonical `@id` Contracts

These string values are sacred. Every subdomain references them verbatim. No project creates its own Organization or its own Person entities — they reference these.

### 2.1 Organization (owned by vastucart.in)

```
https://www.vastucart.in/#organization
```

Referenced as `publisher`, `parentOrganization`, `provider`, `organizer`, `worksFor`, `creator` on every subdomain.

### 2.2 Persons (owned by blog.vastucart.in)

```
https://blog.vastucart.in/authors/pt-raghav-sharma#person
https://blog.vastucart.in/authors/vastucart-editorial#person
```

Referenced as `author` on every BlogPosting, Article, horoscope prediction, and Nakshatra/Tithi article across all subdomains.

**Author assignment rule:**
- Content in Jyotish vertical (Vedic astrology articles, Graha placements, Yogas, Dashas, Doshas, Lagna profiles, Nakshatra analysis, horoscope predictions) → `pt-raghav-sharma`
- All other content (numerology, vastu, tarot, festivals, puja vidhi, stotras, gemstones, rudraksha, generic explainers) → `vastucart-editorial`

### 2.3 Sub-brand `@id`s (each owned by its respective subdomain)

```
https://kundali.vastucart.in/#brand           (Kundali Decoded)
https://store.vastucart.in/#store             (VastuCart Store - dual Organization+OnlineStore)
https://blog.vastucart.in/#blog               (VastuCart Blog)
https://panchang.vastucart.in/#brand          (Panchang)
https://stotra.vastucart.in/#brand            (Stotra)
https://horoscope.vastucart.in/#brand         (Divine Path)
https://muhurta.vastucart.in/#brand           (Shubh Muhurta)
https://wedding.vastucart.in/#brand           (Wedding Muhurta)
https://tarot.vastucart.in/#brand             (Tarot by VastuCart)
```

### 2.4 WebSite `@id`s (each owned by its respective subdomain)

```
https://www.vastucart.in/#website
https://kundali.vastucart.in/#website
https://store.vastucart.in/#website
https://blog.vastucart.in/#website
https://panchang.vastucart.in/#website
https://stotra.vastucart.in/#website
https://horoscope.vastucart.in/#website
https://muhurta.vastucart.in/#website
https://wedding.vastucart.in/#website
https://tarot.vastucart.in/#website
```

---

## 3. Concept Knowledge Graph (40+ Entities)

Every concept below is its own `Thing` / `DefinedTerm` with a stable `@id`. Every blog article, tool result page, stotra, prediction, and product references these via `mentions` / `about`.

**Canonical declaration location:** `vastucart.in` at `/concepts/{slug}` (File 01, Bundle A). Every other project references via `@id` only.

**@id format:** `https://www.vastucart.in/concepts/{slug}#entity`

### 3.1 Nine Grahas (Planets)

| Entity | Slug | Wikidata | @id |
|---|---|---|---|
| Surya (Sun) | surya | Q525 | `https://www.vastucart.in/concepts/surya#entity` |
| Chandra (Moon) | chandra | Q405 | `https://www.vastucart.in/concepts/chandra#entity` |
| Mangala (Mars) | mangala | Q111 | `https://www.vastucart.in/concepts/mangala#entity` |
| Budha (Mercury) | budha | Q308 | `https://www.vastucart.in/concepts/budha#entity` |
| Brihaspati (Jupiter) | brihaspati | Q319 | `https://www.vastucart.in/concepts/brihaspati#entity` |
| Shukra (Venus) | shukra | Q313 | `https://www.vastucart.in/concepts/shukra#entity` |
| Shani (Saturn) | shani | Q193 | `https://www.vastucart.in/concepts/shani#entity` |
| Rahu (North Node) | rahu | Q754072 | `https://www.vastucart.in/concepts/rahu#entity` |
| Ketu (South Node) | ketu | Q1063203 | `https://www.vastucart.in/concepts/ketu#entity` |

### 3.2 Twelve Rashis (Zodiac Signs)

Slugs: `mesha`, `vrishabha`, `mithuna`, `karka`, `simha`, `kanya`, `tula`, `vrishchika`, `dhanu`, `makara`, `kumbha`, `meena`. Each at `/concepts/{slug}#entity` with Wikidata sameAs for the Western equivalent (Aries Q663, Taurus Q666, etc.).

### 3.3 Twenty-Seven Nakshatras

Slugs: `ashwini`, `bharani`, `krittika`, `rohini`, `mrigashira`, `ardra`, `punarvasu`, `pushya`, `ashlesha`, `magha`, `purva-phalguni`, `uttara-phalguni`, `hasta`, `chitra`, `swati`, `vishakha`, `anuradha`, `jyeshtha`, `mula`, `purva-ashadha`, `uttara-ashadha`, `shravana`, `dhanishta`, `shatabhisha`, `purva-bhadrapada`, `uttara-bhadrapada`, `revati`.

Each declared as `DefinedTerm` with `inDefinedTermSet` pointing to:
```
https://www.vastucart.in/concepts/nakshatra-set#termset
```

### 3.4 Thirty Tithis

Slugs: `pratipada`, `dwitiya`, `tritiya`, `chaturthi`, `panchami`, `shashthi`, `saptami`, `ashtami`, `navami`, `dashami`, `ekadashi`, `dwadashi`, `trayodashi`, `chaturdashi`, `purnima`, `amavasya` (Shukla and Krishna pakshas). Each at `/concepts/tithi/{slug}#entity`.

TermSet: `https://www.vastucart.in/concepts/tithi-set#termset`

### 3.5 Twelve Bhavas (Houses)

Slugs: `tanu-bhava` (1st), `dhana-bhava` (2nd), `sahaja-bhava` (3rd), `sukha-bhava` (4th), `putra-bhava` (5th), `ripu-bhava` (6th), `kalatra-bhava` (7th), `ayush-bhava` (8th), `dharma-bhava` (9th), `karma-bhava` (10th), `labha-bhava` (11th), `vyaya-bhava` (12th).

### 3.6 Core Doshas (6)

`mangal-dosha`, `kaal-sarp-dosha`, `pitra-dosha`, `grahan-dosha`, `nadi-dosha`, `sade-sati`.

### 3.7 Core Yogas (top priority — extend later)

`raj-yoga`, `dhana-yoga`, `gaja-kesari-yoga`, `pancha-mahapurusha-yoga`, `hamsa-yoga`, `malavya-yoga`, `ruchaka-yoga`, `bhadra-yoga`, `sasa-yoga`, `neecha-bhanga-raja-yoga`, `vipareeta-raja-yoga`.

### 3.8 Eight Kootas (Guna Milan)

`varna-koota`, `vashya-koota`, `tara-koota`, `yoni-koota`, `graha-maitri-koota`, `gana-koota`, `bhakoot-koota`, `nadi-koota`.

### 3.9 Sixteen Vargas (Divisional Charts)

`rashi-d1`, `hora-d2`, `drekkana-d3`, `chaturthamsha-d4`, `saptamsha-d7`, `navamsha-d9`, `dashamsha-d10`, `dwadashamsha-d12`, `shodashamsha-d16`, `vimshamsha-d20`, `chaturvimshamsha-d24`, `saptavimshamsha-d27`, `trimshamsha-d30`, `khavedamsha-d40`, `akshavedamsha-d45`, `shashtiamsha-d60`.

### 3.10 Numerology Core Concepts

`life-path-number`, `destiny-number`, `soul-urge-number`, `expression-number`, `birthday-number`, `master-numbers`, `lo-shu-grid`, `chaldean-numerology`, `pythagorean-numerology`.

### 3.11 Vastu Core Concepts

`brahmasthana`, `eight-directions` (north, south, east, west, NE, NW, SE, SW), `pancha-bhutas` (earth, water, fire, air, ether), `vastu-purusha-mandala`.

### 3.12 Tarot Core Concepts

`major-arcana`, `minor-arcana`, `suit-of-wands`, `suit-of-cups`, `suit-of-swords`, `suit-of-pentacles`, `court-cards`, `rider-waite-deck`.

---

## 4. Social Profile `sameAs` Array (identical everywhere on the Organization)

```json
"sameAs": [
  "https://www.linkedin.com/company/vastucart",
  "https://www.facebook.com/vastucartindia",
  "https://www.instagram.com/vastucart/",
  "https://in.pinterest.com/vastucart/",
  "https://www.threads.com/@vastucart",
  "https://x.com/vastucart",
  "https://vastucart.etsy.com",
  "https://www.amazon.in/s?k=vastucart"
]
```

Swap the Amazon entry to `https://www.amazon.in/vastucart` once the brand store goes live.

---

## 5. Universal Rules (every project enforces these)

### 5.1 Content-Schema Coupling Rule (enterprise-critical)

**Schema is emitted only when the underlying data exists. Never emit empty arrays, empty strings, or placeholder values.**

Implementation pattern (TypeScript):

```ts
// lib/schema/recipe.ts
export function buildPujaRecipeSchema(puja: PujaData): object | null {
  // Gate emission on required fields
  if (!puja.steps?.length || !puja.samagri?.length || !puja.duration) {
    console.warn(`[schema] Skipping Recipe for ${puja.slug} — missing required data`);
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "Recipe",
    "name": puja.name,
    "recipeIngredient": puja.samagri,
    "recipeInstructions": puja.steps.map((s, i) => ({
      "@type": "HowToStep",
      "position": i + 1,
      "text": s
    })),
    "totalTime": puja.duration,
    // ...
  };
}
```

Consumer:

```tsx
// app/puja/[slug]/page.tsx
const schema = buildPujaRecipeSchema(puja);
return (
  <>
    {schema && (
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    )}
    <PujaPage data={puja} />
  </>
);
```

**Applies to:** Recipe, PodcastEpisode, AudioObject, Product, AggregateRating, Review, Event, LiveBlogPosting, Dataset, ClaimReview, Course, LearningResource.

**Never applies to:** Organization, WebSite, WebPage, BreadcrumbList, CollectionPage, Brand (these must always emit).

### 5.2 No Cross-Project Redefinition

Every project's Claude Code operates only on its own subdomain's codebase. If a project's schema needs a concept or entity owned by another project, it references via `@id` string. It never:
- Redefines the Organization locally
- Redefines Persons locally
- Redefines concept entities locally
- Modifies files outside its declared codebase root

### 5.3 Universal JSON-LD Injection Pattern (Next.js 14 App Router)

Every page emits schema via `generateMetadata` (for metadata like canonical/alternates) AND a JSON-LD `<script>` tag in the page component (for structured data).

Canonical example:

```tsx
// app/tools/[slug]/page.tsx
import { buildToolSchema } from '@/lib/schema/tool';
import type { Metadata } from 'next';

export async function generateMetadata({ params }): Promise<Metadata> {
  const tool = await getTool(params.slug);
  return {
    alternates: {
      canonical: `https://www.vastucart.in/tools/${tool.slug}`,
      languages: {
        en: `https://www.vastucart.in/tools/${tool.slug}`,
        hi: `https://www.vastucart.in/hi/tools/${tool.slug}`,
        'x-default': `https://www.vastucart.in/tools/${tool.slug}`,
      },
    },
  };
}

export default async function ToolPage({ params }) {
  const tool = await getTool(params.slug);
  const schema = buildToolSchema(tool);

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <ToolUI tool={tool} />
    </>
  );
}
```

### 5.4 i18n Canonical Rule (all projects)

- English is the default: bare paths (`/tools/life-path-number`)
- Hindi uses `/hi/` prefix: `/hi/tools/life-path-number`
- `/en/*` is not a valid form and 301s to bare via `next.config.ts` redirects
- Every page's `<head>` emits:

```html
<link rel="canonical" href="{localeUrl}" />
<link rel="alternate" hreflang="en" href="{enUrl}" />
<link rel="alternate" hreflang="hi" href="{hiUrl}" />
<link rel="alternate" hreflang="x-default" href="{enUrl}" />
```

- Sitemap emits both locale pairs with matching `<xhtml:link rel="alternate" hreflang="...">` entries.

### 5.5 Universal Schema Module Structure

Every project creates `lib/schema/` as a dedicated module. One file per schema type. Pages never hand-write JSON-LD.

```
lib/schema/
├── index.ts                    # re-exports
├── organization.ts             # (only vastucart.in)
├── website.ts                  # per-project WebSite
├── blogPosting.ts              # (only blog)
├── person.ts                   # (only blog)
├── product.ts                  # (only store)
├── recipe.ts                   # (stotra, blog/puja)
├── event.ts                    # (panchang)
├── dataset.ts                  # (panchang)
├── creativeWork.ts             # (stotra, tarot)
├── course.ts                   # (blog, tarot, kundali)
├── service.ts                  # (muhurta, wedding)
├── article.ts                  # (blog, horoscope, panchang)
├── definedTerm.ts              # (panchang, vastucart.in concepts)
├── faqPage.ts                  # (universal)
├── breadcrumbList.ts           # (universal)
├── softwareApplication.ts      # (vastucart.in tools, kundali)
├── localBusiness.ts            # (panchang cities)
├── collectionPage.ts           # (universal)
├── podcastEpisode.ts           # (stotra)
├── audioObject.ts              # (stotra)
└── speakableSpec.ts            # (panchang, horoscope)
```

Each module exports:
- `build{Type}Schema(data)` — returns object | null
- Types/interfaces for input data

### 5.6 CI Validation (every project)

Every PR triggers a GitHub Action that:
1. Builds the Next.js project
2. Renders every page's JSON-LD
3. Pipes each JSON-LD block through schema validation
4. Fails the build on any error

Recommended validators:
- `schema-dts` (compile-time TypeScript types)
- `structured-data-testing-tool` npm package (runtime validation)
- Optional: Google Rich Results test via automated Puppeteer script on staging

CI step example:
```yaml
- name: Validate structured data
  run: |
    npm run build
    npx structured-data-testing-tool --url http://localhost:3000 --preset google
```

### 5.7 Commit Conventions

Every commit message follows:
```
[schema/{type}] {action} on {scope}

Example:
[schema/blogPosting] add conditional author emission on blog/*/**
[schema/product] gate AggregateRating on reviewCount > 0
[schema/recipe] skip emission when samagri empty
[bundle-A] emit canonical Organization on vastucart.in homepage
[bundle-B] add Course schema to kundali /features
[bundle-C] wire mentions to concept entities on jyotish blog
[bundle-D] add IndexNow on publish webhook
```

### 5.8 Bundle Order (universal across all projects)

Every project ships in 4 ordered bundles with 48-hour soaks between. Do not skip bundles or reorder.

| Bundle | Contents | Soak | Rollback strategy |
|---|---|---|---|
| A — Entity Foundation | Organization ref, WebSite, Brand, concept entity references, Wikidata sameAs, E-E-A-T pages, mainEntity bindings | 48hr | `git revert {bundle-A SHA}` |
| B — Content-type Schemas | Per-type builders (BlogPosting, Product, Recipe, etc.) with conditional emission | 48hr | Per-builder flags in `lib/schema/config.ts` allow disabling one type without reverting all |
| C — Architecture | Pillar pages, hub pages, internal linking, `mentions`/`about`/`isRelatedTo` cross-refs, LocalBusiness | 48hr | `git revert {bundle-C SHA}` |
| D — Indexing Acceleration | Sitemap lastmod, IndexNow, RSS feeds, sitemap ping, Google Indexing API | Ongoing | Disable via env vars |

### 5.9 Soak Monitoring (what to watch during each 48hr window)

- Google Search Console → Enhancements → Unparsable structured data (must stay at 0)
- GSC → Coverage → Errors (no new URL errors)
- GSC → Core Web Vitals (no regression > 10%)
- Rendering output in Lighthouse → SEO score (should improve or stay flat, never drop)
- Sample 5 random pages, run validator.schema.org on each, 0 errors required

If any check fails, execute rollback per section 5.8 and debug on a branch before re-shipping.

### 5.10 Schema.org Property Legality — Critical Rules

Schema.org types inherit properties from their parent types. A property defined on `CreativeWork` is valid on `Article`, `BlogPosting`, `WebPage`, `WebApplication`, etc., but NOT on `Thing`, `Intangible`, `Service`, `Event`, or `Brand`. Placing a property on the wrong type generates validator warnings that Google ignores for rich results but that clutter audits and signal sloppy modeling.

**The following properties are strictly scoped:**

| Property | Legal on | NOT legal on |
|---|---|---|
| `about` | CreativeWork and subtypes, Event | Service, Brand, Person, Thing (bare) |
| `mentions` | CreativeWork and subtypes only | Service, Event, Brand, Organization, Place, Person |
| `isPartOf` | CreativeWork and subtypes only | Service, Event, Brand, Organization |
| `isRelatedTo` | Product, Service only | WebApplication, CreativeWork, Event, Brand |
| `parentOrganization` | Organization and subtypes (incl. OnlineStore, LocalBusiness, EducationalOrganization) | Brand (Brand is Intangible, not Organization) |
| `instructor` | CourseInstance | Course (use via hasCourseInstance) |

**Wrapping pattern for entities that need cross-references they cannot legally hold:**

When a `Service` or `Event` page needs to declare `about` (concept references), `isPartOf` (the site), or `mentions` (related resources), do NOT attach these directly. Instead, emit a `WebPage` that wraps the entity:

```json
{
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://site.example/{path}#page",
      "url": "https://site.example/{path}",
      "name": "...",
      "isPartOf": { "@id": "https://site.example/#website" },
      "about": [ { "@id": "https://www.vastucart.in/concepts/{slug}#entity" } ],
      "mainEntity": { "@id": "https://site.example/{path}#service" }
    },
    {
      "@type": "Service",
      "@id": "https://site.example/{path}#service",
      "name": "...",
      "description": "...",
      "serviceType": "...",
      "provider": { "@id": "https://www.vastucart.in/#organization" },
      "areaServed": { "@type": "Country", "name": "India" },
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
    }
  ]
}
```

Same pattern applies to Event. WebPage is the CreativeWork-legal home for cross-reference properties; the Service/Event is the mainEntity it describes.

### 5.11 Brand Relationship — Reverse Flow

`Brand` is `Intangible`, not `Organization`. It cannot declare a parent via `parentOrganization`. Instead, the canonical `Organization` in File 01 (vastucart.in) declares its brands via the `brand` property, which IS valid on Organization.

**Every sub-brand emits:**
```json
{
  "@type": "Brand",
  "@id": "https://{subdomain}.vastucart.in/#brand",
  "name": "...",
  "logo": "https://www.vastucart.in/logo.png",
  "slogan": "Divinely Perfect"
}
```

Only these 4 properties. No parentOrganization. No parent reference.

**File 01's canonical Organization emits the reverse link:**
```json
"brand": [
  { "@id": "https://kundali.vastucart.in/#brand" },
  { "@id": "https://panchang.vastucart.in/#brand" },
  { "@id": "https://stotra.vastucart.in/#brand" },
  { "@id": "https://horoscope.vastucart.in/#brand" },
  { "@id": "https://muhurta.vastucart.in/#brand" },
  { "@id": "https://wedding.vastucart.in/#brand" },
  { "@id": "https://tarot.vastucart.in/#brand" }
]
```

Note: `store.vastucart.in` uses multi-type `["OnlineStore", "Organization"]` (not Brand) because OnlineStore IS an Organization subtype. Its `parentOrganization` is legal. It does NOT appear in the Organization.brand array.

Note: `blog.vastucart.in` uses `Blog` (a CreativeWork subtype), not Brand. Not in the brand array either.

---

## 6. Wikidata Properties to Link (every concept entity)

When File 01 (vastucart.in) emits concept entities, each includes a `sameAs` array linking to:

| Platform | URL pattern |
|---|---|
| Wikidata | `https://www.wikidata.org/wiki/{Qid}` |
| Wikipedia (EN) | `https://en.wikipedia.org/wiki/{Title}` |
| Wikipedia (HI) | `https://hi.wikipedia.org/wiki/{Title}` |
| DBpedia | `https://dbpedia.org/resource/{Title}` |

Only include URLs that actually resolve. If a concept doesn't have a Wikidata entry (rare for core Vedic concepts), omit the `sameAs` — do not guess Q-numbers.

---

## 7. Out-of-Scope (Universal)

No project is allowed to:
- Declare a canonical `Organization` other than the one at `https://www.vastucart.in/#organization`
- Create new `Person` entities for blog authors (only the two in section 2.2 exist)
- Redefine concept entities — only reference them via `@id`
- Modify any subdomain's codebase other than its own
- Emit schema for content that doesn't exist yet (gate via section 5.1)
- Reciprocate `sameAs` chains between sister subdomains — `sameAs` is for external identity only; internal relationships use `publisher` / `parentOrganization` / `isPartOf`

---

*Reference file · Version 1.0 · Consumed by files 01–10.*
