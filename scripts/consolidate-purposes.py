#!/usr/bin/env python3
"""
Consolidate duplicate purpose tags across all stotra JSON files.

DEFAULT MODE: dry-run — prints what would change without modifying any files.
With --apply flag: actually writes the changes.

Usage:
  python3 scripts/consolidate-purposes.py            # dry-run
  python3 scripts/consolidate-purposes.py --apply    # apply changes
  python3 scripts/consolidate-purposes.py --report   # write CSV report
"""
import json, os, sys
from collections import defaultdict, Counter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIR = os.path.join(ROOT, "src/data/stotras")

# Source-of-truth merge map. Reviewed for theological accuracy.
# Each entry: "old-tag" -> "canonical-tag"
MERGE_MAP = {
    # Obstacle-removal cluster
    "obstacle-removal": "removal-of-obstacles",
    "removal-of-evil": "removal-of-obstacles",

    # Liberation cluster (Sanskrit canonical preferred)
    "liberation": "moksha",

    # Wealth cluster
    "abundance": "wealth",
    "business-success": "wealth",
    "removal-of-poverty": "wealth",

    # Debt cluster
    "debt-relief": "debt-removal",
    "debt-freedom": "debt-removal",

    # Sin / purification
    "removal-of-sins": "sin-removal",

    # Health (keep healing/mental-health as distinct)
    "removal-of-diseases": "health",

    # Enemy
    "removal-of-enemies": "enemy-removal",

    # Daily worship
    "daily-prayer": "daily-worship",
    "morning-prayer": "daily-worship",

    # Family
    "family-welfare": "family-harmony",
    "family": "family-harmony",

    # Marriage (keep saubhagya distinct as it's a separate concept)
    "marital-bliss": "marital-harmony",

    # Astrology
    "removal-of-graha-dosha": "graha-shanti",
}

apply_mode = "--apply" in sys.argv
report_mode = "--report" in sys.argv

changes = []  # list of (file, before_purposes, after_purposes)
purpose_counter_before = Counter()
purpose_counter_after = Counter()
files_changed = 0

for fname in sorted(os.listdir(DIR)):
    if not fname.endswith(".json"):
        continue
    fpath = os.path.join(DIR, fname)
    with open(fpath, encoding="utf-8") as f:
        d = json.load(f)
    before = list(d.get("purposes") or [])
    if not before:
        continue
    after = []
    seen = set()
    for p in before:
        canonical = MERGE_MAP.get(p, p)
        if canonical not in seen:
            after.append(canonical)
            seen.add(canonical)
    for p in before:
        purpose_counter_before[p] += 1
    for p in after:
        purpose_counter_after[p] += 1
    if after != before:
        changes.append((fname, before, after))

print(f"\n=== Consolidation summary ===")
print(f"Files scanned: 928")
print(f"Files that would change: {len(changes)}")
print(f"Mode: {'APPLY' if apply_mode else 'DRY-RUN'}")

# Per-tag impact
print(f"\n=== Purpose tag impact (top changes) ===")
for old_tag, new_tag in MERGE_MAP.items():
    old_count = purpose_counter_before.get(old_tag, 0)
    if old_count == 0:
        continue
    new_count_before = purpose_counter_before.get(new_tag, 0)
    new_count_after = purpose_counter_after.get(new_tag, 0)
    print(f"  {old_tag} ({old_count}) → {new_tag} (was {new_count_before}, will be {new_count_after})")

if changes:
    print(f"\n=== First 10 file changes (preview) ===")
    for fname, before, after in changes[:10]:
        diff_added = set(after) - set(before)
        diff_removed = set(before) - set(after)
        chg = []
        if diff_removed:
            chg.append(f"-{sorted(diff_removed)}")
        if diff_added:
            chg.append(f"+{sorted(diff_added)}")
        print(f"  {fname}: {' '.join(chg)}")
    if len(changes) > 10:
        print(f"  ... and {len(changes)-10} more")

if report_mode:
    report_path = os.path.join(ROOT, "reports", "purpose-consolidation-diff.csv")
    with open(report_path, "w", encoding="utf-8") as f:
        f.write("file,before,after\n")
        for fname, before, after in changes:
            f.write(f'{fname},"{";".join(before)}","{";".join(after)}"\n')
    print(f"\n📄 Wrote full diff to {report_path}")

if apply_mode:
    for fname, before, after in changes:
        fpath = os.path.join(DIR, fname)
        with open(fpath, encoding="utf-8") as f:
            d = json.load(f)
        d["purposes"] = after
        d["updatedAt"] = "2026-05-05T12:30:00Z"
        with open(fpath, "w", encoding="utf-8") as f:
            json.dump(d, f, indent=4, ensure_ascii=False)
            f.write("\n")
        files_changed += 1
    print(f"\n✅ APPLIED — {files_changed} files written.")
else:
    print(f"\n💡 Re-run with --apply to commit these changes, or --report to write a CSV.")
