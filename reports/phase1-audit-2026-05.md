# Phase 1 — Existing Content Audit (May 2026)

**Total stotras:** 928
**JSON parse errors:** 0
**Source attribution:** 100% (zero missing)
**Benefits coverage:** 100% (zero missing)
**SEO description coverage:** 100% (zero missing)
**Description ≥200 chars:** 100% (zero short)

## Quality findings (action items)

### A. 37 entries missing transliteration + Hindi meaning
These are **premium SEO assets damaged by incomplete fields** — fix before adding new content. Several are top-of-funnel high-value:

| File | Title | Why high-value |
|---|---|---|
| `sri-suktam.json` | Sri Suktam | Major Lakshmi text, evergreen wealth-keyword traffic |
| `soundarya-lahari-excerpt.json` | Soundarya Lahari Excerpt | Adi Shankara, ranks for "Soundarya Lahari" + meaning queries |
| `mahishasura-mardini-stotram-excerpt.json` | Mahishasura Mardini | Navratri-spike, viral chant |
| `mantra-pushpam.json` | Mantra Pushpam | Ritual standard, high search |
| `rudram-chamakam-excerpt.json` | Rudram Chamakam | Shaivite premium |
| `vishnu-sahasranama-dhyanam.json` | Vishnu Sahasranama Dhyanam | Companion to flagship Sahasranama |
| `bhagavad-gita-dhyanam.json` | Bhagavad Gita Dhyanam | Funnel into Gita section |
| `panchamukhi-hanuman-kavacham.json` | Panchamukhi Hanuman Kavacham | Tantric, low competition |
| `dwadasha-jyotirlinga-stotram.json` | Dwadasha Jyotirlinga Stotram | Pilgrimage cluster |
| `shivananda-lahari-excerpt.json` | Shivananda Lahari Excerpt | Adi Shankara |
| `kalabhairava-ashtakam.json` | Kalabhairava Ashtakam | Bhairava cluster (only 12 deity entries) |
| `bhuvaneswari-stotram.json` | Bhuvaneswari Stotram | Dasha Mahavidya, almost zero competition |
| `tripura-sundari-pancharatnam.json` | Tripura Sundari Pancharatnam | Dasha Mahavidya |
| `jagannath-ashtakam.json`, `jagannath-pancharatnam.json` | Jagannath | Rath Yatra Jul 2026 spike |
| `ayyappa-pancharatnam.json` | Ayyappa Pancharatnam | South India traffic |
| `dakshinamurthy-pancharatnam.json` | Dakshinamurthy | Knowledge/student keyword |
| Ketu/Rahu/Mangal/Shukra/Budha/Chandra `-stotram` | Navagraha individual planets | Astrology-remedy traffic |
| `narmada-stotram.json` | Narmada Stotram | River-deity gap |
| `chardham-stotram.json` | Char Dham Stotram | Yatra pilgrimage cluster |
| `annapurna-stotram-shankaracharya.json` | Annapurna Shankara | Recipe/temple traffic |
| `ashtavinayak-stotram.json` | Ashtavinayak | Maharashtra Ganesh cluster |
| `dattatreya-pancharatnam.json` | Dattatreya | 24-deity cluster |
| `kartikeya-pancharatnam.json` | Kartikeya | South India |
| `kubera-pancharatnam.json` | Kubera | Wealth cluster |
| `shankaracharya-ashtakam.json` | Shankaracharya | Guru cluster |
| `shiva-pancharatnam.json` | Shiva Pancharatnam | Premium |
| `ganesha-hridayam`, `ganesha-mangalashtakam`, `ganesha-ashtottara-shatanamavali` | Ganesha trio | Daily-worship cluster |
| `navagraha-kavacham.json`, `navagraha-stotram-brihaspati.json` | Navagraha | Astrology |

**Fix:** add transliteration + Hindi meaning to all 37. **Estimated traffic uplift from this fix alone: high** (these pages exist but underperform vs canonical competitors who have full meaning).

---

## B. Deity coverage — primary deity counts (full)

```
143 vishnu      111 shiva       91 krishna     84 durga      38 navagraha
 37 parvati      36 lakshmi     33 hanuman     31 surya      31 ganesha
 31 rama         24 dattatreya  23 kali        21 narasimha  20 saraswati
 18 kartikeya    15 shani       12 bhairava    11 dhanvantari 11 kubera
 10 ayyappa      10 ganga       10 jagannath    9 brahma      9 vitthal
  9 gayatri       9 sita         9 radha        9 saibaba     8 agni
  8 indra         7 vayu
```

### Underweight deity buckets (≤25, traffic gold pending validation)

