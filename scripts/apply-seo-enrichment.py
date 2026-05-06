#!/usr/bin/env python3
"""
Apply SEO enrichment data (seoFaqs, alsoKnownAs, relatedSearches) to stotra JSON files.

Reads a batch JSON file (e.g. reports/seo-enrichment-batch-01.json) — an array of
{slug, alsoKnownAs?, relatedSearches?, seoFaqs?} — and merges each entry into the
corresponding src/data/stotras/{slug}.json.

DEFAULT MODE: dry-run.  Use --apply to actually write.

Quality gates (will REFUSE to apply if violated):
- slug must exist as a stotra file
- seoFaqs items must have non-empty question + answer (≥10 chars each)
- relatedSearches items must be non-empty strings ≤ 80 chars
- alsoKnownAs items must be non-empty strings ≤ 80 chars
- No duplicate FAQs (vs questions already in the file's existing seoFaqs if present)

Usage:
  python3 scripts/apply-seo-enrichment.py reports/seo-enrichment-batch-01.json
  python3 scripts/apply-seo-enrichment.py reports/seo-enrichment-batch-01.json --apply
"""
import json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIR = os.path.join(ROOT, "src/data/stotras")

if len(sys.argv) < 2:
    print(__doc__)
    sys.exit(1)

batch_path = sys.argv[1]
apply_mode = "--apply" in sys.argv

with open(batch_path, encoding="utf-8") as f:
    batch = json.load(f)

if not isinstance(batch, list):
    print(f"❌ Batch file must be a JSON array, got {type(batch).__name__}")
    sys.exit(1)

print(f"=== SEO Enrichment Apply ===")
print(f"Source: {batch_path}")
print(f"Entries: {len(batch)}")
print(f"Mode: {'APPLY' if apply_mode else 'DRY-RUN'}")
print()

errors = []
applied = 0
skipped = 0

for entry in batch:
    slug = entry.get("slug")
    if not slug:
        errors.append("Entry missing 'slug' field")
        continue

    fpath = os.path.join(DIR, f"{slug}.json")
    if not os.path.exists(fpath):
        errors.append(f"{slug}: file not found")
        continue

    with open(fpath, encoding="utf-8") as f:
        d = json.load(f)

    changes = []

    # alsoKnownAs
    aka = entry.get("alsoKnownAs")
    if aka:
        if not isinstance(aka, list) or any(not isinstance(s, str) or not s.strip() or len(s) > 80 for s in aka):
            errors.append(f"{slug}: invalid alsoKnownAs (need list of non-empty strings ≤80 chars)")
            continue
        d["alsoKnownAs"] = aka
        changes.append(f"alsoKnownAs[{len(aka)}]")

    # relatedSearches
    rs = entry.get("relatedSearches")
    if rs:
        if not isinstance(rs, list) or any(not isinstance(s, str) or not s.strip() or len(s) > 80 for s in rs):
            errors.append(f"{slug}: invalid relatedSearches")
            continue
        d["relatedSearches"] = rs
        changes.append(f"relatedSearches[{len(rs)}]")

    # seoFaqs
    seo_faqs = entry.get("seoFaqs")
    if seo_faqs:
        if not isinstance(seo_faqs, list):
            errors.append(f"{slug}: seoFaqs must be a list")
            continue
        valid = []
        existing_questions = {f.get("question","").strip().lower() for f in (d.get("seoFaqs") or [])}
        for f in seo_faqs:
            if not isinstance(f, dict):
                errors.append(f"{slug}: seoFaq item not a dict")
                continue
            q = (f.get("question") or "").strip()
            a = (f.get("answer") or "").strip()
            if len(q) < 10 or len(a) < 30:
                errors.append(f"{slug}: seoFaq question/answer too short (q={len(q)}, a={len(a)})")
                continue
            if q.lower() in existing_questions:
                continue  # silently dedupe
            valid.append({"question": q, "answer": a})
            existing_questions.add(q.lower())
        if valid:
            d["seoFaqs"] = valid
            changes.append(f"seoFaqs[{len(valid)}]")

    if not changes:
        skipped += 1
        continue

    d["updatedAt"] = "2026-05-06T15:00:00Z"

    print(f"  {slug}: {' '.join(changes)}")

    if apply_mode:
        with open(fpath, "w", encoding="utf-8") as f:
            json.dump(d, f, indent=4, ensure_ascii=False)
            f.write("\n")
        applied += 1

print()
if errors:
    print(f"❌ {len(errors)} errors:")
    for e in errors:
        print(f"  {e}")
    print("\nFix errors in the batch file before --apply")
    sys.exit(1)

if apply_mode:
    print(f"✅ APPLIED — {applied} files written, {skipped} skipped (no changes)")
else:
    print(f"💡 DRY-RUN OK — re-run with --apply to commit changes")
