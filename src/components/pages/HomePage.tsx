import { HOME_FAQS } from "@/data/faqs";

export function FAQSection() {
  return (
    <section className="py-16 bg-cream-mid/50">
      <div className="mx-auto max-w-3xl px-4">
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl font-bold text-brand mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-text-light">
            Common questions about stotras and our collection
          </p>
        </div>
        <div className="space-y-3">
          {HOME_FAQS.map((faq, index) => (
            <details
              key={index}
              className="group bg-white rounded-xl border border-border-light overflow-hidden"
            >
              <summary className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer list-none hover:bg-cream-mid/30 transition-colors duration-200">
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
              <div className="px-6 pb-4">
                <p className="text-sm text-text-light leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
      {/* FAQ Schema — answers are in SSR HTML (via <details>), so schema is valid */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: HOME_FAQS.map((faq) => ({
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
    </section>
  );
}
