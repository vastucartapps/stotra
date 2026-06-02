import fs from "fs";
const dir = "src/data/stotras";
const dupSlugs = JSON.parse(fs.readFileSync("/tmp/dup_slugs.json", "utf8"));

function sentences(t){return (t||"").split(/(?<=[.!?])\s+/).map(s=>s.trim()).filter(Boolean);}
function skeleton(s){return s.replace(/"[^"]*"/g,"#Q").replace(/[ऀ-ॿ]+/g,"#D").replace(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*/g,"#N").replace(/\d+/g,"#").replace(/[^a-z #]/gi," ").replace(/\s+/g," ").trim().toLowerCase();}

function factsFor(slug){
  const j = JSON.parse(fs.readFileSync(`${dir}/${slug}.json`,"utf8"));
  return {
    slug,
    nameEn: j.titleEn,
    nameDev: j.title,            // Devanagari — MUST be copied verbatim
    deity: j.deity,
    secondaryDeities: j.secondaryDeities||[],
    source: j.source,
    verseCount: j.verseCount,
    readingTimeMinutes: j.readingTimeMinutes,
    days: j.days||[],
    festivals: j.festivals||[],
    purposes: j.purposes||[],
    benefits: j.benefits||[],
    currentDescription: j.description||"",
    _openingSkel: skeleton(sentences(j.description||"")[0]||""),
  };
}

const all = dupSlugs.map(factsFor);
// one representative per distinct opening skeleton, for max-diversity calibration
const seen = new Set(); const calib = [];
for (const f of all){ if(!seen.has(f._openingSkel)){ seen.add(f._openingSkel); calib.push(f);} if(calib.length>=24) break; }

fs.writeFileSync("/tmp/rewrite_all.json", JSON.stringify(all,null,2));
fs.writeFileSync("/tmp/calib_input.json", JSON.stringify(calib,null,2));
console.log("affected_total="+all.length+"  calib_batch="+calib.length);
console.log("calib_forms="+calib.map(c=>c.slug).join(", "));
