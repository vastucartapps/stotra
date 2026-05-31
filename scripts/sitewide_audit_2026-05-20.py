#!/usr/bin/env python3
"""
Sitewide audit — all 1,770 URLs against the just-built local server.
Captures per-URL: HTTP status, content size, JSON-LD schema types,
presence of @id fragments, page-type-specific required schemas.
Reports failures by class.

Run while `npx next start -p 3458` is up.
"""
from __future__ import annotations
import concurrent.futures
import json
import re
import sys
import time
import urllib.request
import urllib.error
from pathlib import Path
from collections import defaultdict

URLS = Path("reports/seo-audit-2026-05-12/urls.txt").read_text().splitlines()
LOCAL_BASE = "http://localhost:3458"
PROD_PREFIX = "https://stotra.vastucart.in"
UA = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
TIMEOUT = 20
JSONLD_RE = re.compile(
    r'<script type="application/ld\+json"[^>]*>(.*?)</script>',
    re.S,
)
TITLE_RE = re.compile(r"<title>([^<]+)</title>")
META_DESC_RE = re.compile(
    r'<meta\s+name="description"\s+content="([^"]+)"', re.I
)
CANONICAL_RE = re.compile(
    r'<link\s+rel="canonical"\s+href="([^"]+)"', re.I
)


def url_class(path: str) -> str:
    if path == "/" or path == "":
        return "homepage"
    p = path.rstrip("/")
    if p.startswith("/stotra/"):
        return "stotra-detail"
    if p == "/stotra":
        return "stotra-hub"
    if p.startswith("/deity/"):
        return "deity-detail"
    if p == "/deity":
        return "deity-hub"
    if p.startswith("/festival/"):
        return "festival-detail"
    if p == "/festival":
        return "festival-hub"
    if p.startswith("/day/"):
        return "day-detail"
    if p == "/day":
        return "day-hub"
    if p.startswith("/purpose/"):
        return "purpose-detail"
    if p == "/purpose":
        return "purpose-hub"
    if p.startswith("/gita/") and "/verse-" in p:
        return "gita-verse"
    if p.startswith("/gita/chapter-"):
        return "gita-chapter"
    if p == "/gita":
        return "gita-hub"
    if p == "/today":
        return "today"
    if p == "/vrat-katha":
        return "vrat-katha-hub"
    if p in ("/editorial-process", "/disclaimer", "/privacy-policy", "/terms"):
        return "static-article"
    if p == "/search":
        return "search"
    return "other"


# Required schema types per page class (top-level @type or inside @graph)
REQUIRED = {
    "homepage": ["WebSite"],
    "stotra-detail": ["Article", "CreativeWork", "BreadcrumbList", "FAQPage"],
    "stotra-hub": ["CollectionPage", "BreadcrumbList"],
    "deity-detail": ["CollectionPage", "Thing", "BreadcrumbList"],
    "deity-hub": ["CollectionPage", "BreadcrumbList"],
    "festival-detail": ["CollectionPage", "BreadcrumbList"],
    "festival-hub": ["CollectionPage", "BreadcrumbList"],
    "day-detail": ["CollectionPage", "BreadcrumbList"],
    "day-hub": ["CollectionPage", "BreadcrumbList"],
    "purpose-detail": ["CollectionPage", "BreadcrumbList"],
    "purpose-hub": ["CollectionPage", "BreadcrumbList"],
    "gita-verse": ["BreadcrumbList"],
    "gita-chapter": ["BreadcrumbList"],
    "gita-hub": ["BreadcrumbList"],
    "today": ["CollectionPage", "BreadcrumbList"],
    "vrat-katha-hub": ["CollectionPage", "BreadcrumbList"],
    "static-article": ["Article", "BreadcrumbList"],
}


