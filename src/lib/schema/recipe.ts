/**
 * Vrat Katha schema — Article always, Recipe ONLY if samagri + steps exist.
 * Per 06 §2.6.
 */
import {
  STOTRA_BASE,
  STOTRA_WEBSITE_ID,
  EDITORIAL_AUTHOR_REF,
  ORG_PUBLISHER_REF,
} from "./ids";
import type { Stotra } from "@/types";

/**
 * Vrat katha pages are served via /stotra/{slug} today (same route as other
 * stotras), but the conceptual URL per spec is /vrat-katha/{slug}. We emit
 * schema using the actual served path so URLs match.
 */
export function buildVratKathaGraph(
  vrat: Stotra,
  servedPath: string
): object {
  const webpageId = `${STOTRA_BASE}${servedPath}#webpage`;
  const breadcrumbId = `${STOTRA_BASE}${servedPath}#breadcrumb`;

  const graph: Array<Record<string, unknown>> = [
    {
      "@type": "Article",
      "@id": webpageId,
      url: `${STOTRA_BASE}${servedPath}`,
      mainEntityOfPage: webpageId,
      headline: vrat.titleEn,
      alternativeHeadline: vrat.title,
      description: vrat.seoDescription,
      image: `${STOTRA_BASE}/og-default.jpg`,
      inLanguage: "en",
      isPartOf: { "@id": STOTRA_WEBSITE_ID },
      author: EDITORIAL_AUTHOR_REF,
      publisher: ORG_PUBLISHER_REF,
      datePublished: vrat.createdAt,
      dateModified: vrat.updatedAt,
    },
    {
      "@type": "BreadcrumbList",
      "@id": breadcrumbId,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${STOTRA_BASE}/` },
        {
          "@type": "ListItem",
          position: 2,
          name: "Vrat Katha",
          item: `${STOTRA_BASE}/vrat-katha`,
        },
        { "@type": "ListItem", position: 3, name: vrat.titleEn },
      ],
    },
  ];

  // Recipe schema is conditional — requires samagri and steps data.
  // Current stotra data model does not carry samagri/steps, so we skip
  // Recipe emission entirely. Do NOT stub or placeholder.

  return { "@context": "https://schema.org", "@graph": graph };
}
