/**
 * WebSite + Brand schema for the stotra subdomain homepage only.
 * Per 06 §1.1, this is scoped to the homepage — not root layout.
 */
import {
  STOTRA_WEBSITE_ID,
  STOTRA_BRAND_ID,
  STOTRA_BASE,
  ORG_ID,
  ORG_LOGO,
} from "./ids";

export function buildStotraWebsiteSchema(stotraCount: number): object {
  const description =
    stotraCount >= 1000
      ? `Collection of 1,000+ Hindu stotras, chalisas, the Bhagavad Gita (18 chapters, 701 verses per Gita Press edition), and Vrat Katha in Sanskrit and Hindi with transliteration and meaning.`
      : `Collection of ${stotraCount} Hindu stotras, chalisas, the Bhagavad Gita (18 chapters, 701 verses per Gita Press edition), and Vrat Katha in Sanskrit and Hindi with transliteration and meaning.`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": STOTRA_WEBSITE_ID,
        url: `${STOTRA_BASE}/`,
        name: "Stotra by VastuCart",
        description,
        inLanguage: ["sa", "hi", "en"],
        publisher: { "@id": ORG_ID },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${STOTRA_BASE}/search?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Brand",
        "@id": STOTRA_BRAND_ID,
        name: "VastuCart\u00AE",
        url: "https://vastucart.in/",
        logo: ORG_LOGO,
        slogan: "Divinely Perfect",
      },
    ],
  };
}