def fetch(url: str) -> dict:
    local_url = url.replace(PROD_PREFIX, LOCAL_BASE)
    req = urllib.request.Request(local_url, headers={"User-Agent": UA})
    out = {
        "url": url,
        "class": url_class(url[len(PROD_PREFIX):] or "/"),
        "http": 0,
        "size": 0,
        "title": "",
        "title_len": 0,
        "meta_desc_len": 0,
        "canonical": "",
        "canonical_matches_url": False,
        "jsonld_blocks": 0,
        "jsonld_types": [],
        "missing_types": [],
        "json_parse_errors": 0,
        "has_undefined": False,
        "has_NaN": False,
        "fetch_error": "",
    }
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT) as r:
            out["http"] = r.getcode()
            body_bytes = r.read()
            out["size"] = len(body_bytes)
            body = body_bytes.decode("utf-8", errors="ignore")
    except urllib.error.HTTPError as e:
        out["http"] = e.code
        out["fetch_error"] = f"HTTPError {e.code}"
        return out
    except Exception as e:
        out["fetch_error"] = type(e).__name__ + ": " + str(e)
        return out

    if "undefined" in body:
        if re.search(r'>undefined<|"undefined"', body):
            out["has_undefined"] = True
    if re.search(r'"NaN"|>NaN<', body):
        out["has_NaN"] = True

    t = TITLE_RE.search(body)
    if t:
        out["title"] = t.group(1).strip()
        out["title_len"] = len(out["title"])
    d = META_DESC_RE.search(body)
    if d:
        out["meta_desc_len"] = len(d.group(1))
    c = CANONICAL_RE.search(body)
    if c:
        out["canonical"] = c.group(1)
        out["canonical_matches_url"] = c.group(1).rstrip("/") == url.rstrip("/")

    blocks = JSONLD_RE.findall(body)
    out["jsonld_blocks"] = len(blocks)
    types: list[str] = []
    for b in blocks:
        try:
            data = json.loads(b)
            graph = data.get("@graph") if isinstance(data, dict) else None
            if graph:
                for n in graph:
                    if isinstance(n, dict) and "@type" in n:
                        t = n["@type"]
                        if isinstance(t, list):
                            types.extend(t)
                        else:
                            types.append(t)
            else:
                if isinstance(data, dict) and "@type" in data:
                    t = data["@type"]
                    if isinstance(t, list):
                        types.extend(t)
                    else:
                        types.append(t)
        except json.JSONDecodeError:
            out["json_parse_errors"] += 1
    out["jsonld_types"] = sorted(set(types))

    required = REQUIRED.get(out["class"], [])
    present = set(out["jsonld_types"])
    out["missing_types"] = [t for t in required if t not in present]

    return out


