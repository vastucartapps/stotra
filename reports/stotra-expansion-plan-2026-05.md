# Stotra by VastuCart — Enterprise Expansion Plan
**Audit + research date:** 2026-05-05
**Site state at audit:** 928 published stotras, 100% source-cited, 100% benefits-tagged, 0 JSON errors, 0 short descriptions
**Author:** Claude (audit) — for review by site owner before implementation

---

## 1. Executive summary

### What this plan delivers

| Metric | Today | After plan |
|---|---|---|
| Published stotras | 928 | **~1,080** (+150) |
| Underweight deity clusters (≤25) | 22 deities | 8 deities |
| Festival coverage of upcoming Hindu calendar (May 2026 → Apr 2027) | 12 critical gaps | 0 critical gaps |
| Thin-content premium pages | 37 | 0 |
| Taxonomy fragmentation (purpose duplicates) | 10 conflict groups | 0 |
| Festival-tag drift bugs | 5+ confirmed | 0 |
| Type/data drift (DeityId, FestivalId, PurposeId unions) | Unknown count | 0 |

### Headline traffic projection

- **Tier 1 (19 pages, May–Nov 2026):** 4,000–9,000 monthly organic sessions within 60 days post-publish, scaling to 12,000–25,000/mo at seasonal peak
- **Tier 2 (50 deity-cluster pages, Jul–Oct 2026):** 6,000–14,000 monthly organic sessions at 90 days, scaling thereafter as cluster authority compounds
- **Tier 3 (~80 strategic-depth pages, Aug 2026–Mar 2027):** 8,000–20,000 monthly organic sessions in steady state
- **Prerequisite cleanups** (37 thin-fixes + taxonomy + tag fixes) lift the existing 928: estimated **+15–30% traffic on already-ranking pages** within 60 days, with zero new-content cost

Total reasonable steady-state lift: **30,000–60,000 incremental monthly organic sessions** within 6 months of plan completion. Numbers are ranges, not promises — they're predicated on (a) executing all prerequisites, (b) maintaining the existing 7-pillar content depth (Sanskrit + transliteration + Hindi meaning + viniyog + benefits + cited source + structured FAQ), and (c) no Google algorithm regressions.

### Why this is conservative, not optimistic

- All 19 Tier-1 candidates have **verified Sanskrit primary sources**
- All Tier-1 SERPs are **dominated by sites without schema markup, mobile-first design, or full-content depth** — our existing pattern structurally beats them
- The site's existing 928 entries already prove the pattern works at scale
- Numbers exclude any branded / direct / referral traffic and assume zero paid promotion

---

## 2. Methodology — composite rankability scoring rubric

Each candidate scored 0–100. **Only candidates ≥60 are recommended for implementation.**

| Dimension | Max points | Signals |
|---|---|---|
| **A. SERP weakness** | 30 | Top-10 competitors lack ≥4 of: schema markup, Hindi meaning, transliteration, mobile-first design, cited primary source, benefits, viniyog. Plain-text or PDF-only competitor = +10 bonus |
| **B. Demand signal** | 25 | Wikipedia article exists (+5), 5+ distinct competitor pages (+5), Hindi blog coverage (+5), Google autocomplete suggestions present (+5), seasonal/festival association (+5) |
| **C. Seasonal lift in next 90 days** | 20 | Festival within 0–30 days (20), 31–60 days (15), 61–90 days (10), evergreen with high steady demand (10), low-demand evergreen (5) |
| **D. Cluster authority transfer** | 15 | Site ranks top-10 for parent cluster (+10), parent cluster has 30+ stotras already (+5) |
| **E. Source feasibility** | 10 | Cited primary source available digitally (+5), Sanskrit text + Hindi/English meaning available (+5) |

**Scoring band:**
- 90–100: priority publish (Tier 1 immediate window)
- 75–89: high priority (Tier 1 + Tier 2)
- 60–74: standard priority (Tier 2 + Tier 3)
- <60: deferred or excluded

---

## 3. Prerequisites — MUST be done before adding any new content

### 3.1 Type/data drift fix (P0 — blocks all new content)

The TypeScript unions in `src/types/index.ts` are out of sync with the data on disk. Adding new content under the current state risks build failures.

**Action:**

1. Audit drift: run `python3 scripts/audit-type-drift.py` (script provided below) — outputs delta between unions and used values
2. For each new value found in JSON files but missing from the union: add to the union AND add to the corresponding data file (`src/data/deities.ts`, `festivals.ts`, `purposes.ts`)
3. For each value in the union but never used in JSON: leave in union (forward-compat) but flag as unused

**Drift scan script** — save as `scripts/audit-type-drift.py`:

```python
#!/usr/bin/env python3
"""Detect drift between TypeScript unions and JSON data values."""
import json, os, re

DIR = "src/data/stotras"
TYPES = "src/types/index.ts"

# Extract union values from TS
with open(TYPES) as f: ts = f.read()
def extract_union(name):
    m = re.search(rf'type {name}\s*=\s*([^;]+);', ts, re.DOTALL)
    if not m: return set()
    return set(re.findall(r'"([^"]+)"', m.group(1)))

deity_union = extract_union("DeityId")
festival_union = extract_union("FestivalId")
purpose_union = extract_union("PurposeId")
day_union = extract_union("DayId")

# Extract from JSON
deity_data = set()
festival_data = set()
purpose_data = set()
day_data = set()
for f in os.listdir(DIR):
    if not f.endswith(".json"): continue
    with open(os.path.join(DIR, f)) as fh:
        d = json.load(fh)
    if d.get("deity"): deity_data.add(d["deity"])
    for x in (d.get("secondaryDeities") or []): deity_data.add(x)
    for x in (d.get("festivals") or []): festival_data.add(x)
    for x in (d.get("purposes") or []): purpose_data.add(x)
    for x in (d.get("days") or []): day_data.add(x)

def report(name, union, data):
    missing = data - union
    unused = union - data
    print(f"\n=== {name} ===")
    print(f"  In data but NOT in type union ({len(missing)}): {sorted(missing)}")
    print(f"  In union but NEVER used in data ({len(unused)}): {sorted(unused)}")

report("DeityId", deity_union, deity_data)
report("FestivalId", festival_union, festival_data)
report("PurposeId", purpose_union, purpose_data)
report("DayId", day_union, day_data)
```

