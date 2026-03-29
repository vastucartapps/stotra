"use client";

import Link from "next/link";
import { StotraForm } from "@/components/admin/StotraForm";

export default function AddStotraPage() {
  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-brand text-white px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="font-serif text-xl font-bold">Add New Stotra</h1>
          <Link href="/admin" className="text-sm text-white/70 hover:text-white transition-colors">
            Back to Dashboard
          </Link>
        </div>
      </header>
      <div className="px-6 py-8">
        <StotraForm mode="add" />
      </div>
    </div>
  );
}
