import type { Stotra } from "../types/index";

/** Results per page for /api/search and the search page. */
export const SEARCH_PAGE_SIZE = 48;
const MAX_QUERY_LENGTH = 100;

export interface SearchParams {
  q: string;
  deity: string;
  offset: number;
  limit: number;
}

/** Untrusted query string → bounded, validated parameters. */
export function parseSearchParams(params: URLSearchParams, validDeities: readonly string[]): SearchParams {
  const q = (params.get("q") ?? "").slice(0, MAX_QUERY_LENGTH);
  const deityRaw = params.get("deity") ?? "";
  const offset = Number.parseInt(params.get("offset") ?? "0", 10);
  const limit = Number.parseInt(params.get("limit") ?? "", 10);
  return {
    q,
    deity: validDeities.includes(deityRaw) ? deityRaw : "",
    offset: Number.isFinite(offset) && offset > 0 ? offset : 0,
    limit: Number.isFinite(limit) && limit > 0 ? Math.min(limit, SEARCH_PAGE_SIZE) : SEARCH_PAGE_SIZE,
  };
}

/**
 * Same matching rules the page used to run in the browser (name, English name,
 * deity, description, and the Devanagari text), now run on the server so the
 * full texts are never shipped to the client.
 */
export function filterStotras(all: Stotra[], query: string, deity: string): Stotra[] {
  let filtered = all;
  if (deity) {
    filtered = filtered.filter((s) => s.deity === deity || s.secondaryDeities?.includes(deity as never));
  }
  const raw = query.trim();
  if (raw) {
    const q = raw.toLowerCase();
    filtered = filtered.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.titleEn.toLowerCase().includes(q) ||
        s.deity.toLowerCase().includes(q) ||
        s.seoDescription.toLowerCase().includes(q) ||
        s.devanagariText.includes(raw)
    );
  }
  return filtered;
}
