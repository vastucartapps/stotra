import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getAllStotras, getStotraBySlug, getRelatedStotras } from "@/lib/stotras";
import { getDeityById } from "@/data/deities";
import { getDayById } from "@/data/days";
import { LeftSidebar } from "@/components/layout/LeftSidebar";
import { Sidebar } from "@/components/layout/Sidebar";
import { StotraContent } from "@/components/stotra/StotraContent";
import { StotraFAQ } from "@/components/stotra/StotraFAQ";
import type { Stotra, Deity, FAQItem } from "@/types";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://stotra.vastucart.in";

function generateStotraFAQs(stotra: Stotra, deity: Deity | undefined): FAQItem[] {
  const faqs: FAQItem[] = [];

  // FAQ 1: What is this stotra?
  const deityInfo = deity
    ? ` It is dedicated to ${deity.name} (${deity.nameHi}), ${deity.description.toLowerCase()}`
    : "";
  faqs.push({
    question: `What is ${stotra.titleEn}?`,
    answer: `${stotra.seoDescription}${deityInfo} This sacred hymn contains ${stotra.verseCount} verses and is sourced from ${stotra.source}.`,
  });

  // FAQ 2: Benefits
  if (stotra.benefits.length > 0) {
    const benefitsList = stotra.benefits
      .slice(0, 4)
      .map((b) => b.replace(/\.$/, ""))
      .join("; ");
    faqs.push({
      question: `What are the benefits of reciting ${stotra.titleEn}?`,
      answer: `Reciting ${stotra.titleEn} (${stotra.title}) regularly bestows numerous spiritual and material benefits. Key benefits include: ${benefitsList}. For best results, recite with devotion and a pure heart.`,
    });
  }

  // FAQ 3: When to recite
  if (stotra.days.length > 0) {
    const dayNames = stotra.days
      .map((dayId) => {
        const day = getDayById(dayId);
        return day ? `${day.name} (${day.nameHi})` : dayId;
      })
      .join(", ");
    const deityDayNote = deity
      ? ` These days are traditionally associated with ${deity.name} worship in Hindu tradition.`
      : "";
    faqs.push({
      question: `When should I recite ${stotra.titleEn}?`,
      answer: `${stotra.titleEn} is especially auspicious to recite on ${dayNames}.${deityDayNote} However, this stotra can be recited on any day for spiritual benefit. Early morning (Brahma Muhurta) or during evening prayers (Sandhya) are considered the most effective times.`,
    });
  }

  // FAQ 4: Viniyog (only if exists)
  if (stotra.viniyog) {
    const v = stotra.viniyog;
    const viniyogParts: string[] = [];
    if (v.rishi) viniyogParts.push(`the Rishi (seer) is ${v.rishi}`);
    if (v.chhand) viniyogParts.push(`the Chhand (metre) is ${v.chhand}`);
    if (v.devata) viniyogParts.push(`the Devata (deity) is ${v.devata}`);
    if (v.beej) viniyogParts.push(`the Beej (seed mantra) is "${v.beej}"`);
    if (v.shakti) viniyogParts.push(`the Shakti (power) is ${v.shakti}`);
    if (v.kilak) viniyogParts.push(`the Kilak (key) is ${v.kilak}`);
    faqs.push({
      question: `What is the viniyog of ${stotra.titleEn}?`,
      answer: `The viniyog (formal invocation) of ${stotra.titleEn} identifies the spiritual lineage and structure of the hymn. In this stotra, ${viniyogParts.join(", ")}. The viniyog is traditionally recited before the main stotra to establish the proper spiritual connection and maximize its efficacy.`,
    });
  }

  // FAQ 5: Reading time
  faqs.push({
    question: `How long does it take to recite ${stotra.titleEn}?`,
    answer: `${stotra.titleEn} (${stotra.title}) contains ${stotra.verseCount} verses and takes approximately ${stotra.readingTimeMinutes} minutes to recite at a normal pace. For beginners, it may take slightly longer. You can also download the PDF version for offline reading and practice.`,
  });

  return faqs;
}

