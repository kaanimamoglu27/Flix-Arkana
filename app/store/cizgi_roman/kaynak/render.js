const fs=require('fs');const OUT=process.argv[2]||'/tmp/claude-0/lbtest/v9/comicart/out/';const ONLY=process.argv[3]||'';fs.mkdirSync(OUT,{recursive:true});
require('./run.js')(async(page,errs)=>{await page.addScriptTag({path:'/tmp/claude-0/lbtest/v9/comicart/scenes.js'});
 const jobs=[];const R='/tmp/claude-0/lbtest/v9/raw/';
 const shots=['l_story','a_horde','j_bossrush','k_hunt','e_hell'];
 for(const lang of ['en','tr']){
  jobs.push(['cover_'+lang,'key',[3840,2160,lang,{noFooter:true}]]);
  for(const [dev,W,H] of [['phone',2796,1290],['ipad',2732,2048]]){
   jobs.push([`${dev}_${lang}_1`,'key',[W,H,lang,{page:'01/07'}]]);
   shots.forEach((s,i)=>jobs.push([`${dev}_${lang}_${i+2}`,'mode',[W,H,lang,i,'file://'+R+dev+'_'+s+'.png',null,`0${i+2}/07`]]));
   jobs.push([`${dev}_${lang}_7`,'heroes',[W,H,lang,null,'07/07']]);
  }}
 jobs.push(['icon','icon',[1024]]);jobs.push(['splash','splash',[2732,'en']]);
 for(const [n,fn,args] of jobs){ if(ONLY&&!n.includes(ONLY))continue;
  const u=await page.evaluate(async([fn,args])=>{const L=await IMG('file:///mnt/project-files/flix/kickup/flix-logo-seffaf.png');
   if(fn==='key') return ART.key(args[0],args[1],args[2],L,args[3]);
   if(fn==='mode'){const S=await IMG(args[4]);return ART.mode(args[0],args[1],args[2],args[3],S,L,args[6]);}
   if(fn==='heroes') return ART.heroes(args[0],args[1],args[2],L,args[4]);
   if(fn==='icon') return ART.icon(args[0]); if(fn==='splash') return ART.splash(args[0],args[1],L);},[fn,args]);
  fs.writeFileSync(OUT+n+'.png',Buffer.from(u.split(',')[1],'base64'));console.log(n);}
});
