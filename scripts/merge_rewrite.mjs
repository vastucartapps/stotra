import fs from "fs";
import { execSync } from "child_process";
const dir = "src/data/stotras";
const reportPath = process.argv[2];
if(!reportPath){console.error("usage: merge_rewrite.mjs <report.json>");process.exit(2);}
// HARD GATE first — refuse to merge if the report doesn't pass
try { execSync(`node scripts/gate_rewrite.mjs ${reportPath}`,{stdio:"inherit"}); }
catch(e){ console.error("GATE FAILED — refusing to merge "+reportPath); process.exit(1); }
const out = JSON.parse(fs.readFileSync(reportPath,"utf8"));
let merged=0;
for(const [slug,desc] of Object.entries(out)){
  const p=`${dir}/${slug}.json`;
  const j=JSON.parse(fs.readFileSync(p,"utf8"));
  j.description=desc;
  j.updatedAt="2026-06-02T00:00:00Z";
  fs.writeFileSync(p,JSON.stringify(j,null,2)+"\n");
  merged++;
}
console.log(`MERGED ${merged} descriptions from ${reportPath}`);
