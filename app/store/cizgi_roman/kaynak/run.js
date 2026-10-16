const {chromium}=require('/opt/node22/lib/node_modules/playwright');const fs=require('fs');
const FD='/mnt/project-files/flix/lootback/app/www/fonts/';
module.exports=async function(fn){const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist','--enable-unsafe-swiftshader','--allow-file-access-from-files']});
const page=await b.newPage({viewport:{width:900,height:500}});const errs=[];page.on('pageerror',e=>errs.push(e.stack.slice(0,400)));
await page.route('**/three.min.js',r=>r.fulfill({body:fs.readFileSync('/tmp/claude-0/lbtest/npm/package/build/three.min.js'),contentType:'application/javascript'}));
await page.route('**/examples/js/**',r=>{const p=r.request().url().split('/examples/js/')[1];r.fulfill({body:fs.readFileSync('/tmp/claude-0/lbtest/npm/package/examples/js/'+p),contentType:'application/javascript'})});
await page.route(/fonts\.googleapis/,r=>r.fulfill({contentType:'text/css',body:`@font-face{font-family:Bangers;src:url(https://fonts.gstatic.com/b1.woff2)}@font-face{font-family:Bangers;src:url(https://fonts.gstatic.com/b2.woff2);unicode-range:U+0100-024F,U+1E00-1EFF}@font-face{font-family:Fredoka;font-weight:500 700;src:url(https://fonts.gstatic.com/f1.woff2)}`}));
await page.route(/fonts\.gstatic/,r=>{const u=r.request().url();const f=u.includes('b1')?'bangers-latin':u.includes('b2')?'bangers-latin-ext':'fredoka-latin';r.fulfill({body:fs.readFileSync(FD+f+'.woff2'),contentType:'font/woff2'})});
await page.goto('file:///tmp/claude-0/lbtest/v9/a10.html');await page.waitForTimeout(2500);
await page.addScriptTag({path:'/tmp/claude-0/lbtest/v9/comicart/draw.js'});
await page.evaluate(async FD=>{R.on=false;for(const [f,w] of [['fredoka-latin',700],['fredoka-latin-ext',700]]){const ff=new FontFace('FredokaX',`url(${FD}${f}.woff2)`,{weight:'700',unicodeRange:f.endsWith('ext')?'U+0100-024F':'U+0000-00FF,U+2000-206F'});await ff.load();document.fonts.add(ff);}
 const bb=new FontFace('Bangers',`url(${FD}bangers-latin.woff2)`);await bb.load();document.fonts.add(bb);const bx=new FontFace('Bangers',`url(${FD}bangers-latin-ext.woff2)`,{unicodeRange:'U+0100-024F'});await bx.load();document.fonts.add(bx);
 window.IMG=src=>new Promise((ok,no)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=()=>no(src);i.src=src;});},'file://'+FD);
await fn(page,errs);console.log(errs.slice(0,5));await b.close();}
