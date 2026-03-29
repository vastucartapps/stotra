import type { Metadata } from "next";
import Link from "next/link";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://stotra.vastucart.in";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for Stotra by VastuCart.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
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
        name: "Terms of Service",
        item: `${APP_URL}/terms`,
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
        <span className="text-text">Terms of Service</span>
      </nav>

      <h1 className="font-serif text-3xl md:text-4xl font-bold text-brand mb-8">Terms of Service</h1>

      <div className="bg-white rounded-2xl border border-border-light p-8 md:p-10 prose-sm space-y-6 text-text-light leading-relaxed">
        <p className="text-sm text-text-muted">Last updated: March 2026</p>

        <section>
          <h2 className="font-serif text-lg font-semibold text-brand mb-3">1. Acceptance of Terms</h2>
          <p>By accessing and using Stotra by VastuCart (&quot;stotra.vastucart.in&quot;), you agree to be bound by these Terms of Service. If you do not agree, please do not use this website.</p>
        </section>

        <section>
          <h2 className="font-serif text-lg font-semibold text-brand mb-3">2. Use of Content</h2>
          <p>The stotra texts (Sanskrit/Hindi devotional hymns) presented on this website are sourced from ancient Hindu scriptures and traditional texts in the public domain. You are free to read, recite, and download these texts for personal devotional use.</p>
          <p>The website design, layout, branding, and any original editorial content (translations, summaries, descriptions) are the intellectual property of VastuCart and may not be reproduced without permission.</p>
        </section>

        <section>
          <h2 className="font-serif text-lg font-semibold text-brand mb-3">3. PDF Downloads</h2>
          <p>PDF downloads of stotras are provided free of charge for personal use. The PDFs contain VastuCart branding and may not be modified, resold, or redistributed commercially.</p>
        </section>

        <section>
          <h2 className="font-serif text-lg font-semibold text-brand mb-3">4. Accuracy</h2>
          <p>While we strive to present accurate and authentic stotra texts, we make no warranties regarding the completeness or absolute accuracy of all texts, transliterations, or translations. Users should consult traditional sources and learned scholars for critical religious practices.</p>
        </section>

        <section>
          <h2 className="font-serif text-lg font-semibold text-brand mb-3">5. Third-Party Links</h2>
          <p>This website contains links to other VastuCart ecosystem websites and external platforms. We are not responsible for the content or practices of external websites.</p>
        </section>

        <section>
          <h2 className="font-serif text-lg font-semibold text-brand mb-3">6. Limitation of Liability</h2>
          <p>VastuCart shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use of this website or the stotra content provided herein.</p>
        </section>

        <section>
          <h2 className="font-serif text-lg font-semibold text-brand mb-3">7. Modifications</h2>
          <p>We reserve the right to modify these terms at any time. Continued use of the website after changes constitutes acceptance of the revised terms.</p>
        </section>

        <section>
          <h2 className="font-serif text-lg font-semibold text-brand mb-3">8. Governing Law</h2>
          <p>These terms shall be governed by the laws of India. Any disputes shall be subject to the jurisdiction of courts in India.</p>
        </section>

        <p className="text-xs text-text-muted pt-4 border-t border-border-light">&copy; {new Date().getFullYear()} VastuCart. All rights reserved.</p>
      </div>
    </div>
  );
}
