"use client";

import { useState } from "react";
import Link from "next/link";

export default function BulkImportPage() {
  const [jsonInput, setJsonInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ results: { slug: string; success: boolean; error?: string }[] } | null>(null);
  const [error, setError] = useState("");

  async function handleImport() {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const parsed = JSON.parse(jsonInput);
      const stotras = Array.isArray(parsed) ? parsed : [parsed];

      const res = await fetch("/api/admin/stotras", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stotras),
      });

      const data = await res.json();
      setResult(data);
    } catch (e) {
      setError(`Invalid JSON: ${String(e)}`);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-brand text-white px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="font-serif text-xl font-bold">Bulk Import</h1>
          <Link href="/admin" className="text-sm text-white/70 hover:text-white transition-colors">
            Back to Dashboard
          </Link>
        </div>
      </header>
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl p-6 border border-border-light mb-6">
          <p className="text-sm text-text-muted mb-4">
            Paste a JSON array of stotra objects. Each object must follow the stotra schema with at minimum: slug, title, titleEn, deity, devanagariText, and isPublished fields.
          </p>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-border focus:border-brand outline-none font-mono text-xs leading-relaxed"
            rows={20}
            placeholder='[{"slug": "example", "title": "...", ...}]'
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">{error}</div>
        )}

        {result && (
          <div className="bg-white rounded-xl p-6 border border-border-light mb-6">
            <h3 className="font-semibold text-brand mb-3">Import Results</h3>
            {result.results.map((r, i) => (
              <div key={i} className="flex items-center justify-between py-1 text-sm">
                <span className="text-text">{r.slug}</span>
                <span className={r.success ? "text-green-600" : "text-red-600"}>
                  {r.success ? "Success" : r.error}
                </span>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleImport}
          disabled={loading || !jsonInput.trim()}
          className="bg-brand text-white font-medium px-6 py-3 rounded-xl hover:bg-brand-light transition-colors disabled:opacity-50"
        >
          {loading ? "Importing..." : "Import Stotras"}
        </button>
      </div>
    </div>
  );
}
