import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// Static hub pages whose titles/descriptions were over what Google shows
// (found by the sitemap health crawl, tools/check_sitemap_health.py).
const src = (p: string) => readFileSync(p, "utf8");
const str = (code: string, re: RegExp): string => {
  const m = re.exec(code);
  assert.ok(m, `pattern not found: ${re}`);
  return m[1];
};

test("stotra home description fits (930 stotras)", () => {
  const tpl = str(src("src/app/page.tsx"), /const description = `([^`]+)`/);
  const d = tpl.replace("${count}", "930");
  assert.ok(d.length <= 160, `${d.length}: ${d}`);
});

test("vrat-katha description fits", () => {
  const d = str(src("src/app/vrat-katha/page.tsx"), /description:\s*\n?\s*"([^"]+)",\n\s*alternates/);
  assert.ok(d.length <= 160, `${d.length}: ${d}`);
});

test("editorial-process description fits", () => {
  const d = str(src("src/app/editorial-process/page.tsx"), /description:\s*\n?\s*"([^"]+)",\n\s*alternates/);
  assert.ok(d.length <= 160, `${d.length}: ${d}`);
});

test("mantra hub title and description fit", () => {
  const code = src("src/app/mantra/page.tsx");
  const title = str(code, /const PAGE_TITLE = "([^"]+)"/);
  const desc = str(code, /const PAGE_DESC =\s*\n?\s*"([^"]+)"/);
  assert.ok(`${title} | Stotra by VastuCart`.length <= 70, `${title.length}: ${title}`);
  assert.ok(desc.length <= 160, `${desc.length}: ${desc}`);
});

test("mantra axis pages do not append the brand and stay within 70 characters in the worst case", () => {
  const code = src("src/app/mantra/[axis]/page.tsx");
  assert.doesNotMatch(code, /title: \{ absolute: `\$\{title\} \| Stotra by VastuCart` \}/);
  const tpl = str(code, /const title = `([^`]+)`/);
  const worst = tpl.replace("${meta.label}", "Nakshatra (Birth Star)").replace("${items.length}", "27");
  assert.ok(worst.length <= 70, `${worst.length}: ${worst}`);
  const dtpl = str(code, /const description = `([^`]+)`/);
  const d = dtpl.replace("${meta.blurb}", "Bija & Gayatri mantras for the nine planets and more here").replace("${items.length}", "27");
  assert.ok(d.length <= 160, `${d.length}: ${d}`);
});
