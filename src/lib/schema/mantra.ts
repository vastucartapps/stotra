/**
 * Per-mantra-page schema (GEO/AI-citation oriented):
 *   #article   = Article (the page about the mantra)
 *   #defined-* = DefinedTerm per mantra (the mantra entity itself)
 *   #entity    = Thing (planet/rashi/nakshatra) with sameAs Wikidata/Wikipedia
 *   #breadcrumb = BreadcrumbList
 * FAQPage is emitted separately by buildFaqPageSchema (parse-only post-2026).
 * HowTo is intentionally NOT used (rich-result deprecated) — vidhi steps
 * render as on-page ordered lists.
 */
import {
  STOTRA_BASE,
  STOTRA_WEBSITE_ID,
  EDITORIAL_AUTHOR_REF,
  ORG_PUBLISHER_REF,
} from "./ids";
import type { MantraPage } from "@/types";

export function buildMantraPageGraph(m: MantraPage): object {
  const base = `${STOTRA_BASE}/mantra/${m.type}/${m.slug}`;
  const articleId = `${base}#article`;
  const entityId = `${base}#entity`;
  const breadcrumbId = `${base}#breadcrumb`;

  const graph: Array<Record<string, unknown>> = [];

  // Article node — the page
  const article: Record<string, unknown> = {
    "@type": "Article",
    "@id": articleId,
    url: base,
    mainEntityOfPage: { "@id": articleId, "@type": "WebPage", url: base },
    headline: `${m.name.en} Mantra — Meaning, Vidhi & Benefits`,
    description: m.whatIs.slice(0, 300),
    inLanguage: ["en", "hi", "sa"],
    isPartOf: { "@id": STOTRA_WEBSITE_ID },
    author: EDITORIAL_AUTHOR_REF,
    publisher: ORG_PUBLISHER_REF,
    datePublished: m.createdAt,
    dateModified: m.updatedAt,
    image: `${STOTRA_BASE}/og-default.jpg`,
  };
  if (m.entity) article.about = { "@id": entityId };
  graph.push(article);

  // DefinedTerm per mantra — the citable entity AI engines lift
  m.mantras.forEach((mn, i) => {
    graph.push({
      "@type": "DefinedTerm",
      "@id": `${base}#mantra-${i}`,
      name: mn.transliteration,
      alternateName: mn.textDevanagari,
      inDefinedTermSet: { "@id": articleId },
      description: mn.englishExplanation || mn.meaning || `${mn.kind} mantra (${mn.lineage}); source: ${mn.source}.`,
      termCode: mn.kind,
    });
  });

  // Entity (planet/rashi/nakshatra) with sameAs grounding
  if (m.entity) {
    const node: Record<string, unknown> = {
      "@type": "Thing",
      "@id": entityId,
      name: m.entity.name,
    };
    const sameAs = [m.entity.wikipedia, m.entity.wikidata].filter(Boolean);
    if (sameAs.length) node.sameAs = sameAs;
    graph.push(node);
  }

  // Breadcrumb: Home / Mantras / <Axis> / <Member>
  const axisLabel = m.type.charAt(0).toUpperCase() + m.type.slice(1);
  graph.push({
    "@type": "BreadcrumbList",
    "@id": breadcrumbId,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${STOTRA_BASE}/` },
      { "@type": "ListItem", position: 2, name: "Mantras", item: `${STOTRA_BASE}/mantra` },
      { "@type": "ListItem", position: 3, name: axisLabel, item: `${STOTRA_BASE}/mantra/${m.type}` },
      { "@type": "ListItem", position: 4, name: m.name.en },
    ],
  });

  return { "@context": "https://schema.org", "@graph": graph };
}
