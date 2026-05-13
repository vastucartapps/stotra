import type { Metadata } from "next";
import Link from "next/link";
import { APP_URL, siteOpenGraph, siteTwitter } from "@/lib/seo-meta";

const PAGE_TITLE = "Disclaimer | Stotra by VastuCart";
const PAGE_DESC = "Disclaimer for Stotra by VastuCart.";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: PAGE_DESC,
  alternates: { canonical: "/disclaimer" },
  openGraph: siteOpenGraph({
    path: "/disclaimer",
    title: PAGE_TITLE,
    description: PAGE_DESC,
    type: "website",
  }),
  twitter: siteTwitter({
    path: "/disclaimer",
    title: PAGE_TITLE,
    description: PAGE_DESC,
  }),
};

export default function DisclaimerPage() {
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
        name: "Disclaimer",
        item: `${APP_URL}/disclaimer`,
      },
    ],
  };

  return (
    <div className="mx-auto max-w-[900px] px-4 sm:px-6 lg:px-8 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <nav className="flex items-center gap-2 text-xs text-text-muted mb-8">
        <Link href="/" className="hover:text-brand transition-colors">Home</Link>
        <span>/</span>
        <span className="text-text">Disclaimer</span>
      </nav>

      <h1 className="font-serif text-3xl md:text-4xl font-bold text-brand mb-8">Disclaimer</h1>

      <div className="bg-white rounded-2xl border border-border-light p-8 md:p-10 prose-sm space-y-6 text-text-light leading-relaxed">
        <section>
          <h2 className="font-serif text-lg font-semibold text-brand mb-3">Content Disclaimer</h2>
          <p>Stotra by VastuCart is a devotional resource that presents Hindu stotras, hymns, and prayers sourced from ancient scriptures and traditional texts. All Sanskrit and Hindi devotional texts are from the public domain.</p>
          <p>The transliterations, translations, and interpretations provided are for general guidance and devotional purposes. They should not be considered as authoritative scholarly translations. For critical religious rituals and practices, please consult qualified priests, scholars, or your family tradition.</p>
        </section>

        <section>
          <h2 className="font-serif text-lg font-semibold text-brand mb-3">Religious Disclaimer</h2>
          <p>This website is a devotional resource and does not promote any particular sect, sampradaya, or interpretation over another. The stotras presented represent the broad Hindu devotional tradition. Different traditions may have variations in text, pronunciation, or practice.</p>
          <p>The benefits (phal) listed for each stotra are based on traditional beliefs and scriptural references. They are presented as part of the devotional tradition and should not be interpreted as guaranteed outcomes or as substitutes for medical, legal, or professional advice.</p>
        </section>

        <section>
          <h2 className="font-serif text-lg font-semibold text-brand mb-3">Astrological Content</h2>
          <p>Day-based and planetary (graha) stotra recommendations are based on traditional Hindu astrological associations. They are presented for devotional purposes and should not be considered as astrological advice.</p>
        </section>

        <section>
          <h2 className="font-serif text-lg font-semibold text-brand mb-3">No Professional Advice</h2>
          <p>Nothing on this website constitutes medical, legal, financial, or professional advice. If you have health concerns, please consult a qualified healthcare provider. The health-related benefits mentioned in stotras are traditional beliefs, not medical claims.</p>
        </section>

        <section>
          <h2 className="font-serif text-lg font-semibold text-brand mb-3">External Links</h2>
          <p>This website contains links to other VastuCart ecosystem sites and external platforms. We do not endorse and are not responsible for the content on external websites.</p>
        </section>

        <p className="text-xs text-text-muted pt-4 border-t border-border-light">&copy; {new Date().getFullYear()} VastuCart. All rights reserved.</p>
      </div>
    </div>
  );
}
