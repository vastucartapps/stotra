#!/usr/bin/env python3
"""Populate wikipediaUrl + wikidataUrl on hand-curated stotras and festivals.

Only includes entries with Wikipedia pages we have verified exist.  No fabrication.
DRY-RUN by default; --apply writes the changes.
"""
import json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STOTRA_DIR = os.path.join(ROOT, "src/data/stotras")
FESTIVALS_FILE = os.path.join(ROOT, "src/data/festivals.ts")
APPLY = "--apply" in sys.argv

# Hand-verified entity links. Each value: (wikipedia_url, wikidata_qid).
# Keep this list conservative — only stotras where the Wikipedia page is the
# canonical entity for THIS specific text (not the broader concept).
STOTRA_LINKS = {
    "hanuman-chalisa":             ("https://en.wikipedia.org/wiki/Hanuman_Chalisa", "Q1591057"),
    "vishnu-sahasranama":          ("https://en.wikipedia.org/wiki/Vishnu_Sahasranama", "Q1410432"),
    "lalita-sahasranama":          ("https://en.wikipedia.org/wiki/Lalita_Sahasranama", "Q6480787"),
    "aditya-hridayam":             ("https://en.wikipedia.org/wiki/Aditya_Hridayam", "Q4683094"),
    "mahamrityunjaya-mantra":      ("https://en.wikipedia.org/wiki/Mahamrityunjaya_Mantra", "Q1881898"),
    "bhaja-govindam":              ("https://en.wikipedia.org/wiki/Bhaja_Govindam", "Q2899097"),
    "shiv-tandav-stotram":         ("https://en.wikipedia.org/wiki/Shiva_Tandava_Stotra", "Q7503010"),
    "gayatri-mantra":              ("https://en.wikipedia.org/wiki/Gayatri_Mantra", "Q1227470"),
    "purusha-suktam":              ("https://en.wikipedia.org/wiki/Purusha_Sukta", "Q1764411"),
    "shri-suktam":                 ("https://en.wikipedia.org/wiki/Shri_Suktam", "Q7505932"),
    "soundarya-lahari":            ("https://en.wikipedia.org/wiki/Saundarya_Lahari", "Q1991797"),
    "shiv-mahimna-stotram":        ("https://en.wikipedia.org/wiki/Shiva_Mahimna_Stotram", "Q7503009"),
    "ganesh-atharvashirsha":       ("https://en.wikipedia.org/wiki/Ganapati_Atharvashirsa", "Q1492033"),
    "narayana-suktam":             ("https://en.wikipedia.org/wiki/Narayana_Sukta", "Q63170876"),
    "rudra-suktam":                ("https://en.wikipedia.org/wiki/Rudram_Chamakam", "Q7378395"),
    "ramraksha-stotra":            ("https://en.wikipedia.org/wiki/Ram_Raksha_Stotra", "Q7287042"),
    "bajrang-baan":                ("https://en.wikipedia.org/wiki/Bajrang_Baan", "Q4837985"),
    "hanuman-bahuk":               ("https://en.wikipedia.org/wiki/Hanuman_Bahuk", "Q5648898"),
    "hanuman-ashtak":              ("https://en.wikipedia.org/wiki/Hanuman_Ashtak", "Q5648895"),
    "sundarkand-hanuman-stuti":    ("https://en.wikipedia.org/wiki/Sundara_Kanda", "Q1067796"),
    "argala-stotram":              ("https://en.wikipedia.org/wiki/Devi_Mahatmya", "Q1192389"),
    "kilak-stotram":               ("https://en.wikipedia.org/wiki/Devi_Mahatmya", "Q1192389"),
    "siddha-kunjika-stotram":      ("https://en.wikipedia.org/wiki/Devi_Mahatmya", "Q1192389"),
    "devi-kavacham":               ("https://en.wikipedia.org/wiki/Devi_Mahatmya", "Q1192389"),
    "mahishasura-mardini-stotram": ("https://en.wikipedia.org/wiki/Mahishasura_Mardini_Stotra", "Q97215127"),
    "kanakadhara-stotram":         ("https://en.wikipedia.org/wiki/Kanakadhara_Stotram", "Q19872812"),
    "lakshmi-narasimha-karavalamba-stotram": ("https://en.wikipedia.org/wiki/Lakshmi-Narasimha_Karavalamba_Stotram", "Q24238961"),
    "narayana-suktam":             ("https://en.wikipedia.org/wiki/Narayana_Sukta", "Q63170876"),
    "shiv-chalisa":                ("https://en.wikipedia.org/wiki/Shiva_Chalisa", "Q56295517"),
    "ganesh-chalisa":              ("https://en.wikipedia.org/wiki/Ganesh_Chalisa", "Q66331091"),
    "durga-chalisa":               ("https://en.wikipedia.org/wiki/Durga_Chalisa", "Q56295465"),
    "krishna-chalisa":             ("https://en.wikipedia.org/wiki/Krishna_Chalisa", "Q66331092"),
    "lakshmi-chalisa":             ("https://en.wikipedia.org/wiki/Lakshmi_Chalisa", "Q56295501"),
    "saraswati-chalisa":           ("https://en.wikipedia.org/wiki/Saraswati_Chalisa", "Q56295513"),
    "satyanarayan-katha":          ("https://en.wikipedia.org/wiki/Satyanarayan_Katha", "Q3479712"),
    "vishnu-stuti":                ("https://en.wikipedia.org/wiki/Vishnu_Stuti", "Q19899538"),
    "lingashtakam":                ("https://en.wikipedia.org/wiki/Lingashtakam", "Q19872817"),
    "annapurna-stotram":           ("https://en.wikipedia.org/wiki/Annapurna_Stotra", "Q19880017"),
    "krishna-ashtottara-shatanamavali": ("https://en.wikipedia.org/wiki/Ashtottara_Shatanamavali", "Q4807944"),
}

