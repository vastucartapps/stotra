#!/usr/bin/env python3
"""
Benefits rewrite migration — reads all stotra JSON files, applies the mapping
from scripts/benefits-rewrite-map.ts, writes back, and produces a diff report.

Usage:
    python3 scripts/rewrite-benefits.py --dry-run   # preview only
    python3 scripts/rewrite-benefits.py --apply     # write changes
"""
import json, glob, re, os, sys, csv

# Must mirror scripts/benefits-rewrite-map.ts
EXACT_REWRITES = {
    "Cures diseases and removes all suffering":
        "Invoked in classical tradition for protection from ailments and affliction; not a substitute for medical care",
    "Fulfills all wishes when recited with devotion":
        "Traditionally recited for fulfillment of earnest wishes",
    "Removes all fears and obstacles from life":
        "Classical tradition invokes this hymn for removal of fear (bhaya-nashana) and obstacles (vighna-hara)",
    "Grants strength, courage, and wisdom":
        "Invokes the deity's qualities of strength, courage, and discernment",
    "Protects from evil spirits and negative energies":
        "Traditionally recited for spiritual protection",
    "Bestows the blessings of Lord Rama through Hanuman":
        "Invokes the blessings of Lord Rama through Hanuman's mediation",
}

VERB_PATTERNS = [
    # Medical language — must include the disclaimer
    (re.compile(r"^(Cures?|Heals?)\s+(.+)$", re.IGNORECASE),
     lambda m: f"Associated in tradition with {m.group(2).lower()}; not a substitute for medical care"),
    # "Grants X" → "Invokes X"
    (re.compile(r"^Grants?\s+(.+)$", re.IGNORECASE),
     lambda m: f"Invokes {m.group(1).lower()}"),
    # "Bestows X" → "Invokes the blessing of X"
    (re.compile(r"^Bestows?\s+(.+)$", re.IGNORECASE),
     lambda m: f"Invokes the blessing of {m.group(1).lower()}"),
    # "Destroys all X" or "Destroys X"
    (re.compile(r"^Destroys?\s+all\s+(.+)$", re.IGNORECASE),
     lambda m: f"Traditionally recited for removal of all {m.group(1).lower()}"),
    (re.compile(r"^Destroys?\s+(.+)$", re.IGNORECASE),
     lambda m: f"Traditionally recited for removal of {m.group(1).lower()}"),
    # "Removes all/every X"
    (re.compile(r"^Removes?\s+(all|every)\s+(.+)$", re.IGNORECASE),
     lambda m: f"Classical tradition invokes this for removal of {m.group(2).lower()}"),
    (re.compile(r"^Removes?\s+(.+)$", re.IGNORECASE),
     lambda m: f"Traditionally recited for removal of {m.group(1).lower()}"),
    # "Eliminates X"
    (re.compile(r"^Eliminates?\s+(.+)$", re.IGNORECASE),
     lambda m: f"Traditionally invoked for removal of {m.group(1).lower()}"),
    # "Fulfills all/every X" or "Fulfills X"
    (re.compile(r"^Fulfill?s?\s+(all|every)\s+(.+)$", re.IGNORECASE),
     lambda m: f"Traditionally recited for fulfillment of {m.group(2).lower()}"),
    (re.compile(r"^Fulfill?s?\s+(.+)$", re.IGNORECASE),
     lambda m: f"Traditionally recited for fulfillment of {m.group(1).lower()}"),
    # "Guarantees X"
    (re.compile(r"^Guarantees?\s+(.+)$", re.IGNORECASE),
     lambda m: f"Traditionally associated with {m.group(1).lower()}"),
    # "Ensures X"
    (re.compile(r"^Ensures?\s+(.+)$", re.IGNORECASE),
     lambda m: f"Traditionally recited to invoke {m.group(1).lower()}"),
    # "Protects from X"
    (re.compile(r"^Protects?\s+from\s+(.+)$", re.IGNORECASE),
     lambda m: f"Traditionally invoked for protection from {m.group(1).lower()}"),
    (re.compile(r"^Protection\s+from\s+(.+)$", re.IGNORECASE),
     lambda m: f"Traditional invocation for protection from {m.group(1).lower()}"),
    # "Brings X"
    (re.compile(r"^Brings?\s+(.+)$", re.IGNORECASE),
     lambda m: f"Traditionally associated with {m.group(1).lower()}"),
    # "Creates X"
    (re.compile(r"^Creates?\s+(.+)$", re.IGNORECASE),
     lambda m: f"Traditionally invoked to establish {m.group(1).lower()}"),
]

def rewrite_benefit(b: str) -> str:
    """Return rewritten benefit string, or the original if no pattern matches."""
    b = b.strip()
    # Exact matches first
    if b in EXACT_REWRITES:
        return EXACT_REWRITES[b]
    # Verb pattern softening
    for pat, fn in VERB_PATTERNS:
        m = pat.match(b)
        if m:
            return fn(m)
    return b


def main(apply: bool):
    files = sorted(glob.glob("src/data/stotras/*.json"))
    diff_rows = []
    changed_files = 0
    changed_lines = 0
    for f in files:
        with open(f, encoding="utf-8") as fh:
            d = json.load(fh)
        benefits = d.get("benefits", [])
        new_benefits = []
        file_changed = False
        for b in benefits:
            new_b = rewrite_benefit(b)
            if new_b != b:
                diff_rows.append({"slug": d["slug"], "before": b, "after": new_b})
                changed_lines += 1
                file_changed = True
            new_benefits.append(new_b)
        if file_changed:
            changed_files += 1
            if apply:
                d["benefits"] = new_benefits
                with open(f, "w", encoding="utf-8") as fh:
                    json.dump(d, fh, ensure_ascii=False, indent=4)

    # Write diff report
    os.makedirs("reports", exist_ok=True)
    report_path = "reports/benefits-rewrite-diff.csv"
    with open(report_path, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=["slug", "before", "after"])
        w.writeheader()
        w.writerows(diff_rows)

    print(f"Mode: {'APPLIED' if apply else 'DRY-RUN (no writes)'}")
    print(f"Files with changes: {changed_files} / {len(files)}")
    print(f"Benefit lines rewritten: {changed_lines}")
    print(f"Diff report: {report_path}")

    # Sample of what was rewritten
    print("\n=== Sample of rewrites (first 10) ===")
    for r in diff_rows[:10]:
        print(f"\n  [{r['slug']}]")
        print(f"  BEFORE: {r['before']}")
        print(f"  AFTER:  {r['after']}")


if __name__ == "__main__":
    apply = "--apply" in sys.argv
    main(apply=apply)
