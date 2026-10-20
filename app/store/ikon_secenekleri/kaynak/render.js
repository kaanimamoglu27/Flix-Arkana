const {chromium}=require('playwright-core');const fs=require('fs');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p=await b.newPage();p.on('console',m=>console.log('C:',m.text()));p.on('pageerror',e=>console.log('ERR',e.message));
for(const v of process.argv.slice(3)){await p.goto(`http://localhost:8765/scene.html?v=${v}&s=${process.argv[2]}`);
await p.waitForFunction('window.RESULT',null,{timeout:300000});const d=await p.evaluate('window.RESULT');fs.writeFileSync(`out_${v}.png`,Buffer.from(d.split(',')[1],'base64'));console.log('ok',v);}
await b.close();})();
