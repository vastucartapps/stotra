import { NextResponse } from "next/server";
import { getStotraBySlug } from "@/lib/stotras";
import { getDeityById } from "@/data/deities";

// Escape HTML to prevent XSS
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const stotra = getStotraBySlug(slug);

  if (!stotra) {
    return NextResponse.json({ error: "Stotra not found" }, { status: 404 });
  }

  const deity = getDeityById(stotra.deity);
  const deityName = deity ? `${escapeHtml(deity.name)} (${escapeHtml(deity.nameHi)})` : escapeHtml(stotra.deity);
  const deityColor = deity?.color || "#013F47";
  const year = new Date().getFullYear();

  // Format verses into 2-column pairs where possible
  const verses = stotra.devanagariText.split("\n").filter((l) => l.trim());
  const translitLines = stotra.transliteration
    ? stotra.transliteration.split("\n").filter((l) => l.trim())
    : [];

  const viniyogHtml = stotra.viniyog
    ? `
    <div class="viniyog-box">
      <div class="viniyog-header">
        <div class="viniyog-icon">V</div>
        <span>विनियोग &middot; Viniyog</span>
      </div>
      ${stotra.viniyog.shloka ? `<div class="viniyog-shloka">${stotra.viniyog.shloka.replace(/\n/g, "<br>")}</div>` : ""}
      <table class="viniyog-table">
        ${stotra.viniyog.rishi ? `<tr><td class="vt-label">ऋषि (Rishi)</td><td class="vt-value">${stotra.viniyog.rishi}</td></tr>` : ""}
        ${stotra.viniyog.chhand ? `<tr><td class="vt-label">छन्द (Chhand)</td><td class="vt-value">${stotra.viniyog.chhand}</td></tr>` : ""}
        ${stotra.viniyog.devata ? `<tr><td class="vt-label">देवता (Devata)</td><td class="vt-value">${stotra.viniyog.devata}</td></tr>` : ""}
        ${stotra.viniyog.beej ? `<tr><td class="vt-label">बीज (Beej)</td><td class="vt-value">${stotra.viniyog.beej}</td></tr>` : ""}
        ${stotra.viniyog.shakti ? `<tr><td class="vt-label">शक्ति (Shakti)</td><td class="vt-value">${stotra.viniyog.shakti}</td></tr>` : ""}
        ${stotra.viniyog.kilak ? `<tr><td class="vt-label">कीलक (Kilak)</td><td class="vt-value">${stotra.viniyog.kilak}</td></tr>` : ""}
      </table>
    </div>`
    : "";

  const benefitsHtml =
    stotra.benefits.length > 0
      ? `
    <div class="benefits-section">
      <div class="section-label">फल &middot; Benefits</div>
      <div class="benefits-grid">
        ${stotra.benefits.map((b) => `<div class="benefit-item"><span class="benefit-star">★</span> ${b}</div>`).join("")}
      </div>
    </div>`
      : "";

  const html = `<!DOCTYPE html>
<html lang="hi">
<head>
<meta charset="UTF-8">
<title>${stotra.titleEn} - ${stotra.title} | Stotra by VastuCart</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Open+Sans:wght@400;500;600;700&display=swap');

*{margin:0;padding:0;box-sizing:border-box}

@page{size:A4;margin:0}

body{
  font-family:'Open Sans',sans-serif;
  color:#433B35;
  background:#FFFBF5;
  -webkit-print-color-adjust:exact;
  print-color-adjust:exact;
}

.page{
  width:210mm;min-height:297mm;margin:0 auto;
  padding:32px 40px;
  position:relative;
}

/* ── Decorative Border ── */
.page::before{
  content:'';position:absolute;top:16px;left:16px;right:16px;bottom:16px;
  border:1px solid rgba(218,165,32,0.25);
  border-radius:4px;pointer-events:none;
}

.page::after{
  content:'';position:absolute;top:12px;left:12px;right:12px;bottom:12px;
  border:0.5px solid rgba(1,63,71,0.1);
  border-radius:6px;pointer-events:none;
}

/* ── Header ── */
.header{
  text-align:center;
  padding-bottom:24px;
  margin-bottom:24px;
  position:relative;
}

.header::after{
  content:'';position:absolute;bottom:0;left:10%;right:10%;
  height:3px;
  background:linear-gradient(90deg,transparent,#013F47,#DAA520,#FF9933,#DAA520,#013F47,transparent);
  border-radius:2px;
}

.logo-row{
  display:flex;align-items:center;justify-content:center;gap:8px;
  margin-bottom:16px;
}

.logo-img{
  width:32px;height:32px;border-radius:6px;
}

.logo-text{
  font-family:'Lora',serif;font-size:18px;font-weight:700;color:#013F47;
}

.logo-sub{
  font-size:9px;color:#9A8D82;text-transform:uppercase;letter-spacing:3px;
  display:block;margin-top:-2px;
}

.title-hi{
  font-family:'Noto Sans Devanagari',sans-serif;
  font-size:32px;font-weight:700;color:#013F47;
  margin:8px 0 4px;line-height:1.3;
}

.title-en{
  font-family:'Lora',serif;font-size:20px;color:#6B5E54;
  font-weight:500;font-style:italic;
}

.meta-row{
  display:flex;align-items:center;justify-content:center;gap:16px;
  margin-top:14px;flex-wrap:wrap;
}

.meta-badge{
  display:inline-flex;align-items:center;gap:4px;
  font-size:10px;padding:4px 12px;border-radius:20px;
  background:${deityColor};color:#fff;font-weight:600;
}

.meta-item{
  font-size:10px;color:#9A8D82;
}

/* ── Viniyog ── */
.viniyog-box{
  background:linear-gradient(135deg,#FFFBF5,#FFF5E9);
  border:1px solid rgba(218,165,32,0.3);
  border-radius:10px;padding:20px;margin:20px 0;
  page-break-inside:avoid;
}

.viniyog-header{
  display:flex;align-items:center;gap:10px;
  font-family:'Lora',serif;font-size:14px;font-weight:600;color:#013F47;
  margin-bottom:12px;
}

.viniyog-icon{
  width:28px;height:28px;border-radius:6px;
  background:linear-gradient(135deg,#DAA520,#FF9933);
  color:#fff;font-family:'Lora',serif;font-weight:700;font-size:13px;
  display:flex;align-items:center;justify-content:center;
}

.viniyog-shloka{
  font-family:'Noto Sans Devanagari',sans-serif;
  font-size:13px;line-height:1.9;color:#433B35;
  background:#fff;border-radius:8px;padding:14px 16px;
  margin-bottom:14px;
  border-left:3px solid #DAA520;
}

.viniyog-table{
  width:100%;border-collapse:collapse;
}

.viniyog-table tr{border-bottom:1px solid rgba(218,165,32,0.12)}
.viniyog-table tr:last-child{border:none}

.vt-label{
  font-size:11px;color:#9A8D82;padding:6px 8px 6px 0;width:130px;
  white-space:nowrap;vertical-align:top;
}

.vt-value{
  font-family:'Noto Sans Devanagari',sans-serif;
  font-size:12px;color:#433B35;padding:6px 0;
}

/* ── Section Labels ── */
.section-label{
  font-family:'Lora',serif;font-size:12px;font-weight:600;
  color:#013F47;text-transform:uppercase;letter-spacing:1.5px;
  margin:28px 0 14px;padding-bottom:8px;
  border-bottom:2px solid transparent;
  border-image:linear-gradient(90deg,#013F47 0%,#DAA520 50%,transparent 100%) 1;
  display:flex;align-items:center;gap:8px;
}

.section-label::before{
  content:'';width:4px;height:16px;background:#DAA520;border-radius:2px;
  flex-shrink:0;
}

/* ── Main Text ── */
.stotra-text{
  font-family:'Noto Sans Devanagari',sans-serif;
  font-size:15px;line-height:2.4;color:#433B35;
  background:#fff;border-radius:10px;padding:24px 28px;
  border:1px solid #F0E8DE;
  column-count:auto;
}

/* Side-by-side layout for Devanagari + Transliteration */
.dual-column{
  display:grid;grid-template-columns:1fr 1fr;gap:20px;
  margin-top:4px;
}

.dual-column .col-left{
  background:#fff;border-radius:10px;padding:20px 24px;
  border:1px solid #F0E8DE;
}

.dual-column .col-right{
  background:#FAFAF5;border-radius:10px;padding:20px 24px;
  border:1px solid #F0E8DE;
}

.col-label{
  font-family:'Lora',serif;font-size:10px;font-weight:600;
  color:#9A8D82;text-transform:uppercase;letter-spacing:1.5px;
  margin-bottom:10px;
}

.devanagari-col{
  font-family:'Noto Sans Devanagari',sans-serif;
  font-size:14px;line-height:2.2;color:#433B35;
}

.translit-col{
  font-family:'Open Sans',sans-serif;
  font-size:12px;line-height:2.2;color:#6B5E54;
  font-style:italic;
}

/* Single column transliteration (if too long for dual) */
.translit-block{
  font-family:'Open Sans',sans-serif;
  font-size:12px;line-height:2;color:#6B5E54;
  font-style:italic;
  background:#FAFAF5;border-radius:10px;padding:20px 24px;
  border:1px solid #F0E8DE;
}

/* ── Meaning ── */
.meaning-block{
  font-family:'Noto Sans Devanagari',sans-serif;
  font-size:12px;line-height:1.9;color:#6B5E54;
  background:#fff;border-radius:10px;padding:20px 24px;
  border:1px solid #F0E8DE;
}

/* ── Benefits ── */
.benefits-section{
  page-break-inside:avoid;
}

.benefits-grid{
  display:grid;grid-template-columns:1fr 1fr;gap:8px 16px;
}

.benefit-item{
  font-size:11px;color:#6B5E54;padding:6px 0;
  display:flex;align-items:flex-start;gap:6px;
}

.benefit-star{
  color:#DAA520;font-size:12px;flex-shrink:0;margin-top:1px;
}

/* ── Footer ── */
.footer{
  margin-top:36px;padding-top:16px;
  text-align:center;position:relative;
}

.footer::before{
  content:'';position:absolute;top:0;left:10%;right:10%;
  height:2px;
  background:linear-gradient(90deg,transparent,#013F47,#DAA520,#FF9933,#DAA520,#013F47,transparent);
  border-radius:2px;
}

.footer-brand{
  font-family:'Lora',serif;font-size:14px;font-weight:600;color:#013F47;
  margin-bottom:4px;
}

.footer-links{
  display:flex;align-items:center;justify-content:center;gap:16px;
  margin:8px 0;flex-wrap:wrap;
}

.footer-link{
  font-size:10px;color:#013F47;text-decoration:none;
  padding:4px 14px;border:1px solid #E8DDD4;border-radius:20px;
  transition:all 0.2s;
}

.footer-link:hover{border-color:#013F47}

.footer-copy{
  font-size:9px;color:#9A8D82;margin-top:8px;
}

.footer-tagline{
  font-size:9px;color:#B8860B;font-style:italic;margin-top:4px;
}

/* ── Print Optimization ── */
@media print{
  body{background:#fff}
  .page{padding:24px 32px;width:100%;min-height:auto}
  .page::before,.page::after{display:none}
  .stotra-text,.dual-column .col-left,.dual-column .col-right,
  .translit-block,.meaning-block{border-color:#eee}
}

/* ── Ornamental corners ── */
.corner-tl,.corner-tr,.corner-bl,.corner-br{
  position:absolute;width:24px;height:24px;
  opacity:0.4;
}
.corner-tl{top:20px;left:20px;border-top:2px solid #DAA520;border-left:2px solid #DAA520}
.corner-tr{top:20px;right:20px;border-top:2px solid #DAA520;border-right:2px solid #DAA520}
.corner-bl{bottom:20px;left:20px;border-bottom:2px solid #DAA520;border-left:2px solid #DAA520}
.corner-br{bottom:20px;right:20px;border-bottom:2px solid #DAA520;border-right:2px solid #DAA520}
</style>
</head>
<body>
<div class="page">
  <!-- Ornamental corners -->
  <div class="corner-tl"></div>
  <div class="corner-tr"></div>
  <div class="corner-bl"></div>
  <div class="corner-br"></div>

  <!-- Header -->
  <div class="header">
    <div class="logo-row">
      <img src="https://stotra.vastucart.in/VastuCartFav.png" alt="VastuCart" class="logo-img" onerror="this.style.display='none'">
      <div>
        <span class="logo-text">Stotra</span>
        <span class="logo-sub">by VastuCart</span>
      </div>
    </div>
    <div class="title-hi">${stotra.title}</div>
    <div class="title-en">${stotra.titleEn}</div>
    <div class="meta-row">
      <span class="meta-badge">${deityName}</span>
      <span class="meta-item">${stotra.verseCount} verses</span>
      <span class="meta-item">${stotra.readingTimeMinutes} min read</span>
      ${stotra.source ? `<span class="meta-item">Source: ${stotra.source}</span>` : ""}
    </div>
  </div>

  ${viniyogHtml}

  <!-- Main Stotra Text -->
  ${
    translitLines.length > 0 && verses.length <= 60
      ? `
  <div class="section-label">स्तोत्र पाठ &middot; Stotra Path</div>
  <div class="dual-column">
    <div class="col-left">
      <div class="col-label">संस्कृत / हिन्दी</div>
      <div class="devanagari-col">${verses.map((v) => `<div>${v}</div>`).join("")}</div>
    </div>
    <div class="col-right">
      <div class="col-label">Transliteration</div>
      <div class="translit-col">${translitLines.map((l) => `<div>${l}</div>`).join("")}</div>
    </div>
  </div>`
      : `
  <div class="section-label">स्तोत्र पाठ &middot; Stotra Path</div>
  <div class="stotra-text">${stotra.devanagariText.replace(/\n/g, "<br>")}</div>
  ${
    stotra.transliteration
      ? `
  <div class="section-label">Transliteration</div>
  <div class="translit-block">${stotra.transliteration.replace(/\n/g, "<br>")}</div>`
      : ""
  }`
  }

  ${
    stotra.hindiMeaning
      ? `
  <div class="section-label">अर्थ &middot; Meaning</div>
  <div class="meaning-block">${stotra.hindiMeaning.replace(/\n/g, "<br>")}</div>`
      : ""
  }

  ${benefitsHtml}

  <!-- Footer -->
  <div class="footer">
    <div class="footer-brand">Stotra by VastuCart</div>
    <div class="footer-links">
      <a href="https://stotra.vastucart.in" class="footer-link">stotra.vastucart.in</a>
      <a href="https://store.vastucart.in" class="footer-link">VastuCart Store</a>
      <a href="https://kundali.vastucart.in" class="footer-link">Kundali</a>
      <a href="https://panchang.vastucart.in" class="footer-link">Panchang</a>
    </div>
    <div class="footer-copy">&copy; ${year} VastuCart. Content sourced from public domain scriptures.</div>
    <div class="footer-tagline">Sacred Essentials for Your Spiritual Journey</div>
  </div>
</div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `inline; filename="${stotra.slug}.html"`,
    },
  });
}
