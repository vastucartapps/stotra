import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { buildUpcoming, formatFestivalDate, KEY_TO_FESTIVAL } from "./festival-calendar.ts";
import { FESTIVALS } from "../data/festivals.ts";

// Shape of the astroengine GET /api/v1/panchang/festivals response (see astroengine/jyotish_core/panchang/festivals.py).
const raw = {
  festivals: [
    { key: "navratri_start", name: "Sharad Navratri", name_hindi: "शारदीय नवरात्रि", date_standard: "2026-10-11" },
    { key: "dussehra", name: "Dussehra", name_hindi: "दशहरा", date_standard: "2026-10-20" },
    { key: "diwali", name: "Diwali", name_hindi: "दीवाली", date_standard: "2026-11-08" },
    { key: "pongal", name: "Pongal", name_hindi: "पोंगल", date_standard: "2026-10-25" }, // not a stotra festival here
    { key: "ekadashi_kartik_shukla", name: "Dev Uthani Ekadashi", name_hindi: "देवउठनी एकादशी", date_standard: "2026-11-20", date_vaishnav: "2026-11-21" },
    { key: "holi", name: "Holi", name_hindi: "होली", date_standard: "2026-09-01" }, // already past
    { key: "bad", name: "No date" },
  ],
};

test("only upcoming festivals that map to a stotra festival, sorted by date, no invented dates", () => {
  const rows = buildUpcoming(raw, "2026-10-11", 10);
  assert.deepEqual(rows.map((r) => r.date), ["2026-10-11", "2026-10-20", "2026-11-08", "2026-11-20"]);
  assert.deepEqual(rows.map((r) => r.festivalId), ["navratri", "dussehra", "diwali", "ekadashi"]);
  assert.equal(rows[3].vaishnavDate, "2026-11-21");
  assert.equal(rows[0].vaishnavDate, undefined);
});

test("limit applies and garbage input gives an empty list", () => {
  assert.equal(buildUpcoming(raw, "2026-10-11", 2).length, 2);
  for (const bad of [null, undefined, 5, "x", {}, { festivals: "no" }]) assert.deepEqual(buildUpcoming(bad, "2026-10-11", 5), []);
});

test("every mapped festival id exists in the site data", () => {
  const ids = new Set(FESTIVALS.map((f) => f.id));
  for (const [k, id] of Object.entries(KEY_TO_FESTIVAL)) assert.ok(ids.has(id), `${k} -> ${id}`);
});

test("date formatting is timezone-proof", () => {
  assert.equal(formatFestivalDate("2026-10-20"), "Tue, 20 Oct 2026");
  assert.equal(formatFestivalDate("2026-01-01"), "Thu, 1 Jan 2026");
});

test("festival hub page wires in the calendar and the page descriptions fit", () => {
  const code = readFileSync("src/app/festival/page.tsx", "utf8");
  assert.match(code, /getUpcomingFestivals/);
  const desc = /const PAGE_DESC =\s*\n?\s*"([^"]+)"/.exec(code)![1];
  assert.ok(desc.length <= 160, `${desc.length}`);
  const title = /title: "([^"]+)"/.exec(code)![1];
  assert.ok(title.length <= 70, title);
});
