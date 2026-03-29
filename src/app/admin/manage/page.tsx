"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Stotra } from "@/types";

export default function ManageStotraPage() {
  const [stotras, setStotras] = useState<Stotra[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStotras();
  }, []);

  async function loadStotras() {
    const res = await fetch("/api/admin/stotras");
    const data = await res.json();
    setStotras(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  async function handleDelete(slug: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await fetch(`/api/admin/stotras/${slug}`, { method: "DELETE" });
    loadStotras();
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-brand text-white px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="font-serif text-xl font-bold">Manage Stotras</h1>
          <div className="flex items-center gap-4">
            <Link href="/admin/add" className="text-sm bg-white/10 hover:bg-white/20 px-4 py-1.5 rounded-lg transition-colors">
              + Add New
            </Link>
            <Link href="/admin" className="text-sm text-white/70 hover:text-white transition-colors">
              Dashboard
            </Link>
          </div>
        </div>
      </header>
      <div className="max-w-6xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-12 text-text-muted">Loading...</div>
        ) : stotras.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-border-light">
            <p className="text-text-muted mb-4">No stotras yet</p>
            <Link href="/admin/add" className="bg-brand text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-light transition-colors">
              Add Your First Stotra
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-border-light overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-light bg-cream-mid/30">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Title</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider hidden md:table-cell">Deity</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider hidden sm:table-cell">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider hidden lg:table-cell">Verses</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {stotras.map((stotra) => (
                  <tr key={stotra.slug} className="border-b border-border-light last:border-0 hover:bg-cream-mid/20 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-sm text-text">{stotra.titleEn}</p>
                      <p className="devanagari-heading text-xs text-text-muted">{stotra.title}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs text-text-muted capitalize">{stotra.deity}</span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${stotra.isPublished ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                        {stotra.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-sm text-text-muted">{stotra.verseCount}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/edit/${stotra.slug}`} className="text-xs text-brand hover:text-brand-light transition-colors">
                          Edit
                        </Link>
                        <button onClick={() => handleDelete(stotra.slug, stotra.titleEn)} className="text-xs text-red-500 hover:text-red-700 transition-colors">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
