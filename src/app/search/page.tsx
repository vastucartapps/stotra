import type { Metadata } from "next";
import { SearchPageContent } from "@/components/pages/SearchPage";
import { getAllStotras } from "@/lib/stotras";
import { siteOpenGraph, siteTwitter } from "@/lib/seo-meta";

const PAGE_TITLE = "Search Stotras | Stotra by VastuCart";
const PAGE_DESC =
  "Search our collection of Hindu stotras, chalisa, and sacred hymns by name, deity, or keyword.";

export const metadata: Metadata = {
  title: "Search Stotras",
  description: PAGE_DESC,
  alternates: { canonical: "/search" },
  robots: { index: false, follow: true },
  openGraph: siteOpenGraph({
    path: "/search",
    title: PAGE_TITLE,
    description: PAGE_DESC,
    type: "website",
    imageAlt: "Search Stotras - Stotra by VastuCart",
  }),
  twitter: siteTwitter({
    path: "/search",
    title: PAGE_TITLE,
    description: PAGE_DESC,
  }),
};

export default function SearchPage() {
  const allStotras = getAllStotras();

  // /search is noindex — no schema. The canonical WebSite + SearchAction
  // are emitted on the homepage via buildStotraWebsiteSchema (lib/schema/website.ts)
  // and must not be re-declared here.

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-12">
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
