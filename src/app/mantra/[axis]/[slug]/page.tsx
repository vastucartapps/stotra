import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getMantra, allMantraParams, getMantrasByAxis, MANTRA_AXES } from "@/lib/mantra";
import type { MantraAxis } from "@/types";
import { buildMantraPageGraph, buildFaqPageSchema, STOTRA_BASE } from "@/lib/schema";
import { siteOpenGraph, siteTwitter } from "@/lib/seo-meta";

const AXES = new Set<string>(MANTRA_AXES.map((a) => a.axis));
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function generateStaticParams() {
  return allMantraParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ axis: string; slug: string }>;
}): Promise<Metadata> {
  const { axis, slug } = await params;
  if (!AXES.has(axis)) return {};
  const m = getMantra(axis as MantraAxis, slug);
  if (!m) return {};
  const title = `${m.name.en} Mantra — Meaning, Vidhi & Benefits`;
  const description = m.whatIs.length > 155 ? m.whatIs.slice(0, 152).trimEnd() + "…" : m.whatIs;
  const path = `/mantra/${axis}/${slug}`;
  return {
    title: { absolute: `${title} | Stotra by VastuCart` },
    description,
    keywords: m.alsoKnownAs,
    alternates: { canonical: path },
    openGraph: siteOpenGraph({ path, title, description, type: "article" }),
    twitter: siteTwitter({ path, title, description }),
  };
}