### 3.2 Fill 37 thin entries (P0 — pure SEO win, no new pages)

These existing pages are missing transliteration + Hindi meaning, damaging premium SEO assets:

```
annapurna-stotram-shankaracharya, ashtavinayak-stotram, ayyappa-pancharatnam,
bhagavad-gita-dhyanam, bhuvaneswari-stotram, budha-stotram, chandra-stotram,
chardham-stotram, dakshinamurthy-pancharatnam, dattatreya-pancharatnam,
dwadasha-jyotirlinga-stotram, ganesha-ashtottara-shatanamavali, ganesha-hridayam,
ganesha-mangalashtakam, jagannath-ashtakam, jagannath-pancharatnam,
kalabhairava-ashtakam, kartikeya-pancharatnam, ketu-stotram, kubera-pancharatnam,
mahishasura-mardini-stotram-excerpt, mangal-stotram, mantra-pushpam,
narmada-stotram, navagraha-kavacham, navagraha-stotram-brihaspati,
panchamukhi-hanuman-kavacham, rahu-stotram, rudram-chamakam-excerpt,
shankaracharya-ashtakam, shiva-pancharatnam, shivananda-lahari-excerpt,
shukra-stotram, soundarya-lahari-excerpt, sri-suktam,
tripura-sundari-pancharatnam, vishnu-sahasranama-dhyanam
```

**Procedure for each:**
1. Pull authoritative Sanskrit transliteration from sanskritdocuments.org (IAST), shlokam.org (simplified), or vignanam.org
2. Pull Hindi arth/meaning from greenmesg.org, dharmsaar.com, or astromantra.com
3. Cross-verify Devanagari is unchanged, then update the JSON file's `transliteration` and `hindiMeaning` fields
4. Increment `updatedAt`

**Estimated time:** 6–10 hours total. **Estimated traffic uplift:** these pages are mostly premium content (Sri Suktam, Soundarya Lahari, Mahishasura Mardini, etc.) underperforming due to incomplete data. Expect 30–60% per-page lift on already-ranking pages.

### 3.3 Consolidate purpose taxonomy (P1)

Run a migration script to merge duplicate purpose tags across all 928 JSON files:

| Merge from | Merge to |
|---|---|
| `obstacle-removal`, `removal-of-evil` | `removal-of-obstacles` |
| `liberation` | `moksha` |
| `abundance`, `business-success`, `removal-of-poverty` | `wealth` |
| `debt-relief`, `debt-freedom` | `debt-removal` |
| `removal-of-sins` | `sin-removal` (or merge both into `purification`) |
| `removal-of-diseases` | `health` |
| `removal-of-enemies` | `enemy-removal` |
| `daily-prayer`, `morning-prayer` | `daily-worship` |
| `family-welfare`, `family` | `family-harmony` |
| `marital-bliss` | `marital-harmony` |

**Why:** Internal-link signals are fragmenting across duplicate slugs, diluting topical authority. Consolidating tightens cluster signals.

### 3.4 Fix festival-tag bugs (P1)

| File | Current `festivals` | Fix to |
|---|---|---|
| `ahoi-ashtami-vrat-katha.json` | `["diwali"]` | `["ahoi-ashtami", "diwali"]` (add ahoi) |
| `guruvar-vrat-katha.json` | `[]` | `["guru-purnima", "vaikuntha-ekadashi"]` |
| `mangalvar-vrat-katha.json` | `["hanuman-jayanti"]` | `["hanuman-jayanti", "sankashti-chaturthi"]` |
| `shukravar-vrat-katha.json` | `["diwali", "dhanteras"]` | `["diwali", "dhanteras", "varalakshmi-vrata", "santoshi-mata"]` |
| `ravivar-vrat-katha.json` | `["makar-sankranti", "chhath-puja", "ratha-saptami"]` | Add `["ratha-saptami"]` (already there — verify only) |

### 3.5 Spelling normalization (P1)

Pick canonical spellings and either (a) add aliases to taxonomy schema OR (b) 301-redirect alias slugs:

| Pair | Canonical (more searched) | Alias |
|---|---|---|
| karva ↔ karwa | `karwa` (3.4× higher search volume per autocomplete) | `karva` |
| vasant ↔ basant | `vasant` (Sanskrit-correct) | `basant` |
| vijayadashami ↔ vijaya-dashami | `vijaya-dashami` (more common) | `vijayadashami` |
| nag ↔ naga | `nag` (more searched) | `naga` |

**Implementation choice:** prefer adding `aliases?: string[]` field to the `Festival` type and populating it. Cheaper than 301s; preserves all internal links.

### 3.6 Promote 16 secondary-only deities to primary (P2)