- **Brahma (9)** — Tertiary Trimurti, but: Brahma Sahasranama, Brahma Kavacham, Brahma Stuti from Bhavishya Purana, Brahma Stotra by Markandeya
- **Vitthal/Pandurang (9)** — Pandharpur cluster: Vitthal Ashtakam, Pandurang Ashtakam, Abhang Sangrah, Vitthal Pancharatnam
- **Sita (9), Radha (9)** — Female-deity gap; Sita Chalisa, Sita Ram Stuti, Radha Kripa Kataksha, Radha Sahasranama, Radha Krishna Yugal Stuti
- **Sai Baba (9)** — Shirdi Sai cluster: Sai Sat Charitra excerpts (each chapter), Sai Baba Vishnu Sahasranamavali
- **Ayyappa (10)** — Mandala season Nov-Jan: Ayyappa Sahasranama, Harivarasanam variants, Ayyappa Suprabhatam
- **Ganga (10)** — Ganga Stuti, Ganga Sahasranama, Ganga Lahari (Pt Jagannath)
- **Jagannath (10)** — Rath Yatra Jul 2026: Jagannath Sahasranama, Jagannath Stotra (Adi Shankara)
- **Dhanvantari (11)** — Health-keyword cluster: Dhanvantari Mantra variants, Dhanvantari Kavacham
- **Kubera (11)** — Wealth: Kubera Sahasranama, Kubera Yantra Stotra, Vaishravana Stuti
- **Bhairava (12)** — Tantric: Batuk Bhairava Stotra, Svarna Akarshana Bhairava, Aapaduddharaka Bhairava Stotra
- **Kartikeya (18)** — South India massive: Subrahmanya Bhujangam (Adi Shankara), Skanda Sashti Kavacham (Tamil ritual), Subrahmanya Sahasranama, Murugan Pancharatnam
- **Saraswati (20)** — Education keyword: Saraswati Sahasranama, Saraswati Kavacham, Maa Saraswati Vandana variants

### Deities currently ONLY as secondary (taxonomy upgrade candidates)

`lakshmana(8)`, `rukmini(6)`, `yama(4)`, `subhadra(3)`, `nandi(3)`, `prahlada(3)`, `mangal(3)`, `narayana(2)`, `varuna(2)`, `yashoda(2)`, `savitri(2)`, `lalita(2)`, `bhudevi(2)`, `tara(1)`, `garuda(1)`, `agastya(1)`

→ These need primary stotras created. Lakshmana, Rukmini, Lalita Tripurasundari, Bhudevi, Tara (Dasha Mahavidya) and Garuda each have famous canonical stotras.

---

## C. Festival coverage — gaps for May 2026 → Apr 2027

| Festival | 2026 date (approx) | Site coverage | Action |
|---|---|---|---|
| **Buddha Purnima** | May 31, 2026 | partial (`purnima` general) | Tag-add + create Buddha Stotram |
| **Vat Savitri Vrat** | May 19, 2026 | **ONLY 2** | Critical gap — Savitri Stuti, Vat Savitri Katha, Savitri Ashtakam |
| **Nirjala Ekadashi** | June 7, 2026 | **ONLY 2** | Add Bhima-related Vishnu stotras, Nirjala Vrat Katha |
| **Ganga Dussehra** | June 4, 2026 | 7 | Add Ganga Sahasranama, Ganga Lahari |
| **Jagannath Rath Yatra** | July 16, 2026 | 10 (`rath-yatra`) | Tag-rename, add Jagannath Sahasranama, Subhadra Stotra, Balabhadra Stuti |
| **Guru Purnima** | July 30, 2026 | 77 ✓ strong | Maintain |
| **Shravan Somvar** | Jul 27 – Aug 24 | 21 (4 Mondays) | Add Shravan Maas Mahatmya, Shiva Mahapurana excerpts |
| **Nag Panchami** | Aug 8, 2026 | 9 | Add Nagendra Stotra, Garuda Panchakshari, Manasa Devi stotras |
| **Raksha Bandhan** | Aug 28, 2026 | **ONLY 1** | Critical gap — Yamuna Stuti (sister deity), Subhadra Stotra |
| **Krishna Janmashtami** | Sept 4, 2026 | 98 ✓ strong | Maintain |
| **Hartalika Teej** | Sept 14, 2026 | 6 | Add Hartalika Vrat Katha, Parvati Stuti variants |
| **Ganesh Chaturthi** | Sept 14, 2026 | 30 ✓ | Add Ashtavinayak series, Sankashti variants |
| **Rishi Panchami** | Sept 16, 2026 | **MISSING** | Saptarshi Stotra, Vasishtha Stuti, Rishi Stotra |
| **Pitru Paksha / Shradh / Mahalaya** | Sept 17 – Oct 1 | 2 (`pitru-paksha`) only | Critical gap — Pitru Stotra, Pitru Suktam, Shradh mantras, Mahalaya Stotra |
| **Onam** | Aug 26, 2026 | **ONLY 1** | Vamana Stotra, Mahabali Stuti, Trivikrama Stotra |
| **Sharadiya Navratri** | Oct 11–19, 2026 | 147 ✓ flagship | Maintain + add Saptashati chapter pages |
| **Karwa Chauth** | Oct 30, 2026 | **MISSING** | Critical gap — Karva Chauth Vrat Katha, Gauri Stuti, Chandra Darshan mantra |
| **Ahoi Ashtami** | Nov 2, 2026 | **MISSING** | Critical gap — Ahoi Ashtami Vrat Katha, Mata Ashtami stotra |
| **Dhanteras** | Nov 7, 2026 | 30 ✓ + Dhanvantari (11) | Add Kubera/Lakshmi pairings |
| **Diwali / Lakshmi Puja** | Nov 8, 2026 | 80 ✓ flagship | Add Mahalakshmi Sahasranama if missing |
| **Govardhan Puja** | Nov 9, 2026 | 9 | Add Govardhan Ashtakam, Giriraj Stuti |
| **Bhai Dooj** | Nov 10, 2026 | **MISSING** | Critical gap — Yamuna Stotra, Bhai Dooj Katha, Yama Dwitiya |
| **Tulsi Vivah** | Nov 14, 2026 | 6 | Tulsi Stotra (Brahma Vaivarta), Tulsi Chalisa, Salagram Stotra |
| **Kartik Purnima / Dev Deepawali** | Nov 24, 2026 | 15 + 2 | Maintain |
| **Datta Jayanti** | Dec 14, 2026 | 17 | Already strong |
| **Mokshada / Vaikuntha Ekadashi** | Dec 19, 2026 | 35 | Maintain |
| **Makar Sankranti / Pongal** | Jan 14, 2027 | 29 | Add Pongal-specific Surya stotras, Tamil-context pages |

