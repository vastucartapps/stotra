#!/usr/bin/env python3
"""Classify each audited URL against 21 bug classes.

Reads /tmp/audit.tsv, emits:
  /tmp/classified-summary.txt   counts per class
  /tmp/classified-{A..U}.txt    full URL list per class (no truncation)
  /tmp/classified-perurl.tsv    URL + comma-joined classes it failed
"""
import csv
import os
import sys
from urllib.parse import urlparse

TSV = "/tmp/audit.tsv"
OUT_DIR = "/tmp"

CLASSES = {
    "A": "Site-wide: /_next/ in robots disallow (verified separately)",
    "B": "Site-wide: AI/SEO bots 403 in middleware (verified separately)",
    "C": "Canonical points to wrong host/scheme",
    "D": "Canonical doesn't match URL path (canonical bleed)",
    "E": "Missing canonical link",
    "F": "Missing hreflang x-default (only flagged if other hreflangs exist)",
    "G": "Missing og:url",
    "H": "og:url doesn't match canonical/URL",
    "I": "Missing og:locale",
    "J": "og:locale doesn't match html lang",
    "K": "Missing og:type",
    "L": "Missing html lang attribute",
    "M": "html lang != 'en' (site is single-locale English)",
    "N": "robots meta contains noindex",
    "O": "Title length problematic (<10 or >70 chars)",
    "P": "Missing or multiple H1",
    "Q": "Site-wide: sitemap lastmod regenerates per-request (verified separately)",
    "R": "Content page missing JSON-LD",
    "S": "HTTP non-200 final response",
    "T": "Body suspiciously small (<5KB) — likely error page",
    "U": "Canonical contains '/undefined' (Next 15 params Promise not awaited)",
}


def normalise_url(u: str) -> str:
    """Normalise to compare canonical vs URL: strip trailing slash on non-root, lowercase host, strip default port."""
    if not u:
        return ""
    p = urlparse(u)
    host = p.netloc.lower()
    path = p.path
    if path != "/" and path.endswith("/"):
        path = path.rstrip("/")
    return f"{p.scheme.lower()}://{host}{path}"


def classify_row(row: dict) -> set:
    failed = set()
    url = row["url"]
    http = row["http"]
    content_type = row.get("content_type", "")
    canonical = row.get("canonical", "")
    hreflang_count = int(row.get("hreflang_count") or 0)
    hreflang_x_default = row.get("hreflang_x_default", "no") == "yes"
    og_url = row.get("og_url", "")
    og_locale = row.get("og_locale", "")
    og_type = row.get("og_type", "")
    html_lang = row.get("html_lang", "")
    robots_meta = (row.get("robots_meta") or "").lower()
    title_len = int(row.get("title_len") or 0)
    h1_count = int(row.get("h1_count") or 0)
    jsonld_count = int(row.get("jsonld_count") or 0)
    has_undef = row.get("has_undef", "no") == "yes"
    body_size = int(row.get("body_size") or 0)

    # S — non-200
    if http != "200":
        failed.add("S")

    # Below this point, only HTML pages get checked
    if "html" not in content_type.lower():
        return failed

    n_url = normalise_url(url)
    n_canon = normalise_url(canonical)

    # C — wrong host/scheme
    if canonical:
        pu = urlparse(canonical)
        if pu.netloc and pu.netloc != "stotra.vastucart.in":
            failed.add("C")
        if pu.scheme and pu.scheme != "https":
            failed.add("C")

    # E — missing canonical
    if not canonical:
        failed.add("E")
    # D — canonical bleed (canonical exists but doesn't equal request URL)
    elif n_canon != n_url:
        # special case: trailing slash variation tolerated by normalize_url
        # also tolerate root: "https://host" canonical for "https://host/"
        if not (n_url == "https://stotra.vastucart.in" and canonical.rstrip("/") == "https://stotra.vastucart.in"):
            failed.add("D")

    # F — missing x-default when other hreflangs declared
    if hreflang_count > 0 and not hreflang_x_default:
        failed.add("F")

    # G/H — og:url checks
    if not og_url:
        failed.add("G")
    elif normalise_url(og_url) != n_url:
        if not (n_url == "https://stotra.vastucart.in" and og_url.rstrip("/") == "https://stotra.vastucart.in"):
            failed.add("H")

    # I — missing og:locale
    if not og_locale:
        failed.add("I")

    # J — og:locale vs html lang
    if og_locale and html_lang:
        if not og_locale.lower().startswith(html_lang.lower()[:2]):
            failed.add("J")

    # K — missing og:type
    if not og_type:
        failed.add("K")

    # L — missing html lang
    if not html_lang:
        failed.add("L")
    # M — wrong html lang
    elif html_lang.lower() != "en":
        failed.add("M")

    # N — noindex
    if "noindex" in robots_meta:
        failed.add("N")

    # O — title length
    if title_len < 10 or title_len > 70:
        failed.add("O")

    # P — missing or multiple H1
    if h1_count != 1:
        failed.add("P")

    # R — content page missing JSON-LD
    if jsonld_count == 0:
        failed.add("R")

    # T — body size suspicious
    if body_size < 5000:
        failed.add("T")

    # U — canonical contains /undefined
    if has_undef:
        failed.add("U")

    return failed


def main():
    if not os.path.exists(TSV):
        print(f"❌ {TSV} not found"); sys.exit(1)

    rows = []
    with open(TSV, encoding="utf-8") as f:
        reader = csv.DictReader(f, delimiter="\t")
        for r in reader:
            rows.append(r)
    print(f"Read {len(rows)} audited URLs from {TSV}")

    per_class = {k: [] for k in CLASSES}
    per_url = []  # (url, sorted-classes-comma)
    for r in rows:
        cls = classify_row(r)
        per_url.append((r["url"], ",".join(sorted(cls))))
        for c in cls:
            per_class[c].append(r["url"])

    # Site-wide classes (A, B, Q) — flagged via inspection, every URL is "affected"
    # We will populate them from a separate verification step. Leave per_class[A/B/Q] empty here.

    # Write per-URL TSV
    perurl_path = os.path.join(OUT_DIR, "classified-perurl.tsv")
    with open(perurl_path, "w", encoding="utf-8") as f:
        f.write("url\tfailed_classes\n")
        for u, c in per_url:
            f.write(f"{u}\t{c}\n")

    # Write per-class files (full lists, no truncation)
    for c, urls in per_class.items():
        with open(os.path.join(OUT_DIR, f"classified-{c}.txt"), "w", encoding="utf-8") as f:
            for u in urls:
                f.write(u + "\n")

    # Summary
    summary_path = os.path.join(OUT_DIR, "classified-summary.txt")
    with open(summary_path, "w", encoding="utf-8") as f:
        f.write(f"Total URLs audited: {len(rows)}\n\n")
        f.write("Class | Count | Description\n")
        f.write("------|-------|------------\n")
        for c, desc in CLASSES.items():
            n = len(per_class[c])
            f.write(f"  {c}   | {n:>5} | {desc}\n")
        f.write("\n")
        # url with most failures
        worst = sorted(per_url, key=lambda x: -len(x[1].split(",") if x[1] else []))[:20]
        f.write("Top 20 URLs by # of failed classes:\n")
        for u, c in worst:
            cn = len(c.split(",")) if c else 0
            f.write(f"  [{cn:2d}] {u}  →  {c}\n")

    # Print to stdout
    with open(summary_path) as f:
        print(f.read())


if __name__ == "__main__":
    main()
