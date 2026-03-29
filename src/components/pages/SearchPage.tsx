"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import type { Stotra, DeityId } from "@/types";
import { DEITIES } from "@/data/deities";
import { StotraCard } from "@/components/stotra/StotraCard";

export function SearchPageContent({ stotras }: { stotras: Stotra[] }) {
  const [query, setQuery] = useState("");
  const [deityFilter, setDeityFilter] = useState<DeityId | "">("");

  const results = useMemo(() => {
    let filtered = stotras;

    if (deityFilter) {
      filtered = filtered.filter(
        (s) => s.deity === deityFilter || s.secondaryDeities?.includes(deityFilter)
      );
    }

    if (query.trim()) {
      const q = query.toLowerCase().trim();
      filtered = filtered.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.titleEn.toLowerCase().includes(q) ||
          s.deity.toLowerCase().includes(q) ||
          s.seoDescription.toLowerCase().includes(q) ||
          s.devanagariText.includes(query)
      );
    }

    return filtered;
  }, [stotras, query, deityFilter]);

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

      {/* Results */}
      {results.length > 0 ? (
        <>
          <p className="text-sm text-text-muted mb-4">
            {results.length} stotra{results.length !== 1 ? "s" : ""} found
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {results.map((s) => (
              <StotraCard key={s.slug} stotra={s} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-border-light">
          <p className="text-text-muted mb-2">No stotras found</p>
          <p className="text-sm text-text-muted">
            Try a different search term or clear filters
          </p>
        </div>
      )}
    </div>
  );
}
