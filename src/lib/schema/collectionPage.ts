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
): object | null {
  if (stotras.length === 0) return null;

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
          numberOfItems: stotras.length,
          itemListElement: stotras.map((s, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: s.titleEn,
            url: `${STOTRA_BASE}/stotra/${s.slug}`,
          })),
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
}

export function buildTaxonomyPageGraph(
  input: TaxonomyPageInput
): object | null {
  if (input.stotras.length === 0) return null;

  const path = `/${input.kind}/${input.slug}`;
  const pageId = `${STOTRA_BASE}${path}#page`;
  const breadcrumbId = `${STOTRA_BASE}${path}#breadcrumb`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
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
          numberOfItems: input.stotras.length,
          itemListElement: input.stotras.map((s, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: s.titleEn,
            url: `${STOTRA_BASE}/stotra/${s.slug}`,
          })),
        },
      },
      {
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
      },
    ],
  };
}

/**
 * Top-level hub listing pages: /deity, /day, /purpose, /festival, /stotra,
 * /today, /vrat-katha. One breadcrumb level below home. Item URLs are absolute.
 */
export interface HubPageInput {
  /** Served path beginning with slash, e.g. "/deity" */
  path: string;
  name: string;
  description: string;
  /** Breadcrumb label shown at position 2 */
  breadcrumbName: string;
  items: Array<{ name: string; url: string }>;
}

export function buildHubPageGraph(input: HubPageInput): object {
  const pageId = `${STOTRA_BASE}${input.path}#page`;
  const breadcrumbId = `${STOTRA_BASE}${input.path}#breadcrumb`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
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
          numberOfItems: input.items.length,
          itemListElement: input.items.map((it, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: it.name,
            url: it.url,
          })),
        },
      },
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
  const pageId = `${STOTRA_BASE}${input.path}#webpage`;
  const breadcrumbId = `${STOTRA_BASE}${input.path}#breadcrumb`;
  const articleNode: Record<string, unknown> = {
    "@type": "Article",
    "@id": pageId,
    url: `${STOTRA_BASE}${input.path}`,
    mainEntityOfPage: pageId,
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