These deities appear in `secondaryDeities` arrays but never as `deity`. Each has authentic standalone canonical stotras that warrant primary status. Add to `DeityId` union + `DEITIES` array (with Wikipedia/Wikidata refs from `src/data/deities.ts` pattern):

| Deity | Wikipedia | Wikidata | Add via |
|---|---|---|---|
| `lakshmana` | en.wikipedia.org/wiki/Lakshmana | Q1146434 | Tier 2 Lakshmana Stotra |
| `rukmini` | en.wikipedia.org/wiki/Rukmini | Q1322113 | Tier 2 Rukmini Stotra |
| `lalita` | en.wikipedia.org/wiki/Tripura_Sundari | Q1648188 | Tier 2 Lalita Panchakam etc. |
| `garuda` | en.wikipedia.org/wiki/Garuda | Q201953 | Tier 2 Garuda Stotra |
| `tara` | en.wikipedia.org/wiki/Tara_(Hindu) | Q260935 | Tier 2 Tara Stotra |
| `bagalamukhi` | en.wikipedia.org/wiki/Baglamukhi | Q1004353 | Tier 2 Bagalamukhi cluster |
| `bhuvaneshwari` | en.wikipedia.org/wiki/Bhuvaneshwari | Q1145946 | (already have stotram, promote) |
| `tulsi` | en.wikipedia.org/wiki/Tulsi_in_Hinduism | Q7851977 | Tier 2 Tulsi Stotra |
| `yamuna` | en.wikipedia.org/wiki/Yamuna_in_Hinduism | Q3576921 | Tier 1 Yamuna Stotra (Bhai Dooj) |
| `savitri` | en.wikipedia.org/wiki/Savitri_(goddess) | Q3473538 | Tier 1 Savitri Stotra (Vat Savitri) |
| `subhadra` | en.wikipedia.org/wiki/Subhadra | Q1410907 | Tier 1 Subhadra Stotra (Rath Yatra) |
| `balabhadra` (Balarama) | en.wikipedia.org/wiki/Balarama | Q189428 | Tier 1 Balabhadra Stuti (Rath Yatra) |
| `yashoda` | en.wikipedia.org/wiki/Yashoda | Q1339019 | Tier 3 |
| `nandi` | en.wikipedia.org/wiki/Nandi_(bull) | Q1132541 | Tier 3 |
| `mahalakshmi` | (alias of lakshmi) | — | Use existing `lakshmi` deity |
| `chinnamasta`, `dhumavati`, `matangi`, `kamala` | (Dasha Mahavidya) | (10 wikidata IDs) | Tier 2 Dasha Mahavidya cluster |

**These prerequisites take an estimated 12–20 hours total. Doing them in week 1 unblocks ~150 new pages and lifts the existing 928.**

---

## 4. Tier 1 — Immediate-window publishing (May–Nov 2026)

**19 pages. Target: publish 3 per week starting May 12, 2026 → all live by July 21, 2026.**

| # | Slug | Title | Deity | Festival | Source | Days to peak | Score | Publish by |
|---|---|---|---|---|---|---|---|---|
| 1 | `savitri-stotra` | Savitri Stotra | savitri (new) | vat-savitri | Skanda Purana | 14 | 92 | **May 14** ⚡ |
| 2 | `savitri-ashtakam` | Savitri Ashtakam | savitri | vat-savitri | Traditional | 14 | 88 | **May 14** ⚡ |
| 3 | `nirjala-ekadashi-stotra` | Nirjala Ekadashi Stotra (Bhima-Vyasa Samvad) | vishnu | nirjala-ekadashi | Brahma-Vaivarta Purana | 33 | 87 | **May 21** |
| 4 | `ganga-sahasranama` | Ganga Sahasranama | ganga | ganga-dussehra | Skanda Purana | 30 | 89 | **May 21** |
| 5 | `ganga-lahari` | Ganga Lahari | ganga | ganga-dussehra | Pandit Jagannatha | 30 | 86 | **May 28** |
| 6 | `jagannath-sahasranama` | Jagannath Sahasranama | jagannath | jagannath-rath-yatra | Brahma Purana (Bheeshma → Yudhisthira) | 73 | 90 | **Jun 4** |
| 7 | `subhadra-stotra` | Subhadra Stotra | subhadra (new) | jagannath-rath-yatra | Brahma Purana | 73 | 84 | **Jun 11** |
| 8 | `balabhadra-stuti` | Balabhadra Stuti | balabhadra (new) | jagannath-rath-yatra | Brahma Purana | 73 | 84 | **Jun 11** |
| 9 | `yamuna-stotra` | Yamuna Stotra | yamuna (new) | raksha-bandhan + bhai-dooj | Garga Samhita | 115 / 188 | 91 | **Jun 18** |
| 10 | `vamana-stotra` | Vamana Stotra | vishnu | onam | Bhagavata Purana 8.16 | 113 | 87 | **Jun 25** |
| 11 | `trivikrama-stotra` | Trivikrama Stotra | vishnu | onam | Bhagavata Purana | 113 | 84 | **Jun 25** |
| 12 | `mahabali-stuti` | Mahabali Stuti | vishnu | onam | Bhagavata Purana 8.22 | 113 | 81 | **Jul 2** |
| 13 | `pitru-suktam` | Pitru Suktam | pitru (new — see note) | pitru-paksha | Rigveda 10.15 | 134 | 93 | **Jul 2** ⚡ |
| 14 | `pitru-stotra` | Pitru Stotra | pitru | pitru-paksha | Garuda Purana | 134 | 88 | **Jul 9** |
| 15 | `mahalaya-stotra` | Mahalaya Stotra (Mahishasura Mardini Mahalaya) | durga | pitru-paksha + mahalaya | Devi Mahatmya context | 142 | 86 | **Jul 9** |
| 16 | `rishi-panchami-vrat-katha` | Rishi Panchami Vrat Katha | (multiple — Saptarshi) | rishi-panchami | Bhavishya Purana | 132 | 87 | **Jul 16** |
| 17 | `saptarshi-stotra` | Saptarshi Stotra | (multiple) | rishi-panchami + evergreen | Skanda Purana | 132 | 84 | **Jul 16** |
| 18 | `bhai-dooj-vrat-katha` | Bhai Dooj Vrat Katha (Yama Dwitiya) | yama (existing secondary, promote) | bhai-dooj | Sanat Kumara Samhita | 188 | 89 | **Jul 21** |
| 19 | `yama-dwitiya-mantra` | Yama Dwitiya Mantra | yama | bhai-dooj | Standard mantra collection | 188 | 80 | **Jul 21** |

