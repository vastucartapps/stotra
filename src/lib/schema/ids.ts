/**
 * Canonical `@id` strings — per 00-shared-contracts.md §2.
 * These are REFERENCES ONLY. This subdomain does not canonically emit
 * Organization or Person — vastucart.in and blog.vastucart.in do.
 */

export const ORG_ID = "https://www.vastucart.in/#organization";
export const ORG_LOGO = "https://www.vastucart.in/logo.png";
export const ORG_URL = "https://www.vastucart.in/";

export const EDITORIAL_PERSON_ID =
  "https://blog.vastucart.in/authors/vastucart-editorial#person";

/** Reference object for author @id with minimal hints — not a redefinition. */
export const EDITORIAL_AUTHOR_REF = {
  "@type": "Person",
  "@id": EDITORIAL_PERSON_ID,
  name: "VastuCart Editorial",
  url: "https://blog.vastucart.in/authors/vastucart-editorial",
} as const;

/** Reference object for publisher @id with minimal hints — not a redefinition. */
export const ORG_PUBLISHER_REF = {
  "@type": "Organization",
  "@id": ORG_ID,
  name: "VastuCart",
  url: ORG_URL,
  logo: ORG_LOGO,
} as const;

export const STOTRA_WEBSITE_ID = "https://stotra.vastucart.in/#website";
export const STOTRA_BRAND_ID = "https://stotra.vastucart.in/#brand";

export const STOTRA_BASE = "https://stotra.vastucart.in";

// Note: prior `deityConceptId(slug)` returned a non-resolving URI under
// `https://www.vastucart.in/concepts/...` that broke Google's entity
// resolution on every stotra page. Removed in favour of inline `Thing` nodes
// with sameAs to Wikipedia/Wikidata — see buildStotraPageGraph.