---

## D. Source-text coverage — under-mined Puranas

| Source | Count | Likely under-mined? |
|---|---|---|
| Skanda Purana | 48 | well-mined |
| Shiva Purana | 39 | well-mined |
| Adi Shankaracharya | 39 | well-mined |
| Rigveda | 23 | UNDER — has 1000+ Suktas, room for 30–50 more |
| Bhagavad Gita | 22 | full chapters covered separately |
| Markandeya Purana | 14 | UNDER — Devi Mahatmya alone has more excerpts |
| Padma Purana | 14 | UNDER — huge text, room for 20+ more |
| Brahmanda Purana | 12 | UNDER (Lalita Sahasranama context) |
| Vishnu Purana | 11 | UNDER — Prahlada stutis, Dhruva stuti, etc. |
| Devi Bhagavata Purana | 10 | UNDER — primary Tantric Shakta source |
| Kalika Purana | 8 | UNDER (Tantric Shakta) |
| Brahmavaivarta Purana | 7 | UNDER (Krishna/Radha primary source) |
| Valmiki Ramayana | 6 | UNDER — many stutis (Mandodari, Sita, Lakshmana) not yet pulled |
| Tantrasara | 8 | UNDER (Shakta tantric collection) |

**Missing or barely-touched canonical texts:**
- Garuda Purana
- Agni Purana
- Linga Purana
- Vamana Purana
- Matsya Purana
- Yajurveda (Sukla & Krishna)
- Atharvaveda Suktas
- Samaveda
- Mahanirvana Tantra
- Lalita Sahasranama Bhashya stotras
- Kularnava Tantra (advanced — caution on quality)
- Devi Khadgamala Stotram (already? needs check)
- Stotra Ratnam by Yamunacharya (Sri Vaishnava)
- Andal's Tiruppavai (1 copy, Tamil ritual major text — needs full 30 verses)
- Nalayira Divya Prabandham excerpts (Sri Vaishnava)
- Bhakti Yoga texts: Narada Bhakti Sutra, Shandilya Bhakti Sutra

---

## E. Purpose taxonomy fragmentation (SEO problem)

Multiple slugs for the same intent dilute internal-linking. Consolidate before adding new content:

| Concept | Fragments | Consolidate to |
|---|---|---|
| Obstacle removal | `removal-of-obstacles`(151), `obstacle-removal`(20), `removal-of-evil`(1) | `removal-of-obstacles` |
| Liberation | `moksha`(84), `liberation`(85) | `moksha` (Sanskrit canonical) |
| Wealth/prosperity | `wealth`(127), `prosperity`(156), `abundance`(4), `business`(5), `business-success`(2), `removal-of-poverty`(1), `debt-removal`(4), `debt-relief`(4), `debt-freedom`(1) | `wealth` + `debt-removal` (split) |
| Marriage | `marriage`(35), `marital-bliss`(5), `marital-harmony`(19), `saubhagya`(18), `family-happiness`(7), `family-harmony`(16), `marriage`(separate from saubhagya?) | `marital-harmony` + `saubhagya` (kept distinct) |
| Sin removal | `sin-removal`(24), `removal-of-sins`(4), `purification`(33) | `purification` (umbrella) |
| Health | `health`(211), `healing`(17), `removal-of-diseases`(1), `mental-health`(3) | `health` (umbrella) + `mental-peace`(20) for mind |
| Children | `children`(35), `children-welfare`(1), `protection-of-children`(1), `pregnancy`(1), `fertility`(1) | `children` umbrella + `fertility` distinct |
| Fear/courage | `fear-removal`(51), `fearlessness`(22), `courage`(50) | `courage` + `fear-removal` distinct |
| Enemy | `enemy-removal`(12), `removal-of-enemies`(2), `enemy-protection`(8), `victory`(37) | `enemy-removal` |
| Knowledge/wisdom | `knowledge`(191), `wisdom`(39), `education`(31) | `knowledge` umbrella |
| Daily prayer | `daily-prayer`(1), `daily-worship`(4), `morning-prayer`(2), `worship`(31) | `daily-worship` |

**Estimated impact:** consolidating these alone will likely lift 50–100 existing pages by tightening topical authority signals.

---

## F. Verse-count distribution
- 596 stotras: 1–10 verses (snackable)
- 263 stotras: 11–30 verses (standard)
- 47 stotras: 31–100 verses
- 22 stotras: 101–500 verses (long-form: Sahasranamas, Saptashati chapters)
- 0 stotras: 500+ verses

Healthy pyramid. Sahasranamas (1000-name texts) are properly excerpted.

---

## G. Festival-tag bugs found (existing files mis-tagged or untagged)

These are content we ALREADY have but is invisible to filtered browsing / wrong taxonomy signals:

| File | Current festivals tag | Issue | Fix |
|---|---|---|---|
| `ahoi-ashtami-vrat-katha.json` | `['diwali']` | Missing `ahoi-ashtami` tag | Add `ahoi-ashtami` |
| `guruvar-vrat-katha.json` | `[]` | Empty festivals on a major weekday katha | Add `guru-purnima`, `vaikuntha-ekadashi` |
| `mangalvar-vrat-katha.json` | `['hanuman-jayanti']` | Missing Tuesday festivals | Add `sankashti-chaturthi`, `mangal-jayanti` |
| `karva-chauth-vrat-katha.json` | `['karva-chauth']` | Spelling: `karwa` is more searched | Add alias `karwa-chauth` OR redirect-rename |
| `karva-chauth-stotram.json` | `['karva-chauth']` | Same spelling issue | Same |

**Spelling normalization needed across taxonomy:** `karva` ↔ `karwa`, `vijayadashami` ↔ `vijaya-dashami`, `basant` ↔ `vasant`, `naga` ↔ `nag`. Either pick a canonical and 301 the alias OR support both via `aliases` array in taxonomy schema.

---

## H. Genuinely-missing seasonal content (verified after tag-bug correction)

| Festival | Date 2026 | Site coverage | Status |
|---|---|---|---|
| Karva/Karwa Chauth | Oct 30 | Katha + Stotram exist | ✓ COVERED (just spelling) |
| Ahoi Ashtami | Nov 2 | Katha exists, mis-tagged | ✓ COVERED (tag fix) |
| **Bhai Dooj / Yama Dwitiya** | Nov 10 | **0 files** | ❌ MISSING — Yamuna Stotra, Bhai Dooj Katha needed |
| **Rishi Panchami** | Sept 16 | 0 files | ❌ MISSING — Saptarshi Stotra, Rishi Vrat Katha |
| Pitru Paksha | Sept 17 – Oct 1 | 2 stotras (general) | ⚠️ THIN — Pitru Suktam, Pitru Stotra, Mahalaya needed |
| Onam | Aug 26 | 1 file | ⚠️ THIN — Vamana, Mahabali, Trivikrama stotras needed |
| Raksha Bandhan | Aug 28 | 1 file | ⚠️ THIN — Yamuna Stotra, sister-deity content |

---

## Summary: Phase 1 actions BEFORE adding new content

1. **Fill the 37 thin entries** with transliteration + Hindi meaning — pure SEO gain, no new pages
2. **Consolidate purpose taxonomy** — 10 merge operations, lifts existing 928
3. **Fix festival-tag bugs** (ahoi-ashtami, guruvar, mangalvar, spelling normalizations) — pure SEO gain, no new pages
4. **Tag-rename festival aliases** (`rath-yatra` → `jagannath-rath-yatra` etc.) for entity clarity
5. **Promote 16 secondary deities to primary** where canonical stotras exist (Lakshmana, Rukmini, Lalita, Bhudevi, Garuda, etc.)

These five are **prerequisites to a clean expansion** — without them, new pages will inherit the existing taxonomy noise.
