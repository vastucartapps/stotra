"use client";

import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import type { StotraCardSummary, DeityId } from "@/types";
import { DEITIES } from "@/data/deities";
import { StotraCard } from "@/components/stotra/StotraCard";

const PAGE_SIZE = 48;
const DEBOUNCE_MS = 250;

interface SearchResponse {
  total: number;
  results: StotraCardSummary[];
}

async function fetchPage(
  q: string,
  deity: DeityId | "",
  offset: number,
  signal: AbortSignal
): Promise<SearchResponse> {
  const params = new URLSearchParams({ q, offset: String(offset), limit: String(PAGE_SIZE) });
  if (deity) params.set("deity", deity);
  const res = await fetch(`/api/search?${params}`, { signal });
  if (!res.ok) throw new Error(`search failed: ${res.status}`);
  return res.json();
}

export function SearchPageContent({
  initial,
  total: initialTotal,
}: {
  initial: StotraCardSummary[];
  total: number;
}) {
  const [query, setQuery] = useState("");
  const [deityFilter, setDeityFilter] = useState<DeityId | "">("");
  const [results, setResults] = useState(initial);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const firstRun = useRef(true);
  const controller = useRef<AbortController | null>(null);

  // New query or filter → first page of the new results (debounced).
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    const timer = setTimeout(() => {
      controller.current?.abort();
      const c = (controller.current = new AbortController());
      setLoading(true);
      setFailed(false);
      fetchPage(query, deityFilter, 0, c.signal)
        .then((r) => {
          setResults(r.results);
          setTotal(r.total);
        })
        .catch((e) => {
          if (e.name !== "AbortError") setFailed(true);
        })
        .finally(() => {
          if (controller.current === c) setLoading(false);
        });
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query, deityFilter]);

  useEffect(() => () => controller.current?.abort(), []);

  const loadMore = () => {
    controller.current?.abort();
    const c = (controller.current = new AbortController());
    setLoading(true);
    setFailed(false);
    fetchPage(query, deityFilter, results.length, c.signal)
      .then((r) => {
        setResults((prev) => [...prev, ...r.results]);
        setTotal(r.total);
      })
      .catch((e) => {
        if (e.name !== "AbortError") setFailed(true);
      })
      .finally(() => {
        if (controller.current === c) setLoading(false);
      });
  };

  return (
    <div>
      {/* Search Input */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            maxLength={100}
            aria-label="Search stotras"
            placeholder="Search by name, deity, or keyword..."
            className="w-full pl-12 pr-4 py-4 rounded-xl bg-white border border-border focus:border-brand focus:ring-2 focus:ring-brand/10 outline-none text-text placeholder:text-text-muted transition-all duration-200"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
        <select
          value={deityFilter}
          onChange={(e) => setDeityFilter(e.target.value as DeityId | "")}
          aria-label="Filter by deity"
          className="bg-white border border-border rounded-lg px-4 py-2 text-sm text-text outline-none focus:border-brand transition-colors"
        >
          <option value="">All Deities</option>
          {DEITIES.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name} ({d.nameHi})
            </option>
          ))}
        </select>
      </div>

      {failed && (
        <p role="alert" className="text-center text-sm text-red-700 mb-4">
          Search is unavailable right now. Please try again in a moment.
        </p>
      )}

      {/* Results */}
      {results.length > 0 ? (
        <>
          <p className="text-sm text-text-muted mb-4" role="status" aria-live="polite">
            {total} stotra{total !== 1 ? "s" : ""} found
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" aria-busy={loading}>
            {results.map((s) => (
              <StotraCard key={s.slug} stotra={s} />
            ))}
          </div>
          {results.length < total && (
            <div className="text-center mt-8">
              <button
                type="button"
                onClick={loadMore}
                disabled={loading}
                className="inline-flex items-center gap-2 bg-brand text-white text-sm font-medium px-6 py-3 rounded-lg hover:bg-brand-light transition-colors duration-200 disabled:opacity-60"
              >
                {loading ? "Loading…" : `Show more (${total - results.length} left)`}
              </button>
            </div>
          )}
        </>
      ) : (
        !loading && (
          <div className="text-center py-16 bg-white rounded-xl border border-border-light">
            <p className="text-text-muted mb-2">No stotras found</p>
            <p className="text-sm text-text-muted">Try a different search term or clear filters</p>
          </div>
        )
      )}
    </div>
  );
}