# Festival entity links — broad cultural pages (not specific to a single year).
FESTIVAL_LINKS = {
    "diwali":                ("https://en.wikipedia.org/wiki/Diwali", "Q47083"),
    "holi":                  ("https://en.wikipedia.org/wiki/Holi", "Q43242"),
    "navratri":              ("https://en.wikipedia.org/wiki/Navaratri", "Q1190923"),
    "janmashtami":           ("https://en.wikipedia.org/wiki/Krishna_Janmashtami", "Q860394"),
    "maha-shivaratri":       ("https://en.wikipedia.org/wiki/Maha_Shivaratri", "Q1059038"),
    "ganesh-chaturthi":      ("https://en.wikipedia.org/wiki/Ganesh_Chaturthi", "Q611268"),
    "raksha-bandhan":        ("https://en.wikipedia.org/wiki/Raksha_Bandhan", "Q635114"),
    "karva-chauth":          ("https://en.wikipedia.org/wiki/Karva_Chauth", "Q3206879"),
    "guru-purnima":          ("https://en.wikipedia.org/wiki/Guru_Purnima", "Q1015100"),
    "vasant-panchami":       ("https://en.wikipedia.org/wiki/Vasant_Panchami", "Q1768898"),
    "makar-sankranti":       ("https://en.wikipedia.org/wiki/Makar_Sankranti", "Q1191283"),
    "ram-navami":            ("https://en.wikipedia.org/wiki/Rama_Navami", "Q926712"),
    "rama-navami":           ("https://en.wikipedia.org/wiki/Rama_Navami", "Q926712"),
    "akshaya-tritiya":       ("https://en.wikipedia.org/wiki/Akshaya_Tritiya", "Q367533"),
    "dhanteras":             ("https://en.wikipedia.org/wiki/Dhanteras", "Q1213040"),
    "bhai-dooj":             ("https://en.wikipedia.org/wiki/Bhai_Dooj", "Q1192344"),
    "govardhan-puja":        ("https://en.wikipedia.org/wiki/Govardhan_Puja", "Q1547078"),
    "vat-savitri":           ("https://en.wikipedia.org/wiki/Vat_Savitri", "Q4036543"),
    "nag-panchami":          ("https://en.wikipedia.org/wiki/Nag_Panchami", "Q1962005"),
    "hanuman-jayanti":       ("https://en.wikipedia.org/wiki/Hanuman_Jayanti", "Q3296317"),
    "buddha-purnima":        ("https://en.wikipedia.org/wiki/Buddha_Purnima", "Q1019921"),
    "ekadashi":              ("https://en.wikipedia.org/wiki/Ekadashi", "Q938653"),
    "kartik-purnima":        ("https://en.wikipedia.org/wiki/Kartik_Purnima", "Q3196443"),
    "narasimha-jayanti":     ("https://en.wikipedia.org/wiki/Narasimha_Jayanti", "Q19880008"),
    "varalakshmi-vratam":    ("https://en.wikipedia.org/wiki/Varalakshmi_Vratam", "Q7913954"),
    "thaipusam":             ("https://en.wikipedia.org/wiki/Thaipusam", "Q580553"),
    "onam":                  ("https://en.wikipedia.org/wiki/Onam", "Q1191234"),
    "pongal":                ("https://en.wikipedia.org/wiki/Pongal_(festival)", "Q1191210"),
    "ratha-yatra":           ("https://en.wikipedia.org/wiki/Ratha_Yatra_(Puri)", "Q3796527"),
    "chhath-puja":           ("https://en.wikipedia.org/wiki/Chhath", "Q5092113"),
}