export default async function MantraMemberPage({
  params,
}: {
  params: Promise<{ axis: string; slug: string }>;
}) {
  const { axis, slug } = await params;
  if (!AXES.has(axis)) notFound();
  const m = getMantra(axis as MantraAxis, slug);
  if (!m) notFound();

  const path = `/mantra/${axis}/${slug}`;
  const graph = buildMantraPageGraph(m);
  const faqSchema = m.faqs && m.faqs.length ? buildFaqPageSchema(m.faqs, `${STOTRA_BASE}${path}`) : null;
  const axisMeta = MANTRA_AXES.find((a) => a.axis === axis);
  const siblings = getMantrasByAxis(axis as MantraAxis).filter((s) => s.slug !== slug);
  const reviewed = new Date(m.updatedAt);
  const reviewedStr = `${reviewed.getUTCDate()} ${MONTHS[reviewed.getUTCMonth()]} ${reviewed.getUTCFullYear()}`;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}

      <div className="bg-cream-dark/50 border-b border-border-light">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-xs text-text-muted flex-wrap">
            <Link href="/" className="hover:text-brand transition-colors">Home</Link>
            <span>/</span>
            <Link href="/mantra" className="hover:text-brand transition-colors">Mantras</Link>
            <span>/</span>
            <Link href={`/mantra/${axis}`} className="hover:text-brand transition-colors capitalize">{axis}</Link>
            <span>/</span>
            <span className="text-text">{m.name.en}</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-[1100px] px-4 sm:px-6 lg:px-8 py-8">
        <article className="bg-white rounded-2xl border border-border-light shadow-card overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-brand via-gold to-saffron" />
          <div className="p-6 md:p-8">
            <header className="border-b border-border-light pb-6">
              <p className="text-xs text-saffron font-semibold uppercase tracking-[0.15em] mb-2">
                {axisMeta?.label ?? axis} Mantra
              </p>
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-brand">{m.name.en} Mantra</h1>
              {m.name.hi && <p className="devanagari-heading text-xl text-text-light mt-1">{m.name.hi}</p>}
              {m.alsoKnownAs && m.alsoKnownAs.length > 0 && (
                <p className="text-xs italic text-text-muted mt-2">
                  Also known as: <span className="not-italic">{m.alsoKnownAs.slice(0, 5).join(" · ")}</span>
                </p>
              )}
              <p className="text-xs text-text-muted mt-3">
                Prepared by{" "}
                <a href="/editorial-process" className="underline hover:text-brand transition-colors">VastuCart Editorial</a>
                {" "}— last reviewed <time dateTime={m.updatedAt}>{reviewedStr}</time>
              </p>
            </header>

            <section className="py-6">
              <p className="text-text leading-relaxed">{m.whatIs}</p>
            </section>

            {m.keyFacts.length > 0 && (
              <section className="mb-6">
                <h2 className="font-serif text-sm font-semibold text-brand uppercase tracking-wider mb-3">Key Facts</h2>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 bg-cream-mid/40 rounded-xl p-5 border border-gold/15">
                  {m.keyFacts.map((kf) => (
                    <div key={kf.label} className="flex justify-between gap-3 text-sm border-b border-border-light/50 py-1">
                      <dt className="text-text-muted">{kf.label}</dt>
                      <dd className="text-text font-medium text-right">{kf.value}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}

            <section className="mb-6">
              <h2 className="font-serif text-xl font-semibold text-brand mb-4">The Mantra{m.mantras.length > 1 ? "s" : ""}</h2>
              <div className="space-y-4">
                {m.mantras.map((mn, i) => (
                  <div key={i} className="rounded-xl border border-border-light p-5">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-brand/10 text-brand capitalize">{mn.kind}</span>
                      <span className="text-xs text-text-muted">{mn.lineage}</span>
                      <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-cream-mid text-text-muted">{mn.authenticity}</span>
                    </div>
                    <p className="devanagari text-xl text-brand leading-[1.9]">{mn.textDevanagari}</p>
                    <p className="text-sm text-text-light italic mt-2">{mn.transliteration}</p>
                    {mn.englishExplanation && <p className="text-sm text-text-muted mt-3">{mn.englishExplanation}</p>}
                    {mn.hindiExplanation && <p className="devanagari text-sm text-text-muted mt-1">{mn.hindiExplanation}</p>}
                    <p className="text-xs text-text-muted mt-3">Source: {mn.source}</p>
                  </div>
                ))}
              </div>
            </section>

            {m.vidhi && (
              <section className="mb-6">
                <h2 className="font-serif text-xl font-semibold text-brand mb-4">How to Practise (Vidhi)</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  {m.vidhi.bestDayToStart && <Fact label="Best day to begin" value={m.vidhi.bestDayToStart} />}
                  {m.vidhi.bestTime && <Fact label="Best time" value={m.vidhi.bestTime} />}
                  {m.vidhi.direction && <Fact label="Direction" value={m.vidhi.direction} />}
                  {m.vidhi.asana && <Fact label="Seat (asana)" value={m.vidhi.asana} />}
                  {m.vidhi.mala && <Fact label="Mala" value={`${m.vidhi.mala.beads}-bead ${m.vidhi.mala.type}`} />}
                  {m.vidhi.japaCount?.recommended && (
                    <Fact label="Daily japa" value={`${m.vidhi.japaCount.recommended}${m.vidhi.japaCount.totalSankalpa ? ` (sankalpa ${m.vidhi.japaCount.totalSankalpa.toLocaleString("en-IN")})` : ""}`} />
                  )}
                  {m.vidhi.durationDays?.recommended && <Fact label="Duration" value={`${m.vidhi.durationDays.recommended} days`} />}
                  {m.vidhi.guruDiksha && <Fact label="Guru diksha" value={m.vidhi.guruDiksha.level} />}
                </div>
                {m.vidhi.benefits && m.vidhi.benefits.length > 0 && (
                  <div className="mt-5">
                    <h3 className="font-serif text-sm font-semibold text-brand uppercase tracking-wider mb-2">Benefits</h3>
                    <ul className="space-y-1.5">
                      {m.vidhi.benefits.map((b, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-text">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-saffron flex-shrink-0" />{b}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {m.vidhi.impact && <p className="text-sm text-text-muted mt-4 italic">{m.vidhi.impact}</p>}
                {m.vidhi.pujaModes && (
                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {(["minimal", "medium", "full"] as const).map((tier) =>
                      m.vidhi?.pujaModes?.[tier] ? (
                        <div key={tier} className="rounded-xl bg-cream-mid/40 p-4 border border-border-light">
                          <p className="text-xs font-semibold text-brand uppercase tracking-wide mb-1">{tier}</p>
                          <p className="text-sm text-text-muted">{m.vidhi.pujaModes[tier]}</p>
                        </div>
                      ) : null
                    )}
                  </div>
                )}
                {m.vidhi.dosAndDonts && (
                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-serif text-sm font-semibold text-green-700 mb-2">Do</h3>
                      <ul className="space-y-1 text-sm text-text">{m.vidhi.dosAndDonts.dos.map((d, i) => <li key={i}>• {d}</li>)}</ul>
                    </div>
                    <div>
                      <h3 className="font-serif text-sm font-semibold text-orange mb-2">Avoid</h3>
                      <ul className="space-y-1 text-sm text-text">{m.vidhi.dosAndDonts.donts.map((d, i) => <li key={i}>• {d}</li>)}</ul>
                    </div>
                  </div>
                )}
              </section>
            )}

            {m.faqs && m.faqs.length > 0 && (
              <section className="mb-2">
                <h2 className="font-serif text-xl font-semibold text-brand mb-4">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {m.faqs.map((f, i) => (
                    <div key={i}>
                      <h3 className="font-medium text-text">{f.question}</h3>
                      <p className="text-sm text-text-muted mt-1">{f.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {m.links && m.links.length > 0 && (
              <section className="mt-6 pt-6 border-t border-border-light flex flex-wrap gap-3">
                {m.links.map((l, i) => (
                  <a key={i} href={l.url} className="text-sm font-medium text-brand hover:text-brand-light underline">
                    {l.label} →
                  </a>
                ))}
              </section>
            )}
          </div>
        </article>

        {siblings.length > 0 && (
          <section className="mt-8">
            <h2 className="font-serif text-lg font-semibold text-brand mb-3 capitalize">Other {axis} mantras</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1 text-sm">
              {siblings.map((s) => (
                <li key={s.slug} className="border-b border-border-light/60 py-1.5">
                  <Link href={`/mantra/${axis}/${s.slug}`} className="text-text hover:text-brand transition-colors">{s.name.en}</Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 border-b border-border-light/50 py-1">
      <span className="text-text-muted">{label}</span>
      <span className="text-text font-medium text-right">{value}</span>
    </div>
  );
}