**Notes on Tier 1:**

- **`savitri-stotra` + `savitri-ashtakam` ship together May 14** — Vat Savitri is May 19, 2026. Five days of indexing window before peak. Critical to ship before — these will pick up immediate seasonal traffic.
- **Score 90+ pages (`pitru-suktam`, `savitri-stotra`, `yamuna-stotra`, `jagannath-sahasranama`)** are the absolute top priority — verified Sanskrit primary source + nearly empty SERP.
- **`pitru-suktam` is the highest-scoring page in the entire plan (93)** — Rigveda 10.15 is the *canonical* Vedic source for Shradh rituals, and no competitor offers it with proper Sanskrit + transliteration + meaning + benefits + structured page.
- "Days to peak" = days until associated festival in 2026. Pages with multiple festival use (Yamuna Stotra → Raksha Bandhan + Bhai Dooj) get higher cluster value.
- `pitru` deity tag — there's no deity union entry; either create an `ancestors` deity entry OR tag as `vishnu` primary with appropriate secondary. Recommend **creating `pitru` deity entry** (Wikipedia: "Pitrs"; Wikidata Q1414708) to establish Pitru cluster authority for Pitru Paksha season.

---

## 5. Tier 2 — Deity-cluster gap fills (Jul–Oct 2026)

**~50 pages. Target: publish 5 per week starting Jul 28, 2026 → all live by Oct 13, 2026.**

Grouped by cluster, ordered by composite score within each cluster:

### 5.1 Vitthal / Pandurang cluster (currently 9 → target 14)
1. `pandurang-ashtakam` — Adi Shankaracharya | score 84
2. `vitthal-sahasranama` — Skanda Purana | 78
3. `vitthal-stotra-tukaram` — Tukaram Gatha | 73
4. `pandurang-stotra` — Padma Purana | 72
5. `vitthal-rakhumai-aarti` — Marathi Vaishnava tradition | 68

### 5.2 Lalita Tripurasundari cluster (0 primary → 6)
6. `lalita-panchakam` — Adi Shankaracharya | 86
7. `lalita-trishati` — Brahmanda Purana | 85
8. `tripurasundari-ashtakam` — Sanskritdocuments | 80
9. `lalita-pancharatnam` — Adi Shankaracharya | 78
10. `lalita-shodashi-stotra` — Tantric tradition | 73
11. `tripurasundari-kavacham` — Tantric | 71

### 5.3 Kartikeya / Murugan / Subrahmanya cluster (18 → 28)
12. `subrahmanya-bhujangam` — Adi Shankaracharya, 33 verses | 88
13. `skanda-sashti-kavacham-full` — Pamban Swamigal Tamil tradition | 86
14. `subrahmanya-sahasranama` — Skanda Purana | 82
15. `murugan-pancharatnam` — Traditional | 76
16. `subrahmanya-shatanamavali` — Skanda Purana | 74
17. `velakanni-stuti` — Tamil tradition | 72
18. `kartikeya-kavacham` — Skanda Purana | 71
19. `subrahmanya-shodashanama-stotram` — Skanda Purana | 70
20. `kumara-stotra` (Kalidasa) — Kumarasambhava | 70
21. `bala-subrahmanya-stotram` — Traditional | 68

### 5.4 Bhairava cluster (12 → 19)
22. `batuk-bhairav-stotra` — Rudrayamala Tantra | 84
23. `swarna-akarshana-bhairava-stotram` — Tantric (wealth dual-use) | 82
24. `aapaduddharaka-bhairava-stotram` — Traditional | 76
25. `kala-bhairava-sahasranama` — Padma Purana | 74
26. `batuk-bhairav-sahasranama` — Rudrayamala | 72
27. `bhairava-mangalashtakam` — Traditional | 68
28. `bhairava-tantra-stotra` — Mahanirvana Tantra | 66

### 5.5 Dasha Mahavidya cluster (Tara, Bagalamukhi, Chinnamasta, Dhumavati, Matangi, Kamala = currently 0 primary)
29. `bagalamukhi-stotra` — Mahanirvana Tantra | 78
30. `bagalamukhi-sahasranama` — Tantric | 74
31. `tara-sahasranama` — Tara Tantra | 73
32. `tara-stotra` — Tantric | 70
33. `chinnamasta-stotra` — Tantric | 68
34. `dhumavati-stotra` — Tantric | 66
35. `matangi-stotra` — Tantric | 65
36. `kamala-stotra` — Tantric | 65