def main() -> None:
    started = time.time()
    results: list[dict] = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=20) as pool:
        futures = {pool.submit(fetch, u): u for u in URLS}
        for i, f in enumerate(concurrent.futures.as_completed(futures), 1):
            results.append(f.result())
            if i % 100 == 0:
                print(f"  ...{i}/{len(URLS)} fetched", flush=True)

    elapsed = time.time() - started
    print(f"\nFetched {len(results)} URLs in {elapsed:.1f}s")

    # Aggregate
    by_class = defaultdict(list)
    for r in results:
        by_class[r["class"]].append(r)

    # Failure summary
    fail_http = [r for r in results if r["http"] != 200]
    fail_size_huge = [r for r in results if r["size"] > 2_500_000]
    fail_jsonld_zero = [r for r in results if r["http"] == 200 and r["jsonld_blocks"] == 0 and r["class"] != "search"]
    fail_jsonld_parse = [r for r in results if r["json_parse_errors"] > 0]
    fail_undefined = [r for r in results if r["has_undefined"]]
    fail_nan = [r for r in results if r["has_NaN"]]
    fail_title = [r for r in results if r["title_len"] > 70 or (r["title_len"] == 0 and r["http"] == 200)]
    fail_canonical = [r for r in results if r["http"] == 200 and not r["canonical_matches_url"] and r["canonical"]]
    fail_meta_short = [r for r in results if 0 < r["meta_desc_len"] < 50 and r["http"] == 200]
    fail_required = [r for r in results if r["missing_types"]]

    print("\n=== AUDIT SUMMARY ===")
    print(f"  Total URLs:            {len(results)}")
    print(f"  HTTP != 200:           {len(fail_http)}")
    print(f"  Body size > 2.5MB:     {len(fail_size_huge)}")
    print(f"  Zero JSON-LD blocks:   {len(fail_jsonld_zero)}")
    print(f"  JSON-LD parse errors:  {len(fail_jsonld_parse)}")
    print(f"  'undefined' in body:   {len(fail_undefined)}")
    print(f"  'NaN' in body:         {len(fail_nan)}")
    print(f"  title > 70 / missing:  {len(fail_title)}")
    print(f"  Canonical mismatch:    {len(fail_canonical)}")
    print(f"  Meta desc < 50 chars:  {len(fail_meta_short)}")
    print(f"  Missing required @type: {len(fail_required)}")

    print("\n=== BY PAGE CLASS ===")
    print(f"  {'class':22s} {'count':>5s} {'avg_kb':>7s} {'med_kb':>7s} {'jsonld_avg':>10s}")
    for cls, rs in sorted(by_class.items()):
        ok = [r for r in rs if r["http"] == 200]
        sizes = sorted([r["size"] for r in ok])
        avg = sum(sizes) / len(sizes) / 1024 if sizes else 0
        med = sizes[len(sizes)//2] / 1024 if sizes else 0
        avg_blocks = sum(r["jsonld_blocks"] for r in ok) / len(ok) if ok else 0
        print(f"  {cls:22s} {len(rs):>5d} {avg:>7.1f} {med:>7.1f} {avg_blocks:>10.2f}")

    # Sample failures
    if fail_required:
        print("\n=== SAMPLE: Pages missing required schema types ===")
        by_missing = defaultdict(list)
        for r in fail_required[:50]:
            key = (r["class"], tuple(r["missing_types"]))
            by_missing[key].append(r["url"])
        for (cls, missing), urls in sorted(by_missing.items()):
            print(f"  [{cls}] missing {missing}: {len(urls)} pages")
            for u in urls[:3]:
                print(f"    - {u}")

    if fail_undefined:
        print(f"\n=== SAMPLE: 'undefined' in body ({len(fail_undefined)} pages) ===")
        for r in fail_undefined[:10]:
            print(f"  - {r['url']}")

    if fail_size_huge:
        print(f"\n=== SAMPLE: Body > 2.5MB ({len(fail_size_huge)} pages) ===")
        for r in fail_size_huge[:10]:
            print(f"  - {r['size']:>10} {r['url']}")

    if fail_canonical:
        print(f"\n=== SAMPLE: Canonical mismatch ({len(fail_canonical)} pages) ===")
        for r in fail_canonical[:10]:
            print(f"  page={r['url']}")
            print(f"    canonical={r['canonical']}")

    # Write per-class schema-type breakdown
    print("\n=== SCHEMA TYPES BY CLASS ===")
    for cls, rs in sorted(by_class.items()):
        ok = [r for r in rs if r["http"] == 200]
        if not ok:
            continue
        type_counts = defaultdict(int)
        for r in ok:
            for t in r["jsonld_types"]:
                type_counts[t] += 1
        types_str = ", ".join(f"{t}({c})" for t, c in sorted(type_counts.items(), key=lambda x: -x[1]))
        print(f"  [{cls}] {types_str}")

    # Persist
    out_dir = Path("reports/sitewide-audit-2026-05-20")
    out_dir.mkdir(parents=True, exist_ok=True)
    (out_dir / "results.jsonl").write_text("\n".join(json.dumps(r) for r in results))
    print(f"\nWrote {out_dir/'results.jsonl'}")


if __name__ == "__main__":
    main()
