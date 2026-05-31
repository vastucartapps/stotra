import type { Metadata } from "next";
import Link from "next/link";
import { MANTRA_AXES, getMantrasByAxis, getMantraCount } from "@/lib/mantra";
import { buildHubPageGraph, STOTRA_BASE } from "@/lib/schema";
import { siteOpenGraph, siteTwitter } from "@/lib/seo-meta";

const PAGE_TITLE = "Hindu Mantras — Bija, Gayatri & Remedial Mantras by Planet, Rashi, Nakshatra & Day";
const PAGE_DESC =
  "Authentic Hindu mantras organised by planet (Navagraha), zodiac sign, birth star and weekday — each with Sanskrit Devanagari, transliteration, classical source, and step-by-step vidhi (how to chant).";

export function generateMetadata(): Metadata {
  return {
    title: { absolute: `${PAGE_TITLE} | Stotra by VastuCart` },
    description: PAGE_DESC,
    alternates: { canonical: "/mantra" },
    openGraph: siteOpenGraph({ path: "/mantra", title: PAGE_TITLE, description: PAGE_DESC, type: "website" }),
    twitter: siteTwitter({ path: "/mantra", title: PAGE_TITLE, description: PAGE_DESC }),
  };
}

export default function MantraPillar() {
  const count = getMantraCount();
  const graph = buildHubPageGraph({
    path: "/mantra",
    name: "Hindu Mantras",
    description: PAGE_DESC,
    breadcrumbName: "Mantras",
    items: MANTRA_AXES.flatMap((a) =>
      getMantrasByAxis(a.axis).map((m) => ({
        name: `${m.name.en} Mantra`,
        url: `${STOTRA_BASE}/mantra/${a.axis}/${m.slug}`,
      }))
    ),
    about: {
      name: "Mantra (Hindu sacred sound formula)",
      description:
        "A mantra is a sacred sound, syllable, or phrase from the Vedic and Tantric traditions, chanted for spiritual or remedial effect. Bija (seed) mantras, Gayatri mantras, and naam (name) mantras are the principal forms.",
      sameAs: ["https://en.wikipedia.org/wiki/Mantra", "https://www.wikidata.org/wiki/Q193291"],
    },
  });

  return (
    <div className="mx-auto max-w-[1100px] px-4 sm:px-6 lg:px-8 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />
      <nav className="flex items-center gap-2 text-xs text-text-muted mb-6">
        <Link href="/" className="hover:text-brand">Home</Link><span>/</span><span className="text-text">Mantras</span>
      </nav>

      <header className="text-center mb-10">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-brand">Hindu Mantras</h1>
        <p className="text-text-light mt-3 max-w-2xl mx-auto leading-relaxed">
          A mantra is a sacred formula of sound — a seed (bija), a name, or a Gayatri verse — chanted to steady the mind and
          strengthen a planet, sign, or birth star. Every mantra here carries its Sanskrit Devanagari, transliteration, the
          classical text it comes from, and a clear vidhi for how to chant it.
        </p>
        <p className="text-xs text-text-muted mt-3">{count} mantras across {MANTRA_AXES.length} categories</p>
        <div className="mt-4 mx-auto w-24 h-1 rounded-full bg-gradient-to-r from-brand via-gold to-saffron" />
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {MANTRA_AXES.map((a) => {
          const items = getMantrasByAxis(a.axis);
          return (
            <Link
              key={a.axis}
              href={`/mantra/${a.axis}`}
              className="group block bg-white rounded-2xl p-6 border border-border-light hover:border-gold/40 hover:shadow-card transition-all"
            >
              <div className="flex items-baseline justify-between">
                <h2 className="font-serif text-xl font-semibold text-brand group-hover:text-brand-light">{a.label}</h2>
                <span className="devanagari-heading text-base text-text-muted">{a.hi}</span>
              </div>
              <p className="text-sm text-text-muted mt-2">{a.blurb}</p>
              <p className="text-xs text-saffron font-medium mt-3">{items.length} mantras →</p>
            </Link>
          );
        })}
      </div>

      <section className="mt-10 bg-cream-mid rounded-2xl p-6 border border-gold/20">
        <h2 className="font-serif text-lg font-semibold text-brand mb-2">A note on authenticity</h2>
        <p className="text-sm text-text-muted leading-relaxed">
          Seed mantras here follow the Mantra Mahodadhi; the parallel Vedic name mantras are shown alongside, never merged.
          Planet-to-sign and nakshatra lordships follow the Brihat Parashara Hora Shastra. Where an association is a later
          convention rather than a scriptural verse, the page says so plainly.
        </p>
      </section>
    </div>
  );
}
