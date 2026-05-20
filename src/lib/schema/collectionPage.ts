/**
 * CollectionPage schemas. Four flavours:
 *   - buildDeityPageGraph(): CollectionPage + Thing (with Wikipedia/Wikidata sameAs)
 *   - buildTaxonomyPageGraph(): CollectionPage only (purpose/day/festival — no Thing entity)
 *   - buildHubPageGraph(): top-level listing hubs (/deity, /today, /stotra, etc.)
 *   - buildStaticArticleGraph(): editorial/legal/about Article pages
 *
 * Per 06 §2.4 + §2.7.
 */
import {
  STOTRA_BASE,
  STOTRA_WEBSITE_ID,
  EDITORIAL_AUTHOR_REF,
  ORG_PUBLISHER_REF,
} from "./ids";
import type { Deity, Stotra } from "@/types";

export function buildDeityPageGraph(
  deity: Deity,
  stotras: Stotra[]
): object {
  // Previously returned null when stotras.length === 0 — that left
  // /deity/yama and similar low-content deities with ZERO schema, which
  // is worse than an empty-ItemList CollectionPage. Now always emit a
  // CollectionPage + Thing + BreadcrumbList, even if the ItemList is empty.

  const pageId = `${STOTRA_BASE}/deity/${deity.slug}#page`;
  const deityId = `${STOTRA_BASE}/deity/${deity.slug}#deity`;
  const breadcrumbId = `${STOTRA_BASE}/deity/${deity.slug}#breadcrumb`;

  const sameAs: string[] = [];
  if (deity.wikipediaUrl) sameAs.push(deity.wikipediaUrl);
  if (deity.wikidataUrl) sameAs.push(deity.wikidataUrl);

  const deityNode: Record<string, unknown> = {
    "@type": "Thing",
    "@id": deityId,
    name: deity.name,
    alternateName: deity.nameHi,
    description: deity.description,
  };
  if (sameAs.length) deityNode.sameAs = sameAs;

  // Enriched item entries — each stotra carries CreativeWork sub-entity
  // (description, language, verseCount, deity ref) so the deity hub
  // schema gives Google a real entity per item rather than a bare name.
  const itemListElement = stotras.map((s, i) => ({
    "@type": "ListItem",
    position: i + 1,
    url: `${STOTRA_BASE}/stotra/${s.slug}`,
    item: {
      "@type": "CreativeWork",
      "@id": `${STOTRA_BASE}/stotra/${s.slug}#work`,
      name: s.titleEn,
      alternateName: s.title,
      url: `${STOTRA_BASE}/stotra/${s.slug}`,
      description: s.seoDescription,
      inLanguage: ["sa", "hi", "en"],
      genre: "Hindu devotional hymn",
      numberOfItems: s.verseCount,
      isPartOf: { "@id": STOTRA_WEBSITE_ID },
      about: { "@id": deityId },
    },
  }));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": pageId,
        url: `${STOTRA_BASE}/deity/${deity.slug}`,
        name: `${deity.name} Stotras`,
        description: deity.description,
        inLanguage: "en",
        isPartOf: { "@id": STOTRA_WEBSITE_ID },
        publisher: ORG_PUBLISHER_REF,
        about: { "@id": deityId },
        breadcrumb: { "@id": breadcrumbId },
        mainEntity: {
          "@type": "ItemList",
          "@id": `${STOTRA_BASE}/deity/${deity.slug}#itemlist`,
          numberOfItems: stotras.length,
          itemListOrder: "https://schema.org/ItemListOrderAscending",
          itemListElement,
        },
      },
      deityNode,
      {
        "@type": "BreadcrumbList",
        "@id": breadcrumbId,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${STOTRA_BASE}/` },
          { "@type": "ListItem", position: 2, name: "Deities", item: `${STOTRA_BASE}/deity` },
          { "@type": "ListItem", position: 3, name: deity.name },
        ],
      },
    ],
  };
}

export interface TaxonomyPageInput {
  kind: "purpose" | "day" | "festival";
  slug: string;
  name: string;
  description: string;
  stotras: Stotra[];
  /** Display name for the hub listing page (e.g., "Purposes", "Days", "Festivals") */
  hubName: string;
  /** Optional sameAs URLs (Wikipedia/Wikidata) for the topic/festival entity. */
  topicSameAs?: string[];
  /** Devanagari/local-language alternate name to attach to the topic entity. */
  topicAlternateName?: string;
}

export function buildTaxonomyPageGraph(
  input: TaxonomyPageInput
): object {
  // Always emit schema even for empty taxonomies (e.g. festivals with no
  // stotras yet) — an empty CollectionPage is better than no schema.

  const path = `/${input.kind}/${input.slug}`;
  const pageId = `${STOTRA_BASE}${path}#page`;
  const breadcrumbId = `${STOTRA_BASE}${path}#breadcrumb`;
  const topicId = `${STOTRA_BASE}${path}#topic`;

  // Enriched item entries — same CreativeWork sub-entity shape as deity hubs.
  const itemListElement = input.stotras.map((s, i) => ({
    "@type": "ListItem",
    position: i + 1,
    url: `${STOTRA_BASE}/stotra/${s.slug}`,
    item: {
      "@type": "CreativeWork",
      "@id": `${STOTRA_BASE}/stotra/${s.slug}#work`,
      name: s.titleEn,
      alternateName: s.title,
      url: `${STOTRA_BASE}/stotra/${s.slug}`,
      description: s.seoDescription,
      inLanguage: ["sa", "hi", "en"],
      genre: "Hindu devotional hymn",
      numberOfItems: s.verseCount,
      isPartOf: { "@id": STOTRA_WEBSITE_ID },
    },
  }));

  const collectionNode: Record<string, unknown> = {
    "@type": "CollectionPage",
    "@id": pageId,
    url: `${STOTRA_BASE}${path}`,
    name: input.name,
    description: input.description,
    inLanguage: "en",
    isPartOf: { "@id": STOTRA_WEBSITE_ID },
    publisher: ORG_PUBLISHER_REF,
    breadcrumb: { "@id": breadcrumbId },
    mainEntity: {
      "@type": "ItemList",
      "@id": `${STOTRA_BASE}${path}#itemlist`,
      numberOfItems: input.stotras.length,
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      itemListElement,
    },
  };

  const graph: Array<Record<string, unknown>> = [collectionNode];

  // Optional Thing entity for the festival/topic with sameAs Wikipedia/Wikidata.
  // Schema.org "Event" deliberately NOT used: Hindu festivals are recurring lunar
  // observances without single startDate/location; emitting Event would either need
  // fabricated data (fails Google validators worse) or trigger missing-field warnings.
  if (input.topicSameAs && input.topicSameAs.length) {
    const topicNode: Record<string, unknown> = {
      "@type": "Thing",
      "@id": topicId,
      name: input.name,
      description: input.description,
      sameAs: input.topicSameAs,
    };
    if (input.topicAlternateName) topicNode.alternateName = input.topicAlternateName;
    collectionNode.about = { "@id": topicId };
    graph.push(topicNode);
  }

  graph.push({
    "@type": "BreadcrumbList",
    "@id": breadcrumbId,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${STOTRA_BASE}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: input.hubName,
        item: `${STOTRA_BASE}/${input.kind}`,
      },
      { "@type": "ListItem", position: 3, name: input.name },
    ],
  });

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

