"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Stotra, DeityId, DayId, FestivalId, PurposeId } from "@/types";
import { DEITIES } from "@/data/deities";
import { DAYS } from "@/data/days";
import { FESTIVALS } from "@/data/festivals";
import { PURPOSES } from "@/data/purposes";
import { slugify, estimateReadingTime } from "@/lib/utils";

interface StotraFormProps {
  initialData?: Stotra;
  mode: "add" | "edit";
}

const EMPTY_STOTRA: Omit<Stotra, "id" | "createdAt" | "updatedAt"> = {
  title: "",
  titleEn: "",
  slug: "",
  devanagariText: "",
  transliteration: "",
  hindiMeaning: "",
  viniyog: null,
  benefits: [""],
  deity: "ganesha",
  secondaryDeities: [],
  days: [],
  festivals: [],
  purposes: [],
  readingTimeMinutes: 1,
  seoDescription: "",
  verseCount: 0,
  source: "",
  isPublished: false,
};

export function StotraForm({ initialData, mode }: StotraFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<Partial<Stotra>>(
    initialData || {
      ...EMPTY_STOTRA,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  );
  const [showViniyog, setShowViniyog] = useState(!!initialData?.viniyog);

  function updateField<K extends keyof Stotra>(key: K, value: Stotra[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleTitleEnChange(titleEn: string) {
    updateField("titleEn", titleEn);
    if (mode === "add") {
      updateField("slug", slugify(titleEn));
    }
  }

  function handleTextChange(text: string) {
    updateField("devanagariText", text);
    const lines = text.split("\n").filter((l) => l.trim());
    updateField("verseCount", lines.length);
    updateField("readingTimeMinutes", estimateReadingTime(text));
  }

  function toggleArrayItem<T extends string>(arr: T[], item: T): T[] {
    return arr.includes(item) ? arr.filter((a) => a !== item) : [...arr, item];
  }

  async function handleSubmit(publish: boolean) {
    setSaving(true);
    setError("");
    const stotra: Stotra = {
      ...(form as Stotra),
      isPublished: publish,
      updatedAt: new Date().toISOString(),
      benefits: (form.benefits || []).filter((b) => b.trim()),
    };

    const url = mode === "edit" ? `/api/admin/stotras/${initialData?.slug}` : "/api/admin/stotras";
    const method = mode === "edit" ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(stotra),
    });

    if (res.ok) {
      router.push("/admin/manage");
    } else {
      const data = await res.json();
      setError(data.error || "Failed to save");
    }
    setSaving(false);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <section className="bg-white rounded-xl p-6 border border-border-light">
        <h2 className="font-serif text-lg font-semibold text-brand mb-4">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text mb-1">Title (Devanagari)</label>
            <input type="text" value={form.title || ""} onChange={(e) => updateField("title", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border focus:border-brand outline-none text-text" placeholder="गणेश अथर्वशीर्ष" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">Title (English)</label>
            <input type="text" value={form.titleEn || ""} onChange={(e) => handleTitleEnChange(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border focus:border-brand outline-none text-text" placeholder="Ganesh Atharvashirsha" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">Slug</label>
            <input type="text" value={form.slug || ""} onChange={(e) => updateField("slug", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border focus:border-brand outline-none text-text-light text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">Source</label>
            <input type="text" value={form.source || ""} onChange={(e) => updateField("source", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border focus:border-brand outline-none text-text" placeholder="Atharvaveda" />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-text mb-1">SEO Description</label>
          <textarea value={form.seoDescription || ""} onChange={(e) => updateField("seoDescription", e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-border focus:border-brand outline-none text-text" rows={2} placeholder="Brief description for search engines..." />
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white rounded-xl p-6 border border-border-light">
        <h2 className="font-serif text-lg font-semibold text-brand mb-4">Categories</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text mb-2">Primary Deity</label>
            <select value={form.deity || "ganesha"} onChange={(e) => updateField("deity", e.target.value as DeityId)}
              className="w-full px-3 py-2 rounded-lg border border-border focus:border-brand outline-none text-text">
              {DEITIES.map((d) => <option key={d.id} value={d.id}>{d.name} ({d.nameHi})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-2">Days</label>
            <div className="flex flex-wrap gap-2">
              {DAYS.map((day) => (
                <button key={day.id} type="button" onClick={() => updateField("days", toggleArrayItem(form.days || [], day.id as DayId))}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${(form.days || []).includes(day.id) ? "bg-brand text-white border-brand" : "bg-white text-text border-border hover:border-brand/30"}`}>
                  {day.name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-2">Festivals</label>
            <div className="flex flex-wrap gap-2">
              {FESTIVALS.map((f) => (
                <button key={f.id} type="button" onClick={() => updateField("festivals", toggleArrayItem(form.festivals || [], f.id as FestivalId))}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${(form.festivals || []).includes(f.id) ? "bg-brand text-white border-brand" : "bg-white text-text border-border hover:border-brand/30"}`}>
                  {f.name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-2">Purposes</label>
            <div className="flex flex-wrap gap-2">
              {PURPOSES.map((p) => (
                <button key={p.id} type="button" onClick={() => updateField("purposes", toggleArrayItem(form.purposes || [], p.id as PurposeId))}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${(form.purposes || []).includes(p.id) ? "bg-brand text-white border-brand" : "bg-white text-text border-border hover:border-brand/30"}`}>
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Viniyog */}
      <section className="bg-white rounded-xl p-6 border border-border-light">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-lg font-semibold text-brand">Viniyog</h2>
          <button type="button" onClick={() => {
            setShowViniyog(!showViniyog);
            if (!showViniyog) updateField("viniyog", { rishi: "", chhand: "", devata: "", beej: "", shakti: "", kilak: "", shloka: "" });
            else updateField("viniyog", null);
          }} className="text-sm text-brand hover:text-brand-light transition-colors">
            {showViniyog ? "Remove" : "Add Viniyog"}
          </button>
        </div>
        {showViniyog && form.viniyog && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(["rishi", "chhand", "devata", "beej", "shakti", "kilak", "shloka"] as const).map((field) => (
              <div key={field}>
                <label className="block text-xs font-medium text-text-muted mb-1 capitalize">{field}</label>
                <input type="text" value={form.viniyog?.[field] ?? ""} onChange={(e) => updateField("viniyog", { ...form.viniyog!, [field]: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border focus:border-brand outline-none text-sm" />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Content */}
      <section className="bg-white rounded-xl p-6 border border-border-light">
        <h2 className="font-serif text-lg font-semibold text-brand mb-4">Content</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text mb-1">Devanagari Text</label>
            <textarea value={form.devanagariText || ""} onChange={(e) => handleTextChange(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border focus:border-brand outline-none font-[var(--font-devanagari)] leading-loose text-lg" rows={12} placeholder="ॐ नमस्ते गणपतये..." />
            <p className="text-xs text-text-muted mt-1">{form.verseCount || 0} lines &middot; ~{form.readingTimeMinutes || 1} min read</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">Transliteration (IAST)</label>
            <textarea value={form.transliteration || ""} onChange={(e) => updateField("transliteration", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border focus:border-brand outline-none italic" rows={8} placeholder="Om namaste ganapataye..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">Hindi Meaning</label>
            <textarea value={form.hindiMeaning || ""} onChange={(e) => updateField("hindiMeaning", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border focus:border-brand outline-none" rows={8} placeholder="Hindi translation/meaning..." />
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-white rounded-xl p-6 border border-border-light">
        <h2 className="font-serif text-lg font-semibold text-brand mb-4">Benefits</h2>
        {(form.benefits || [""]).map((benefit, i) => (
          <div key={i} className="flex items-center gap-2 mb-2">
            <input type="text" value={benefit} onChange={(e) => {
              const updated = [...(form.benefits || [])];
              updated[i] = e.target.value;
              updateField("benefits", updated);
            }} className="flex-1 px-3 py-2 rounded-lg border border-border focus:border-brand outline-none text-sm" placeholder="Benefit..." />
            <button type="button" onClick={() => {
              const updated = (form.benefits || []).filter((_, idx) => idx !== i);
              updateField("benefits", updated.length ? updated : [""]);
            }} className="text-red-400 hover:text-red-600 text-sm px-2">Remove</button>
          </div>
        ))}
        <button type="button" onClick={() => updateField("benefits", [...(form.benefits || []), ""])}
          className="text-sm text-brand hover:text-brand-light mt-2">+ Add Benefit</button>
      </section>

      {/* Actions */}
      <div className="flex items-center gap-3 pb-12">
        <button onClick={() => handleSubmit(false)} disabled={saving}
          className="bg-white border border-border text-text font-medium px-6 py-3 rounded-xl hover:border-brand/30 transition-colors disabled:opacity-50">
          Save as Draft
        </button>
        <button onClick={() => handleSubmit(true)} disabled={saving}
          className="bg-brand text-white font-medium px-6 py-3 rounded-xl hover:bg-brand-light transition-colors disabled:opacity-50">
          {saving ? "Saving..." : "Publish"}
        </button>
        <button onClick={() => router.back()} className="text-sm text-text-muted hover:text-text transition-colors ml-auto">
          Cancel
        </button>
      </div>
    </div>
  );
}
