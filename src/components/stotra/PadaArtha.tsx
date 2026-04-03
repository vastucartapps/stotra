import type { PadaArthaVerse } from "@/types";

interface PadaArthaProps {
  padaartha: PadaArthaVerse[];
}

export function PadaArtha({ padaartha }: PadaArthaProps) {
  return (
    <div className="px-6 md:px-8 pb-6">
      <div className="border-t border-border-light pt-4">
        <h3 className="font-serif text-sm font-semibold text-brand uppercase tracking-wider mb-4">
          Word by Word Meaning — पद-अर्थ
        </h3>
        <div className="space-y-5">
          {padaartha.map((v) => (
            <div key={v.verse}>
              <p className="text-xs text-text-muted mb-2 font-medium">
                Verse {v.verse}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {v.words.map((w, i) => (
                  <div
                    key={i}
                    className="bg-cream/50 rounded-lg border border-border-light p-3 text-center"
                  >
                    <span className="devanagari text-base text-brand font-semibold block">
                      {w.word}
                    </span>
                    <span className="text-[11px] text-text-muted italic block mt-0.5">
                      {w.transliteration}
                    </span>
                    <span className="text-xs text-text-light block mt-1 leading-snug">
                      {w.meaning}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
