#!/usr/bin/env python3
"""Robust content-gap finder: GSC queries with no real matching stotra page.

Folds common Sanskrit transliteration variants so 'shiv'~'shiva',
'kavach'~'kavacham', 'aaditya'~'aditya' don't create false gaps.
Writes a reviewable markdown report.
"""
import json, re

GENERIC = {"in","the","of","and","with","for","ki","ka","ke","hindi","english",
           "sanskrit","lyrics","pdf","mp3","meaning","benefits","wikipedia","path",
           "text","download","full","free","com","mp","ke","hd","video","song",
           "online","read","quotes","image","images","photo","wallpaper"}

def fold(t):
    t = t.lower()
    t = re.sub(r"[^a-z0-9ऀ-ॿ]", "", t)
    # collapse doubled vowels: aaditya->aditya, shrii->shri
    t = re.sub(r"([aeiou])\1+", r"\1", t)
    # strip common devotional suffix inflections to a stem
    for a, b in [("stotram","stotra"),("stotras","stotra"),("kavacham","kavach"),
                 ("kavacha","kavach"),("ashtakam","ashtak"),("ashtakeam","ashtak"),
                 ("sahasranamam","sahasranam"),("sahasranama","sahasranam"),
                 ("suktam","sukta"),("ashtottara","ashtottar"),("chalisa","chalisa")]:
        if t.endswith(a):
            t = t[: -len(a)] + b
            break
    # drop a trailing schwa 'a' (shiva->shiv, tandava->tandav, rama->ram)
    if len(t) > 4 and t.endswith("a"):
        t = t[:-1]
    return t

def toks(s):
    out = []
    for raw in re.sub(r"[^a-z0-9ऀ-ॿ ]", " ", s.lower()).split():
        if raw in GENERIC or len(raw) < 3:
            continue
        f = fold(raw)
        if f and len(f) >= 3:
            out.append(f)
    return out

our = json.load(open("/tmp/our-stotras.json"))
inv = []
for s in our:
    blob = s["titleEn"] + " " + s["slug"].replace("-", " ") + " " + " ".join(s.get("aka") or [])
    inv.append((s["slug"], set(toks(blob))))

gsc = json.load(open("/tmp/gsc-90d.json"))
# de-dup queries (sum impressions across duplicate rows)
agg = {}
for r in gsc["by_query"]:
    k = r["keys"][0]
    a = agg.setdefault(k, {"imp":0,"clk":0,"pos":r["position"]})
    a["imp"] += r["impressions"]; a["clk"] += r["clicks"]
    a["pos"] = min(a["pos"], r["position"])

rows = []
for q, a in agg.items():
    qt = set(toks(q))
    if not qt:
        continue
    best, bs = 0.0, ""
    for slug, it in inv:
        if not it: continue
        inter = len(qt & it)
        if not inter: continue
        score = inter / len(qt)
        if score > best:
            best, bs = score, slug
    rows.append({"q":q,"imp":a["imp"],"pos":round(a["pos"],1),
                 "best":round(best,2),"match":bs})

gaps = [r for r in rows if r["best"] < 0.5]
gaps.sort(key=lambda r:-r["imp"])
covered = [r for r in rows if r["best"] >= 0.5]

md = ["# GSC content-gap analysis (90 days) — 2026-05-31","",
      f"- unique queries: {len(rows)}",
      f"- well-covered (>=50% token match to an existing page): {len(covered)}",
      f"- potential gaps (<50% match): {len(gaps)}","",
      "## Potential gap queries by impressions","",
      "| imp | pos | best-match | nearest existing slug | query |",
      "|----:|----:|----:|---|---|"]
for r in gaps:
    md.append(f"| {r['imp']} | {r['pos']} | {r['best']:.2f} | {r['match']} | {r['q']} |")
md.append("")
md.append("## Well-covered queries (already have a strong page — ranking problem, not gap)")
md.append("")
md.append("| imp | pos | match-slug | query |")
md.append("|----:|----:|---|---|")
for r in sorted(covered, key=lambda r:-r["imp"])[:40]:
    md.append(f"| {r['imp']} | {r['pos']} | {r['match']} | {r['q']} |")

open("reports/gsc-gap-analysis-2026-05-31.md","w").write("\n".join(md))
print("gaps=%d covered=%d -> reports/gsc-gap-analysis-2026-05-31.md" % (len(gaps), len(covered)))
