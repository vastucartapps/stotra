import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { FESTIVALS, getFestivalBySlug } from "@/data/festivals";
import { getDeityById } from "@/data/deities";
import { getStotrasByFestival } from "@/lib/stotras";
import { StotraCard } from "@/components/stotra/StotraCard";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { buildTaxonomyPageGraph, buildFaqPageSchema } from "@/lib/schema";
import type { SchemaFAQItem } from "@/lib/schema";
import { APP_URL, siteOpenGraph, siteTwitter } from "@/lib/seo-meta";

export function generateStaticParams() {
  return FESTIVALS.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const festival = getFestivalBySlug(slug);
  if (!festival) return {};
  const title = `${festival.name} (${festival.nameHi}) Stotras`;
  const description = `Sacred stotras and prayers for ${festival.name} (${festival.nameHi}). Read with transliteration, meaning, and free PDF download.`;
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: `/festival/${slug}`,
    },
    openGraph: siteOpenGraph({
      path: `/festival/${slug}`,
      title,
      description,
      type: "website",
      imageAlt: `${festival.name} Stotras - Stotra by VastuCart`,
    }),
    twitter: siteTwitter({
      path: `/festival/${slug}`,
      title,
      description,
    }),
  };
}

export default async function FestivalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const festival = getFestivalBySlug(slug);
  if (!festival) notFound();
  const stotras = getStotrasByFestival(festival.id);
  const deityNames = festival.deities.map((id) => getDeityById(id)?.name).filter(Boolean);

  // Note: Event schema intentionally NOT emitted — we lack real event data
  // (startDate, location) and the spec forbids fabricated Organization nodes.

  const topicSameAs: string[] = [];
  if (festival.wikipediaUrl) topicSameAs.push(festival.wikipediaUrl);
  if (festival.wikidataUrl) topicSameAs.push(festival.wikidataUrl);

  const pageGraph = buildTaxonomyPageGraph({
    kind: "festival",
    slug,
    name: `${festival.name} Stotras`,
    description: `Sacred stotras and prayers for ${festival.name} (${festival.nameHi}).`,
    stotras,
    hubName: "Festivals",
    topicSameAs: topicSameAs.length ? topicSameAs : undefined,
    topicAlternateName: festival.nameHi,
  });
  const faqs: SchemaFAQItem[] = [
    {
      question: `Which stotras are recited during ${festival.name}?`,
      answer: `During ${festival.name} (${festival.nameHi}), devotees recite stotras dedicated to ${deityNames.join(", ")}. We have ${stotras.length} stotras traditionally recited for this festival, available with Devanagari text, transliteration, and Hindi meaning.`,
    },
    {
      question: `When is ${festival.name} celebrated?`,
      answer: `${festival.name} (${festival.nameHi}) is celebrated according to the Hindu lunar calendar. The exact dates vary each year. During this festival, devotees worship ${deityNames.join(" and ")} through special prayers, stotras, and rituals.`,
    },
    {
      question: `What is the significance of reciting stotras during ${festival.name}?`,
      answer: `Reciting stotras during ${festival.name} is considered highly auspicious in Hindu tradition. Devotees recite stotras to invoke the blessings of ${deityNames.join(" and ")} for prosperity, protection, and spiritual growth.`,
    },
  ];
  const faqSchema = buildFaqPageSchema(faqs, `${APP_URL}/festival/${slug}`);

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

      <nav className="flex items-center gap-2 text-xs text-text-muted mb-8">
        <Link href="/" className="hover:text-brand transition-colors">Home</Link>
        <span>/</span>
        <Link href="/festival" className="hover:text-brand transition-colors">Festivals</Link>
        <span>/</span>
        <span className="text-text">{festival.name}</span>
      </nav>
      <div className="flex items-center gap-4 mb-8">
        <CategoryIcon type="festival" id={festival.id} size="xl" className="rounded-2xl bg-saffron/10" />
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-brand">{festival.name} Stotras</h1>
          <p className="devanagari-heading text-lg text-text-muted">{festival.nameHi} के स्तोत्र</p>
        </div>
      </div>
      {stotras.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {stotras.map((s) => <StotraCard key={s.slug} stotra={s} />)}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-border-light">
          <p className="text-text-muted">No stotras for {festival.name} yet.</p>
        </div>
      )}
    </div>
  );
}
