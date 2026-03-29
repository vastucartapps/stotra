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
import type { Stotra, Deity } from "@/types";
import { CategoryIcon } from "@/components/ui/CategoryIcon";

interface StotraContentProps {
  stotra: Stotra;
  deity: Deity | null;
}

export function StotraContent({ stotra, deity }: StotraContentProps) {
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
      </div>

      {/* Viniyog Card */}
      {stotra.viniyog && (
        <div className="mx-6 md:mx-8 mt-6">
          <button
            onClick={() => setViniyogOpen(!viniyogOpen)}
            className="w-full flex items-center justify-between bg-cream-mid/60 rounded-xl px-5 py-4 border border-gold/20 hover:border-gold/40 transition-colors duration-200"
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
            <div className="bg-cream-mid/30 rounded-b-xl px-5 py-4 border-x border-b border-gold/20 animate-slide-down">
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

      {/* Devanagari Text */}
      <div className="p-6 md:p-8">
        <h3 className="font-serif text-sm font-semibold text-brand uppercase tracking-wider mb-4">
          Stotra Path (स्तोत्र पाठ)
        </h3>
        <div className="devanagari text-lg md:text-xl leading-[2.2] text-text bg-cream/50 rounded-xl p-6 border border-border-light">
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
        {showTransliteration && (
          <div className="pb-4 animate-slide-down">
            <div className="text-base leading-[2] text-text-light italic bg-cream-mid/30 rounded-xl p-6">
              {stotra.transliteration.split("\n").map((line, i) => (
                <p key={i} className={line.trim() === "" ? "h-4" : ""}>
                  {line}
                </p>
              ))}
            </div>
          </div>
        )}
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
        {showMeaning && (
          <div className="pb-4 animate-slide-down">
            <div className="devanagari text-base leading-[1.9] text-text-light bg-cream-mid/30 rounded-xl p-6">
              {stotra.hindiMeaning.split("\n").map((line, i) => (
                <p key={i} className={line.trim() === "" ? "h-4" : ""}>
                  {line}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>

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

      {/* Action Bar */}
      <div className="p-6 md:p-8 bg-cream-mid/30 border-t border-border-light">
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
    </article>
  );
}