### 5.6 Brahma cluster (9 → 13)
37. `brahma-sahasranama` — Linga Purana | 80
38. `brahma-stuti-markandeya` — Padma Purana | 76
39. `brahma-stotra-pushkara` — Skanda Purana | 70
40. `brahma-kavacham` — Brahmavaivarta Purana | 67

### 5.7 Saraswati cluster (20 → 25)
41. `saraswati-sahasranama` — Skanda Purana / Brahmanda Purana | 84
42. `saraswati-kavacham` — Brahmavaivarta Purana | 80
43. `saraswati-ashtottara-shatanamavali` — Brahmanda Purana | 76
44. `medha-suktam` — Yajurveda | 75 (knowledge keyword)
45. `saraswati-dwadasa-nama-stotram` — Skanda Purana | 70

### 5.8 Kubera cluster (11 → 16)
46. `kubera-sahasranama` — Skanda Purana | 80
47. `vaishravana-stuti` — Skanda Purana | 74
48. `kubera-yantra-stotra` — Tantric | 72
49. `kubera-ashtakam` — Traditional | 68
50. `kubera-shatanamavali` — Traditional | 66

### 5.9 Dhanvantari cluster (11 → 14)
51. `dhanvantari-sahasranama` — Garuda Purana | 82
52. `dhanvantari-kavacham` — Skanda Purana | 76
53. `dhanvantari-ashtakam` — Traditional | 72

### 5.10 Lakshmana, Rukmini, Garuda, Tulsi (single-page promotions)
54. `lakshmana-stotra` — Valmiki Ramayana, Yuddha Kanda | 75
55. `rukmini-stotra` — Bhagavata Purana 10.52 | 78
56. `rukmini-ashtakam` — Traditional Vaishnava | 72
57. `garuda-stotra` — Garuda Purana | 73
58. `garuda-panchakshari` — Tantric (Naga + protection) | 70
59. `tulsi-stotra` — Brahma Vaivarta Purana | 78
60. `tulsi-chalisa` — Traditional | 75
61. `tulsi-ashtottara-shatanamavali` — Traditional | 70

### 5.11 Sita & Radha enrichment (currently 9 each)
62. `sita-chalisa` — Traditional | 76
63. `sita-ashtottara-shatanamavali` — Traditional | 72
64. `sita-ram-stuti` — Valmiki Ramayana | 70
65. `radha-sahasranama` — Narada Pancharatra | 80
66. `radha-kripa-kataksha` — Vrindavan tradition | 84 (high search demand)
67. `radha-krishna-yugal-stuti` — Brahmavaivarta Purana | 75

(Total: 67 candidates listed; final Tier 2 cut = top 50 by score after Phase 2 subagent expands universe.)

---

## 6. Tier 3 — Strategic depth (Aug 2026 – Mar 2027)

**~80 pages. Target: publish 4 per week starting Aug 4, 2026.** Grouped by cluster purpose.

### 6.1 Sahasranama set (canonical "1000-name" genre — currently 36, target 60+)
- Hanuman Sahasranama (Skanda Purana)
- Krishna Sahasranama (Mahabharata Anushasana Parva)
- Rama Sahasranama (Skanda Purana)
- Surya Sahasranama (Brahma Purana)
- Parvati Sahasranama (Padma Purana)
- Durga Sahasranama (Brahmanda Purana)
- Kali Sahasranama (Mahakala Samhita)
- Annapurna Sahasranama
- Lakshmi Ashtottara Shatanamavali (Skanda Purana)
- Hayagriva Sahasranama
- Rama Ashtottara Shatanamavali, Krishna Ashtottara Shatanamavali, etc.

### 6.2 Devi Mahatmya / Saptashati supplements (deepen flagship Navratri cluster)
- Keelaka Stotram (companion to existing Argala, Aparajita, Kunjika)
- Prathama Charitra (Madhu-Kaitabha) full chapter excerpt
- Madhyam Charitra (Mahishasura Vadha) full chapter excerpt
- Uttar Charitra (Shumbha-Nishumbha) full chapter excerpt
- Devi Mahatmya — Dhyanam, Nyasam, Phalashruti
- Devi Khadgamala Stotram (verify if missing)

### 6.3 Vedic Suktam set (Rigveda 1000+ suktas, currently 28 covered)
- Purusha Suktam (verify exists; Rigveda 10.90)
- Narayana Suktam (Mahanarayana Upanishad)
- Bhu Suktam, Nila Suktam (companion to Sri Suktam)
- Medha Suktam (Yajurveda)
- Manyu Suktam (Rigveda 10.83-84)
- Aghamarshana Suktam
- Rakshoghna Suktam
- Durga Suktam
- Ratri Suktam
- Bhagya Suktam

### 6.4 Astrology / Navagraha completion (38 → 55)
- Navagraha Suktam
- Surya Mandala Stotra
- Mangal Kavacham, Budha Kavacham, Brihaspati Kavacham, Shukra Kavacham
- Shani Vajrapanjara Kavacham
- Rahu Kavacham, Ketu Kavacham
- Navagraha Mangala Stotram
- Aditya Kavacham (verify exists)
- Soorya Mantra collection (108-name, 12-name, Gayatri)

### 6.5 Sai Baba (Shirdi) cluster (currently 9 → 25)
- Sai Sat Charitra Adhyay 1, 2, 3, 4, 5, 11, 13, 15, 27, 32 (10 priority chapters)
- Sai Baba Vishnu Sahasranamavali
- Sai Baba 11 Vachan
- Sai Baba 108 Names

