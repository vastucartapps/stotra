import { NextResponse } from "next/server";
import { getStotraBySlug } from "@/lib/stotras";
import { getDeityById } from "@/data/deities";

function esc(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function nl2br(str: string): string {
  return esc(str).replace(/\n/g, "<br>");
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
  const dn = deity ? `${esc(deity.name)} (${esc(deity.nameHi)})` : esc(stotra.deity);
  const dc = deity?.color || "#013F47";
  const yr = new Date().getFullYear();

  const viniyogHtml = stotra.viniyog ? `
    <div class="vin">
      <div class="vin-h"><span class="vin-i">॥</span> विनियोग · Viniyog</div>
      ${stotra.viniyog.shloka ? `<div class="vin-sh">${nl2br(stotra.viniyog.shloka)}</div>` : ""}
      <div class="vin-g">
        ${stotra.viniyog.rishi ? `<div class="vin-r"><span class="vin-l">ऋषि</span>${esc(stotra.viniyog.rishi)}</div>` : ""}
        ${stotra.viniyog.chhand ? `<div class="vin-r"><span class="vin-l">छन्द</span>${esc(stotra.viniyog.chhand)}</div>` : ""}
        ${stotra.viniyog.devata ? `<div class="vin-r"><span class="vin-l">देवता</span>${esc(stotra.viniyog.devata)}</div>` : ""}
        ${stotra.viniyog.beej ? `<div class="vin-r"><span class="vin-l">बीज</span>${esc(stotra.viniyog.beej)}</div>` : ""}
        ${stotra.viniyog.shakti ? `<div class="vin-r"><span class="vin-l">शक्ति</span>${esc(stotra.viniyog.shakti)}</div>` : ""}
        ${stotra.viniyog.kilak ? `<div class="vin-r"><span class="vin-l">कीलक</span>${esc(stotra.viniyog.kilak)}</div>` : ""}
      </div>
    </div>` : "";

  const benefitsHtml = stotra.benefits.length > 0 ? `
    <div class="sec">
      <div class="sec-t"><span class="sec-bar"></span>फल · Benefits</div>
      <div class="ben-g">${stotra.benefits.map((b) => `<div class="ben">★ ${esc(b)}</div>`).join("")}</div>
    </div>` : "";

  const html = `<!DOCTYPE html>
<html lang="hi">
<head>
<meta charset="UTF-8">
<title>${esc(stotra.titleEn)} · ${esc(stotra.title)} | Stotra by VastuCart</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700&family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=Open+Sans:wght@400;500;600&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
@page{size:A4;margin:18mm 15mm 18mm 15mm}
body{font-family:'Open Sans',sans-serif;color:#333;background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{max-width:780px;margin:0 auto;padding:30px 20px;position:relative}

/* Header */
.hdr{text-align:center;padding:0 0 18px;margin:0 0 18px;border-bottom:3px solid;border-image:linear-gradient(90deg,transparent 5%,#013F47 20%,#DAA520 50%,#FF9933 80%,transparent 95%) 1}
.brand{font-family:'Lora',serif;font-size:16px;font-weight:700;color:#013F47;letter-spacing:1px}
.brand-s{font-size:9px;color:#999;text-transform:uppercase;letter-spacing:3px;display:block;margin-top:1px}
.t-hi{font-family:'Noto Sans Devanagari',sans-serif;font-size:30px;font-weight:700;color:#013F47;margin:14px 0 4px;line-height:1.3}
.t-en{font-family:'Lora',serif;font-size:19px;color:#555;font-style:italic;font-weight:400}
.meta{display:flex;align-items:center;justify-content:center;gap:12px;margin-top:12px;flex-wrap:wrap}
.badge{font-size:10px;padding:3px 14px;border-radius:20px;color:#fff;font-weight:600;background:${dc}}
.meta-i{font-size:10px;color:#888}

/* Viniyog */
.vin{background:#FFFAF0;border:1px solid #E8D5A8;border-radius:8px;padding:16px 18px;margin:16px 0;page-break-inside:avoid}
.vin-h{font-family:'Lora',serif;font-size:13px;font-weight:600;color:#013F47;margin-bottom:10px;display:flex;align-items:center;gap:8px}
.vin-i{color:#DAA520;font-size:16px}
.vin-sh{font-family:'Noto Sans Devanagari',sans-serif;font-size:12px;line-height:1.8;color:#444;background:#fff;border-radius:6px;padding:10px 14px;margin-bottom:10px;border-left:3px solid #DAA520}
.vin-g{display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px}
.vin-r{font-family:'Noto Sans Devanagari',sans-serif;font-size:11px;color:#444;background:#fff;border-radius:4px;padding:5px 8px}
.vin-l{display:block;font-size:9px;color:#999;margin-bottom:1px}

/* Sections */
.sec{margin:20px 0}
.sec-t{font-family:'Lora',serif;font-size:12px;font-weight:600;color:#013F47;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:10px;display:flex;align-items:center;gap:8px}
.sec-bar{width:4px;height:14px;background:#DAA520;border-radius:2px;display:inline-block}

/* Two-column layout for text */
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:6px}
.col{border-radius:8px;padding:16px 18px;border:1px solid #eee}
.col-l{background:#FAFAFA}
.col-r{background:#F8F8F4}
.col-t{font-family:'Lora',serif;font-size:9px;font-weight:600;color:#999;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:8px}
.dev{font-family:'Noto Sans Devanagari',sans-serif;font-size:13px;line-height:2;color:#333}
.trl{font-family:'Open Sans',sans-serif;font-size:11px;line-height:2;color:#555;font-style:italic}

/* Single column fallback */
.one-col{background:#FAFAFA;border-radius:8px;padding:18px 20px;border:1px solid #eee;margin-top:6px}
.one-col .dev{font-size:14px;line-height:2.2}

/* Meaning */
.mng{font-family:'Noto Sans Devanagari',sans-serif;font-size:11px;line-height:1.8;color:#555;background:#FAFAFA;border-radius:8px;padding:14px 18px;border:1px solid #eee;margin-top:6px}

/* Benefits */
.ben-g{display:grid;grid-template-columns:1fr 1fr;gap:4px 14px}
.ben{font-size:11px;color:#555;padding:3px 0}

/* Footer */
.ftr{margin-top:24px;padding-top:14px;text-align:center;border-top:2px solid;border-image:linear-gradient(90deg,transparent 5%,#013F47 20%,#DAA520 50%,#FF9933 80%,transparent 95%) 1}
.ftr-b{font-family:'Lora',serif;font-size:13px;font-weight:600;color:#013F47}
.ftr-links{display:flex;align-items:center;justify-content:center;gap:10px;margin:6px 0;flex-wrap:wrap}
.ftr-l{font-size:9px;color:#013F47;text-decoration:none;padding:3px 12px;border:1px solid #ddd;border-radius:14px}
.ftr-c{font-size:8px;color:#999;margin-top:6px}

/* Print button (hidden in print) */
.no-print{position:fixed;top:20px;right:20px;z-index:100}
.print-btn{background:#013F47;color:#fff;border:none;padding:12px 28px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;font-family:'Open Sans',sans-serif;box-shadow:0 4px 20px rgba(0,0,0,0.15)}
.print-btn:hover{background:#025868}
.print-hint{font-size:11px;color:#888;margin-top:8px;text-align:center}

@media print{
  .no-print{display:none!important}
  body{background:#fff}
  .page{padding:0;max-width:100%}
  .col,.one-col,.mng,.vin{break-inside:avoid}
}
</style>
</head>
<body>
<div class="no-print">
  <button class="print-btn" onclick="window.print()">Save as PDF</button>
  <div class="print-hint">Use "Save as PDF" in print dialog</div>
</div>
<div class="page">

  <!-- Header -->
  <div class="hdr">
    <div class="brand">Stotra<span class="brand-s">by VastuCart</span></div>
    <div class="t-hi">${esc(stotra.title)}</div>
    <div class="t-en">${esc(stotra.titleEn)}</div>
    <div class="meta">
      <span class="badge">${dn}</span>
      <span class="meta-i">${stotra.verseCount} verses</span>
      <span class="meta-i">${stotra.readingTimeMinutes} min read</span>
      ${stotra.source ? `<span class="meta-i">${esc(stotra.source)}</span>` : ""}
    </div>
  </div>

  ${viniyogHtml}

  <!-- Main Text -->
  <div class="sec">
    <div class="sec-t"><span class="sec-bar"></span>स्तोत्र पाठ · Stotra Path</div>
    ${stotra.transliteration ? `
    <div class="two-col">
      <div class="col col-l">
        <div class="col-t">संस्कृत / हिन्दी</div>
        <div class="dev">${nl2br(stotra.devanagariText)}</div>
      </div>
      <div class="col col-r">
        <div class="col-t">Transliteration</div>
        <div class="trl">${nl2br(stotra.transliteration)}</div>
      </div>
    </div>` : `
    <div class="one-col">
      <div class="dev">${nl2br(stotra.devanagariText)}</div>
    </div>`}
  </div>

  ${stotra.hindiMeaning ? `
  <div class="sec">
    <div class="sec-t"><span class="sec-bar"></span>अर्थ · Meaning</div>
    <div class="mng">${nl2br(stotra.hindiMeaning)}</div>
  </div>` : ""}

  ${benefitsHtml}

  <!-- Footer -->
  <div class="ftr">
    <div class="ftr-b">Stotra by VastuCart</div>
    <div class="ftr-links">
      <a href="https://stotra.vastucart.in" class="ftr-l">stotra.vastucart.in</a>
      <a href="https://store.vastucart.in" class="ftr-l">VastuCart Store</a>
      <a href="https://kundali.vastucart.in" class="ftr-l">Kundali</a>
      <a href="https://panchang.vastucart.in" class="ftr-l">Panchang</a>
    </div>
    <div class="ftr-c">&copy; ${yr} VastuCart · Content from public domain scriptures · stotra.vastucart.in</div>
  </div>

</div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