/**
 * Top-level hub listing pages: /deity, /day, /purpose, /festival, /stotra,
 * /today, /vrat-katha. One breadcrumb level below home. Item URLs are absolute.
 */
export interface HubItemInput {
  name: string;
  url: string;
  /** Optional: short summary (used as schema:description on the item). */
  description?: string;
  /** Optional: deity slug or label (used as schema:about on the item). */
  deity?: string;
  /** Optional: verse count (used as schema:numberOfPages on CreativeWork item). */
  verseCount?: number;
}

export interface HubPageInput {
  /** Served path beginning with slash, e.g. "/deity" */
  path: string;
  name: string;
  description: string;
  /** Breadcrumb label shown at position 2 */
  breadcrumbName: string;
  items: HubItemInput[];
  /** Optional concept entity (e.g. "Hindu stotras") for schema:about. */
  about?: {
    name: string;
    description?: string;
    sameAs?: string[];
  };
}

export function buildHubPageGraph(input: HubPageInput): object {
  const pageId = `${STOTRA_BASE}${input.path}#page`;
  const breadcrumbId = `${STOTRA_BASE}${input.path}#breadcrumb`;
  const aboutId = input.about ? `${STOTRA_BASE}${input.path}#about` : undefined;

  // Each list item carries its own CreativeWork sub-entity so Google sees
  // each stotra in the hub as a typed entity rather than a bare URL.
  const itemListElement = input.items.map((it, i) => {
    const item: Record<string, unknown> = {
      "@type": "CreativeWork",
      "@id": `${it.url}#work`,
      name: it.name,
      url: it.url,
      inLanguage: ["sa", "hi", "en"],
      isPartOf: { "@id": STOTRA_WEBSITE_ID },
    };
    if (it.description) item.description = it.description;
    if (it.verseCount && it.verseCount > 0) {
      item.numberOfItems = it.verseCount;
      item.genre = "Hindu devotional hymn";
    }
    if (it.deity) {
      item.about = { "@type": "Thing", name: it.deity };
    }
    return {
      "@type": "ListItem",
      position: i + 1,
      url: it.url,
      item,
    };
  });

  const collectionNode: Record<string, unknown> = {
    "@type": "CollectionPage",
    "@id": pageId,
    url: `${STOTRA_BASE}${input.path}`,
    name: input.name,
    description: input.description,
    inLanguage: "en",
    isPartOf: { "@id": STOTRA_WEBSITE_ID },
    publisher: ORG_PUBLISHER_REF,
    breadcrumb: { "@id": breadcrumbId },
    mainEntity: {
      "@type": "ItemList",
      "@id": `${STOTRA_BASE}${input.path}#itemlist`,
      numberOfItems: input.items.length,
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      itemListElement,
    },
  };
  if (aboutId) {
    collectionNode.about = { "@id": aboutId };
  }

  const graph: Array<Record<string, unknown>> = [collectionNode];

  if (input.about && aboutId) {
    const aboutNode: Record<string, unknown> = {
      "@type": "Thing",
      "@id": aboutId,
      name: input.about.name,
    };
    if (input.about.description) aboutNode.description = input.about.description;
    if (input.about.sameAs && input.about.sameAs.length) {
      aboutNode.sameAs = input.about.sameAs;
    }
    graph.push(aboutNode);
  }

  graph.push({
    "@type": "BreadcrumbList",
    "@id": breadcrumbId,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${STOTRA_BASE}/` },
      { "@type": "ListItem", position: 2, name: input.breadcrumbName },
    ],
  });

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

/**
 * Static Article pages owned by VastuCart Editorial (editorial-process,
 * about, privacy, terms, disclaimer). Article + BreadcrumbList.
 */
export interface StaticArticleInput {
  path: string;
  headline: string;
  description: string;
  breadcrumbName: string;
  datePublished?: string;
  dateModified?: string;
}

export function buildStaticArticleGraph(input: StaticArticleInput): object {
  // Fragment matches type ("#article", not "#webpage") so Google's Rich
  // Results Test doesn't flag the Article node as semantically inconsistent.
  const articleId = `${STOTRA_BASE}${input.path}#article`;
  const breadcrumbId = `${STOTRA_BASE}${input.path}#breadcrumb`;
  const articleUrl = `${STOTRA_BASE}${input.path}`;
  const articleNode: Record<string, unknown> = {
    "@type": "Article",
    "@id": articleId,
    url: articleUrl,
    mainEntityOfPage: { "@id": articleId, "@type": "WebPage", url: articleUrl },
    headline: input.headline,
    description: input.description,
    image: `${STOTRA_BASE}/og-default.jpg`,
    inLanguage: "en",
    isPartOf: { "@id": STOTRA_WEBSITE_ID },
    author: EDITORIAL_AUTHOR_REF,
    publisher: ORG_PUBLISHER_REF,
  };
  if (input.datePublished) articleNode.datePublished = input.datePublished;
  if (input.dateModified) articleNode.dateModified = input.dateModified;

  return {
    "@context": "https://schema.org",
    "@graph": [
      articleNode,
      {
        "@type": "BreadcrumbList",
        "@id": breadcrumbId,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${STOTRA_BASE}/` },
          { "@type": "ListItem", position: 2, name: input.breadcrumbName },
        ],
      },
    ],
  };
}
