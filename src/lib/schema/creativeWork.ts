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
} from "./ids";
import { resolveSourceWikidata } from "./source-entities";
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
  vedantadesika: {
    name: "Vedanta Desika",
    sameAs: [
      "https://en.wikipedia.org/wiki/Vedanta_Desika",
      "https://www.wikidata.org/wiki/Q3530291",
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
  if (src.includes("vedanta desika") || src.includes("vedantadesika"))
    return { "@type": "Person", ...TRADITIONAL_AUTHORS.vedantadesika };
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

  // Fragment matches type — was previously "#webpage" with type "Article",
  // a semantic mismatch that Google's Rich Results Test flags as inconsistent.
  const articleId = `${STOTRA_BASE}/stotra/${stotra.slug}#article`;
  const workId = `${STOTRA_BASE}/stotra/${stotra.slug}#work`;
  const breadcrumbId = `${STOTRA_BASE}/stotra/${stotra.slug}#breadcrumb`;
  const deityId = `${STOTRA_BASE}/stotra/${stotra.slug}#deity`;
  const deitySlug = deity?.slug || stotra.deity;
  const deityName = deity?.name || stotra.deity;

  // #deity node — replaces the prior @id reference to a non-resolving private
  // namespace (https://www.vastucart.in/concepts/<slug>#entity). Emit an inline
  // Thing so Google can match it to a known Knowledge Graph entity via sameAs.
  const deitySameAs: string[] = [];
  if (deity?.wikipediaUrl) deitySameAs.push(deity.wikipediaUrl);
  if (deity?.wikidataUrl) deitySameAs.push(deity.wikidataUrl);
  const deityNode: Record<string, unknown> = {
    "@type": "Thing",
    "@id": deityId,
    name: deityName,
  };
  if (deity?.nameHi) deityNode.alternateName = deity.nameHi;
  if (deity?.description) deityNode.description = deity.description;
  if (deitySameAs.length) deityNode.sameAs = deitySameAs;

  // #work node — the ancient text
  const workNode: Record<string, unknown> = {
    "@type": "CreativeWork",
    "@id": workId,
    name: stotra.titleEn,
    alternateName: stotra.title,
    inLanguage: ["sa", "hi"],
    genre: "Hindu devotional hymn",
    about: { "@id": deityId },
  };

  // sameAs — link the stotra entity to its Wikipedia + Wikidata records when known.
  // Builds Knowledge Graph entity-authority and gives Google a stable identifier.
  const workSameAs: string[] = [];
  if (stotra.wikipediaUrl) workSameAs.push(stotra.wikipediaUrl);
  if (stotra.wikidataUrl) workSameAs.push(stotra.wikidataUrl);
  if (workSameAs.length) workNode.sameAs = workSameAs;

  // abstract — a short machine-readable summary of the work (GEO: gives AI a
  // concise, citable description inside structured data, not just prose HTML).
  if (stotra.seoDescription) workNode.abstract = stotra.seoDescription;

  const workAuthor = resolveWorkAuthor(stotra);
  if (workAuthor) workNode.author = workAuthor;

  const classicalSource = resolveClassicalSource(stotra);
  if (classicalSource) {
    const sourceNode: Record<string, unknown> = {
      "@type": "CreativeWork",
      name: classicalSource,
    };
    // Entity-ground the source text to its Wikidata record when it is a known
    // classical scripture (Purana/Veda/epic). GEO: lets AI engines + Google
    // resolve "Markandeya Purana" etc. to a Knowledge Graph entity.
    const sourceWikidata = resolveSourceWikidata(stotra.source);
    if (sourceWikidata) sourceNode.sameAs = sourceWikidata;
    workNode.isBasedOn = sourceNode;
  }

  // #article node
  // Note: `breadcrumb` is a WebPage property, not Article — BreadcrumbList
  // lives as a sibling @graph node with its own @id. Google picks it up
  // without an explicit reference on Article.
  const articleUrl = `${STOTRA_BASE}/stotra/${stotra.slug}`;
  const articleBody = stotra.description || stotra.seoDescription || "";
  const articleNode: Record<string, unknown> = {
    "@type": "Article",
    "@id": articleId,
    url: articleUrl,
    // Google's Article rich-result spec prefers the object form so the
    // Article and its canonical page node are unambiguously the same entity.
    mainEntityOfPage: { "@id": articleId, "@type": "WebPage", url: articleUrl },
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
    // GEO: the unique on-page summary inside structured data + a word count,
    // so answer engines can extract a body without parsing the full DOM.
    articleBody,
    wordCount: articleBody ? articleBody.split(/\s+/).filter(Boolean).length : undefined,
    // speakable: tells voice/AI surfaces which DOM regions are the citable
    // answer — the H1, the Key Facts table (#key-facts), and the unique
    // About summary (#about-summary). Matches the ids set in StotraContent.
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "#key-facts", "#about-summary"],
    },
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
    "@graph": [articleNode, workNode, deityNode, breadcrumbNode],
  };
}
