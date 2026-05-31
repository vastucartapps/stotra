/**
 * Per-mantra-page schema (GEO / AI-citation oriented). Emits a rich @graph:
 *   #webpage         = WebPage (the page)
 *   #article         = Article (the editorial content)
 *   #termset         = DefinedTermSet (the mantra collection)
 *   #mantra-N        = DefinedTerm per mantra (the citable units)
 *   #entity          = Thing (planet/rashi/nakshatra) + sameAs Wikidata/Wikipedia
 *   #itemlist        = ItemList of the mantras (rich-result eligible)
 *   #faq             = FAQPage (built from buildMantraFaqs)
 *   #breadcrumb      = BreadcrumbList
 * HowTo intentionally omitted (rich-result deprecated) — vidhi renders as
 * on-page ordered lists.
 */
import {
  STOTRA_BASE,
  STOTRA_WEBSITE_ID,
  EDITORIAL_AUTHOR_REF,
  ORG_PUBLISHER_REF,
} from "./ids";
import type { MantraPage, FAQItem } from "@/types";

export function buildMantraPageGraph(m: MantraPage, faqs: FAQItem[]): object {
  const base = `${STOTRA_BASE}/mantra/${m.type}/${m.slug}`;
  const webpageId = `${base}#webpage`;
  const articleId = `${base}#article`;
  const termsetId = `${base}#termset`;
  const entityId = `${base}#entity`;
  const itemlistId = `${base}#itemlist`;
  const faqId = `${base}#faq`;
  const breadcrumbId = `${base}#breadcrumb`;

  const graph: Array<Record<string, unknown>> = [];
  const axisLabel = m.type.charAt(0).toUpperCase() + m.type.slice(1);

  // WebPage
  graph.push({
    "@type": "WebPage",
    "@id": webpageId,
    url: base,
    name: `${m.name.en} Mantra`,
    inLanguage: "en",
    isPartOf: { "@id": STOTRA_WEBSITE_ID },
    breadcrumb: { "@id": breadcrumbId },
    primaryImageOfPage: `${STOTRA_BASE}/og-default.jpg`,
    datePublished: m.createdAt,
    dateModified: m.updatedAt,
    about: m.entity ? { "@id": entityId } : undefined,
    mainEntity: { "@id": articleId },
    hasPart: [{ "@id": faqId }, { "@id": itemlistId }],
  });

  // Article
  const article: Record<string, unknown> = {
    "@type": "Article",
    "@id": articleId,
    url: base,
    mainEntityOfPage: { "@id": webpageId, "@type": "WebPage", url: base },
    headline: `${m.name.en} Mantra — Meaning, Vidhi & Benefits`,
    description: m.whatIs.slice(0, 300),
    articleBody: m.whatIs,
    inLanguage: ["en", "hi", "sa"],
    isPartOf: { "@id": STOTRA_WEBSITE_ID },
    author: EDITORIAL_AUTHOR_REF,
    publisher: ORG_PUBLISHER_REF,
    datePublished: m.createdAt,
    dateModified: m.updatedAt,
    image: `${STOTRA_BASE}/og-default.jpg`,
  };
  if (m.entity) article.about = { "@id": entityId };
  if (m.alsoKnownAs?.length) article.keywords = m.alsoKnownAs.join(", ");
  graph.push(article);

  // DefinedTermSet + a DefinedTerm per mantra (the AI-citable units)
  graph.push({
    "@type": "DefinedTermSet",
    "@id": termsetId,
    name: `${m.name.en} Mantras`,
    hasDefinedTerm: m.mantras.map((_, i) => ({ "@id": `${base}#mantra-${i}` })),
  });
  m.mantras.forEach((mn, i) => {
    graph.push({
      "@type": "DefinedTerm",
      "@id": `${base}#mantra-${i}`,
      name: mn.transliteration,
      alternateName: mn.textDevanagari,
      inDefinedTermSet: { "@id": termsetId },
      description: mn.englishExplanation || mn.meaning || `${mn.kind} mantra (${mn.lineage}); source: ${mn.source}.`,
      termCode: mn.kind,
      inLanguage: "sa",
    });
  });

  // ItemList of the mantras (ordered, rich-result eligible)
  graph.push({
    "@type": "ItemList",
    "@id": itemlistId,
    name: `${m.name.en} Mantras`,
    numberOfItems: m.mantras.length,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    itemListElement: m.mantras.map((mn, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: mn.transliteration,
      item: { "@id": `${base}#mantra-${i}` },
    })),
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

  // FAQPage — the full expanded set
  if (faqs.length) {
    graph.push({
      "@type": "FAQPage",
      "@id": faqId,
      isPartOf: { "@id": webpageId },
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    });
  }

  // Breadcrumb
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
