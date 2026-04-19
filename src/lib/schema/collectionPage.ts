/**
 * CollectionPage schemas. Two flavours:
 *   - buildDeityPageGraph(): CollectionPage + Thing (with Wikipedia/Wikidata sameAs)
 *   - buildTaxonomyPageGraph(): CollectionPage only (purpose/day/festival — no Thing entity)
 *
 * Per 06 §2.4 + §2.7.
 */
import { STOTRA_BASE, STOTRA_WEBSITE_ID } from "./ids";
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
        isPartOf: { "@id": STOTRA_WEBSITE_ID },
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
        isPartOf: { "@id": STOTRA_WEBSITE_ID },
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
