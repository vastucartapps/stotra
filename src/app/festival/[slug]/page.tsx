import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { FESTIVALS, getFestivalBySlug } from "@/data/festivals";
import { getDeityById } from "@/data/deities";
import { getStotrasByFestival } from "@/lib/stotras";
import { StotraCard } from "@/components/stotra/StotraCard";
import { CategoryIcon } from "@/components/ui/CategoryIcon";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://stotra.vastucart.in";

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
    openGraph: {
      title,
      description,
      url: `${APP_URL}/festival/${slug}`,
      type: "website",
      images: [
        {
          url: `${APP_URL}/og-default.jpg`,
          width: 1200,
          height: 630,
          alt: `${festival.name} Stotras - Stotra by VastuCart`,
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

export default async function FestivalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const festival = getFestivalBySlug(slug);
  if (!festival) notFound();
  const stotras = getStotrasByFestival(festival.id);
  const deityNames = festival.deities.map((id) => getDeityById(id)?.name).filter(Boolean);

  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: festival.name,
    description: `${festival.name} (${festival.nameHi}) - a sacred Hindu festival. Recite special stotras and prayers during this auspicious occasion.`,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    organizer: {
      "@type": "Organization",
      name: "Hindu Tradition",
    },
  };

  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${festival.name} Stotras`,
    description: `Sacred stotras and prayers for ${festival.name} (${festival.nameHi}).`,
    url: `${APP_URL}/festival/${slug}`,
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
        name: "Festivals",
        item: `${APP_URL}/festival`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: festival.name,
        item: `${APP_URL}/festival/${slug}`,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Which stotras are recited during ${festival.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `During ${festival.name} (${festival.nameHi}), devotees recite stotras dedicated to ${deityNames.join(", ")}. We have ${stotras.length} stotras specifically recommended for this festival, available with Devanagari text, transliteration, and Hindi meaning.`,
        },
      },
      {
        "@type": "Question",
        name: `When is ${festival.name} celebrated?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${festival.name} (${festival.nameHi}) is a major Hindu festival celebrated according to the Hindu lunar calendar. The exact dates vary each year. During this festival, devotees worship ${deityNames.join(" and ")} through special prayers, stotras, and rituals.`,
        },
      },
      {
        "@type": "Question",
        name: `What is the significance of reciting stotras during ${festival.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Reciting stotras during ${festival.name} is considered highly auspicious in Hindu tradition. It is believed that prayers offered during this sacred occasion carry multiplied spiritual merit. Devotees recite stotras to seek blessings from ${deityNames.join(" and ")} for prosperity, protection, and spiritual growth.`,
        },
      },
    ],
  };

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />
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