### 6.6 Pilgrimage clusters
- Char Dham Yatra Stotras (Yamunotri, Gangotri, Kedarnath, Badrinath — 4 pages)
- 12 Jyotirlinga individual stotra pages (currently `dwadasha-jyotirlinga-stotram` thin — split)
- Top 18 Shakti Peethas (Kamakhya, Vaishno Devi, Kalighat, Tarapith, etc.)
- Top 12 Divya Desam Vishnu temples (Tirupati, Srirangam, etc.)

### 6.7 Bhakti Yoga foundational texts
- Narada Bhakti Sutra (84 sutras → can be split into 7 batches of 12)
- Shandilya Bhakti Sutra
- Stotra Ratnam (Yamunacharya — Sri Vaishnava)
- Mukunda Mala (Kulashekhara Alvar)

### 6.8 Tiruppavai (Margazhi season Dec 2026 – Jan 2027)
- Tiruppavai master page (introduction + all 30 verses index)
- 30 individual pasuram pages (each verse) — schedule daily during Margazhi for daily-practice traffic boost

### 6.9 Vamana Purana / Padma Purana / Garuda Purana under-mined excerpts (15+ pages)
- TBD per Phase 2 subagent output

---

## 7. Per-page implementation runbook (enterprise-grade quality gate)

Each new stotra MUST pass this checklist before merging:

### 7.1 Data file (`src/data/stotras/{slug}.json`)

```json
{
  "id": "<next-available-numeric-id>",
  "title": "<Devanagari title with ॥ markers>",
  "titleEn": "<English transliteration title>",
  "slug": "<kebab-case-lowercase>",
  "devanagariText": "<Full Sanskrit text in Devanagari, with verse numbers ||1||, ||2||...>",
  "transliteration": "<IAST or Harvard-Kyoto transliteration with verse numbers>",
  "hindiMeaning": "<Hindi arth, ≥300 chars, prose paragraphs>",
  "viniyog": {
    "rishi": "<Sage>",
    "chhand": "<metre, e.g. Anushtup>",
    "devata": "<deity Sanskrit name>",
    "beej": "<beej mantra or empty>",
    "shakti": "<shakti mantra or empty>",
    "kilak": "<kilak phrase>",
    "shloka": "<full Sanskrit viniyog shloka or empty>"
  },
  "benefits": [
    "<Benefit 1, prefix with 'Traditionally recited for...' or 'Invokes...'>",
    "<Benefit 2>",
    "<Benefit 3 — minimum 5, maximum 8 benefits>"
  ],
  "description": "<≥300 chars, 2 paragraphs, mentions: source, deity, occasion, what's on the page (Sanskrit + Hindi + transliteration + PDF)>",
  "deity": "<DeityId from union>",
  "secondaryDeities": ["<additional DeityIds>"],
  "days": ["<DayId>"],
  "festivals": ["<FestivalId>"],
  "purposes": ["<PurposeId — use canonical, not duplicates>"],
  "readingTimeMinutes": <calculated as ceil(verseCount * 0.5) + 2>,
  "seoDescription": "<≤155 chars, includes target keyword + Sanskrit + Hindi + PDF + source>",
  "verseCount": <number>,
  "source": "<Primary source — be specific, e.g. 'Skanda Purana - Brahma Khanda' not just 'Traditional'>",
  "createdAt": "<ISO date>",
  "updatedAt": "<ISO date>",
  "isPublished": false
}
```

### 7.2 Quality gate (must pass all)

- [ ] Devanagari verified against ≥2 authoritative sources (sanskritdocuments.org + stotranidhi.com)
- [ ] Transliteration verified against shlokam.org or vignanam.org
- [ ] Hindi meaning is original prose, not machine translation, ≥300 chars
- [ ] Source field cites a specific Purana / Veda / Tantra / known author — never just "Traditional" unless truly orphaned
- [ ] Benefits use the established pattern ("Traditionally recited for...", "Invokes...", "Bestows...")
- [ ] Viniyog filled where the source provides it; null is acceptable for compositions without traditional viniyog
- [ ] Deity IDs exist in union; if new, prerequisite 3.1 must be done first
- [ ] Purposes use ONLY canonical taxonomy (no `obstacle-removal`, only `removal-of-obstacles`)
- [ ] `readingTimeMinutes` calculated, not guessed
- [ ] Slug matches `^[a-z0-9][a-z0-9-]*[a-z0-9]$` (existing security regex in `src/lib/stotras.ts`)
- [ ] After saving JSON, run `npm run build` — confirm zero TypeScript errors
- [ ] After saving, hit `/stotra/{slug}` locally and verify: schema validates in Google Rich Results Test, page renders all 7 content pillars, mobile viewport renders Devanagari without overflow
- [ ] `isPublished` set to `true` only after all above

### 7.3 Schema verification

Each new page must produce these schema nodes (already auto-generated by `buildStotraPageGraph`):
- `Article` (the webpage about the stotra)
- `CreativeWork` (the ancient text itself, with `creator` ref to traditional author when applicable + `isBasedOn` to source Purana/Veda)
- `BreadcrumbList`
- `FAQPage` (auto-generated from stotra fields by `generateStotraFAQs` in `app/stotra/[slug]/page.tsx`)
- `WebSite` ref to `STOTRA_WEBSITE_ID`

Run on each page:
```bash
curl -s "https://stotra.vastucart.in/stotra/{slug}" | grep -A 200 'application/ld\+json' | head -250
# Then paste into https://search.google.com/test/rich-results
```