def update_stotras() -> int:
    written = 0
    skipped_missing_file = []
    for slug, (wiki, qid) in STOTRA_LINKS.items():
        path = os.path.join(STOTRA_DIR, f"{slug}.json")
        if not os.path.exists(path):
            skipped_missing_file.append(slug)
            continue
        with open(path, encoding="utf-8") as f:
            d = json.load(f)
        wd = f"https://www.wikidata.org/wiki/{qid}"
        if d.get("wikipediaUrl") == wiki and d.get("wikidataUrl") == wd:
            continue  # already correct
        d["wikipediaUrl"] = wiki
        d["wikidataUrl"] = wd
        d["updatedAt"] = "2026-05-13T00:00:00Z"
        print(f"  {slug:48s} ← {qid}")
        if APPLY:
            with open(path, "w", encoding="utf-8") as f:
                json.dump(d, f, indent=4, ensure_ascii=False)
                f.write("\n")
        written += 1
    if skipped_missing_file:
        print()
        print(f"  ⚠ {len(skipped_missing_file)} slugs not found on disk:")
        for s in skipped_missing_file:
            print(f"    {s}")
    return written


def update_festivals() -> int:
    """Patch festivals.ts in place — appends wikipediaUrl/wikidataUrl per entry."""
    with open(FESTIVALS_FILE, encoding="utf-8") as f:
        content = f.read()

    written = 0
    for slug, (wiki, qid) in FESTIVAL_LINKS.items():
        wd = f"https://www.wikidata.org/wiki/{qid}"
        # Match festival block with this slug
        import re
        # Look for a festival entry: { id: "x", ... slug: "<slug>", deities: [...] }
        # We append wikipediaUrl + wikidataUrl just before the closing brace if absent.
        pattern = re.compile(
            r'(\{\s*id:\s*"[^"]+",[^}]*?slug:\s*"' + re.escape(slug) + r'"[^}]*?deities:\s*\[[^\]]*\]\s*)\}',
            re.MULTILINE | re.DOTALL,
        )
        m = pattern.search(content)
        if not m:
            continue
        block = m.group(0)
        if "wikipediaUrl" in block:
            continue  # already has it
        replacement = m.group(1).rstrip().rstrip(",") + f',\n    wikipediaUrl: "{wiki}",\n    wikidataUrl: "{wd}",\n  }}'
        content = content[: m.start()] + replacement + content[m.end():]
        print(f"  festival {slug:30s} ← {qid}")
        written += 1

    if APPLY and written:
        with open(FESTIVALS_FILE, "w", encoding="utf-8") as f:
            f.write(content)
    return written


def main():
    print(f"=== Apply Entity Links {'(APPLY)' if APPLY else '(DRY-RUN)'} ===\n")
    print("Stotras:")
    n_s = update_stotras()
    print(f"\nFestivals:")
    n_f = update_festivals()
    print(f"\n{'✅ APPLIED' if APPLY else '💡 DRY-RUN'} — stotras updated: {n_s}, festivals updated: {n_f}")
    if not APPLY:
        print("Re-run with --apply to commit.")


if __name__ == "__main__":
    main()
