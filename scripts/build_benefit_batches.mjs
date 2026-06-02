import fs from "fs";
const dir="src/data/stotras";
function skel(s){return s.replace(/"[^"]*"/g,"#Q").replace(/[ऀ-ॿ]+/g,"#D").replace(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*/g,"#N").replace(/\d+/g,"#").replace(/[^a-z #]/gi," ").replace(/\s+/g," ").trim().toLowerCase();}
const files=fs.readdirSync(dir).filter(f=>f.endsWith(".json"));
// pass 1: frequency of exact strings + skeletons
const exact={}, skels={};
const data={};
for(const f of files){const j=JSON.parse(fs.readFileSync(dir+"/"+f,"utf8"));const slug=f.replace(".json","");
  data[slug]=j;
  for(const b of j.benefits||[]){if(typeof b!=="string")continue;
    const n=b.trim().toLowerCase();exact[n]=(exact[n]||0)+1;
    const sk=skel(b);skels[sk]=(skels[sk]||new Set());skels[sk].add(slug);}}
const skelCount={};for(const[k,v]of Object.entries(skels))skelCount[k]=v.size;
// a benefit is "generic" if its exact string repeats >1 OR its skeleton spans >5 stotras
function isGeneric(b){if(typeof b!=="string")return false;const n=b.trim().toLowerCase();
  return (exact[n]>1)||(skelCount[skel(b)]>5);}
// targets: stotras with >=1 generic benefit
const targets=[];
for(const f of files){const slug=f.replace(".json","");const j=data[slug];
  const bens=j.benefits||[];
  const genericIdx=bens.map((b,i)=>isGeneric(b)?i:-1).filter(i=>i>=0);
  if(genericIdx.length){
    targets.push({slug,nameEn:j.titleEn,nameDev:j.title,deity:j.deity,secondaryDeities:j.secondaryDeities||[],
      source:j.source,verseCount:j.verseCount,days:j.days||[],festivals:j.festivals||[],purposes:j.purposes||[],
      benefits:bens, genericIndexes:genericIdx});
  }}
fs.writeFileSync("/tmp/benefit_targets.json",JSON.stringify(targets,null,2));
// split into batches
const N=8;const per=Math.ceil(targets.length/N);
for(let i=0;i<N;i++){const c=targets.slice(i*per,(i+1)*per);if(!c.length)break;
  fs.writeFileSync(`/tmp/benbatch_${String(i+1).padStart(2,"0")}.json`,JSON.stringify(c,null,2));}
const totalGeneric=targets.reduce((a,t)=>a+t.genericIndexes.length,0);
console.log("target_stotras="+targets.length+" generic_bullets_to_fix="+totalGeneric+" batches="+Math.min(N,Math.ceil(targets.length/per))+" per~="+per);
