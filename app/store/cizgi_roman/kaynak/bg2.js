(function(){
// polished backgrounds, effects and lettering
const A=window.ART, PI=Math.PI, mix=A.mix, YEL='#ffc20e';
// skyline with side faces, gradient fronts, rooftop details, glowing windows
A.city2=function(c,w,base,seed,o){ const r=cmRand(seed); let x=-60;
  while(x<w+60){ const bw=o.bw*(0.7+r()*0.8), bh=o.hMin+r()*(o.hMax-o.hMin), col=o.cols[Math.floor(r()*o.cols.length)], top=base-bh, sd=bw*.16, kind=r();
    c.beginPath(); c.moveTo(x+bw,top); c.lineTo(x+bw+sd,top+sd*.45); c.lineTo(x+bw+sd,base); c.lineTo(x+bw,base); c.closePath(); c.fillStyle=mix(col,'#000',.5); c.fill(); if(o.lw){ c.strokeStyle=INK; c.lineWidth=o.lw; c.stroke(); }
    c.beginPath(); c.moveTo(x,base); c.lineTo(x,top);
    if(kind<.12){ const k=bw; c.lineTo(x+k*.15,top); c.lineTo(x+k*.15,top-bh*.08); c.lineTo(x+k*.3,top-bh*.08); c.lineTo(x+k*.3,top-bh*.16); c.lineTo(x+k*.42,top-bh*.16); c.lineTo(x+k*.47,top-bh*.34); c.lineTo(x+k*.53,top-bh*.34); c.lineTo(x+k*.58,top-bh*.16); c.lineTo(x+k*.7,top-bh*.16); c.lineTo(x+k*.7,top-bh*.08); c.lineTo(x+k*.85,top-bh*.08); c.lineTo(x+k*.85,top); }
    else if(kind<.24){ c.lineTo(x+bw*.5,top-bw*.35); }
    c.lineTo(x+bw,top); c.lineTo(x+bw,base); c.closePath();
    const g=c.createLinearGradient(0,top,0,base); g.addColorStop(0,mix(col,'#fff',.16)); g.addColorStop(1,mix(col,'#000',.32)); c.fillStyle=g; c.fill(); if(o.lw){ c.strokeStyle=INK; c.lineWidth=o.lw; c.stroke(); }
    if(kind<.12){ c.beginPath(); c.moveTo(x+bw*.5,top-bh*.34); c.lineTo(x+bw*.5,top-bh*.46); c.strokeStyle=o.lw?INK:mix(col,'#000',.3); c.lineWidth=Math.max(3,bw*.03); c.stroke(); }
    else if(kind>.82&&o.lw){ const tx=x+bw*.62; c.fillStyle=mix(col,'#000',.35); c.fillRect(tx,top-bw*.22,bw*.2,bw*.18); c.strokeStyle=INK; c.lineWidth=o.lw*.8; c.strokeRect(tx,top-bw*.22,bw*.2,bw*.18); c.beginPath(); c.moveTo(tx,top-bw*.22); c.lineTo(tx+bw*.1,top-bw*.32); c.lineTo(tx+bw*.2,top-bw*.22); c.fill(); c.stroke(); }
    if(o.win){ const ws=o.ws||1; for(let wy=top+14*ws; wy<base-16*ws; wy+=22*ws) for(let wx=x+10*ws; wx<x+bw-14*ws; wx+=17*ws){ const on=r()<(o.lit==null?.5:o.lit);
        if(on){ c.fillStyle=o.glowWin||'rgba(255,240,150,.22)'; c.fillRect(wx-3*ws,wy-3*ws,13*ws,17*ws); c.fillStyle=o.win; } else c.fillStyle=mix(col,'#000',.45);
        c.fillRect(wx,wy,7*ws,11*ws); } }
    x+=bw+sd+(r()<.3?12:0); } };
A.haze=function(c,x,y,w,h,col,a){ const g=c.createLinearGradient(0,y,0,y+h); g.addColorStop(0,'rgba(0,0,0,0)'); g.addColorStop(1,col); c.save(); c.globalAlpha=a; c.fillStyle=g; c.fillRect(x,y,w,h); c.restore(); };
// four-point sparkle
A.spark=function(c,x,y,r,col){ c.save(); c.translate(x,y); c.fillStyle=col; c.shadowColor=col; c.shadowBlur=r*1.4; c.beginPath(); for(let i=0;i<8;i++){ const a=i*PI/4, q=i%2?r*.2:r; c.lineTo(Math.cos(a)*q,Math.sin(a)*q); } c.closePath(); c.fill(); c.shadowBlur=0; c.fillStyle='#fff'; c.beginPath(); c.arc(0,0,r*.16,0,PI*2); c.fill(); c.restore(); };
A.bokeh=function(c,x,y,w,h,n,cols,seed,rr){ const r=cmRand(seed); c.save(); c.globalCompositeOperation='lighter'; for(let i=0;i<n;i++){ const px=x+r()*w, py=y+r()*h, q=rr*(.4+r()); const g=c.createRadialGradient(px,py,0,px,py,q); const col=cols[i%cols.length]; g.addColorStop(0,col); g.addColorStop(.7,col.replace(/[\d.]+\)$/,m=>(parseFloat(m)*.5)+')')); g.addColorStop(1,'rgba(0,0,0,0)'); c.fillStyle=g; c.beginPath(); c.arc(px,py,q,0,PI*2); c.fill(); } c.restore(); };
// billboard screens
A.hypno=function(q,w,h){ q.fillStyle='#d8d8d8'; q.fillRect(0,0,w,h); const g=q.createRadialGradient(w/2,h*.4,0,w/2,h*.4,w*.7); g.addColorStop(0,'#fff'); g.addColorStop(1,'#8a8a8a'); q.fillStyle=g; q.fillRect(0,0,w,h);
  q.fillStyle='#3a3a3a'; q.beginPath(); q.ellipse(w/2,h*.45,w*.2,h*.27,0,0,PI*2); q.fill(); q.beginPath(); q.ellipse(w/2,h*1.02,w*.38,h*.32,0,0,PI*2); q.fill();
  for(const k of [-1,1]){ const ex=w/2+k*w*.085, ey=h*.42, R=Math.min(w,h)*.075; q.fillStyle='#fff'; q.beginPath(); q.arc(ex,ey,R,0,PI*2); q.fill(); q.strokeStyle='#111'; q.lineWidth=Math.max(1.5,R*.16); q.beginPath(); for(let a=0;a<15;a+=.3) q.lineTo(ex+Math.cos(a)*a/15*R,ey+Math.sin(a)*a/15*R); q.stroke(); } };
A.spiralScr=function(q,w,h){ A.spiral(q,w,h); const g=q.createRadialGradient(w/2,h/2,0,w/2,h/2,w*.6); g.addColorStop(0,'rgba(255,255,255,.5)'); g.addColorStop(1,'rgba(0,0,0,.2)'); q.fillStyle=g; q.fillRect(0,0,w,h); };
A.board=function(c,x,y,w,h,scr,o){ o=o||{}; c.save(); c.translate(x,y); c.rotate(o.rot||0); if(o.glow){ c.shadowColor=o.glow; c.shadowBlur=o.gb||40; }
  cmRR(c,-w/2,-h/2,w,h,8); c.fillStyle='#1a1a22'; c.fill(); c.shadowBlur=0; c.lineWidth=o.lw||5; c.strokeStyle=INK; c.stroke();
  const m=Math.min(w,h)*.06; c.save(); cmRR(c,-w/2+m,-h/2+m,w-2*m,h-2*m,5); c.clip(); c.translate(-w/2+m,-h/2+m); scr(c,w-2*m,h-2*m); c.restore();
  c.fillStyle='#1a1a22'; c.fillRect(-w*.04,h/2,w*.08,h*.5); c.restore(); };
A.flixAd=col=>(q,w,h)=>{ const g=q.createLinearGradient(0,0,0,h); g.addColorStop(0,'#fff27a'); g.addColorStop(1,'#ffb300'); q.fillStyle=g; q.fillRect(0,0,w,h); cmDots(q,0,0,w,h,'rgba(255,90,0,.6)',.35,6); const s=Math.min(w,h)/130; cmFlixToy(q,w/2,h*.92,s,col||'#e22511',0); };
// street with perspective lines and wet reflections
A.street=function(c,W,H,base,vx,u,o){ o=o||{}; const g=c.createLinearGradient(0,base,0,H); g.addColorStop(0,o.c0||'#2a1a5a'); g.addColorStop(1,o.c1||'#0c0824'); c.fillStyle=g; c.fillRect(0,base,W,H-base);
  c.save(); c.beginPath(); c.rect(0,base,W,H-base); c.clip(); c.strokeStyle=o.line||'rgba(255,255,255,.18)'; c.lineWidth=4*u;
  for(let i=-8;i<=8;i++){ c.beginPath(); c.moveTo(vx,base-H*.2); c.lineTo(vx+i*W*.18,H*1.4); c.stroke(); }
  // crosswalk
  const y0=base+(H-base)*.38, y1=base+(H-base)*.72; c.fillStyle=o.zebra||'rgba(255,255,255,.55)';
  for(let i=-14;i<=14;i++){ const k0=(y0-(base-H*.2))/(H*1.4-(base-H*.2)), k1=(y1-(base-H*.2))/(H*1.4-(base-H*.2)); const a=i*W*.05, b=a+W*.026;
    c.beginPath(); c.moveTo(vx+a*k0,y0); c.lineTo(vx+b*k0,y0); c.lineTo(vx+b*k1,y1); c.lineTo(vx+a*k1,y1); c.closePath(); c.fill(); }
  if(o.refl) A.bokeh(c,0,base,W,H-base,o.refl[1],o.refl[0],o.seed||3,30*u);
  c.restore(); };
// richer fire ribbon: several strands, embers and sparkles
A.fire2=function(c,pts,w,seed){ const bz=k=>{ const m=1-k; return [m*m*m*pts[0]+3*m*m*k*pts[2]+3*m*k*k*pts[4]+k*k*k*pts[6], m*m*m*pts[1]+3*m*m*k*pts[3]+3*m*k*k*pts[5]+k*k*k*pts[7]]; };
  const strand=(off,lw,col,blur,taper)=>{ c.save(); c.lineCap='round'; c.strokeStyle=col; c.shadowColor='#ff8a1a'; c.shadowBlur=blur; const N=48;
    for(let i=0;i<N;i++){ const a=bz(i/N), b=bz((i+1)/N), k=i/N, ww=lw*(taper?Math.sin(Math.min(1,k*1.6+.15)*PI*.5)*(1-k*.55):1); const nx=-(b[1]-a[1]), ny=b[0]-a[0], nl=Math.hypot(nx,ny)||1, o2=off*Math.sin(k*PI*3+off);
      c.lineWidth=ww; c.beginPath(); c.moveTo(a[0]+nx/nl*o2,a[1]+ny/nl*o2); c.lineTo(b[0]+nx/nl*o2,b[1]+ny/nl*o2); c.stroke(); } c.restore(); };
  c.save(); c.globalCompositeOperation='lighter';
  strand(0,w*2.2,'rgba(226,40,17,.35)',w*1.4,1); strand(w*.6,w*.9,'rgba(255,90,20,.55)',w*.6,1); strand(-w*.5,w*.7,'rgba(255,170,30,.6)',w*.5,1);
  c.restore(); strand(0,w,'#ff8a1a',w*.6,1); strand(0,w*.55,'#ffd34a',w*.4,1); strand(0,w*.2,'#fffbe0',0,1);
  const r=cmRand(seed||5); for(let i=0;i<46;i++){ const k=r(), p=bz(k), d=(r()-.5)*w*4; c.save(); c.fillStyle=r()<.5?'#ffe27a':'#ff9a2a'; c.shadowColor='#ff8a1a'; c.shadowBlur=w*.5; c.beginPath(); c.arc(p[0]+d,p[1]+(r()-.5)*w*4,w*(.06+r()*.14),0,PI*2); c.fill(); c.restore(); }
  for(let i=0;i<7;i++){ const p=bz(r()); A.spark(c,p[0]+(r()-.5)*w*3,p[1]+(r()-.5)*w*3,w*(.4+r()*.5),'#fff3b0'); } };
// a soul trail (cyan swirl)
A.swirl=function(c,pts,w){ c.save(); c.globalCompositeOperation='lighter'; c.lineCap='round'; for(const [lw,col,b] of [[w*2,'rgba(80,200,255,.25)',w*1.5],[w*.8,'rgba(140,240,255,.7)',w],[w*.25,'#ffffff',0]]){ c.strokeStyle=col; c.lineWidth=lw; c.shadowColor='#5fdcff'; c.shadowBlur=b; c.beginPath(); c.moveTo(pts[0],pts[1]); c.bezierCurveTo(pts[2],pts[3],pts[4],pts[5],pts[6],pts[7]); c.stroke(); } c.restore(); };
// brush swoosh behind stats
A.swoosh=function(c,x,y,w,h,c1,c2,rot){ c.save(); c.translate(x,y); c.rotate(rot||-.05); const g=c.createLinearGradient(0,0,w,0); g.addColorStop(0,c1); g.addColorStop(1,c2);
  c.beginPath(); c.moveTo(0,h*.55); c.quadraticCurveTo(w*.3,-h*.05,w,0); c.lineTo(w*.9,h*.28); c.lineTo(w*1.04,h*.36); c.lineTo(w*.88,h*.6); c.lineTo(w*.98,h*.7); c.quadraticCurveTo(w*.4,h*.75,0,h*.55); c.closePath(); c.fillStyle=g; c.fill(); c.restore(); };
// lettering: ink extrude, gradient fill, gloss line
const GR={'#fff':['#ffffff','#d9e2ff'],'#ffffff':['#ffffff','#d9e2ff']}; GR[YEL]=['#fff47a','#ffae00'];
A.text=function(c,txt,x,y,size,fill,o){ o=o||{}; c.save(); c.translate(x,y); c.rotate(o.rot||0); c.font=`${size}px Bangers`; c.textAlign=o.align||'left'; c.textBaseline='alphabetic'; c.lineJoin='round';
  const n=Math.max(2,Math.min(12,Math.round(size*.06))), st=size*(o.sh==null?.09:o.sh)/n;
  c.fillStyle=INK; c.strokeStyle=INK; c.lineWidth=size*.17; for(let i=n;i>=1;i--){ c.strokeText(txt,i*st,i*st); c.fillText(txt,i*st,i*st); } c.strokeText(txt,0,0);
  const f=GR[fill]; if(f){ const g=c.createLinearGradient(0,-size*.72,0,0); g.addColorStop(0,f[0]); g.addColorStop(.55,f[0]); g.addColorStop(1,f[1]); c.fillStyle=g; } else c.fillStyle=fill; c.fillText(txt,0,0);
  if(size>50){ c.save(); c.beginPath(); c.rect(-1e5,-size*2,2e5,size*1.62); c.clip(); c.lineWidth=size*.025; c.strokeStyle='rgba(255,255,255,.6)'; c.strokeText(txt,-size*.012,-size*.02); c.restore(); }
  const w=c.measureText(txt).width; c.restore(); return w; };
A.stats=function(c,items,x,y,size,maxW,align){ c.save(); let tot=0; const parts=[]; for(const [n,l] of items){ c.font=`${size}px Bangers`; const nw=c.measureText(n).width; c.font=`${size*.62}px Bangers`; const lw=c.measureText(l).width; parts.push([n,l,nw,lw]); tot+=nw+size*.18+lw; }
  tot+=(items.length-1)*size*.9; let k=1; if(tot>maxW) k=maxW/tot; size*=k; tot*=k; let cx=align==='center'?x-tot/2:x;
  const sw=[['rgba(226,37,17,.9)','rgba(255,138,26,0)'],['rgba(122,44,255,.9)','rgba(255,45,138,0)'],['rgba(46,196,255,.85)','rgba(122,44,255,0)']];
  parts.forEach(([n,l,nw,lw],i)=>{ nw*=k; lw*=k; const s=sw[i%3]; A.swoosh(c,cx-size*.25,y-size*.72,nw+lw+size*.7,size*.9,s[0],s[1],-.04);
    A.text(c,n,cx,y,size,YEL,{rot:-.03}); A.text(c,l,cx+nw+size*.18,y,size*.62,'#fff',{rot:-.03}); cx+=nw+size*.18+lw;
    if(i<parts.length-1){ c.save(); c.strokeStyle='#fff'; c.lineWidth=size*.06; c.lineCap='round'; c.beginPath(); c.moveTo(cx+size*.5,y-size*.85); c.lineTo(cx+size*.38,y+size*.1); c.stroke(); c.restore(); cx+=size*.9; } });
  c.restore(); };
A.vignette=function(c,W,H,a){ const g=c.createRadialGradient(W/2,H/2,Math.min(W,H)*.35,W/2,H/2,Math.hypot(W,H)*.6); g.addColorStop(0,'rgba(0,0,0,0)'); g.addColorStop(1,`rgba(4,2,20,${a||.55})`); c.fillStyle=g; c.fillRect(0,0,W,H); };
// ---------- left: the hypnotised grey city ----------
A.grayCity=function(c,W,H,x0,x1,base,u,t){ const o=document.createElement('canvas'); o.width=W; o.height=H; const q=o.getContext('2d');
  const sk=q.createLinearGradient(0,0,0,base); sk.addColorStop(0,'#141418'); sk.addColorStop(1,'#4a4a52'); q.fillStyle=sk; q.fillRect(0,0,W,H);
  q.save(); q.scale(u,u); const Wu=W/u, bu=base/u, xm=x1/u;
  for(const [cx,cy,r] of [[.1,.12,160],[.3,.06,200],[.5,.16,140]]){ q.fillStyle='rgba(110,110,120,.22)'; q.beginPath(); q.arc(Wu*cx,bu*cy,r,0,PI*2); q.arc(Wu*cx+r,bu*cy+20,r*.8,0,PI*2); q.arc(Wu*cx-r*.9,bu*cy+30,r*.7,0,PI*2); q.fill(); }
  A.city2(q,xm*1.1,bu-60,5,{cols:['#4a4a52','#55555e','#3e3e46'],hMin:380,hMax:760,bw:130,win:'#c8c8c8',lit:.25});
  A.haze(q,0,bu-700,xm*1.1,640,'#6a6a72',.6);
  A.city2(q,xm*1.1,bu-10,9,{cols:['#6a6a72','#5a5a64','#7a7a82'],hMin:200,hMax:520,bw:170,win:'#ffffff',lit:.35,lw:5,ws:1.3});
  for(const [bx,by,bw,bh,r,f] of [[150,bu-660,280,200,-.05,A.hypno],[520,bu-560,220,170,.04,A.spiralScr],[90,bu-330,190,150,.03,A.spiralScr],[760,bu-700,200,160,-.04,A.hypno],[380,bu-380,170,130,-.02,A.hypno]]) A.board(q,bx,by,bw,bh,f,{rot:r,glow:'#ffffff',gb:50});
  A.street(q,xm*1.2,H/u,bu,xm*.6,1,{c0:'#3a3a40',c1:'#18181c',line:'rgba(255,255,255,.12)',zebra:'rgba(255,255,255,.35)'});
  for(let i=0;i<12;i++) A.person(q,40+i*80,bu+20,.62,{pose:'hunch',tablet:true,shirt:['#666','#777','#555'][i%3],hs:i%3===1?1:0,hair:'#333'},t+i);
  A.person(q,130,bu+190,1.75,{zombie:true,pose:'zomb',hair:'#444',shirt:'#777'},t); A.person(q,400,bu+150,1.45,{zombie:true,pose:'zomb',hs:1,hair:'#2a2a2a',shirt:'#8a8a8a'},t+1); A.person(q,640,bu+180,1.6,{zombie:true,pose:'zomb',shirt:'#5a5a5a',hair:'#3a3a3a'},t+2);
  q.restore();
  c.save(); c.beginPath(); c.moveTo(0,0); c.lineTo(x1,0); c.lineTo(x0,H); c.lineTo(0,H); c.closePath(); c.clip();
  c.filter='grayscale(1) contrast(1.2) brightness(.92)'; c.drawImage(o,0,0); c.filter='none';
  cmDots(c,0,0,x1,H,'rgba(0,0,0,.7)',.22,Math.round(9*u)); c.restore(); };
// ---------- right: colour coming back ----------
A.colorCity=function(c,W,H,x0,x1,base,u,t){ c.save(); c.beginPath(); c.moveTo(x1,0); c.lineTo(W,0); c.lineTo(W,H); c.lineTo(x0,H); c.closePath(); c.clip();
  const sk=c.createLinearGradient(0,0,0,base); sk.addColorStop(0,'#1a0a6a'); sk.addColorStop(.6,'#5a1aa8'); sk.addColorStop(1,'#ff3d8a'); c.fillStyle=sk; c.fillRect(x0,0,W-x0,base);
  c.save(); c.scale(u,u); const Wu=W/u, bu=base/u, xs=x0/u;
  { const r=cmRand(7717); for(let i=0;i<40;i++) A.spark(c,xs+r()*(Wu-xs),r()*bu*.5,3+r()*7,'rgba(255,255,255,.9)'); }
  // spire
  const sx=Wu*.86, sb=bu-120; c.fillStyle='#8a5aff'; c.strokeStyle=INK; c.lineWidth=5;
  c.beginPath(); c.moveTo(sx-90,sb); c.lineTo(sx-90,sb-520); c.lineTo(sx-60,sb-520); c.lineTo(sx-60,sb-640); c.lineTo(sx-34,sb-640); c.lineTo(sx-34,sb-760); c.lineTo(sx-12,sb-800); c.lineTo(sx-5,sb-940); c.lineTo(sx+5,sb-940); c.lineTo(sx+12,sb-800); c.lineTo(sx+34,sb-760); c.lineTo(sx+34,sb-640); c.lineTo(sx+60,sb-640); c.lineTo(sx+60,sb-520); c.lineTo(sx+90,sb-520); c.lineTo(sx+90,sb); c.closePath();
  const sg=c.createLinearGradient(sx-90,0,sx+90,0); sg.addColorStop(0,'#c9a2ff'); sg.addColorStop(.5,'#7a3aff'); sg.addColorStop(1,'#3a1a9a'); c.fillStyle=sg; c.fill(); c.stroke();
  c.fillStyle='#fff27a'; for(let y=sb-500;y<sb;y+=26) for(let k=-70;k<70;k+=22) if(cmRand(y*3+k)()<.6) c.fillRect(sx+k,y,8,12);
  A.city2(c,Wu,bu-90,17,{cols:['#5a2ad8','#7a2cff','#3a1a9a','#2a6aff'],hMin:380,hMax:720,bw:130,win:'#fff27a',lit:.55});
  A.haze(c,xs,bu-640,Wu-xs,560,'#ff3d8a',.45);
  A.city2(c,Wu,bu-10,23,{cols:['#ffb81a','#ff6a2a','#ff3d7f','#2ec4ff','#8a4aff','#22d39a'],hMin:200,hMax:520,bw:170,win:'#fffbe0',lit:.6,lw:5,ws:1.3});
  for(const [bx,by,bw,bh,col] of [[Wu*.62,bu-560,210,170,'#e22511'],[Wu*.96,bu-420,190,150,'#2d6cff'],[Wu*.78,bu-300,150,120,'#22b04a']]) A.board(c,bx,by,bw,bh,A.flixAd(col),{rot:-.03,glow:'#ffd34a',gb:50});
  A.bokeh(c,xs,bu*.3,Wu-xs,bu*.7,26,['rgba(255,220,90,.35)','rgba(255,80,170,.3)','rgba(90,220,255,.3)'],11,40);
  A.street(c,Wu,H/u,bu,Wu*.6,1,{c0:'#3a1a7a',c1:'#120a30',line:'rgba(255,200,255,.14)',zebra:'rgba(255,255,255,.4)',refl:[['rgba(255,190,60,.35)','rgba(255,60,170,.3)','rgba(60,220,255,.3)'],30]});
  for(let i=0;i<14;i++) A.person(c,xs+80+i*((Wu-xs)/13),bu+30,.6,{pose:'cheer',shirt:['#7a3aff','#ff3d7f','#2ec4ff','#ffb81a'][i%4],hs:i%3,hair:['#5a2a1a','#1a1a2a','#aa5a1a'][i%3],toy:i%4===0?'#ffc20e':null},t+i);
  const sl=[[.66,.26,1.3,-.2],[.92,.36,1.1,.15],[.74,.1,.9,.1],[.98,.14,.8,-.1],[.6,.46,.8,.2]];
  for(const [sx2,sy,ss,r] of sl){ A.swirl(c,[Wu*sx2,bu*sy,Wu*sx2-120,bu*sy+80,Wu*sx2+60,bu*sy+170,Wu*sx2-40,bu*sy+260],8); A.soul(c,Wu*sx2,bu*sy,ss,t,{rot:r}); }
  const ppl=[[.7,{pose:'cheer',shirt:'#3a8dff',toy:'#e22511',hair:'#3a2416'}],[.82,{pose:'cheer',shirt:'#e22511',hair:'#7a3a1a',toy:'#ffc20e',hs:2,cap:'#ffc20e'}],[.94,{pose:'cheer',shirt:'#8a4aff',hair:'#5a2a8a',kid:1,toy:'#2ee6ff',hs:1}]];
  for(const [px,oo] of ppl) A.person(c,Wu*px,bu+130,1.45,oo,t);
  c.restore(); c.restore(); };
A.bg=function(c,W,H,fx,fy,u){ const g=c.createRadialGradient(fx,fy,0,fx,fy,Math.hypot(W,H)*.7); g.addColorStop(0,'#4a22b0'); g.addColorStop(.45,'#1c146e'); g.addColorStop(1,'#070926'); c.fillStyle=g; c.fillRect(0,0,W,H);
  cmSpeed(c,W,H,fx,fy,70,'rgba(140,70,255,.32)',11,.18); cmSpeed(c,W,H,fx,fy,26,'rgba(255,194,14,.5)',29,.32); cmSpeed(c,W,H,fx,fy,18,'rgba(255,45,138,.42)',41,.3);
  cmDots(c,0,0,W,H,'rgba(255,255,255,.5)',.07,Math.round(10*u));
  A.bokeh(c,0,0,W,H,22,['rgba(255,200,80,.18)','rgba(255,60,170,.16)','rgba(90,200,255,.16)'],7,60*u);
  { const r=cmRand(9137); for(let i=0;i<24;i++){ A.spark(c,r()*W,r()*H,(4+r()*10)*u,'rgba(255,255,255,.85)'); } } };
})();
