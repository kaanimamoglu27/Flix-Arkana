(function(){
const NAVY='#0b0f3a', YEL='#ffc20e', RED='#e22511';
const A = window.ART = {};
// ---------- 2D heroes in the game's comic style ----------
A.kick = function(c,x,y,s,o,t){ o=o||{}; c.save(); c.translate(x,y); c.scale(o.flip?-s:s,s);
  const Y=o.body||'#ffd21a', R=o.cape||'#e22511', D='#b8860b';
  c.beginPath(); c.moveTo(-40,-196); c.quadraticCurveTo(-120,-120,-150,-8); c.lineTo(-104,-22); c.lineTo(-80,2); c.lineTo(-50,-18); c.lineTo(-20,0); c.quadraticCurveTo(0,-110,40,-196); c.closePath(); cmFill(c,R,5);
  c.save(); c.clip(); cmDots(c,-150,-200,110,200,'rgba(0,0,0,.5)',0.3,7); c.restore();
  const L=o.pose==='kick'?[[-16,-92,-26,-50,-34,-10],[16,-92,60,-96,104,-120]]:[[-16,-92,-22,-50,-28,-10],[16,-92,22,-50,28,-10]];
  for(const l of L) cmLimb(c,l,22,Y);
  for(const l of L){ cmEll(c,l[4]+(l[4]<0?-6:8),l[5],22,15,o.pose==='kick'&&l[4]>0?-0.5:0); cmFill(c,R,4); }
  cmRR(c,-40,-186,80,100,26); cmFill(c,Y,5); c.fillStyle='#8a4a1a'; c.fillRect(-40,-110,80,12); c.strokeStyle=INK; c.lineWidth=3; c.strokeRect(-40,-110,80,12);
  cmDots(c,8,-184,30,96,'rgba(120,70,0,.6)',0.35,6);
  const Ar=o.pose==='fist'?[[-38,-170,-70,-140,-80,-104],[38,-170,74,-206,92,-252]]:o.pose==='kick'?[[-38,-170,-80,-160,-110,-176],[38,-170,72,-150,96,-130]]:[[-38,-170,-66,-136,-72,-100],[38,-170,66,-136,72,-100]];
  for(const a of Ar){ cmLimb(c,a,18,Y); cmEll(c,a[4],a[5],17,16); cmFill(c,R,4); }
  // teardrop head
  c.beginPath(); c.moveTo(14,-372); c.bezierCurveTo(-10,-330,-70,-300,-66,-236); c.bezierCurveTo(-62,-176,62,-176,66,-236); c.bezierCurveTo(70,-292,30,-320,14,-372); c.closePath(); cmFill(c,Y,6);
  c.save(); c.clip(); cmEll(c,30,-210,60,50); c.fillStyle='rgba(180,110,0,.25)'; c.fill(); cmDots(c,-70,-240,140,70,'rgba(150,80,0,.6)',0.3,6); c.restore();
  cmEll(c,-24,-290,10,16,-0.5); c.fillStyle='rgba(255,255,255,.7)'; c.fill();
  if(o.patch){ c.beginPath(); c.moveTo(-70,-262); c.quadraticCurveTo(0,-292,70,-262); c.lineTo(66,-246); c.quadraticCurveTo(0,-272,-66,-246); c.closePath(); cmFill(c,'#e22511',3); }
  for(const k of [-1,1]){ if(o.patch&&k<0){ cmEll(c,-22,-236,15,13); cmFill(c,INK,3);} else { cmEll(c,k*22,-236,11,15); cmFill(c,'#fff',3.5); cmEll(c,k*22+3,-234,6,8); c.fillStyle=INK; c.fill(); cmEll(c,k*22+5,-238,2,2.4); c.fillStyle='#fff'; c.fill(); }
    c.beginPath(); c.moveTo(k*10,-256); c.lineTo(k*34,-262+(k<0?0:-2)); c.lineWidth=5; c.strokeStyle=INK; c.lineCap='round'; c.stroke(); }
  c.beginPath(); c.moveTo(-20,-210); c.quadraticCurveTo(4,-188,24,-212); c.quadraticCurveTo(4,-200,-20,-210); cmFill(c,'#5a1a08',3);
  cmEll(c,-40,-212,9,6); c.fillStyle='rgba(255,90,60,.45)'; c.fill(); cmEll(c,42,-212,9,6); c.fill();
  c.restore(); };
A.flick = function(c,x,y,s,o,t){ o=o||{}; c.save(); c.translate(x,y); c.scale(o.flip?-s:s,s);
  const W=o.body||'#fbfbff', S=o.scarf||'#2d6cff';
  const L=[[-16,-90,-20,-48,-24,-10],[16,-90,20,-48,24,-10]];
  for(const l of L) cmLimb(c,l,22,W); for(const l of L){ cmEll(c,l[4]+(l[4]<0?-6:8),l[5],22,14); cmFill(c,W,4); }
  cmRR(c,-38,-180,76,96,30); cmFill(c,W,5); cmDots(c,6,-178,30,92,'rgba(80,90,140,.6)',0.3,6);
  if(o.buttons) for(const by of [-160,-136,-112]){ cmEll(c,0,by,5,5); c.fillStyle=INK; c.fill(); }
  const Ar=o.pose==='wave'?[[-36,-168,-64,-136,-70,-104],[36,-168,72,-200,84,-250]]:[[-36,-168,-62,-136,-68,-102],[36,-168,62,-136,68,-102]];
  for(const a of Ar){ cmLimb(c,a,18,W); cmEll(c,a[4],a[5],15,14); cmFill(c,W,4); }
  c.beginPath(); c.moveTo(-44,-188); c.quadraticCurveTo(0,-170,44,-188); c.lineTo(44,-170); c.quadraticCurveTo(0,-152,-44,-170); c.closePath(); cmFill(c,S,4);
  c.beginPath(); c.moveTo(20,-172); c.lineTo(46,-120); c.lineTo(28,-118); c.lineTo(8,-168); c.closePath(); cmFill(c,S,3);
  cmEll(c,0,-252,74,72); cmFill(c,W,6);
  c.save(); cmEll(c,0,-252,74,72); c.clip(); cmEll(c,34,-222,70,60); c.fillStyle='rgba(90,100,160,.18)'; c.fill(); cmDots(c,-74,-230,148,60,'rgba(80,90,140,.6)',0.28,6); c.restore();
  cmEll(c,-30,-290,14,8,-0.5); c.fillStyle='rgba(255,255,255,.9)'; c.fill();
  if(o.hat){ cmRR(c,-46,-336,92,16,6); cmFill(c,INK,3); cmRR(c,-30,-400,60,70,6); cmFill(c,'#15151c',4); c.fillStyle='#2d6cff'; c.fillRect(-30,-350,60,10); }
  for(const k of [-1,1]){ cmEll(c,k*24,-262,8,11); c.fillStyle=INK; c.fill(); cmEll(c,k*24+2,-266,2.5,3); c.fillStyle='#fff'; c.fill(); }
  c.beginPath(); c.arc(0,-246,24,0.25,Math.PI-0.25); c.lineWidth=5; c.strokeStyle=INK; c.lineCap='round'; c.stroke();
  cmEll(c,-44,-238,11,7); c.fillStyle='rgba(255,110,140,.55)'; c.fill(); cmEll(c,44,-238,11,7); c.fill();
  c.restore(); };
// ---------- shared art pieces ----------
A.bg = function(c,W,H,fx,fy,u){
  const g=c.createRadialGradient(fx,fy,0,fx,fy,Math.hypot(W,H)*0.7); g.addColorStop(0,'#3a1a9a'); g.addColorStop(0.45,'#1a1366'); g.addColorStop(1,'#080a2e'); c.fillStyle=g; c.fillRect(0,0,W,H);
  cmSpeed(c,W,H,fx,fy,70,'rgba(140,70,255,.35)',11,0.18); cmSpeed(c,W,H,fx,fy,26,'rgba(255,194,14,.55)',29,0.32); cmSpeed(c,W,H,fx,fy,18,'rgba(255,45,138,.45)',41,0.3);
  cmDots(c,0,0,W,H,'rgba(255,255,255,.5)',0.08,Math.round(10*u));
};
A.spiral = function(q,w,h){ q.fillStyle='#cfcfcf'; q.fillRect(0,0,w,h); q.strokeStyle='#222'; q.lineWidth=Math.max(2,w*0.05); q.beginPath(); const cx=w/2,cy=h/2; for(let a=0;a<26;a+=0.2){ const r=a*Math.min(w,h)*0.018; q.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r);} q.stroke(); };
A.grayCity = function(c,W,H,x0,x1,base,u,t){ // left half: city drained of colour, tablet zombies
  const o=document.createElement('canvas'); o.width=W; o.height=H; const q=o.getContext('2d');
  q.fillStyle='#2a2a33'; q.fillRect(0,0,W,H);
  q.save(); q.scale(u,u); const Wu=W/u, bu=base/u;
  cmCity(q,Wu,bu-140,5,{cols:['#55555f','#6a6a72','#44444c'],hMin:300,hMax:620,bw:120,win:'#f5f5f5',lit:0.35,lw:5});
  cmCity(q,Wu,bu-20,9,{cols:['#77777f','#5a5a64','#8a8a92'],hMin:180,hMax:420,bw:150,win:'#ffffff',lit:0.4,lw:5,ws:1.3});
  for(const [bx,by,bw,bh,r] of [[200,bu-640,260,180,-0.04],[540,bu-520,190,250,0.05],[110,bu-360,200,150,0.03],[820,bu-680,170,130,-0.06]]) cmTablet(q,bx,by,bw,bh,r,0,A.spiral);
  cmPerson(q,150,bu+90,2.7,{zombie:true,pose:'zomb',tablet:true},t); cmPerson(q,420,bu+70,2.3,{pose:'hunch',tablet:true,shirt:'#777',hair:'#333'},t); cmPerson(q,650,bu+100,2.5,{zombie:true,pose:'zomb'},t);
  for(let i=0;i<9;i++) cmPerson(q,60+i*90,bu-30,0.9,{pose:'hunch',tablet:true,shirt:'#666'},t+i);
  q.restore();
  c.save(); c.beginPath(); c.moveTo(0,0); c.lineTo(x1,0); c.lineTo(x0,H); c.lineTo(0,H); c.closePath(); c.clip();
  c.filter='grayscale(1) contrast(1.15) brightness(.95)'; c.drawImage(o,0,0); c.filter='none';
  cmDots(c,0,0,x1,H,'rgba(0,0,0,.6)',0.25,Math.round(9*u)); c.restore();
};
A.colorCity = function(c,W,H,x0,x1,base,u,t){ // right half: colour coming back, souls and cheering kids
  c.save(); c.beginPath(); c.moveTo(x1,0); c.lineTo(W,0); c.lineTo(W,H); c.lineTo(x0,H); c.closePath(); c.clip();
  c.save(); c.scale(u,u); const Wu=W/u, bu=base/u;
  const sk=c.createLinearGradient(0,0,0,bu); sk.addColorStop(0,'#2a0f8e'); sk.addColorStop(1,'#ff2d8a'); c.fillStyle=sk; c.globalAlpha=0.55; c.fillRect(x0/u,0,Wu,bu); c.globalAlpha=1;
  cmCity(c,Wu,bu-140,17,{cols:['#7a2cff','#ff3d7f','#2ec4ff','#5a2ad8'],hMin:320,hMax:680,bw:120,win:'#fff27a',lit:0.6,lw:5});
  cmCity(c,Wu,bu-20,23,{cols:['#ffb81a','#ff6a2a','#ff3d7f','#2ee6ff','#8a4aff'],hMin:180,hMax:430,bw:150,win:'#fffbe0',lit:0.6,lw:5,ws:1.3});
  for(const [sx,sy,ss] of [[0.78,0.28,1.4],[0.9,0.44,1.1],[0.66,0.2,1],[0.95,0.2,0.9],[0.72,0.5,0.8]]) cmSoul(c,Wu*sx,bu*sy,ss,t);
  const ppl=[[0.7,{pose:'cheer',shirt:'#3a8dff',toy:'#e22511'}],[0.8,{pose:'cheer',shirt:'#e22511',hair:'#7a3a1a',toy:'#ffc20e'}],[0.9,{pose:'cheer',shirt:'#8a4aff',hair:'#5a2a8a',kid:1,toy:'#2ee6ff'}]];
  for(const [px,oo] of ppl) cmPerson(c,Wu*px,bu+70,1.8,oo,t);
  c.restore(); c.restore();
};
A.fire = function(c,pts,w){ // glowing fire ribbon along a bezier
  const draw=(lw,col,blur)=>{ c.save(); c.lineCap='round'; c.lineJoin='round'; c.strokeStyle=col; c.lineWidth=lw; c.shadowColor='#ff8a1a'; c.shadowBlur=blur; c.beginPath(); c.moveTo(pts[0],pts[1]); c.bezierCurveTo(pts[2],pts[3],pts[4],pts[5],pts[6],pts[7]); c.stroke(); c.restore(); };
  draw(w*1.6,'rgba(226,37,17,.55)',w*1.2); draw(w,'#ff8a1a',w*0.8); draw(w*0.55,'#ffd34a',w*0.5); draw(w*0.2,'#fffbe0',0);
};
A.text = function(c,txt,x,y,size,fill,o){ o=o||{}; c.save(); c.translate(x,y); c.rotate(o.rot||0); c.font=`${size}px Bangers`; c.textAlign=o.align||'left'; c.textBaseline='alphabetic'; c.lineJoin='round';
  const sh=size*(o.sh==null?0.08:o.sh); c.fillStyle=INK; c.strokeStyle=INK; c.lineWidth=size*0.16; c.strokeText(txt,sh,sh); c.fillText(txt,sh,sh); c.strokeText(txt,0,0); c.fillStyle=fill; c.fillText(txt,0,0); const w=c.measureText(txt).width; c.restore(); return w; };
A.fit = function(c,txt,size,maxW,fam){ c.font=`${size}px ${fam||'Bangers'}`; while(c.measureText(txt).width>maxW&&size>10){ size-=2; c.font=`${size}px ${fam||'Bangers'}`; } return size; };
A.box = function(c,txt,x,y,size,bg,fg,o){ o=o||{}; c.save(); c.font=`${o.fam==='F'?'700 ':''}${size}px ${o.fam==='F'?'FredokaX':'Bangers'}`; const tw=c.measureText(txt).width, px=size*0.5, py=size*0.28, w=tw+px*2, h=size*1.18+py; const bx=o.align==='center'?x-w/2:x;
  c.translate(bx,y); c.rotate(o.rot||0); c.fillStyle=INK; c.fillRect(size*0.12,size*0.12,w,h); c.beginPath(); c.rect(0,0,w,h); c.fillStyle=bg; c.fill(); c.lineWidth=Math.max(3,size*0.09); c.strokeStyle=INK; c.stroke();
  c.fillStyle=fg; c.textBaseline='middle'; c.fillText(txt,px,h/2+size*0.04); c.restore(); return {w,h}; };
A.logoArkana = function(c,x,y,size,rot){ cmSfx(c,'ARKANA',x,y,size,rot||-0.06,'#ffe14d','#ff6a1a'); };
A.stats = function(c,items,x,y,size,maxW,align){ // "50 DALGA | 5 PATRON"
  c.save(); let tot=0; const parts=[]; for(const [n,l] of items){ c.font=`${size}px Bangers`; const nw=c.measureText(n).width; c.font=`${size*0.62}px Bangers`; const lw=c.measureText(l).width; parts.push([n,l,nw,lw]); tot+=nw+size*0.18+lw; }
  tot+=(items.length-1)*size*0.9; let k=1; if(tot>maxW){ k=maxW/tot; } size*=k; tot*=k; let cx=align==='center'?x-tot/2:x;
  parts.forEach(([n,l,nw,lw],i)=>{ nw*=k; lw*=k; A.text(c,n,cx,y,size,YEL,{rot:-0.03}); A.text(c,l,cx+nw+size*0.18,y,size*0.62,'#fff',{rot:-0.03}); cx+=nw+size*0.18+lw;
    if(i<parts.length-1){ c.save(); c.strokeStyle='#fff'; c.lineWidth=size*0.06; c.beginPath(); c.moveTo(cx+size*0.5,y-size*0.85); c.lineTo(cx+size*0.38,y+size*0.1); c.stroke(); c.restore(); cx+=size*0.9; } });
  c.restore(); };
A.footer = function(c,W,H,u,page){ c.save(); c.font=`700 ${Math.round(26*u)}px FredokaX`; c.fillStyle='#fff'; c.textBaseline='middle'; const y=H-34*u; c.fillText('FLIX ARKANA',46*u,y); const tw=c.measureText('FLIX ARKANA').width; c.textAlign='right'; c.fillText(page,W-46*u,y); const pw=c.measureText(page).width;
  c.strokeStyle='rgba(255,255,255,.8)'; c.lineWidth=2*u; c.beginPath(); c.moveTo(46*u+tw+24*u,y); c.lineTo(W-46*u-pw-24*u,y); c.stroke(); c.restore(); };
A.frame = function(c,img,x,y,w,h,rot,u){ c.save(); c.translate(x+w/2,y+h/2); c.rotate(rot||0); c.fillStyle=INK; c.fillRect(-w/2+16*u,-h/2+18*u,w,h); cmRR(c,-w/2-10*u,-h/2-10*u,w+20*u,h+20*u,26*u); c.fillStyle='#fff'; c.fill(); c.lineWidth=7*u; c.strokeStyle=INK; c.stroke();
  c.save(); cmRR(c,-w/2,-h/2,w,h,18*u); c.clip(); c.filter='saturate(1.15) contrast(1.05)'; c.drawImage(img,-w/2,-h/2,w,h); c.filter='none'; c.restore(); c.restore(); };
})();
