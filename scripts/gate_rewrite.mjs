import fs from "fs";
const dir = "src/data/stotras";
const reportPath = process.argv[2] || "reports/rewrite-calib.json";
const out = JSON.parse(fs.readFileSync(reportPath,"utf8"));
const allFacts = JSON.parse(fs.readFileSync("/tmp/rewrite_all.json","utf8"));
const factBySlug = Object.fromEntries(allFacts.map(f=>[f.slug,f]));

const BANNED=["delve","tapestry","treasure trove","realm of","testament to","navigate the","rich history","rich tradition","plays a crucial role","plays a vital role","plays a key role","it is important to note","it is worth noting","serves as a","stands as a","when it comes to","in conclusion","moreover","furthermore","first and foremost","nestled","bustling","unlock the","embark on","a beacon of"];
const PROPER=["vibrant gujarat"];
function sentences(t){return (t||"").split(/(?<=[.!?])\s+/).map(s=>s.trim()).filter(Boolean);}
function skeleton(s){return s.replace(/"[^"]*"/g,"#Q").replace(/[ऀ-ॿ]+/g,"#D").replace(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*/g,"#N").replace(/\d+/g,"#").replace(/[^a-z #]/gi," ").replace(/\s+/g," ").trim().toLowerCase();}
function words(t){return (t||"").split(/\s+/).filter(Boolean);}
function stdev(xs){if(xs.length<2)return 0;const m=xs.reduce((a,b)=>a+b,0)/xs.length;return Math.sqrt(xs.reduce((a,b)=>a+(b-m)**2,0)/xs.length);}
const numWord=/\b(zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|thousand)\b/i;

const problems=[]; const skels={};
let n=0;
for(const [slug,desc] of Object.entries(out)){
  n++;
  const f=factBySlug[slug];
  if(!f){problems.push(`${slug}: NOT in affected set`);continue;}
  // 1. Devanagari name byte-verify: every Devanagari char-run in nameDev must be present verbatim
  const nameDevRuns=(f.nameDev.match(/[ऀ-ॿ]+/g)||[]);
  for(const run of nameDevRuns){ if(!desc.includes(run)) problems.push(`${slug}: DEVANAGARI missing/altered "${run}"`); }
  // reject any Devanagari char NOT from nameDev (stray homoglyph/corruption)
  const descDev=(desc.match(/[ऀ-ॿ]+/g)||[]);
  const allowed=new Set(nameDevRuns);
  for(const run of descDev){ if(!allowed.has(run)) problems.push(`${slug}: STRAY Devanagari "${run}" (not in nameDev)`); }
  // 2. source: at least one CITABLE source token must survive. Skip generic
  // labels (no real text to cite) and verb/structural words.
  const SRC_STOP=new Set(["composed","traditional","literature","tradition","sanskrit","stotra","stotram","text","various","sources","unknown","classical","hindu","puranic","vedic","tantric","devotional","collection","compilation","vaishnava","shaiva","shakta","smarta","prayer","hymn","mantra","vaishnavite","shaivite","parampara","bhakti","hymns","sangrah","sangraha","dharma","shastra","navdurga","navadurga","stotras","song","aarti","saint","folk","modern","popular","sampradaya","chalisa","chalis","ashtakam","kavacham","suktam","gayatri"]);
  const SRC_ALIAS={bhagavad:"gita",adi:"shankaracharya"}; // accept these surrogates
  const srcToks=(f.source||"").replace(/[()\-]/g," ").split(/\s+/).map(w=>w.toLowerCase()).filter(w=>w.length>3 && !SRC_STOP.has(w));
  if(srcToks.length){
    const low0=desc.toLowerCase();
    const survived=srcToks.some(t=>low0.includes(t)||(SRC_ALIAS[t]&&low0.includes(SRC_ALIAS[t]))||(t.length>=6&&low0.includes(t.slice(0,5))));
    if(!survived) problems.push(`${slug}: SOURCE dropped (none of [${srcToks.join(", ")}] present)`);
  }
  // 3. verse count present (digit or word) — skip if generic
  const vc=f.verseCount;
  if(vc && vc>1){ const hasDigit=new RegExp(`\\b${vc}\\b`).test(desc); const hasWord=numWord.test(desc);
    if(!hasDigit && !hasWord) problems.push(`${slug}: VERSECOUNT ${vc} not surfaced`); }
  // 4. banned phrases
  let low=desc.toLowerCase(); for(const pn of PROPER) low=low.split(pn).join("◆");
  for(const b of BANNED) if(low.includes(b)) problems.push(`${slug}: BANNED "${b}"`);
  // 5. length sanity
  const wc=words(desc).length; if(wc<70) problems.push(`${slug}: TOO SHORT (${wc}w)`); if(wc>180) problems.push(`${slug}: TOO LONG (${wc}w)`);
  // 6. burstiness
  const lens=sentences(desc).map(s=>words(s).length);
  if(lens.length>=3 && stdev(lens)<3.5) problems.push(`${slug}: LOW BURSTINESS (sd=${stdev(lens).toFixed(1)})`);
  // collect opening skeleton
  const sk=skeleton(sentences(desc)[0]||""); (skels[sk]=skels[sk]||[]).push(slug);
}
// 7. internal skeleton collisions within this batch
for(const [sk,slugs] of Object.entries(skels)) if(slugs.length>1) problems.push(`SKELETON COLLISION x${slugs.length}: "${sk.slice(0,50)}" -> ${slugs.join(", ")}`);

console.log(`GATED ${n} rewrites from ${reportPath}`);
console.log(`distinct_opening_skeletons=${Object.keys(skels).length}/${n}`);
console.log(`PROBLEMS=${problems.length}`);
problems.forEach(p=>console.log("  ✗ "+p));
process.exit(problems.length?1:0);
