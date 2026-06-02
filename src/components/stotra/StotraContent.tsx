"use client";

import { useState } from "react";
import {
  Clock,
  BookOpen,
  Download,
  Share2,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
} from "lucide-react";
import Link from "next/link";
import type { Stotra, Deity, StotraCardSummary } from "@/types";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { PadaArtha } from "@/components/stotra/PadaArtha";

const MONTHS_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/**
 * Format an ISO timestamp as "13 May 2026" using UTC throughout — so the
 * server's Node runtime and the client's browser runtime produce IDENTICAL
 * output regardless of either's local timezone. Using
 * Date.prototype.toLocaleDateString() here causes React error #418
 * (hydration mismatch) because the same Date object resolves to a
 * different day-string in UTC vs IST/PST/etc near the day boundary.
 */
function formatReviewedDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getUTCDate()} ${MONTHS_EN[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

interface StotraContentProps {
  stotra: Stotra;
  deity: Deity | null;
  /**
   * Companion stotras as minimal cards — never full Stotra objects.
   * Full objects would 2-3x the RSC payload of every stotra page.
   */
  companionStotras?: StotraCardSummary[];
}

export function StotraContent({ stotra, deity, companionStotras }: StotraContentProps) {
  const [showTransliteration, setShowTransliteration] = useState(false);
  const [showMeaning, setShowMeaning] = useState(false);
  const [viniyogOpen, setViniyogOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = `${stotra.titleEn} - ${stotra.title} | Read this sacred stotra`;

  return (
    <article className="bg-white rounded-2xl border border-border-light shadow-card overflow-hidden">
      {/* Top gradient bar */}
      <div className="h-1 bg-gradient-to-r from-brand via-gold to-saffron" />

      {/* Header */}
      <div className="p-6 md:p-8 border-b border-border-light">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {deity && (
            <span
              className="inline-flex items-center gap-2 text-xs font-medium pl-1 pr-3 py-1 rounded-full text-white"
              style={{ backgroundColor: deity.color }}
            >
              <CategoryIcon type="deity" id={deity.id} color={deity.color} size="sm" />
              {deity.name}
            </span>
          )}
          {stotra.days.map((day) => (
            <span
              key={day}
              className="text-xs bg-cream-mid text-text-light px-2.5 py-1 rounded-full capitalize"
            >
              {day}
            </span>
          ))}
        </div>

        <h1 className="font-serif text-xl md:text-2xl text-text-light font-medium mb-1">
          {stotra.titleEn}
        </h1>
        <p className="devanagari-heading text-3xl md:text-4xl text-brand">
          {stotra.title}
        </p>

        {stotra.alsoKnownAs && stotra.alsoKnownAs.length > 0 && (
          <p className="text-xs italic text-text-muted mt-2">
            Also known as:{" "}
            <span className="not-italic">{stotra.alsoKnownAs.join(" · ")}</span>
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-text-muted">
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {stotra.readingTimeMinutes} min read
          </span>
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" />
            {stotra.verseCount} verses
          </span>
          {stotra.source && (
            <span className="text-xs">Source: {stotra.source}</span>
          )}
        </div>

        {/* E-E-A-T trust signal: visible last-reviewed line per Google QRG.
            Date is formatted via formatReviewedDate() (UTC-pinned) — using
            toLocaleDateString() here would fire React error #418 because
            server (Node UTC) and client (browser-local TZ) produce
            different strings for dates near a day boundary. */}
        <p className="text-xs text-text-muted mt-3">
          Prepared by{" "}
          <a
            href="/editorial-process"
            className="underline hover:text-brand transition-colors"
          >
            VastuCart Editorial
          </a>
          {" "}— last reviewed{" "}
          <time dateTime={stotra.updatedAt}>
            {formatReviewedDate(stotra.updatedAt)}
          </time>
        </p>
      </div>

      {/* Key Facts — TL;DR box (citable summary from existing fields).
          id="key-facts" is the target of schema speakable cssSelector. */}
      <div className="mx-6 md:mx-8 mt-6">
        <div id="key-facts" className="bg-cream-mid rounded-xl px-5 py-4 border border-gold/20">
          <h2 className="font-serif text-sm font-semibold text-brand uppercase tracking-wider mb-3">
            Key Facts
          </h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
            {deity && (
              <div className="flex justify-between gap-3 border-b border-border-light/70 py-1">
                <dt className="text-text-muted">Deity</dt>
                <dd className="text-text font-medium text-right">{deity.name}</dd>
              </div>
            )}
            {stotra.source && (
              <div className="flex justify-between gap-3 border-b border-border-light/70 py-1">
                <dt className="text-text-muted">Source</dt>
                <dd className="text-text font-medium text-right">{stotra.source}</dd>
              </div>
            )}
            <div className="flex justify-between gap-3 border-b border-border-light/70 py-1">
              <dt className="text-text-muted">Verses</dt>
              <dd className="text-text font-medium text-right">{stotra.verseCount}</dd>
            </div>
            <div className="flex justify-between gap-3 border-b border-border-light/70 py-1">
              <dt className="text-text-muted">Reading time</dt>
              <dd className="text-text font-medium text-right">{stotra.readingTimeMinutes} min</dd>
            </div>
            {stotra.days.length > 0 && (
              <div className="flex justify-between gap-3 border-b border-border-light/70 py-1">
                <dt className="text-text-muted">Best day</dt>
                <dd className="text-text font-medium text-right capitalize">{stotra.days.join(", ")}</dd>
              </div>
            )}
            <div className="flex justify-between gap-3 border-b border-border-light/70 py-1">
              <dt className="text-text-muted">Languages</dt>
              <dd className="text-text font-medium text-right">Sanskrit, Hindi, English</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* When to Recite — promoted from FAQ to standalone callout.
          Renders even without festivals/days so the section exists on every
          page (AI Overviews / featured-snippet bait). */}
      {(stotra.days.length > 0 || stotra.festivals.length > 0) && (
        <div className="mx-6 md:mx-8 mt-6">
          <div className="bg-saffron/8 rounded-xl px-5 py-4 border-l-4 border-saffron">
            <h3 className="font-serif text-sm font-semibold text-brand uppercase tracking-wider mb-3">
              When to Recite
            </h3>
            <ul className="space-y-1.5 text-sm text-text">
              {stotra.days.length > 0 && (
                <li>
                  <strong className="text-brand">Days:</strong>{" "}
                  <span className="capitalize">{stotra.days.join(", ")}</span>
                  {deity && (
                    <span className="text-text-muted">
                      {" "}— traditionally associated with {deity.name} worship
                    </span>
                  )}
                </li>
              )}
              {stotra.festivals.length > 0 && (
                <li>
                  <strong className="text-brand">Festivals:</strong>{" "}
                  <span className="capitalize">
                    {stotra.festivals.map((f) => f.replace(/-/g, " ")).join(", ")}
                  </span>
                </li>
              )}
              <li>
                <strong className="text-brand">Time of day:</strong> Early
                morning (Brahma Muhurta, ~4:00–6:00 IST) and evening Sandhya
                are considered most efficacious. The stotra may be recited on
                any day for spiritual benefit.
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Viniyog Card */}
      {stotra.viniyog && (
        <div className="mx-6 md:mx-8 mt-6">
          <button
            onClick={() => setViniyogOpen(!viniyogOpen)}
            className="w-full flex items-center justify-between bg-cream-mid rounded-xl px-5 py-4 border border-gold/20 hover:border-gold/40 transition-colors duration-200"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center text-gold font-serif font-bold text-sm">
                V
              </span>
              <span className="font-serif font-semibold text-brand text-sm">
                Viniyog (विनियोग)
              </span>
            </div>
            {viniyogOpen ? (
              <ChevronUp className="w-4 h-4 text-text-muted" />
            ) : (
              <ChevronDown className="w-4 h-4 text-text-muted" />
            )}
          </button>
          {viniyogOpen && (
            <div className="bg-cream-mid rounded-b-xl px-5 py-4 border-x border-b border-gold/20 animate-slide-down">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: "ऋषि (Rishi)", value: stotra.viniyog.rishi },
                  { label: "छन्द (Chhand)", value: stotra.viniyog.chhand },
                  { label: "देवता (Devata)", value: stotra.viniyog.devata },
                  { label: "बीज (Beej)", value: stotra.viniyog.beej },
                  { label: "शक्ति (Shakti)", value: stotra.viniyog.shakti },
                  { label: "कीलक (Kilak)", value: stotra.viniyog.kilak },
                ].map(
                  (item) =>
                    item.value && (
                      <div key={item.label} className="bg-white rounded-lg p-3">
                        <span className="text-xs text-text-muted block mb-0.5">
                          {item.label}
                        </span>
                        <span className="devanagari text-sm text-text leading-normal">
                          {item.value}
                        </span>
                      </div>
                    )
                )}
              </div>
              {stotra.viniyog.nyasa && (
                <div className="mt-3 bg-white rounded-lg p-3">
                  <span className="text-xs text-text-muted block mb-0.5">
                    न्यास (Nyasa)
                  </span>
                  <span className="devanagari text-sm text-text leading-normal">
                    {stotra.viniyog.nyasa}
                  </span>
                </div>
              )}
              {stotra.viniyog.shloka && (
                <div className="mt-3 bg-white rounded-lg p-4 border border-gold/15">
                  <span className="text-xs text-gold-dark font-semibold block mb-2">
                    विनियोग श्लोक (Viniyog Shloka)
                  </span>
                  <div className="devanagari text-sm text-text leading-[2]">
                    {stotra.viniyog.shloka.split("\n").map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* About This Stotra */}
      {stotra.description && (
        <div className="mx-6 md:mx-8 mt-6">
          <div className="bg-cream rounded-xl border border-border-light p-5 md:p-6">
            <h2 className="font-serif text-sm font-semibold text-brand uppercase tracking-wider mb-3">
              About {stotra.titleEn}
            </h2>
            <div id="about-summary" className="text-sm md:text-[15px] text-text-light leading-relaxed md:leading-[1.85] space-y-3">
              {stotra.description.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Editorial Byline */}
      <p className="text-xs text-text-muted px-6 md:px-8 pb-2">
        Prepared by{" "}
        <Link href="/editorial-process" className="text-brand hover:text-brand-light transition-colors">
          VastuCart Editorial
        </Link>
      </p>

      {/* Devanagari Text */}
      <div className="p-6 md:p-8">
        <h3 className="font-serif text-sm font-semibold text-brand uppercase tracking-wider mb-4">
          Stotra Path (स्तोत्र पाठ)
        </h3>
        <div className="devanagari text-xl md:text-2xl lg:text-[1.75rem] xl:text-3xl leading-[2] md:leading-[2.2] lg:leading-[2.3] text-text bg-cream rounded-xl p-5 md:p-6 border border-border-light text-center">
          {stotra.devanagariText.split("\n").map((line, i) => (
            <p key={i} className={line.trim() === "" ? "h-4" : ""}>
              {line}
            </p>
          ))}
        </div>
      </div>

      {/* Transliteration (Collapsible) */}
      <div className="px-6 md:px-8 pb-2">
        <button
          onClick={() => setShowTransliteration(!showTransliteration)}
          className="w-full flex items-center justify-between py-3 border-t border-border-light text-sm"
        >
          <span className="font-serif font-semibold text-brand uppercase tracking-wider">
            Transliteration
          </span>
          {showTransliteration ? (
            <ChevronUp className="w-4 h-4 text-text-muted" />
          ) : (
            <ChevronDown className="w-4 h-4 text-text-muted" />
          )}
        </button>
        {/* Always rendered (CSS-collapsed, not unmounted) so the transliteration
            is present in the server HTML for AI crawlers + Google to read. A
            conditional `{showTransliteration && …}` mount would omit it from SSR
            output entirely — losing the most citable content on the page. */}
        <div className={showTransliteration ? "pb-4 animate-slide-down" : "hidden"}>
          <div className="text-base leading-[2] text-text-light italic bg-cream-mid rounded-xl p-6">
            {stotra.transliteration.split("\n").map((line, i) => (
              <p key={i} className={line.trim() === "" ? "h-4" : ""}>
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Hindi Meaning (Collapsible) */}
      <div className="px-6 md:px-8 pb-2">
        <button
          onClick={() => setShowMeaning(!showMeaning)}
          className="w-full flex items-center justify-between py-3 border-t border-border-light text-sm"
        >
          <span className="font-serif font-semibold text-brand uppercase tracking-wider">
            Meaning (अर्थ)
          </span>
          {showMeaning ? (
            <ChevronUp className="w-4 h-4 text-text-muted" />
          ) : (
            <ChevronDown className="w-4 h-4 text-text-muted" />
          )}
        </button>
        {/* Always rendered (CSS-collapsed) so the Hindi meaning (अर्थ) ships in
            the server HTML — this is the single most AI-queried field ("what
            does X mean?") and was previously absent from SSR output. */}
        <div className={showMeaning ? "pb-4 animate-slide-down" : "hidden"}>
          <div className="devanagari text-base leading-[1.9] text-text-light bg-cream-mid rounded-xl p-6">
            {stotra.hindiMeaning.split("\n").map((line, i) => (
              <p key={i} className={line.trim() === "" ? "h-4" : ""}>
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Pada Artha (Word by Word) */}
      {stotra.padaartha && stotra.padaartha.length > 0 && (
        <PadaArtha padaartha={stotra.padaartha} />
      )}

      {/* Benefits */}
      {stotra.benefits.length > 0 && (
        <div className="px-6 md:px-8 pb-6">
          <div className="border-t border-border-light pt-4">
            <h3 className="font-serif text-sm font-semibold text-brand uppercase tracking-wider mb-3">
              Benefits (फल)
            </h3>
            <ul className="space-y-2">
              {stotra.benefits.map((benefit, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-text-light">
                  <span className="text-gold mt-0.5 text-xs">&#9733;</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Also Recited With */}
      {companionStotras && companionStotras.length > 0 && (
        <div className="px-6 md:px-8 pb-6">
          <div className="border-t border-border-light pt-4">
            <h3 className="font-serif text-sm font-semibold text-brand uppercase tracking-wider mb-3">
              Also Recited With
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {companionStotras.map((cs) => (
                <Link
                  key={cs.slug}
                  href={`/stotra/${cs.slug}`}
                  className="flex items-center gap-3 px-4 py-3 bg-cream rounded-xl border border-border-light hover:border-gold/30 hover:shadow-card transition-all duration-200"
                >
                  <span className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-brand text-xs font-serif font-bold">&#x0950;</span>
                  </span>
                  <span className="min-w-0">
                    <span className="devanagari-heading text-xs text-brand block leading-snug truncate">
                      {cs.title}
                    </span>
                    <span className="text-[11px] text-text-muted truncate block">
                      {cs.titleEn}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Action Bar */}
      <div className="p-6 md:p-8 bg-cream-mid border-t border-border-light">
        <div className="flex flex-wrap items-center gap-3">
          {/* PDF Download */}
          <a
            href={`/api/pdf/${stotra.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-brand text-white font-medium px-5 py-2.5 rounded-xl hover:bg-brand-light transition-colors duration-200 text-sm"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </a>

          {/* Share */}
          <div className="relative">
            <button
              onClick={() => setShareOpen(!shareOpen)}
              className="inline-flex items-center gap-2 bg-white border border-border text-text font-medium px-5 py-2.5 rounded-xl hover:border-brand/30 transition-colors duration-200 text-sm"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
            {shareOpen && (
              <div className="absolute bottom-full left-0 mb-2 bg-white rounded-xl shadow-elevated border border-border-light p-2 min-w-[180px] animate-scale-in z-10">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-3 py-2 rounded-lg text-sm text-text hover:bg-cream-mid transition-colors"
                >
                  WhatsApp
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-3 py-2 rounded-lg text-sm text-text hover:bg-cream-mid transition-colors"
                >
                  Facebook
                </a>
                <a
                  href={`https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-3 py-2 rounded-lg text-sm text-text hover:bg-cream-mid transition-colors"
                >
                  X (Twitter)
                </a>
                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-3 py-2 rounded-lg text-sm text-text hover:bg-cream-mid transition-colors"
                >
                  Telegram
                </a>
                <a
                  href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&description=${encodeURIComponent(shareText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-3 py-2 rounded-lg text-sm text-text hover:bg-cream-mid transition-colors"
                >
                  Pinterest
                </a>
                <a
                  href={`mailto:?subject=${encodeURIComponent(stotra.titleEn + " - Stotra by VastuCart")}&body=${encodeURIComponent(shareText + "\n\n" + shareUrl)}`}
                  className="block px-3 py-2 rounded-lg text-sm text-text hover:bg-cream-mid transition-colors"
                >
                  Email
                </a>
                <button
                  onClick={handleCopyLink}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-text hover:bg-cream-mid transition-colors flex items-center gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy Link
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Searches — populated by per-stotra SERP enrichment */}
      {stotra.relatedSearches && stotra.relatedSearches.length > 0 && (
        <div className="px-6 md:px-8 py-5 border-t border-border-light bg-cream-light">
          <p className="text-xs uppercase tracking-wide text-text-muted mb-3 font-medium">
            People also search for
          </p>
          <div className="flex flex-wrap gap-2">
            {stotra.relatedSearches.map((term, i) => (
              <span
                key={i}
                className="text-sm text-text bg-white px-3 py-1.5 rounded-full border border-border-light"
              >
                {term}
              </span>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
