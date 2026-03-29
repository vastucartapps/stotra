"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FAQItem } from "@/types";

interface StotraFAQProps {
  faqs: FAQItem[];
  stotraTitle: string;
}

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
            <FAQAccordionItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              defaultOpen={index === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQAccordionItem({
  question,
  answer,
  defaultOpen = false,
}: {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-cream/50 rounded-xl border border-border-light overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-cream-mid/30 transition-colors duration-200"
      >
        <span className="font-medium text-sm text-text pr-4">{question}</span>
        <ChevronDown
          className={`w-4 h-4 text-text-muted flex-shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-5 pb-4 animate-slide-down">
          <p className="text-sm text-text-light leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}
