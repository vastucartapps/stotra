"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
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
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
      {/* FAQ Schema */}
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

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-border-light overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-cream-mid/30 transition-colors duration-200"
      >
        <span className="font-medium text-sm text-text pr-4">{question}</span>
        <ChevronDown
          className={`w-4 h-4 text-text-muted flex-shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-6 pb-4 animate-slide-down">
          <p className="text-sm text-text-light leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}
