import type { Metadata } from "next";
import { SearchPageContent } from "@/components/pages/SearchPage";
import { getAllStotras } from "@/lib/stotras";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://stotra.vastucart.in";

export const metadata: Metadata = {
  title: "Search Stotras",
  description: "Search our collection of Hindu stotras, chalisa, and sacred hymns by name, deity, or keyword.",
  alternates: {
    canonical: "/search",
  },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Search Stotras | Stotra by VastuCart",
    description: "Search our collection of Hindu stotras, chalisa, and sacred hymns by name, deity, or keyword.",
    url: `${APP_URL}/search`,
    type: "website",
    images: [
      {
        url: `${APP_URL}/og-default.jpg`,
        width: 1200,
        height: 630,
        alt: "Search Stotras - Stotra by VastuCart",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Search Stotras | Stotra by VastuCart",
    description: "Search our collection of Hindu stotras, chalisa, and sacred hymns by name, deity, or keyword.",
    images: [`${APP_URL}/og-default.jpg`],
  },
};

export default function SearchPage() {
  const allStotras = getAllStotras();

  const searchActionSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: APP_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${APP_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(searchActionSchema) }}
      />

      <div className="text-center mb-10">
        <h1 className="font-serif text-4xl font-bold text-brand mb-3">Search Stotras</h1>
        <p className="text-text-light max-w-lg mx-auto">
          Find stotras by name, deity, or keyword
        </p>
      </div>
      <SearchPageContent stotras={allStotras} />
    </div>
  );
}
