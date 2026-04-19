/**
 * Schema module entry point. Per 00 §5.5.
 */
export * from "./ids";
export { buildStotraWebsiteSchema } from "./website";
export { buildStotraPageGraph } from "./creativeWork";
export { buildFaqPageSchema } from "./faqPage";
export type { SchemaFAQItem } from "./faqPage";
export {
  buildDeityPageGraph,
  buildTaxonomyPageGraph,
  buildHubPageGraph,
  buildStaticArticleGraph,
} from "./collectionPage";
export type {
  TaxonomyPageInput,
  HubPageInput,
  StaticArticleInput,
} from "./collectionPage";
export {
  buildGitaBookSchema,
  buildGitaChapterGraph,
  buildGitaVerseGraph,
} from "./book";
export { buildVratKathaGraph } from "./recipe";
