import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { PURPOSES, getPurposeBySlug } from "@/data/purposes";
import { getStotrasByPurpose } from "@/lib/stotras";
import { StotraCard } from "@/components/stotra/StotraCard";
import { CategoryIcon } from "@/components/ui/CategoryIcon";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://stotra.vastucart.in";

export function generateStaticParams() {
  return PURPOSES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const purpose = getPurposeBySlug(slug);
  if (!purpose) return {};
  const title = `Stotras for ${purpose.name} — Sanskrit Prayers for ${purpose.nameHi} | VastuCart`;
  const description = `Find the most powerful Hindu stotras and prayers for ${purpose.name.toLowerCase()} in Sanskrit with Hindi meaning and PDF download.`;
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: `/purpose/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${APP_URL}/purpose/${slug}`,
      type: "website",
      images: [
        {
          url: `${APP_URL}/og-default.jpg`,
          width: 1200,
          height: 630,
          alt: `Stotras for ${purpose.name} - Stotra by VastuCart`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${APP_URL}/og-default.jpg`],
    },
  };
}

export default async function PurposePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const purpose = getPurposeBySlug(slug);
  if (!purpose) notFound();
  const stotras = getStotrasByPurpose(purpose.id);

  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Stotras for ${purpose.name}`,
    description: `Hindu stotras and prayers for ${purpose.name.toLowerCase()} (${purpose.nameHi}).`,
    url: `${APP_URL}/purpose/${slug}`,
    isPartOf: { "@id": `${APP_URL}/#website` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: stotras.length,
      itemListElement: stotras.map((stotra, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: stotra.titleEn,
        url: `${APP_URL}/stotra/${stotra.slug}`,
      })),
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: APP_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Purpose",
        item: `${APP_URL}/purpose`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: purpose.name,
        item: `${APP_URL}/purpose/${slug}`,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Which stotras help with ${purpose.name.toLowerCase()}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `We have ${stotras.length} stotras specifically recommended for ${purpose.name.toLowerCase()} (${purpose.nameHi}). These include prayers to various deities that are traditionally recited to seek blessings for ${purpose.name.toLowerCase()}.`,
        },
      },
      {
        "@type": "Question",
        name: `How to recite stotras for ${purpose.name.toLowerCase()}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `For best results, recite stotras for ${purpose.name.toLowerCase()} with devotion and concentration, preferably during early morning or evening hours. Each stotra on our site includes the Devanagari text, transliteration for correct pronunciation, and Hindi meaning to help you understand the prayer.`,
        },
      },
      {
        "@type": "Question",
        name: `How many stotras are available for ${purpose.name.toLowerCase()}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Our collection currently includes ${stotras.length} stotras for ${purpose.name.toLowerCase()} (${purpose.nameHi}). Each stotra is available with full Devanagari text, transliteration, Hindi meaning, and free PDF download.`,
        },
      },
    ],
  };

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <nav className="flex items-center gap-2 text-xs text-text-muted mb-8">
        <Link href="/" className="hover:text-brand transition-colors">Home</Link>
        <span>/</span>
        <Link href="/purpose" className="hover:text-brand transition-colors">Purpose</Link>
        <span>/</span>
        <span className="text-text">{purpose.name}</span>
      </nav>
      <div className="flex items-center gap-4 mb-8">
        <CategoryIcon type="purpose" id={purpose.id} size="xl" className="rounded-2xl bg-brand/10" />
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-brand">{purpose.name}</h1>
          <p className="devanagari-heading text-lg text-text-muted">{purpose.nameHi}</p>
        </div>
      </div>
      {stotras.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {stotras.map((s) => <StotraCard key={s.slug} stotra={s} />)}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-border-light">
          <p className="text-text-muted">No stotras for {purpose.name} yet.</p>
        </div>
      )}
    </div>
  );
}
