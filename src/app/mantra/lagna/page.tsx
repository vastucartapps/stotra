import type { Metadata } from "next";
import Link from "next/link";
import { getMantrasByAxis } from "@/lib/mantra";
import { buildHubPageGraph, STOTRA_BASE } from "@/lib/schema";
import { siteOpenGraph, siteTwitter } from "@/lib/seo-meta";

const PAGE_TITLE = "Lagna (Ascendant) Mantra — How to Find Your Rising-Sign Remedy";
const PAGE_DESC =
  "Your lagna (ascendant) mantra is the mantra of your lagna lord — the planet ruling your rising sign. Find your ascendant, then chant that planet's mantra. Explained with the classical rulerships.";

// Sign -> ruling planet (BPHS), same rulership the rashi pages use.
const SIGN_LORD: { sign: string; rashiSlug: string; lord: string; planetSlug: string }[] = [
  { sign: "Aries (Mesha)", rashiSlug: "mesha", lord: "Mars", planetSlug: "mangal" },
  { sign: "Taurus (Vrishabha)", rashiSlug: "vrishabha", lord: "Venus", planetSlug: "shukra" },
  { sign: "Gemini (Mithuna)", rashiSlug: "mithuna", lord: "Mercury", planetSlug: "budha" },
  { sign: "Cancer (Karka)", rashiSlug: "karka", lord: "Moon", planetSlug: "chandra" },
  { sign: "Leo (Simha)", rashiSlug: "simha", lord: "Sun", planetSlug: "surya" },
  { sign: "Virgo (Kanya)", rashiSlug: "kanya", lord: "Mercury", planetSlug: "budha" },
  { sign: "Libra (Tula)", rashiSlug: "tula", lord: "Venus", planetSlug: "shukra" },
  { sign: "Scorpio (Vrishchika)", rashiSlug: "vrishchika", lord: "Mars", planetSlug: "mangal" },
  { sign: "Sagittarius (Dhanu)", rashiSlug: "dhanu", lord: "Jupiter", planetSlug: "guru" },
  { sign: "Capricorn (Makara)", rashiSlug: "makara", lord: "Saturn", planetSlug: "shani" },
  { sign: "Aquarius (Kumbha)", rashiSlug: "kumbha", lord: "Saturn", planetSlug: "shani" },
  { sign: "Pisces (Meena)", rashiSlug: "meena", lord: "Jupiter", planetSlug: "guru" },
];

const FAQS = [
  {
    q: "What is a lagna mantra?",
    a: "There is no separate 'lagna mantra'. Your lagna (ascendant) remedy is the mantra of your lagna lord — the planet that rules your rising sign. For a Leo ascendant, that is the Sun mantra; for a Capricorn ascendant, the Saturn mantra; and so on.",
  },
  {
    q: "Why isn't there a different mantra for each lagna?",
    a: "Because a lagna and the corresponding moon sign share the same ruling planet, the remedial mantra is identical. Aries lagna and Aries rashi are both ruled by Mars, so both use the Mars mantra. We therefore keep one mantra page per planet and per sign rather than duplicating them.",
  },
  {
    q: "How do I find my lagna?",
    a: "Your lagna is the zodiac sign rising on the eastern horizon at your exact birth time and place. It needs your birth date, time, and city. Use a Vedic birth-chart calculator to find it, then chant the mantra of its ruling planet.",
  },
];

export function generateMetadata(): Metadata {
  return {
    title: { absolute: `${PAGE_TITLE} | Stotra by VastuCart` },
    description: PAGE_DESC,
    alternates: { canonical: "/mantra/lagna" },
    openGraph: siteOpenGraph({ path: "/mantra/lagna", title: PAGE_TITLE, description: PAGE_DESC, type: "article" }),
    twitter: siteTwitter({ path: "/mantra/lagna", title: PAGE_TITLE, description: PAGE_DESC }),
  };
}

export default function LagnaExplainer() {
  const graph = buildHubPageGraph({
    path: "/mantra/lagna",
    name: "Lagna (Ascendant) Mantra",
    description: PAGE_DESC,
    breadcrumbName: "Mantras",
    items: SIGN_LORD.map((s) => ({
      name: `${s.sign} ascendant — ${s.lord} mantra`,
      url: `${STOTRA_BASE}/mantra/planet/${s.planetSlug}`,
    })),
  });
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const rashiCount = getMantrasByAxis("rashi").length;

  return (
    <div className="mx-auto max-w-[1100px] px-4 sm:px-6 lg:px-8 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <nav className="flex items-center gap-2 text-xs text-text-muted mb-6">
        <Link href="/" className="hover:text-brand">Home</Link><span>/</span>
        <Link href="/mantra" className="hover:text-brand">Mantras</Link><span>/</span>
        <span className="text-text">Lagna</span>
      </nav>

      <header className="mb-8">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-brand">Lagna (Ascendant) Mantra</h1>
        <p className="text-text-light mt-3 leading-relaxed max-w-2xl">
          Your ascendant remedy is simply the mantra of your <strong>lagna lord</strong> — the planet that
          rules your rising sign. Find your lagna, read off its ruling planet below, and chant that planet&apos;s
          mantra. The {rashiCount} moon-sign pages share the same rulerships, so the mantra is the same whether
          you go by lagna or by rashi.
        </p>
        <div className="mt-4 w-24 h-1 rounded-full bg-gradient-to-r from-brand via-gold to-saffron" />
      </header>

      <section className="mb-8 bg-cream-mid rounded-2xl border border-gold/20 p-5">
        <h2 className="font-serif text-lg font-semibold text-brand mb-4">Lagna → ruling planet → mantra</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SIGN_LORD.map((s) => (
            <li key={s.sign}>
              <Link
                href={`/mantra/planet/${s.planetSlug}`}
                className="flex items-center justify-between gap-3 bg-white rounded-xl border border-border-light p-3 text-sm hover:border-gold/40 transition-colors"
              >
                <span className="text-text">{s.sign}</span>
                <span className="text-brand font-medium">{s.lord} mantra →</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="text-xs text-text-muted mt-4">
          Find your lagna with a Vedic birth chart:{" "}
          <a href="https://kundali.vastucart.in" className="underline hover:text-brand">kundali.vastucart.in</a>.
        </p>
      </section>

      <section>
        <h2 className="font-serif text-xl font-semibold text-brand mb-4">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {FAQS.map((f) => (
            <div key={f.q} className="rounded-xl bg-cream-mid p-4 border border-border-light">
              <h3 className="font-medium text-text">{f.q}</h3>
              <p className="text-sm text-text-muted mt-1">{f.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
