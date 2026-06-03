import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { DEITIES, getDeityBySlug } from "@/data/deities";
import { getStotrasByPrimaryDeity, getStotrasBySecondaryDeity, getTopStotrasForDeity } from "@/lib/stotras";
import { buildDeityPageGraph, buildFaqPageSchema } from "@/lib/schema";
import type { SchemaFAQItem } from "@/lib/schema";
import { StotraCard } from "@/components/stotra/StotraCard";
import { StotraFAQ } from "@/components/stotra/StotraFAQ";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { APP_URL, siteOpenGraph, siteTwitter } from "@/lib/seo-meta";

export function generateStaticParams() {
  return DEITIES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const deity = getDeityBySlug(slug);
  if (!deity) return {};
  const stotras = getStotrasByPrimaryDeity(deity.id);
  const title = `${deity.name} Stotras (${stotras.length}) — Sanskrit, Hindi, PDF`;
  const description = `Complete collection of ${stotras.length} ${deity.name} stotras, chalisa and prayers in Sanskrit with Hindi meaning and free PDF download.`;
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: `/deity/${slug}`,
    },
    openGraph: siteOpenGraph({
      path: `/deity/${slug}`,
      title,
      description,
      type: "website",
      imageAlt: `${deity.name} Stotras - Stotra by VastuCart`,
    }),
    twitter: siteTwitter({
      path: `/deity/${slug}`,
      title,
      description,
    }),
  };
}

