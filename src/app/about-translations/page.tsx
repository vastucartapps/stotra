import type { Metadata } from "next";
import Link from "next/link";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://stotra.vastucart.in";

export const metadata: Metadata = {
  title: { absolute: "About Our Translations — Acharya Pushyadant Mishra | VastuCart Stotra" },
  description:
    "Our stotra translations are reviewed by Acharya Pushyadant Mishra, a Varanasi-trained Sanskrit Pandit with 35+ years of experience. Learn about our translation approach and source scriptures.",
  alternates: {
    canonical: "/about-translations",
  },
  openGraph: {
    title: "About Our Translations — Acharya Pushyadant Mishra | VastuCart Stotra",
    description:
      "Our stotra translations are reviewed by Acharya Pushyadant Mishra, a Varanasi-trained Sanskrit Pandit with 35+ years of experience.",
    url: `${APP_URL}/about-translations`,
    type: "website",
  },
};

export default function AboutTranslationsPage() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Acharya Pushyadant Mishra",
    jobTitle: "Vedic Scholar, Stotra Researcher & Sanskrit Translator",
    description:
      "Varanasi-trained Sanskrit Pandit with over 35 years of experience translating Sanskrit stotras into Hindi.",
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Sampurnanand Sanskrit University, Varanasi",
    },
    knowsAbout: [
      "Sanskrit",
      "Hindu Stotras",
      "Vedanta",
      "Sahitya",
      "Vedic Literature",
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: APP_URL },
      { "@type": "ListItem", position: 2, name: "About Our Translations", item: `${APP_URL}/about-translations` },
    ],
  };

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-text-muted mb-8">
        <Link href="/" className="hover:text-brand transition-colors">Home</Link>
        <span>/</span>
        <span className="text-text">About Our Translations</span>
      </nav>

      <div className="max-w-3xl mx-auto">
        {/* Section 1 — About the translator */}
        <section className="mb-12">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-brand mb-6">
            About Acharya Pushyadant Mishra
          </h1>
          <div className="prose prose-sm text-text-light leading-relaxed space-y-4">
            <p>
              Acharya Pushyadant Mishra is a Sanskrit Pandit and stotra researcher born in Prayagraj
              (Allahabad), Uttar Pradesh in 1963. He received his foundational Sanskrit education at
              Gurukul Mahavidyalaya, Prayagraj, before pursuing advanced studies at the Sampurnanand
              Sanskrit University in Varanasi &mdash; one of India&rsquo;s oldest and most respected institutions
              of Sanskrit learning.
            </p>
            <p>
              He completed his Shastri degree (equivalent to a Bachelor of Arts) in Sanskrit and
              Vyakarana in 1984, followed by his Acharya degree (equivalent to a Master of Arts)
              in Sahitya and Vedanta in 1987. From 1987 to 1992, he undertook advanced study under
              Pandit Shri Rameshwar Datta Shastri, a renowned specialist in Purana stotra literature
              based in Varanasi.
            </p>
            <p>
              For over 35 years, Acharya Pushyadant has focused on translating Sanskrit stotras into
              accessible Hindi, with particular expertise in Shaiva stotras (from the Shiva Purana and
              Linga Purana), Vaishnava stotras (from the Vishnu Purana and Bhagavata Purana), Shakta
              stotras (from the Devi Bhagavata and Markandeya Purana), Vedic suktams from the Rigveda
              and Atharvaveda, and the Chalisa literature of Tulsidas. He was associated with the
              Kashimath Stotra Parishad, a scholarly body dedicated to the documentation and preservation
              of stotra literature across the Shaiva, Vaishnava, and Shakta traditions.
            </p>
            <p>
              To date, he has reviewed and translated more than 800 Sanskrit stotras into Hindi, making
              classical devotional texts accessible to modern devotees without sacrificing their ritual
              authenticity.
            </p>
          </div>
        </section>

        {/* Section 2 — Translation approach */}
        <section className="mb-12">
          <h2 className="font-serif text-2xl font-bold text-brand mb-5">
            Our Translation Approach
          </h2>
          <div className="prose prose-sm text-text-light leading-relaxed space-y-4">
            <p>
              Every stotra on this site has been reviewed against its mula (root) source text. We do
              not translate from secondary or aggregated sources &mdash; each translation begins with the
              original Sanskrit as it appears in the relevant Purana, Tantra, or devotional text.
            </p>
            <p>
              Our translation process follows three steps. First, we establish the viniyog &mdash; the
              ritual purpose, presiding deity, seer (rishi), and metre (chandas) of the stotra. This
              context shapes how the meaning is rendered. Second, we translate each verse into Hindi
              arth, cross-referencing classical commentaries by Adi Shankaracharya, Madhvacharya, or
              Ramanujacharya where they exist. Third, we add the English transliteration using a
              consistent romanisation system so that non-Hindi readers can pronounce each verse correctly.
            </p>
            <p>
              Our guiding principle, in the words of Acharya Pushyadant: &ldquo;A stotra is not a poem to be
              parsed &mdash; it is a living prayer to be experienced. The arth must move the devotee&rsquo;s
              heart, not merely satisfy the intellect.&rdquo;
            </p>
          </div>
        </section>

        {/* Section 3 — Source scriptures */}
        <section className="mb-12">
          <h2 className="font-serif text-2xl font-bold text-brand mb-5">
            Primary Source Scriptures
          </h2>
          <p className="text-sm text-text-light mb-6">
            The stotras in our collection are sourced from the following classical texts:
          </p>
          <div className="space-y-4">
            <div className="bg-cream/50 rounded-xl border border-border-light p-5">
              <h3 className="font-serif text-sm font-semibold text-brand mb-2">Vedic Texts</h3>
              <p className="text-sm text-text-light">
                Rigveda (Agni Suktam, Purusha Suktam, Shri Suktam), Atharvaveda (Devi Suktam,
                various kavachas), Yajurveda (Rudrashtadhyayi, Chamakam)
              </p>
            </div>
            <div className="bg-cream/50 rounded-xl border border-border-light p-5">
              <h3 className="font-serif text-sm font-semibold text-brand mb-2">Shaiva Sources</h3>
              <p className="text-sm text-text-light">
                Shiva Purana, Linga Purana, Skanda Purana, Shiva Mahimna Stotram (Pushpadanta),
                works of Adi Shankaracharya
              </p>
            </div>
            <div className="bg-cream/50 rounded-xl border border-border-light p-5">
              <h3 className="font-serif text-sm font-semibold text-brand mb-2">Vaishnava Sources</h3>
              <p className="text-sm text-text-light">
                Vishnu Purana, Bhagavata Purana (Srimad Bhagavatam), Narada Purana,
                Ramcharitmanas (Goswami Tulsidas), Ramayana (Valmiki)
              </p>
            </div>
            <div className="bg-cream/50 rounded-xl border border-border-light p-5">
              <h3 className="font-serif text-sm font-semibold text-brand mb-2">Shakta Sources</h3>
              <p className="text-sm text-text-light">
                Devi Bhagavata Purana, Markandeya Purana (Devi Mahatmyam / Durga Saptashati),
                Kalika Purana, Soundarya Lahari (Adi Shankaracharya)
              </p>
            </div>
            <div className="bg-cream/50 rounded-xl border border-border-light p-5">
              <h3 className="font-serif text-sm font-semibold text-brand mb-2">Agamic &amp; Tantric Texts</h3>
              <p className="text-sm text-text-light">
                Tantrasara, Rudrayamala Tantra, various Upanishads (Ganapati Atharvashirsha,
                Devi Atharvashirsha)
              </p>
            </div>
            <div className="bg-cream/50 rounded-xl border border-border-light p-5">
              <h3 className="font-serif text-sm font-semibold text-brand mb-2">Later Devotional Literature</h3>
              <p className="text-sm text-text-light">
                Hanuman Chalisa and Vinay Patrika (Tulsidas), works of Raskhan, Sant Tukaram,
                Samartha Ramdas
              </p>
            </div>
          </div>
        </section>

        {/* Section 4 — Corrections */}
        <section className="mb-12">
          <h2 className="font-serif text-2xl font-bold text-brand mb-5">
            Corrections &amp; Feedback
          </h2>
          <div className="prose prose-sm text-text-light leading-relaxed space-y-4">
            <p>
              Sanskrit is a precise language, and even well-reviewed translations may contain errors.
              If you find a discrepancy between our translation and the mula text, or if a word meaning
              appears incorrect, we welcome your feedback. Please use the feedback mechanism on the
              relevant stotra page or contact us through{" "}
              <a
                href="https://vastucart.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand hover:text-brand-light transition-colors"
              >
                VastuCart
              </a>.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
