"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { StotraForm } from "@/components/admin/StotraForm";
import type { Stotra } from "@/types";

export default function EditStotraPage() {
  const { slug } = useParams<{ slug: string }>();
  const [stotra, setStotra] = useState<Stotra | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/stotras/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setStotra(null);
        else setStotra(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-brand text-white px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="font-serif text-xl font-bold">Edit Stotra</h1>
          <Link href="/admin/manage" className="text-sm text-white/70 hover:text-white transition-colors">
            Back to Manage
          </Link>
        </div>
      </header>
      <div className="px-6 py-8">
        {loading ? (
          <div className="text-center py-12 text-text-muted">Loading...</div>
        ) : stotra ? (
          <StotraForm mode="edit" initialData={stotra} />
        ) : (
          <div className="text-center py-12 text-text-muted">Stotra not found</div>
        )}
      </div>
    </div>
  );
}
