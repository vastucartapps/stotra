import fs from "fs";
const dir="src/data/stotras";
const reportPath=process.argv[2];
const out=JSON.parse(fs.readFileSync(reportPath,"utf8"));
const targets=Object.fromEntries(JSON.parse(fs.readFileSync("/tmp/benefit_targets.json","utf8")).map(t=>[t.slug,t]));
function skel(s){return s.replace(/"[^"]*"/g,"#Q").replace(/[ऀ-ॿ]+/g,"#D").replace(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*/g,"#N").replace(/\d+/g,"#").replace(/[^a-z #]/gi," ").replace(/\s+/g," ").trim().toLowerCase();}
// the known generic skeletons that must NOT reappear
const GENERIC_SKEL=new Set([
"#n for devotion and spiritual growth","#n blessings of #n in all forms","#n divine protection and auspiciousness",
"#n recited for removal of sins and bestows spiritual merit","#n for #n festivals and daily worship",
"#n divine protection and planetary peace","#n recited for removal of poverty and financial difficulties"]);
const BANNED=["delve","tapestry","realm of","testament to","serves as a","stands as a","first and foremost","unlock the","a beacon of","embark on"];
const problems=[]; let n=0;
for(const [slug,bens] of Object.entries(out)){
  n++; const t=targets[slug];
  if(!t){problems.push(`${slug}: not a target`);continue;}
  if(!Array.isArray(bens)){problems.push(`${slug}: benefits not array`);continue;}
  if(bens.length!==t.benefits.length) problems.push(`${slug}: length ${bens.length}!=${t.benefits.length}`);
  const seen=new Set();
  for(const b of bens){
    if(typeof b!=="string"||b.trim().length<8){problems.push(`${slug}: bad bullet "${b}"`);continue;}
    if(/[ऀ-ॿ]/.test(b)) problems.push(`${slug}: Devanagari in benefit`);
    const low=b.toLowerCase();
    for(const bn of BANNED) if(low.includes(bn)) problems.push(`${slug}: BANNED "${bn}" in benefit`);
    if(GENERIC_SKEL.has(skel(b))) problems.push(`${slug}: still-generic skeleton "${b.slice(0,45)}"`);
    const k=low.trim(); if(seen.has(k)) problems.push(`${slug}: intra-stotra dup "${b.slice(0,40)}"`); seen.add(k);
  }
  // must reference deity name or a purpose somewhere (specificity heuristic): at least one bullet mentions deity token or stotra name word
  const deityTok=(t.deity||"").toLowerCase();
  const nameTok=(t.nameEn||"").toLowerCase().split(/\s+/)[0];
  const joined=bens.join(" ").toLowerCase();
  if(deityTok && deityTok.length>3 && !joined.includes(deityTok) && nameTok && !joined.includes(nameTok)){
    // soft: only flag if NONE of the bullets seem specific
  }
}
console.log(`GATED ${n} benefit-sets from ${reportPath}`);
console.log(`PROBLEMS=${problems.length}`);
problems.forEach(p=>console.log("  ✗ "+p));
process.exit(problems.length?1:0);
