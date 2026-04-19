import type { FAQItem } from "@/types";

interface StotraFAQProps {
  faqs: FAQItem[];
  stotraTitle: string;
}

/**
 * SSR-first FAQ using native <details>/<summary> so answer text is
 * present in the initial HTML (crawlable + FAQPage-schema valid).
 */
export function StotraFAQ({ faqs, stotraTitle }: StotraFAQProps) {
  return (
    <section className="bg-white rounded-2xl border border-border-light shadow-card overflow-hidden mt-8">
      <div className="p-6 md:p-8">
        <h2 className="font-serif text-xl md:text-2xl font-semibold text-brand mb-2">
          Frequently Asked Questions
        </h2>
        <p className="text-sm text-text-muted mb-6">
          Common questions about {stotraTitle}
        </p>
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <details
              key={index}
              open={index === 0}
              className="group bg-cream/50 rounded-xl border border-border-light overflow-hidden"
            >
              <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none hover:bg-cream-mid/30 transition-colors duration-200">
                <span className="font-medium text-sm text-text">{faq.question}</span>
                <svg
                  className="w-4 h-4 text-text-muted flex-shrink-0 transition-transform duration-300 group-open:rotate-180"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </summary>
              <div className="px-5 pb-4">
                <p className="text-sm text-text-light leading-relaxed">{faq.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
