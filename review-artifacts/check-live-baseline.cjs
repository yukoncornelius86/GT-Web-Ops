const {execFileSync}=require('node:child_process');
const fs=require('node:fs');
const base='a6b6136e6140b86037cd164aa1671162eb38d2dd';
const files=['index.html','assets/gt-bright-theme.css','consultation/index.html','paint-correction-leonardtown-md.html','blog/1988-porsche-911-dry-ice-cleaning.html','blog/2013-porsche-cayenne-lanolin-undercoating.html'];
const normalize=s=>s.replace(/\r\n/g,'\n').trim();
(async()=>{
 const results=await Promise.all(files.map(async path=>{
  const url='https://thegtcollective.com/'+(path==='index.html'?'':path);
  const response=await fetch(url);
  const live=await response.text();
  const baseline=execFileSync('git',['show',`${base}:sites/thegtcollective/${path}`],{encoding:'utf8',maxBuffer:2000000});
  return {path,status:response.status,matchesPinnedBase:normalize(live)===normalize(baseline)};
 }));
 console.log(JSON.stringify(results,null,2));
 if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(results,null,2));
 if(results.some(x=>!x.matchesPinnedBase))process.exitCode=1;
})().catch(error=>{console.error(error.message);process.exitCode=1;});
