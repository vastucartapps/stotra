import type { Metadata } from "next";
import Link from "next/link";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://stotra.vastucart.in";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Stotra by VastuCart. Learn how we handle your data.",
  alternates: {
    canonical: "/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
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
        name: "Privacy Policy",
        item: `${APP_URL}/privacy-policy`,
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
        <span className="text-text">Privacy Policy</span>
      </nav>

      <h1 className="font-serif text-3xl md:text-4xl font-bold text-brand mb-8">Privacy Policy</h1>

      <div className="bg-white rounded-2xl border border-border-light p-8 md:p-10 prose-sm space-y-6 text-text-light leading-relaxed">
        <p className="text-sm text-text-muted">Last updated: March 2026</p>

        <section>
          <h2 className="font-serif text-lg font-semibold text-brand mb-3">1. Introduction</h2>
          <p>Stotra by VastuCart (&quot;stotra.vastucart.in&quot;) is operated by VastuCart. This Privacy Policy explains how we collect, use, and protect your information when you visit our website.</p>
        </section>

        <section>
          <h2 className="font-serif text-lg font-semibold text-brand mb-3">2. Information We Collect</h2>
          <p><strong>Automatically Collected:</strong> When you visit our site, we may automatically collect standard web log information including your IP address, browser type, pages visited, and time spent on pages through analytics services.</p>
          <p><strong>No Personal Data Required:</strong> Our stotra portal does not require registration, login, or any personal information to access content. You can browse, read, and download stotras anonymously.</p>
          <p><strong>Admin Panel:</strong> The admin panel is password-protected and used solely by site administrators for content management.</p>
        </section>

        <section>
          <h2 className="font-serif text-lg font-semibold text-brand mb-3">3. Cookies</h2>
          <p>We use essential cookies for site functionality (admin authentication). We may use analytics cookies (such as Google Analytics) to understand site usage patterns. No advertising or tracking cookies are used.</p>
        </section>

        <section>
          <h2 className="font-serif text-lg font-semibold text-brand mb-3">4. How We Use Information</h2>
          <p>Any information collected is used solely to: improve our website content and user experience, understand traffic patterns, and maintain site security. We do not sell, trade, or share your information with third parties.</p>
        </section>

        <section>
          <h2 className="font-serif text-lg font-semibold text-brand mb-3">5. Third-Party Links</h2>
          <p>Our website contains links to other VastuCart ecosystem sites (store.vastucart.in, kundali.vastucart.in, etc.) and social media platforms. Each of these sites has its own privacy policy, and we encourage you to review them.</p>
        </section>

        <section>
          <h2 className="font-serif text-lg font-semibold text-brand mb-3">6. Content Sources</h2>
          <p>All stotra content on this website is sourced from ancient Hindu scriptures and traditional texts that are in the public domain. We do not claim copyright over the original Sanskrit/Hindi devotional texts.</p>
        </section>

        <section>
          <h2 className="font-serif text-lg font-semibold text-brand mb-3">7. Data Security</h2>
          <p>We implement appropriate security measures including HTTPS encryption, secure headers, and access controls to protect our website and any data transmitted through it.</p>
        </section>

        <section>
          <h2 className="font-serif text-lg font-semibold text-brand mb-3">8. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. Any changes will be reflected on this page with an updated revision date.</p>
        </section>

        <section>
          <h2 className="font-serif text-lg font-semibold text-brand mb-3">9. Contact</h2>
          <p>For any questions regarding this Privacy Policy, please contact us through our main website at <a href="https://vastucart.in" target="_blank" rel="noopener noreferrer" className="text-brand hover:text-brand-light">vastucart.in</a>.</p>
        </section>

        <p className="text-xs text-text-muted pt-4 border-t border-border-light">&copy; {new Date().getFullYear()} VastuCart. All rights reserved.</p>
      </div>
    </div>
  );
}