export async function generateStaticParams() {
  const stotras = getAllStotras();
  return stotras.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const stotra = getStotraBySlug(slug);
  if (!stotra) return {};

  const deity = getDeityById(stotra.deity);
  const title = `${stotra.titleEn} in Sanskrit with Hindi Meaning & PDF | ${deity?.name || "Hindu"} Stotra`;
  const metaDescription = `Read ${stotra.titleEn} (${stotra.title}) in Sanskrit with Hindi arth, English transliteration, and free PDF download. ${stotra.verseCount} verses.${stotra.benefits[0] ? ` ${stotra.benefits[0]}.` : ""}`;

  return {
    title,
    description: metaDescription,
    alternates: {
      canonical: `/stotra/${stotra.slug}`,
    },
    openGraph: {
      title,
      description: metaDescription,
      url: `${APP_URL}/stotra/${stotra.slug}`,
      type: "article",
      siteName: "Stotra by VastuCart",
      images: [
        {
          url: `${APP_URL}/og-default.jpg`,
          width: 1200,
          height: 630,
          alt: `${stotra.titleEn} - Stotra by VastuCart`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@vastucart",
      title,
      description: metaDescription,
      images: [`${APP_URL}/og-default.jpg`],
    },
    keywords: [
      stotra.titleEn.toLowerCase(),
      stotra.title,
      deity?.name || "",
      deity?.nameHi || "",
      "stotra",
      "prayer",
      "hymn",
      "hindu",
      ...stotra.purposes,
    ],
  };
}

export default async function StotraPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const stotra = getStotraBySlug(slug);
  if (!stotra) notFound();

  const deity = getDeityById(stotra.deity);
  const relatedStotras = getRelatedStotras(stotra, 5);
  const stotraFAQs = generateStotraFAQs(stotra, deity);

  // Enhanced CreativeWork schema with author, keywords, wordCount, thumbnailUrl
  const authorInfo = stotra.viniyog?.rishi
    ? {
        "@type": "Person" as const,
        name: stotra.viniyog.rishi,
        description: "Rishi (seer) of this stotra",
      }
    : stotra.source
      ? {
          "@type": "Organization" as const,
          name: stotra.source,
        }
      : undefined;

  const keywordsArray = [
    stotra.titleEn.toLowerCase(),
    stotra.title,
    deity?.name || "",
    deity?.nameHi || "",
    "stotra",
    "prayer",
    "hymn",
    "hindu",
    "sanskrit",
    ...stotra.purposes,
    ...stotra.days,
  ].filter(Boolean);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: stotra.titleEn,
    alternateName: stotra.title,
    description: stotra.seoDescription,
    inLanguage: ["sa", "hi", "en"],
    url: `${APP_URL}/stotra/${stotra.slug}`,
    datePublished: stotra.createdAt,
    dateModified: stotra.updatedAt,
    publisher: {
      "@type": "Organization",
      name: "VastuCart",
      url: "https://vastucart.in",
    },
    ...(authorInfo ? { author: authorInfo } : {}),
    about: {
      "@type": "Thing",
      name: deity?.name || stotra.deity,
    },
    genre: "Religious Text",
    isAccessibleForFree: true,
    keywords: keywordsArray.join(", "),
    wordCount: stotra.verseCount * 20, // Approximate words per verse
    thumbnailUrl: `${APP_URL}/og-default.jpg`,
  };

  const breadcrumbJsonLd = {
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
        name: deity?.name || "Deity",
        item: `${APP_URL}/deity/${deity?.slug || stotra.deity}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: stotra.titleEn,
        item: `${APP_URL}/stotra/${stotra.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: stotraFAQs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          }),
        }}
      />

      {/* Breadcrumb */}
      <div className="bg-cream-dark/50 border-b border-border-light">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-xs text-text-muted">
            <Link href="/" className="hover:text-brand transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              href={`/deity/${deity?.slug || stotra.deity}`}
              className="hover:text-brand transition-colors"
            >
              {deity?.name || stotra.deity}
            </Link>
            <span>/</span>
            <span className="text-text">{stotra.titleEn}</span>
          </nav>
        </div>
      </div>

      {/* 3-Column Layout */}
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Hidden on mobile, shown on lg */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-28">
              <LeftSidebar />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <StotraContent stotra={stotra} deity={deity || null} />
            <StotraFAQ faqs={stotraFAQs} stotraTitle={stotra.titleEn} />
          </div>

          {/* Right Sidebar - Hidden on mobile, shown on lg */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-28">
              <Sidebar relatedStotras={relatedStotras} />
            </div>
          </div>
        </div>

        {/* Mobile: Related & Sidebar Content Below */}
        <div className="lg:hidden mt-8 space-y-8">
          {relatedStotras.length > 0 && (
            <div>
              <h3 className="font-serif text-xl font-semibold text-brand mb-4">
                Related Stotras
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {relatedStotras.map((rs) => (
                  <Link
                    key={rs.slug}
                    href={`/stotra/${rs.slug}`}
                    className="bg-white rounded-xl p-4 border border-border-light hover:border-gold/30 hover:shadow-card transition-all duration-200"
                  >
                    <p className="devanagari-heading text-sm text-brand">
                      {rs.title}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {rs.titleEn}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
          <Sidebar />
        </div>
      </div>
    </>
  );
}
