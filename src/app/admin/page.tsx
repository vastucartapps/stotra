"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Stotra } from "@/types";
import { DEITIES } from "@/data/deities";

export default function AdminDashboard() {
  const [stotras, setStotras] = useState<Stotra[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/admin/stotras")
      .then((r) => r.json())
      .then((data) => {
        setStotras(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  }

  const published = stotras.filter((s) => s.isPublished).length;
  const drafts = stotras.filter((s) => !s.isPublished).length;

  return (
    <div className="min-h-screen bg-cream">
      {/* Admin Header */}
      <header className="bg-brand text-white px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-serif text-xl font-bold">Stotra Admin</h1>
            <p className="text-xs text-white/60">by VastuCart</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-white/70 hover:text-white transition-colors">
              View Site
            </Link>
            <button onClick={handleLogout} className="text-sm text-white/70 hover:text-white transition-colors">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Link href="/admin/add" className="bg-white rounded-xl p-5 border border-border-light hover:border-brand/30 hover:shadow-card transition-all text-center">
            <span className="text-2xl mb-1 block">+</span>
            <span className="text-sm font-medium text-brand">Add Stotra</span>
          </Link>
          <Link href="/admin/manage" className="bg-white rounded-xl p-5 border border-border-light hover:border-brand/30 hover:shadow-card transition-all text-center">
            <span className="text-2xl mb-1 block">&#9776;</span>
            <span className="text-sm font-medium text-brand">Manage</span>
          </Link>
          <Link href="/admin/import" className="bg-white rounded-xl p-5 border border-border-light hover:border-brand/30 hover:shadow-card transition-all text-center">
            <span className="text-2xl mb-1 block">&#8593;</span>
            <span className="text-sm font-medium text-brand">Bulk Import</span>
          </Link>
          <Link href="/" className="bg-white rounded-xl p-5 border border-border-light hover:border-brand/30 hover:shadow-card transition-all text-center">
            <span className="text-2xl mb-1 block">&#8599;</span>
            <span className="text-sm font-medium text-brand">View Site</span>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12 text-text-muted">Loading...</div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-xl p-5 border border-border-light">
                <p className="text-3xl font-bold text-brand">{stotras.length}</p>
                <p className="text-sm text-text-muted">Total Stotras</p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-border-light">
                <p className="text-3xl font-bold text-green-700">{published}</p>
                <p className="text-sm text-text-muted">Published</p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-border-light">
                <p className="text-3xl font-bold text-orange">{drafts}</p>
                <p className="text-sm text-text-muted">Drafts</p>
              </div>
            </div>

            {/* By Deity */}
            <div className="bg-white rounded-xl p-6 border border-border-light">
              <h2 className="font-serif text-lg font-semibold text-brand mb-4">Stotras by Deity</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {DEITIES.map((deity) => {
                  const count = stotras.filter(
                    (s) => s.deity === deity.id || s.secondaryDeities?.includes(deity.id)
                  ).length;
                  return (
                    <div key={deity.id} className="flex items-center justify-between bg-cream-mid/50 rounded-lg px-3 py-2">
                      <span className="text-sm text-text">{deity.name}</span>
                      <span className="text-sm font-semibold text-brand">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
