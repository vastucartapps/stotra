import fs from "fs";
const dir = "src/data/stotras";
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));

function clean(s) {
  if (typeof s !== "string") return s;
  let t = s;
  t = t.replace(/Vibrant Gujarat/g, "VG"); // protect proper noun
  t = t.replace(/\bserves as an\b/g, "works as an").replace(/\bServes as an\b/g, "Works as an");
  t = t.replace(/\bserves as a\b/g, "works as a").replace(/\bServes as a\b/g, "Works as a");
  t = t.replace(/\bunlock the\b/g, "release the").replace(/\bUnlock the\b/g, "Release the");
  t = t.replace(/\brealm of\b/g, "world of").replace(/\bRealm of\b/g, "World of");
  t = t.replace(/\bfirst and foremost\b/g, "foremost").replace(/\bFirst and foremost\b/g, "Foremost");
  t = t.replace(/\btestament to\b/g, "a mark of").replace(/\bTestament to\b/g, "A mark of");
  t = t.replace(/\brich tradition\b/g, "long tradition").replace(/\bRich tradition\b/g, "Long tradition");
  t = t.replace(/\bvibrant practice\b/g, "living practice");
  t = t.replace(/\bvibrant\b/g, "living").replace(/\bVibrant\b/g, "Living");
  t = t.replace(/VG/g, "Vibrant Gujarat"); // restore
  return t;
}

let touched = 0;
for (const f of files) {
  const p = dir + "/" + f;
  const j = JSON.parse(fs.readFileSync(p, "utf8"));
  const before = JSON.stringify(j);
  if (j.description) j.description = clean(j.description);
  if (Array.isArray(j.benefits)) j.benefits = j.benefits.map(clean);
  if (Array.isArray(j.seoFaqs)) j.seoFaqs = j.seoFaqs.map((q) => ({ question: clean(q.question), answer: clean(q.answer) }));
  if (JSON.stringify(j) !== before) { j.updatedAt = "2026-06-01"; fs.writeFileSync(p, JSON.stringify(j, null, 2) + "\n"); touched++; }
}
console.log("files_touched=" + touched);
