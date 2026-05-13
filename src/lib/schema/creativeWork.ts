/**
 * Per-stotra schema — the two-node pattern from 06 §2.1:
 *   #webpage = Article (the Next.js HTML page about the stotra)
 *   #work    = CreativeWork (the ancient stotra text itself)
 *   #breadcrumb = BreadcrumbList
 */
import {
  STOTRA_BASE,
  STOTRA_WEBSITE_ID,
  EDITORIAL_AUTHOR_REF,
  ORG_PUBLISHER_REF,
  deityConceptId,
} from "./ids";
import type { Stotra, Deity } from "@/types";

/** Traditional-author mappings. name only + optional sameAs. No credentials. */
const TRADITIONAL_AUTHORS: Record<
  string,
  { name: string; sameAs?: string[] }
> = {
  tulsidas: {
    name: "Goswami Tulsidas",
    sameAs: [
      "https://en.wikipedia.org/wiki/Tulsidas",
      "https://www.wikidata.org/wiki/Q193466",
    ],
  },
  shankaracharya: {
    name: "Adi Shankaracharya",
    sameAs: [
      "https://en.wikipedia.org/wiki/Adi_Shankara",
      "https://www.wikidata.org/wiki/Q11345",
    ],
  },
  valmiki: {
    name: "Valmiki",
    sameAs: [
      "https://en.wikipedia.org/wiki/Valmiki",
      "https://www.wikidata.org/wiki/Q193267",
    ],
  },
  vyasa: {
    name: "Vyasa",
    sameAs: [
      "https://en.wikipedia.org/wiki/Vyasa",
      "https://www.wikidata.org/wiki/Q193563",
    ],
  },
};

function resolveWorkAuthor(
  stotra: Stotra
): { "@type": "Person"; name: string; sameAs?: string[] } | undefined {
  // Special case: Hanuman Chalisa = Tulsidas standalone (NOT Ramcharitmanas)
  if (stotra.slug === "hanuman-chalisa") {
    return { "@type": "Person", ...TRADITIONAL_AUTHORS.tulsidas };
  }
  const src = (stotra.source || "").toLowerCase();
  if (src.includes("tulsidas"))
    return { "@type": "Person", ...TRADITIONAL_AUTHORS.tulsidas };
  if (src.includes("shankaracharya") || src.includes("shankara"))
    return { "@type": "Person", ...TRADITIONAL_AUTHORS.shankaracharya };
  if (src.includes("valmiki"))
    return { "@type": "Person", ...TRADITIONAL_AUTHORS.valmiki };
  if (src.includes("mahabharata") || src.includes("vyasa"))
    return { "@type": "Person", ...TRADITIONAL_AUTHORS.vyasa };
  return undefined;
}

function resolveClassicalSource(stotra: Stotra): string | undefined {
  if (stotra.slug === "hanuman-chalisa") {
    return "Standalone composition by Tulsidas in Awadhi, late 16th century";
  }
  return stotra.source || undefined;
}

export function buildStotraPageGraph(
  stotra: Stotra,
  deity: Deity | null
): object | null {
  if (!stotra.titleEn || !stotra.verseCount || stotra.verseCount < 1)
    return null;

  const pageId = `${STOTRA_BASE}/stotra/${stotra.slug}#webpage`;
  const workId = `${STOTRA_BASE}/stotra/${stotra.slug}#work`;
  const breadcrumbId = `${STOTRA_BASE}/stotra/${stotra.slug}#breadcrumb`;
  const deitySlug = deity?.slug || stotra.deity;
  const deityName = deity?.name || stotra.deity;

  // #work node — the ancient text
  const workNode: Record<string, unknown> = {
    "@type": "CreativeWork",
    "@id": workId,
    name: stotra.titleEn,
    alternateName: stotra.title,
    inLanguage: ["sa", "hi"],
    genre: "Hindu devotional hymn",
    about: { "@id": deityConceptId(deitySlug) },
  };

  // sameAs — link the stotra entity to its Wikipedia + Wikidata records when known.
  // Builds Knowledge Graph entity-authority and gives Google a stable identifier.
  const workSameAs: string[] = [];
  if (stotra.wikipediaUrl) workSameAs.push(stotra.wikipediaUrl);
  if (stotra.wikidataUrl) workSameAs.push(stotra.wikidataUrl);
  if (workSameAs.length) workNode.sameAs = workSameAs;

  const workAuthor = resolveWorkAuthor(stotra);
  if (workAuthor) workNode.author = workAuthor;

  const classicalSource = resolveClassicalSource(stotra);
  if (classicalSource) {
    workNode.isBasedOn = {
      "@type": "CreativeWork",
      name: classicalSource,
    };
  }

  // #webpage node — the Article
  // Note: `breadcrumb` is a WebPage property, not Article — BreadcrumbList
  // lives as a sibling @graph node with its own @id. Google picks it up
  // without an explicit reference on Article.
  const articleNode = {
    "@type": "Article",
    "@id": pageId,
    url: `${STOTRA_BASE}/stotra/${stotra.slug}`,
    mainEntityOfPage: pageId,
    headline: `${stotra.titleEn} — ${stotra.title}`,
    description: stotra.seoDescription,
    image: `${STOTRA_BASE}/og-default.jpg`,
    inLanguage: "en",
    isPartOf: { "@id": STOTRA_WEBSITE_ID },
    about: { "@id": workId },
    author: EDITORIAL_AUTHOR_REF,
    publisher: ORG_PUBLISHER_REF,
    datePublished: stotra.createdAt,
    dateModified: stotra.updatedAt,
  };

  // #breadcrumb node (standalone sibling — Article doesn't need a `breadcrumb`
  // back-reference; Google finds this via the shared @graph)
  const breadcrumbNode = {
    "@type": "BreadcrumbList",
    "@id": breadcrumbId,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${STOTRA_BASE}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: deityName,
        item: `${STOTRA_BASE}/deity/${deitySlug}`,
      },
      { "@type": "ListItem", position: 3, name: stotra.titleEn },
    ],
  };

  return {
    "@context": "https://schema.org",
    "@graph": [articleNode, workNode, breadcrumbNode],
  };
}