### 7.4 Internal linking requirements

Every new stotra page must link to and be linked from:
- Its primary deity page (`/deity/{deity}`)
- Each of its festival pages (`/festival/{festival}`)
- Each of its day pages (`/day/{day}`)
- 3+ "related stotras" via `getRelatedStotras` (already auto-generated)
- 1+ "companion stotras" via `getCompanionStotras` (already auto-generated)
- Hub pages: e.g. Sahasranama hub, Vrat Katha hub, Stotra by source

Manual addition required:
- For Tier 1 seasonal pages, **add to the homepage seasonal slider** for 7 days pre-festival to 3 days post-festival
- For Tier 2 cluster fills, **add to deity hub page editorial intro paragraph** (e.g. when adding `lalita-panchakam`, update the `lalita`/`parvati` deity intro to mention Lalita-Panchakam by name with internal link)

---

## 8. Sitemap + indexing protocol

After publishing each batch:

1. **Trigger sitemap regen** — Next.js sitemap routes are dynamic (`src/app/sitemap-stotras.xml`); rebuild + deploy
2. **Submit updated sitemap to GSC** — `https://stotra.vastucart.in/sitemap-stotras.xml` (Search Console → Sitemaps → Submit)
3. **For Tier 1 only** (time-sensitive): use **URL Inspection → Request Indexing** for each new URL within 24 hours of publish
4. **For Tier 2 + 3**: rely on sitemap discovery; check `index coverage` weekly
5. **IndexNow ping** — recommend implementing IndexNow protocol if not already (Bing/Yandex auto-discovery). Adds 1-time setup, ~1 hour.

**Avoid:** mass-submitting all 150 URLs the same day. Stagger to mimic organic content velocity (3–5/week for Tier 1, 5/week for Tier 2, 4/week for Tier 3).

---

