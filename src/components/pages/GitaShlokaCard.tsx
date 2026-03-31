"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface GitaShlokaCardProps {
  devanagari: string;
  transliteration: string;
  englishTranslation: string;
  hindiTranslation: string;
  commentary: string;
  chapterNumber: number;
  verseNumber: number;
  chapterSlug: string;
  verseSlug: string;
  chapterTitle: string;
  appUrl: string;
}

export function GitaShlokaCard({
  devanagari,
  transliteration,
  englishTranslation,
  hindiTranslation,
  commentary,
  chapterNumber,
  verseNumber,
  chapterSlug,
  verseSlug,
  chapterTitle,
  appUrl,
}: GitaShlokaCardProps) {
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    if (!shareOpen) return;
    function handleClick(e: MouseEvent) {
      if (shareRef.current && !shareRef.current.contains(e.target as Node)) {
        setShareOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [shareOpen]);

  const verseUrl = `${appUrl}/gita/${chapterSlug}/${verseSlug}`;
  const shareText = `${devanagari.split("\n")[0]}\n\n"${englishTranslation.slice(0, 140)}"\n\n— Bhagavad Gita ${chapterNumber}.${verseNumber} (${chapterTitle})`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareText + "\n\n" + verseUrl);
    setCopied(true);
    setTimeout(() => { setCopied(false); setShareOpen(false); }, 1500);
  };

  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden shadow-card border border-border-light">
          <div className="h-1.5 bg-gradient-to-r from-brand via-gold to-saffron" />

          <div className="bg-white p-6 md:p-8 lg:p-10">
            {/* ── Row 1: Label */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #013f47, #01303a)' }}>
                <span className="text-lg font-serif" style={{ color: '#DAA520' }}>&#x0950;</span>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: '#DAA520' }}>
                  Gita Shloka of the Day
                </p>
                <p className="text-[10px] text-text-muted mt-0.5">
                  Chapter {chapterNumber} &middot; {chapterTitle} &middot; Verse {verseNumber}
                </p>
              </div>
            </div>

            {/* ── Row 2: Shloka card (full width, centered — the hero of this section) */}
            <div className="relative rounded-xl overflow-hidden mb-8" style={{ background: 'linear-gradient(135deg, #013f47, #01303a)' }}>
              <div className="absolute inset-0 opacity-[0.06]">
                <div className="absolute inset-0" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0L40 20L20 40L0 20Z' fill='none' stroke='%23DAA520' stroke-width='0.4'/%3E%3C/svg%3E")`, backgroundSize: "40px 40px" }} />
              </div>
              <div className="relative px-6 py-8 md:px-12 md:py-10 text-center">
                <div className="devanagari text-xl md:text-2xl lg:text-[1.7rem] leading-[2.4] text-white/90 max-w-3xl mx-auto">
                  {devanagari.split("\n").map((line, i) => (
                    <p key={i} className={line.trim() === "" ? "h-3" : ""}>{line}</p>
                  ))}
                </div>
                <div className="mt-5 flex items-center justify-center gap-3">
                  <div className="w-12 h-px bg-gradient-to-r from-transparent to-gold/40" />
                  <span className="text-gold/50 text-xs">&#x0965;</span>
                  <div className="w-12 h-px bg-gradient-to-l from-transparent to-gold/40" />
                </div>
                <p className="text-white/40 text-xs mt-3 italic">
                  {transliteration.split("\n").join(" ")}
                </p>
              </div>
            </div>

            {/* ── Row 3: Three balanced columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              {/* English Translation */}
              <div className="bg-cream/50 rounded-xl border border-border-light p-5">
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2.5">English Translation</p>
                <p className="text-sm text-text-light leading-relaxed">
                  {englishTranslation}
                </p>
              </div>

              {/* Hindi Translation */}
              <div className="bg-brand/5 rounded-xl border border-brand/10 p-5">
                <p className="text-xs font-semibold text-brand uppercase tracking-wider mb-2.5">हिन्दी अर्थ</p>
                <p className="devanagari text-sm text-text-light leading-[1.9]">
                  {hindiTranslation}
                </p>
              </div>

              {/* Commentary */}
              <div className="bg-gold/5 rounded-xl border border-gold/15 p-5">
                <p className="text-xs font-semibold uppercase tracking-wider mb-2.5" style={{ color: '#DAA520' }}>Commentary</p>
                <p className="text-sm text-text-light leading-relaxed">
                  {commentary || `This verse from Chapter ${chapterNumber} (${chapterTitle}) illuminates a key teaching of Lord Krishna in the Bhagavad Gita.`}
                </p>
              </div>
            </div>

            {/* ── Row 4: CTAs + Share — balanced */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href={`/gita/${chapterSlug}/${verseSlug}`}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-brand to-brand-light text-white font-semibold px-6 py-3 rounded-xl hover:shadow-card-hover transition-all duration-300 text-sm"
                >
                  Read Full Verse &rarr;
                </Link>
                <Link
                  href={`/gita/${chapterSlug}`}
                  className="inline-flex items-center gap-2 bg-white border border-border-light hover:border-brand/30 text-brand font-medium px-6 py-3 rounded-xl transition-all duration-200 text-sm"
                >
                  Chapter {chapterNumber}
                </Link>
                <Link
                  href="/gita"
                  className="hidden sm:inline-flex items-center gap-2 text-text-muted hover:text-brand text-sm font-medium transition-colors"
                >
                  All 18 Chapters &rarr;
                </Link>
              </div>

              {/* Share */}
              <div className="relative" ref={shareRef}>
                <button
                  onClick={() => setShareOpen(!shareOpen)}
                  className="inline-flex items-center gap-2 bg-cream-mid hover:bg-cream-dark text-text-muted hover:text-brand border border-border-light px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                  Share Shloka
                </button>
                {shareOpen && (
                  <div className="absolute right-0 bottom-full mb-2 bg-white rounded-xl shadow-elevated border border-border-light p-1.5 min-w-[210px] z-20 animate-scale-in">
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(shareText + "\n\n" + verseUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setShareOpen(false)}
                      className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm text-text hover:bg-cream-mid transition-colors"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      WhatsApp
                    </a>
                    <a
                      href={`https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(verseUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setShareOpen(false)}
                      className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm text-text hover:bg-cream-mid transition-colors"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                      X (Twitter)
                    </a>
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(verseUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setShareOpen(false)}
                      className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm text-text hover:bg-cream-mid transition-colors"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                      Facebook
                    </a>
                    <div className="h-px bg-border-light mx-2 my-1" />
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm text-text hover:bg-cream-mid transition-colors w-full"
                    >
                      {copied ? (
                        <>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                          <span className="text-green-600">Copied!</span>
                        </>
                      ) : (
                        <>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                          Copy to Clipboard
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
