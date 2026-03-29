import { ECOSYSTEM_SITES } from "@/data/ecosystem";
import type { Stotra } from "@/types";
import Link from "next/link";

interface SidebarProps {
  relatedStotras?: Stotra[];
}

export function Sidebar({ relatedStotras }: SidebarProps) {
  return (
    <aside className="space-y-6">
      {/* Store Promo */}
      <div className="bg-white rounded-xl border border-gold/30 p-5 overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold via-saffron to-orange" />
        <p className="text-xs text-gold-dark font-semibold uppercase tracking-wider mb-2">
          VastuCart Store
        </p>
        <p className="font-serif text-lg font-semibold text-brand mb-2">
          Sacred Essentials for Your Spiritual Journey
        </p>
        <p className="text-sm text-text-muted mb-4">
          Discover authentic crystals, yantras, rudraksha, and puja essentials.
        </p>
        <a
          href="https://store.vastucart.in"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 bg-brand text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-brand-light transition-colors duration-200"
        >
          Shop Now &rarr;
        </a>
      </div>

      {/* Kundali Promo */}
      <div className="bg-white rounded-xl border border-border-light p-5">
        <p className="text-xs text-saffron font-semibold uppercase tracking-wider mb-2">
          Kundali by VastuCart
        </p>
        <p className="font-serif font-semibold text-brand mb-2">
          Decode Your Birth Chart
        </p>
        <p className="text-sm text-text-muted mb-3">
          Get detailed Vedic astrology analysis, dasha predictions, and personalized remedies.
        </p>
        <a
          href="https://kundali.vastucart.in"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-brand hover:text-brand-light transition-colors"
        >
          Explore Kundali &rarr;
        </a>
      </div>

      {/* Related Stotras */}
      {relatedStotras && relatedStotras.length > 0 && (
        <div className="bg-white rounded-xl border border-border-light p-5">
          <h3 className="font-serif text-sm font-semibold text-brand uppercase tracking-wider mb-4">
            Related Stotras
          </h3>
          <ul className="space-y-2">
            {relatedStotras.map((stotra) => (
              <li key={stotra.slug}>
                <Link
                  href={`/stotra/${stotra.slug}`}
                  className="block px-3 py-2 rounded-lg text-sm hover:bg-cream-mid transition-colors duration-150"
                >
                  <span className="devanagari-heading text-xs block text-brand leading-snug">
                    {stotra.title}
                  </span>
                  <span className="text-xs text-text-muted">
                    {stotra.titleEn}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Ecosystem Links */}
      <div className="bg-white rounded-xl border border-border-light p-5">
        <h3 className="font-serif text-sm font-semibold text-brand uppercase tracking-wider mb-4">
          VastuCart Network
        </h3>
        <ul className="space-y-2">
          {ECOSYSTEM_SITES.slice(0, 5).map((site) => (
            <li key={site.name}>
              <a
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-text hover:bg-cream-mid hover:text-brand transition-colors duration-150"
              >
                <span>{site.name}</span>
                <span className="text-xs text-text-muted">&rarr;</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