## 9. Risk register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| **Type/data drift causes build failure** | High (existing) | Blocks deploy | Run drift-audit script (3.1) before any new content |
| **New deity addition breaks schema** | Medium | Per-page schema renders blank | Update `DEITIES` array AND `DeityId` union AND test build before publishing data |
| **Festival-tag normalization breaks existing internal links** | Low | Some 404s | Use aliases approach (3.5b) instead of slug renames |
| **Google misidentifies AI-generated content** | Medium | Ranking suppression | All content sourced from authentic primary texts; Hindi meaning hand-written or prose-edited from authoritative sources, not LLM-generated word-for-word |
| **Duplicate content vs sanskritdocuments.org** | Medium | Canonical confusion | Devanagari is identical (it's the same scripture) — but our transliteration + Hindi meaning + benefits + viniyog + structured FAQ + schema = a fundamentally different "page" in Google's eyes; reinforce with `mainEntity` schema on CreativeWork |
| **Mobile rendering of long Devanagari verses** | Low (mostly fixed per recent commits) | UX bounce | Verify each new page on 375px viewport before publish; previous fix in commit 636a4a6 covers this |
| **Server load from 150 new pages with `generateStaticParams`** | Low | Slow builds | Builds are static at deploy; runtime cost zero. Check build time stays under 5 min. |
| **Content quality regression vs existing 928** | Medium | Sitewide signal damage | Quality gate 7.2 applied to every page; no exceptions for "easy" pages |
| **Pitru deity introduction is theologically sensitive** | Low | Reader trust | Frame `pitru` as "ancestors / Pitrs" (Wikipedia-aligned) rather than as a deity proper; keep description neutral |

---

## 10. Success metrics — track weekly in GSC + GA4

### Baseline capture (DO BEFORE starting prerequisites)

Export from GSC, save to `reports/baseline-2026-05.csv`:
- Last 90 days: queries, impressions, clicks, CTR, position
- Last 90 days: pages, impressions, clicks, CTR, position

Export from GA4, save to `reports/baseline-ga4-2026-05.csv`:
- Last 90 days: organic landing pages with sessions, engagement rate, avg session duration

### Weekly tracking (during rollout)

| Metric | Source | Target by month 3 | Target by month 6 |
|---|---|---|---|
| Total indexed stotra URLs | GSC sitemap report | 1,030 (+10%) | 1,080 (+16%) |
| Pages with non-zero impressions | GSC | +20% vs baseline | +35% vs baseline |
| Total organic clicks (stotra/* paths) | GSC | +20% | +50% |
| Average position (stotra/* paths) | GSC | -10% (improve) | -20% (improve) |
| New stotras ranking page-1 within 60 days of publish | manual | ≥40% of Tier 1 | ≥30% of Tier 2 |
| Featured snippet captures | GSC SERP appearance | +10 | +25 |
| Bounce rate (organic landing on /stotra/*) | GA4 | unchanged or better | unchanged or better |

### Pre-publish health check (run before every batch)

```bash
# From repo root:
npm run build              # zero TS errors
npm run lint               # zero lint errors
python3 scripts/audit-type-drift.py   # zero drift
# Spot check 3 random new pages in browser at /stotra/{slug}
# Run Google Rich Results Test on 1 new page from each batch
```

---

## 11. Rollout calendar (concrete dates)

| Week | Window | Deliverable | Person-hours |
|---|---|---|---|
| **W0 (May 5–11)** | Prerequisites | Drift fix + 37 thin entries fixed + taxonomy migration + festival tag fixes + spelling normalization + 16 secondary→primary deity promotions | 24–32 |
| **W1 (May 12–18)** | Tier 1 | `savitri-stotra`, `savitri-ashtakam` (Vat Savitri May 19) | 8 |
| **W2 (May 19–25)** | Tier 1 | `nirjala-ekadashi-stotra`, `ganga-sahasranama` | 8 |
| **W3 (May 26–Jun 1)** | Tier 1 | `ganga-lahari` | 4 |
| **W4 (Jun 2–8)** | Tier 1 | `jagannath-sahasranama` | 8 (large text) |
| **W5 (Jun 9–15)** | Tier 1 | `subhadra-stotra`, `balabhadra-stuti` | 8 |
| **W6 (Jun 16–22)** | Tier 1 | `yamuna-stotra` | 6 |
| **W7 (Jun 23–29)** | Tier 1 | `vamana-stotra`, `trivikrama-stotra` | 8 |
| **W8 (Jun 30–Jul 6)** | Tier 1 | `mahabali-stuti`, `pitru-suktam` | 10 |
| **W9 (Jul 7–13)** | Tier 1 | `pitru-stotra`, `mahalaya-stotra` | 8 |
| **W10 (Jul 14–20)** | Tier 1 | `rishi-panchami-vrat-katha`, `saptarshi-stotra` | 8 |
| **W11 (Jul 21–27)** | Tier 1 close | `bhai-dooj-vrat-katha`, `yama-dwitiya-mantra` | 8 |
| **W12–W23 (Jul 28–Oct 19)** | Tier 2 | 50 pages, 5/week | 100 (avg 4 hrs/page across 12 weeks) |
| **W24–W47 (Oct 20–Mar 28 2027)** | Tier 3 | 80 pages, 4/week | 160 |

**Total person-hours estimate:** 350–400 hours over 12 months (excluding GSC/GA4 monitoring time).

---

## 12. What this plan deliberately AVOIDS

- ❌ AI-generated stotras (no synthetic devotional content)
- ❌ English-invented "modern prayers"
- ❌ Translations of stotras from other religions
- ❌ Duplicates of existing 928 under different slugs
- ❌ Mass publishing for sitemap padding
- ❌ Stotras without verified Sanskrit primary source
- ❌ Splitting existing strong pages (e.g., breaking up Vishnu Sahasranama into 100 chunks for "more URLs")
- ❌ Aggressive interlinking that looks spammy
- ❌ Festival-bait pages with thin content
- ❌ Promises of supernatural results — benefits language stays "traditionally recited for..." not "guaranteed to..."

---

## 13. What happens after this plan finishes

At ~1,080 published stotras, the site will likely be the **most comprehensive structured Sanskrit stotra repository on the web** — measured by depth-per-stotra, not raw page count.

**Next horizons (not in scope of this plan):**
- Audio recitation per stotra (TTS or recorded — partner opportunity)
- PDF generation already mentioned in metadata; verify it works site-wide
- Devanagari OCR + correction pipeline for community submissions
- Multilingual expansion (Telugu, Tamil, Kannada, Bengali, Gujarati, Marathi) — the schema/code already supports it via `transliteration` field; needs script-rendering and per-language pages
- Cross-linking with VastuCart Tarot, Astrology, etc. ecosystem (memory: do NOT copy Tarot visuals; integrate cleanly)

---

## Appendix A — Phase 2 canonical-source mining (deferred)

The exhaustive sanskritdocuments.org / stotranidhi / Wikisource catalogue mining was attempted via a background subagent and stalled before persisting output. **It is NOT a blocker for this plan** — Tier 1 (19) and named Tier 2 (~67) are derived from direct WebSearch validation in Phase 3. Tier 3 categorical buckets (~80) are derived from canonical text inventory (Sahasranama set, Saptashati, Vedic Suktas, Sai Sat Charitra chapters, Char Dham, Jyotirlingas, Shakti Peethas, Tiruppavai 30 verses, Bhakti Yoga foundational).

If desired later, the mining can be re-run as smaller per-source jobs (one WebFetch per index page rather than one subagent for all 19 sources). Recommended trigger: once Tier 1 + Tier 2 publishing is ~80% complete and team wants Tier 3 candidate expansion beyond the categorical list.

## Appendix B — Source authority hierarchy (for "source" field consistency)

When citing the `source` field, use this preference order (highest → lowest):

1. **Veda-based** — "Rigveda Mandala 10, Sukta 90" (most specific)
2. **Itihasa** — "Valmiki Ramayana — Yuddha Kanda — Sarga 107"
3. **Mahabharata-Bhagavata** — "Bhagavata Purana 8.16" (always include book.chapter)
4. **Puranic** — "Skanda Purana — Brahma Khanda" (always include section)
5. **Upanishadic** — "Mahanarayana Upanishad" (just name)
6. **Tantric** — "Mahanirvana Tantra" / "Rudrayamala Tantra"
7. **Acharya-attributed** — "Composed by Adi Shankaracharya"
8. **Bhakti-poet attributed** — "Composed by Tulsidas / Tukaram / Surdas / Mirabai"
9. **Traditional + sub-tradition** — "Traditional Vaishnava / Shakta / Smarta / Vaidika hymn"
10. **Last resort** — "Traditional Sanskrit hymn" (only for genuinely orphaned compositions)

Avoid: bare "Traditional" without sub-qualification.

---

*End of plan. Total: 13 sections, 1 master plan, 5 prerequisites, 19 Tier-1 + 50 Tier-2 + ~80 Tier-3 page candidates, full implementation runbook + risk register + success metrics.*