export default async function DeityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const deity = getDeityBySlug(slug);
  if (!deity) notFound();

  const stotras = getStotrasByPrimaryDeity(deity.id);

  const pageGraph = buildDeityPageGraph(deity, stotras);
  const faqs: SchemaFAQItem[] = [
    {
      question: `How many stotras are dedicated to ${deity.name}?`,
      answer: `We currently have ${stotras.length} stotras dedicated to ${deity.name} (${deity.nameHi}) in our collection, including chalisa, ashtakam, sahasranama, and other sacred hymns. New stotras are added regularly.`,
    },
    {
      question: `What is the best day to recite ${deity.name} stotras?`,
      answer: `While ${deity.name} stotras can be recited any day, Hindu tradition associates specific days of the week with each deity. Visit our "Stotras by Day" section to find the most auspicious day for ${deity.name} prayers. Regular daily recitation is considered most beneficial.`,
    },
    {
      question: `What are the benefits of reciting ${deity.name} stotras?`,
      answer: `Reciting ${deity.name} stotras is traditionally associated with divine blessings, spiritual growth, inner peace, and protection. Each stotra has specific benefits (phal) mentioned in the scriptures. ${deity.description}`,
    },
  ];
  const faqSchema = buildFaqPageSchema(
    faqs,
    `${APP_URL}/deity/${slug}`
  );

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-8">
      {pageGraph && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(pageGraph) }}
        />
      )}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-text-muted mb-8">
        <Link href="/" className="hover:text-brand transition-colors">Home</Link>
        <span>/</span>
        <Link href="/deity" className="hover:text-brand transition-colors">Deities</Link>
        <span>/</span>
        <span className="text-text">{deity.name}</span>
      </nav>

      {/* Header */}
      <div className="flex items-center gap-5 mb-10">
        <CategoryIcon type="deity" id={deity.id} color={deity.color} size="xl" />
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-brand">
            {deity.name} Stotras
          </h1>
          <p className="devanagari-heading text-lg text-text-muted">
            {deity.nameHi} स्तोत्र
          </p>
        </div>
      </div>

      <p className="text-text-light mb-8 max-w-2xl">{deity.description}</p>

      {/* Long-form deity essay — promotes the hub from a 100-word card
          into an authoritative entity page (Google QRG location-page
          minimum is 500 words). Renders only when populated. */}
      {deity.essay && deity.essay.length > 0 && (
        <section className="bg-white rounded-2xl border border-border-light p-6 md:p-8 mb-10 max-w-3xl">
          <h2 className="font-serif text-2xl font-semibold text-brand mb-4">
            About {deity.name}
          </h2>
          <div className="prose-sm space-y-4 text-text leading-relaxed">
            {deity.essay.map((para, i) => (
              <div key={i}>
                {deity.essayHeadings?.[i] && (
                  <h3 className="font-serif text-base font-semibold text-brand mt-4 mb-2">
                    {deity.essayHeadings[i]}
                  </h3>
                )}
                <p>{para}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {(() => {
        // Render rich cards for the first 30; emit the remainder as a
        // lightweight text index. Vishnu's 168 stotras × full StotraCard
        // weigh 854KB on the wire and hurt indexation.
        const FEATURED = 30;
        const featured = stotras.slice(0, FEATURED);
        const rest = stotras.slice(FEATURED);
        if (stotras.length === 0) {
          return (
            <div className="text-center py-16 bg-white rounded-xl border border-border-light">
              <p className="text-text-muted">
                No stotras available for {deity.name} yet. Check back soon!
              </p>
            </div>
          );
        }
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {featured.map((stotra) => (
                <StotraCard key={stotra.slug} stotra={stotra} />
              ))}
            </div>
            {rest.length > 0 && (
              <section className="mt-12">
                <h2 className="font-serif text-xl font-semibold text-brand mb-3">
                  More {deity.name} Stotras
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1 text-sm">
                  {rest.map((s) => (
                    <li key={s.slug} className="border-b border-border-light/60 py-1.5">
                      <Link
                        href={`/stotra/${s.slug}`}
                        className="block text-text hover:text-brand transition-colors"
                      >
                        <span>{s.titleEn}</span>
                        <span className="devanagari-heading text-xs text-text-muted ml-2">
                          {s.title}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </>
        );
      })()}

      {/* Also Featuring [Deity] — stotras where this deity is secondary */}
      {(() => {
        const secondary = getStotrasBySecondaryDeity(deity.id);
        return secondary.length > 0 ? (
          <div className="mt-12">
            <h2 className="font-serif text-xl font-semibold text-brand mb-2">
              Also Featuring {deity.name}
            </h2>
            <p className="text-sm text-text-muted mb-5">
              Stotras primarily addressed to other deities that also invoke {deity.name}.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {secondary.slice(0, 12).map((s) => (
                <StotraCard key={s.slug} stotra={s} />
              ))}
            </div>
          </div>
        ) : null;
      })()}

      {/* Most Recited Stotras */}
      {stotras.length > 0 && (() => {
        const topStotras = getTopStotrasForDeity(deity.id, 5);
        return topStotras.length > 0 ? (
          <div className="mt-12 bg-white rounded-xl border border-border-light p-6 md:p-8">
            <h2 className="font-serif text-xl font-semibold text-brand mb-5">
              Most Recited {deity.name} Stotras
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {topStotras.map((s) => (
                <Link
                  key={s.slug}
                  href={`/stotra/${s.slug}`}
                  className="group flex items-center gap-3 px-4 py-3 bg-cream rounded-xl border border-border-light hover:border-gold/30 hover:shadow-card transition-all duration-200"
                >
                  <span className="w-9 h-9 rounded-lg bg-brand/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-brand text-xs font-serif font-bold">&#x0950;</span>
                  </span>
                  <span className="min-w-0">
                    <span className="devanagari-heading text-sm text-brand group-hover:text-brand-light transition-colors block leading-snug truncate">
                      {s.title}
                    </span>
                    <span className="text-xs text-text-muted truncate block">
                      {s.titleEn}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ) : null;
      })()}

      {/* Visible FAQ — makes the FAQPage schema valid (Google requires the Q&A
          to be on-page) and gives AI engines + readers a citable answer block. */}
      <div className="mt-8">
        <StotraFAQ faqs={faqs} stotraTitle={deity.name} />
      </div>
    </div>
  );
}
