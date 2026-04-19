/**
 * FAQPage schema — emitted only when FAQ answer text is in SSR HTML.
 * Our StotraFAQ component uses <details>/<summary> so answers are SSR.
 * Per 06 §2.2 and 00 §5.1 (content-schema coupling rule).
 */

export interface SchemaFAQItem {
  question: string;
  answer: string;
}

export function buildFaqPageSchema(
  faqs: SchemaFAQItem[] | undefined | null,
  pageUrl: string
): object | null {
  if (!faqs || faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
