import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getMantrasByAxis, MANTRA_AXES } from "@/lib/mantra";
import type { MantraAxis } from "@/types";
import { buildHubPageGraph, STOTRA_BASE } from "@/lib/schema";
import { siteOpenGraph, siteTwitter } from "@/lib/seo-meta";

export function generateStaticParams() {
  return MANTRA_AXES.map((a) => ({ axis: a.axis }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ axis: string }>;
}): Promise<Metadata> {
  const { axis } = await params;
  const meta = MANTRA_AXES.find((a) => a.axis === axis);
  if (!meta) return {};
  const items = getMantrasByAxis(axis as MantraAxis);
  const title = `${meta.label} Mantras (${items.length}) — Sanskrit, Vidhi & Benefits`;
  const description = `${meta.blurb}. ${items.length} authentic mantras with Devanagari, transliteration, classical source, and step-by-step vidhi.`;
  const path = `/mantra/${axis}`;
  return {
    title: { absolute: `${title} | Stotra by VastuCart` },
    description,
    alternates: { canonical: path },
    openGraph: siteOpenGraph({ path, title, description, type: "website" }),
    twitter: siteTwitter({ path, title, description }),
  };
}

export default async function MantraAxisHub({
  params,
}: {
  params: Promise<{ axis: string }>;
}) {
  const { axis } = await params;
  const meta = MANTRA_AXES.find((a) => a.axis === axis);
  if (!meta) notFound();
  const items = getMantrasByAxis(axis as MantraAxis);

  const graph = buildHubPageGraph({
    path: `/mantra/${axis}`,
    name: `${meta.label} Mantras`,
    description: meta.blurb,
    breadcrumbName: "Mantras",
    items: items.map((m) => ({
      name: `${m.name.en} Mantra`,
      url: `${STOTRA_BASE}/mantra/${axis}/${m.slug}`,
      description: m.whatIs.slice(0, 160),
    })),
  });

  return (
    <div className="mx-auto max-w-[1100px] px-4 sm:px-6 lg:px-8 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />
      <nav className="flex items-center gap-2 text-xs text-text-muted mb-6">
        <Link href="/" className="hover:text-brand">Home</Link><span>/</span>
        <Link href="/mantra" className="hover:text-brand">Mantras</Link><span>/</span>
        <span className="text-text capitalize">{axis}</span>
      </nav>

      <header className="text-center mb-10">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-brand">{meta.label} Mantras</h1>
        <p className="text-text-light mt-2 max-w-xl mx-auto">{meta.blurb}</p>
        <div className="mt-4 mx-auto w-24 h-1 rounded-full bg-gradient-to-r from-brand via-gold to-saffron" />
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((m) => (
          <Link
            key={m.slug}
            href={`/mantra/${axis}/${m.slug}`}
            className="group block bg-white rounded-xl p-5 border border-border-light hover:border-gold/40 hover:shadow-card transition-all"
          >
            <h2 className="font-serif text-lg font-semibold text-brand group-hover:text-brand-light">{m.name.en}</h2>
            {m.name.hi && <p className="devanagari-heading text-sm text-text-muted mt-0.5">{m.name.hi}</p>}
            <p className="text-sm text-text-muted mt-2 line-clamp-3">{m.whatIs.slice(0, 140)}…</p>
            <span className="inline-block mt-3 text-xs font-medium text-saffron group-hover:text-orange">View mantra →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
