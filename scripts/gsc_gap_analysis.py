#!/usr/bin/env python3
"""Find GSC queries with NO strong match in our stotra inventory = content gaps."""
import json, re

NOISE = {"in","the","of","and","with","for","ki","ka","ke","hindi","english","sanskrit",
         "lyrics","pdf","mp3","meaning","benefits","wikipedia","stotra","stotram","path",
         "mantra","text","download","full","free","com","aarti","stuti","chalisa"}

def toks(s):
    s = s.lower()
    s = re.sub(r"[^a-z0-9ऀ-ॿ ]"," ",s)
    return [t for t in s.split() if t and t not in NOISE and len(t) > 2]

our = json.load(open("/tmp/our-stotras.json"))
# Build a token-set index of our stotras (title + aka)
inv = []
for s in our:
    blob = s["titleEn"] + " " + " ".join(s.get("aka") or [])
    inv.append((s["slug"], set(toks(blob))))

gsc = json.load(open("/tmp/gsc-90d.json"))
queries = sorted(gsc["by_query"], key=lambda r: -r["impressions"])

gaps, covered = [], []
for q in queries:
    qt = set(toks(q["keys"][0]))
    if not qt:
        continue
    best, bestslug = 0.0, ""
    for slug, it in inv:
        if not it:
            continue
        inter = len(qt & it)
        if inter == 0:
            continue
        score = inter / len(qt)   # fraction of query tokens covered
        if score > best:
            best, bestslug = score, slug
    rec = {"q": q["keys"][0], "imp": q["impressions"], "pos": round(q["position"],1),
           "best": round(best,2), "match": bestslug}
    if best < 0.5:          # under half the meaningful query tokens matched = weak/no page
        gaps.append(rec)
    else:
        covered.append(rec)

json.dump(gaps, open("/tmp/gsc-gaps.json","w"), ensure_ascii=False)
print("queries=%d  covered=%d  GAPS=%d" % (len(queries), len(covered), len(gaps)))
print("\n=== TOP CONTENT GAPS (weak/no matching page, by impressions) ===")
for g in sorted(gaps, key=lambda r:-r["imp"])[:40]:
    print("  %3d imp  pos %5.1f  match=%.2f[%s]  %s" % (g["imp"], g["pos"], g["best"], g["match"][:22], g["q"]))
