import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { filterStotras as searchStotras, parseSearchParams, SEARCH_PAGE_SIZE } from "./stotra-search.ts";

const DEITY_IDS = ["shiva", "hanuman", "ganesha"] as const;

const mk = (over: Record<string, unknown>) =>
  ({
    slug: "s", title: "शीर्षक", titleEn: "Title", deity: "shiva", secondaryDeities: [],
    seoDescription: "desc", devanagariText: "ॐ नमः शिवाय", verseCount: 1, readingTimeMinutes: 1,
    ...over,
  }) as never;

const ALL = [
  mk({ slug: "a", titleEn: "Shiv Tandav Stotram", deity: "shiva" }),
  mk({ slug: "b", titleEn: "Hanuman Chalisa", title: "हनुमान चालीसा", deity: "hanuman", devanagariText: "जय हनुमान ज्ञान गुन सागर" }),
  mk({ slug: "c", titleEn: "Ganesh Atharvashirsha", deity: "ganesha", secondaryDeities: ["shiva"], seoDescription: "Remove obstacles" }),
];

test("empty query returns everything, as the old client filter did", () => {
  assert.equal(searchStotras(ALL, "", "").length, 3);
});

test("matches titleEn, deity, seoDescription and Devanagari body, case-insensitively", () => {
  assert.deepEqual(searchStotras(ALL, "  TANDAV ", "").map((s) => s.slug), ["a"]);
  assert.deepEqual(searchStotras(ALL, "hanuman", "").map((s) => s.slug), ["b"]);
  assert.deepEqual(searchStotras(ALL, "obstacles", "").map((s) => s.slug), ["c"]);
  assert.deepEqual(searchStotras(ALL, "ज्ञान गुन", "").map((s) => s.slug), ["b"]);
});

test("deity filter includes secondary deities", () => {
  assert.deepEqual(searchStotras(ALL, "", "shiva").map((s) => s.slug), ["a", "c"]);
});

test("the search route only ever returns card summaries, never full texts", () => {
  const src = readFileSync("src/app/api/search/route.ts", "utf8");
  assert.match(src, /toStotraCard/);
  assert.doesNotMatch(src, /devanagariText|transliteration/);
});

test("the search page no longer receives full stotra objects", () => {
  const page = readFileSync("src/app/search/page.tsx", "utf8");
  assert.doesNotMatch(page, /stotras=\{allStotras\}/);
  assert.doesNotMatch(readFileSync("src/components/pages/SearchPage.tsx", "utf8"), /Stotra\[\]/);
});

test("parseSearchParams bounds and validates untrusted input", () => {
  const p = parseSearchParams(new URLSearchParams({ q: "x".repeat(500), deity: "<script>", offset: "-5", limit: "99999" }), DEITY_IDS);
  assert.equal(p.q.length, 100);
  assert.equal(p.deity, "");
  assert.equal(p.offset, 0);
  assert.equal(p.limit, SEARCH_PAGE_SIZE);
  assert.equal(parseSearchParams(new URLSearchParams({ deity: "shiva", offset: "48" }), DEITY_IDS).deity, "shiva");
  assert.equal(parseSearchParams(new URLSearchParams({ offset: "48" }), DEITY_IDS).offset, 48);
});

test("search and the navbar never prefetch the heavy /search route", () => {
  for (const f of ["src/components/layout/Navbar.tsx", "src/app/stotra/page.tsx"]) {
    const src = readFileSync(f, "utf8");
    const link = src.match(/<Link\s+href="\/search"[\s\S]*?>/);
    assert.ok(link, `${f} has a /search link`);
    assert.match(link[0], /prefetch=\{false\}/, `${f} must not prefetch /search`);
  }
});

test("the sitemap does not list /search, which is noindex (a sitemap must only list indexable pages)", () => {
  const sitemap = readFileSync("src/app/sitemap-static.xml/route.ts", "utf8");
  const page = readFileSync("src/app/search/page.tsx", "utf8");
  assert.match(page, /robots: \{ index: false/);
  assert.doesNotMatch(sitemap, /\/search`/);
});
