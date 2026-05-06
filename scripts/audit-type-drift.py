#!/usr/bin/env python3
"""
Detect drift between TypeScript unions in src/types/index.ts and
the actual values used in src/data/stotras/*.json.

Usage: python3 scripts/audit-type-drift.py
Exits 0 if no drift, 1 if drift found.
"""
import json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIR = os.path.join(ROOT, "src/data/stotras")
TYPES = os.path.join(ROOT, "src/types/index.ts")

with open(TYPES, encoding="utf-8") as f:
    ts = f.read()

def extract_union(name):
    m = re.search(rf'export type {name}\s*=([^;]+);', ts, re.DOTALL)
    if not m:
        m = re.search(rf'type {name}\s*=([^;]+);', ts, re.DOTALL)
    if not m:
        return set()
    return set(re.findall(r'"([^"]+)"', m.group(1)))

deity_union = extract_union("DeityId")
festival_union = extract_union("FestivalId")
purpose_union = extract_union("PurposeId")
day_union = extract_union("DayId")

deity_data = set()
festival_data = set()
purpose_data = set()
day_data = set()

for f in os.listdir(DIR):
    if not f.endswith(".json"):
        continue
    with open(os.path.join(DIR, f), encoding="utf-8") as fh:
        d = json.load(fh)
    if d.get("deity"):
        deity_data.add(d["deity"])
    for x in d.get("secondaryDeities") or []:
        deity_data.add(x)
    for x in d.get("festivals") or []:
        festival_data.add(x)
    for x in d.get("purposes") or []:
        purpose_data.add(x)
    for x in d.get("days") or []:
        day_data.add(x)

drift_found = False

def report(name, union, data):
    global drift_found
    missing = data - union
    unused = union - data
    print(f"\n=== {name} ===")
    print(f"  Type union size: {len(union)}, Data values: {len(data)}")
    if missing:
        drift_found = True
        print(f"  ❌ IN DATA, NOT IN UNION ({len(missing)}) — will cause type errors:")
        for v in sorted(missing):
            print(f"      \"{v}\"")
    else:
        print(f"  ✅ All data values present in union")
    if unused:
        print(f"  ⚠️  IN UNION, NEVER USED ({len(unused)}) — fine to keep for forward-compat:")
        for v in sorted(unused):
            print(f"      \"{v}\"")

report("DeityId", deity_union, deity_data)
report("FestivalId", festival_union, festival_data)
report("PurposeId", purpose_union, purpose_data)
report("DayId", day_union, day_data)

if drift_found:
    print("\n❌ DRIFT FOUND — fix the unions in src/types/index.ts before adding new content.")
    sys.exit(1)
else:
    print("\n✅ No drift. Safe to add new content.")
    sys.exit(0)
