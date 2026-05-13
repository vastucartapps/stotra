import type { Metadata } from "next";
import Link from "next/link";
import { buildStaticArticleGraph } from "@/lib/schema";
import { siteOpenGraph, siteTwitter } from "@/lib/seo-meta";

const PAGE_TITLE = "Editorial Process — How We Prepare Stotra Translations | Stotra by VastuCart";
const PAGE_DESC =
  "How VastuCart Editorial prepares the Sanskrit, transliteration, and Hindi meaning for every stotra on this site.";

export const metadata: Metadata = {
  title: { absolute: "Editorial Process — Stotra Translations | VastuCart" },
  description:
    "How VastuCart Editorial prepares the Sanskrit, transliteration, and Hindi meaning for every stotra on this site — our sources, our translation approach, and how you can report corrections.",
  alternates: { canonical: "/editorial-process" },
  openGraph: siteOpenGraph({
    path: "/editorial-process",
    title: PAGE_TITLE,
    description: PAGE_DESC,
    type: "website",
  }),
  twitter: siteTwitter({
    path: "/editorial-process",
    title: PAGE_TITLE,
    description: PAGE_DESC,
  }),
};

export default function EditorialProcessPage() {
  const graph = buildStaticArticleGraph({
    path: "/editorial-process",
    headline: "Editorial Process — How We Prepare Stotra Translations",
    description:
      "How VastuCart Editorial prepares the Sanskrit, transliteration, and Hindi meaning for every stotra on this site — our sources, our translation approach, and how you can report corrections.",
    breadcrumbName: "Editorial Process",
    datePublished: "2026-04-10",
    dateModified: "2026-04-19",
  });

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
      />

      <nav className="flex items-center gap-2 text-xs text-text-muted mb-8">
        <Link href="/" className="hover:text-brand transition-colors">Home</Link>
        <span>/</span>
        <span className="text-text">Editorial Process</span>
      </nav>

      <div className="max-w-3xl mx-auto">
        <section className="mb-12">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-brand mb-6">
            Our Editorial Process
          </h1>
          <div className="prose prose-sm text-text-light leading-relaxed space-y-4">
            <p>
              The stotras, chalisas, Bhagavad Gita verses, and vrat kathas on this site are
              prepared by <strong>VastuCart Editorial</strong> — the in-house team of
              VastuCart that researches, transcribes, and presents classical Hindu devotional
              texts in Sanskrit and Hindi with English transliteration. Translation and
              meaning work is editorial, not scholarly — we are not a research institution
              and we do not claim individual scholarly credentials. We are a devotional-text
              publisher.
            </p>
            <p>
              Our goal is simple: make authentic Hindu devotional texts readable for anyone
              who can read Devanagari, Roman script, or Hindi, without distorting the source.
              Where a text has a well-established classical composer &mdash; Goswami Tulsidas,
              Adi Shankaracharya, Valmiki, Vyasa, and others &mdash; we credit that composer.
              Where a text is preserved in classical tradition with uncertain provenance, we
              say so plainly rather than inventing a citation.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="font-serif text-2xl font-bold text-brand mb-5">
            How We Source Stotras
          </h2>
          <div className="prose prose-sm text-text-light leading-relaxed space-y-4">
            <p>
              Every stotra on this site is transcribed from classical printed or digital
              editions in the public domain. Our primary reference shelf includes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Gita Press (Gorakhpur)</strong> editions of the Puranas, Ramayana,
                Mahabharata, Bhagavad Gita, Devi Mahatmyam, and standalone stotra collections.
              </li>
              <li>
                <strong>Ramcharitmanas</strong> and other compositions of Goswami Tulsidas
                (Vinay Patrika, Geetavali, Dohavali).
              </li>
              <li>
                <strong>Adi Shankaracharya stotra corpus</strong> &mdash; Soundarya Lahari,
                Bhaja Govindam, Nirvana Shatakam, and the many ashtakams attributed to him.
              </li>
              <li>
                <strong>Devi Bhagavata Purana, Markandeya Purana (Durga Saptashati), Shiva
                Purana, Vishnu Purana, Bhagavata Purana, Skanda Purana</strong> &mdash; for
                stotras embedded in Puranic narratives.
              </li>
              <li>
                <strong>Vedic suktas</strong> (Rigveda, Atharvaveda, Yajurveda) for Agni
                Suktam, Purusha Suktam, Shri Suktam, Rudram, and other Samhita hymns.
              </li>
              <li>
                <strong>Agamic and Tantric texts</strong> where applicable &mdash; Ganapati
                Atharvashirsha, Devi Atharvashirsha, Kali Sahasranama from Mahanirvana
                Tantra.
              </li>
            </ul>
            <p>
              When a text&apos;s provenance is uncertain, we write &ldquo;preserved in the classical
              Parasari tradition&rdquo; or &ldquo;traditional composition, precise source
              uncertain&rdquo; rather than naming a random Purana. We would rather leave a
              field blank than fabricate a citation.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="font-serif text-2xl font-bold text-brand mb-5">
            How We Present Each Stotra
          </h2>
          <div className="prose prose-sm text-text-light leading-relaxed space-y-4">
            <p>Every stotra detail page follows the same structure:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Sanskrit in Devanagari</strong> &mdash; the text itself, as close to
                the original published edition as we can transcribe.
              </li>
              <li>
                <strong>Transliteration</strong> &mdash; Roman-script rendering following a
                consistent IAST-inspired convention for readability. Where diacritics get in
                the way of everyday pronunciation, we prefer readability.
              </li>
              <li>
                <strong>Hindi arth (meaning)</strong> &mdash; a verse-by-verse or passage-by-passage
                Hindi rendering aimed at devotional understanding, not literary analysis.
                Where classical commentaries (Adi Shankaracharya, Madhvacharya, Ramanujacharya)
                exist and disagree, we cite the mainstream Smarta reading and note major variants.
              </li>
              <li>
                <strong>Viniyog (where applicable)</strong> &mdash; the traditional ritual
                framing (rishi, chhand, devata, beej, shakti, kilak) from the mula source.
              </li>
              <li>
                <strong>Benefits section</strong> &mdash; stated in tradition-framed language.
                We describe what the tradition says about a stotra, not medical, financial, or
                outcome claims.
              </li>
            </ul>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="font-serif text-2xl font-bold text-brand mb-5">
            Corrections &amp; Feedback
          </h2>
          <div className="prose prose-sm text-text-light leading-relaxed space-y-4">
            <p>
              Sanskrit is a precise language and devotional texts have multiple recensions.
              If you spot a transcription error, a wrong source attribution, an incorrect
              Hindi arth, or a variant reading we should know about, please write to{" "}
              <a
                href="mailto:hi@vastucart.in"
                className="text-brand hover:text-brand-light transition-colors"
              >
                hi@vastucart.in
              </a>
              {" "}with the URL and the correction. If you can cite a primary source for the
              fix (Gita Press page reference, Purana chapter, or a Paramparagat text), that
              speeds up the review.
            </p>
            <p>
              We treat every correction seriously. Corrections are reviewed, verified against
              the mula text, and applied with the correction date noted in the dateModified
              field on the page.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
