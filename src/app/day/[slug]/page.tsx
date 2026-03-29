import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { DAYS, getDayBySlug } from "@/data/days";
import { getDeityById } from "@/data/deities";
import { getStotrasByDay } from "@/lib/stotras";
import { StotraCard } from "@/components/stotra/StotraCard";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://stotra.vastucart.in";

export function generateStaticParams() {
  return DAYS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const day = getDayBySlug(slug);
  if (!day) return {};
  const deityNames = day.deities.map((id) => getDeityById(id)?.name).filter(Boolean).join(", ");
  const title = `${day.name} (${day.nameHi}) Stotras`;
  const description = `Stotras to recite on ${day.name} (${day.nameHi}). Sacred to ${deityNames}. Read with transliteration and meaning.`;
  return {
    title,
    description,
    alternates: {
      canonical: `/day/${slug}`,
    },
    openGraph: {
      title: `${title} | Stotra by VastuCart`,
      description,
      url: `${APP_URL}/day/${slug}`,
      type: "website",
      images: [
        {
          url: `${APP_URL}/og-default.jpg`,
          width: 1200,
          height: 630,
          alt: `${day.name} Stotras - Stotra by VastuCart`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Stotra by VastuCart`,
      description,
      images: [`${APP_URL}/og-default.jpg`],
    },
  };
}

export default async function DayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const day = getDayBySlug(slug);
  if (!day) notFound();

  const stotras = getStotrasByDay(day.id);
  const deityNames = day.deities.map((id) => getDeityById(id)?.name).filter(Boolean);

  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${day.name} Stotras`,
    description: `Stotras recommended for recitation on ${day.name} (${day.nameHi}).`,
    url: `${APP_URL}/day/${slug}`,
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
        name: "Days",
        item: `${APP_URL}/day`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: day.name,
        item: `${APP_URL}/day/${slug}`,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Which deity stotras should be recited on ${day.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${day.name} (${day.nameHi}) is sacred to ${deityNames.join(", ")}. It is recommended to recite stotras, chalisa, and hymns dedicated to ${deityNames.length > 1 ? "these deities" : "this deity"} on ${day.name} for maximum spiritual benefit.`,
        },
      },
      {
        "@type": "Question",
        name: `What is the significance of ${day.name} in Hindu tradition?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `In Hindu tradition, ${day.name} (${day.nameHi}) is dedicated to ${deityNames.join(" and ")}. Devotees observe fasts, perform pujas, and recite specific stotras on this day to seek blessings. We have ${stotras.length} stotras recommended for ${day.name}.`,
        },
      },
      {
        "@type": "Question",
        name: `How many stotras are recommended for ${day.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `We currently have ${stotras.length} stotras recommended for ${day.name} (${day.nameHi}) in our collection. These include prayers dedicated to ${deityNames.join(", ")}, available with Devanagari text, transliteration, and Hindi meaning.`,
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
        <Link href="/day" className="hover:text-brand transition-colors">Days</Link>
        <span>/</span>
        <span className="text-text">{day.name}</span>
      </nav>

      <div className="mb-10">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-brand mb-2">
          {day.name} Stotras
        </h1>
        <p className="devanagari-heading text-lg text-text-muted mb-4">
          {day.nameHi} के स्तोत्र
        </p>
        <div className="flex flex-wrap gap-2">
          {day.deities.map((deityId) => {
            const deity = getDeityById(deityId);
            return deity ? (
              <Link
                key={deityId}
                href={`/deity/${deity.slug}`}
                className="text-xs font-medium px-3 py-1.5 rounded-full text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: deity.color }}
              >
                {deity.name} ({deity.nameHi})
              </Link>
            ) : null;
          })}
        </div>
      </div>

      {stotras.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {stotras.map((stotra) => (
            <StotraCard key={stotra.slug} stotra={stotra} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-border-light">
          <p className="text-text-muted">No stotras for {day.name} yet.</p>
        </div>
      )}
    </div>
  );
}
