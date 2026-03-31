import { ImageResponse } from "next/og";
import { getGitaVerse, getAllGitaChapters } from "@/lib/gita";

export const runtime = "nodejs";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

export function generateStaticParams() {
  const params: { chapter: string; verse: string }[] = [];
  for (const ch of getAllGitaChapters()) {
    for (const v of ch.verses) {
      params.push({ chapter: ch.slug, verse: v.slug });
    }
  }
  return params;
}

export default async function OGImage({
  params,
}: {
  params: Promise<{ chapter: string; verse: string }>;
}) {
  const { chapter: chSlug, verse: vSlug } = await params;
  const result = getGitaVerse(chSlug, vSlug);

  if (!result) {
    return new ImageResponse(
      (
        <div style={{ display: "flex", width: "100%", height: "100%", background: "#013f47", alignItems: "center", justifyContent: "center" }}>
          <p style={{ color: "white", fontSize: 40 }}>Bhagavad Gita</p>
        </div>
      ),
      size
    );
  }

  const { chapter, verse } = result;
  const shlokaLine1 = verse.devanagari.split("\n")[0] || "";
  const shlokaLine2 = verse.devanagari.split("\n")[1] || "";
  const translation = verse.englishTranslation.length > 160
    ? verse.englishTranslation.slice(0, 157) + "..."
    : verse.englishTranslation;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #013f47 0%, #01303a 60%, #012a30 100%)",
          padding: "0",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Diamond pattern overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.04,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30Z' fill='none' stroke='%23DAA520' stroke-width='0.6'/%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Top gold bar */}
        <div style={{ display: "flex", width: "100%", height: "6px", background: "linear-gradient(90deg, #013f47, #DAA520, #FF9933, #DAA520, #013f47)" }} />

        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "48px 60px 40px 60px", position: "relative" }}>

          {/* Header: Om + label */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "36px" }}>
            <div style={{ display: "flex", width: "44px", height: "44px", borderRadius: "12px", background: "rgba(218,165,32,0.15)", border: "1px solid rgba(218,165,32,0.3)", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#DAA520", fontSize: "24px" }}>&#x0950;</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ color: "#DAA520", fontSize: "13px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const }}>
                Bhagavad Gita {chapter.chapterNumber}.{verse.verseNumber}
              </span>
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", marginTop: "2px" }}>
                {chapter.titleEnglish} &middot; {chapter.titleSanskrit}
              </span>
            </div>
          </div>

          {/* Shloka */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" as const, marginBottom: "28px" }}>
            <p style={{ color: "rgba(255,255,255,0.92)", fontSize: "36px", lineHeight: "1.7", margin: "0", maxWidth: "1000px" }}>
              {shlokaLine1}
            </p>
            {shlokaLine2 && (
              <p style={{ color: "rgba(255,255,255,0.92)", fontSize: "36px", lineHeight: "1.7", margin: "0", maxWidth: "1000px" }}>
                {shlokaLine2}
              </p>
            )}
          </div>

          {/* Gold divider */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "24px" }}>
            <div style={{ width: "50px", height: "1px", background: "linear-gradient(90deg, transparent, rgba(218,165,32,0.5))" }} />
            <span style={{ color: "rgba(218,165,32,0.4)", fontSize: "14px" }}>&#x0965;</span>
            <div style={{ width: "50px", height: "1px", background: "linear-gradient(90deg, rgba(218,165,32,0.5), transparent)" }} />
          </div>

          {/* English translation */}
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "18px", lineHeight: "1.6", textAlign: "center" as const, maxWidth: "900px", margin: "0 auto", fontStyle: "italic" as const }}>
            &ldquo;{translation}&rdquo;
          </p>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Footer: branding */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", fontWeight: 600 }}>Stotra</span>
              <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "14px" }}>by VastuCart</span>
            </div>
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "13px" }}>
              stotra.vastucart.in
            </span>
          </div>
        </div>

        {/* Bottom gold bar */}
        <div style={{ display: "flex", width: "100%", height: "4px", background: "linear-gradient(90deg, #013f47, #DAA520, #FF9933, #DAA520, #013f47)" }} />
      </div>
    ),
    {
      ...size,
    }
  );
}
