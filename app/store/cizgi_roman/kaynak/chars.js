(function(){
// polished comic characters: shaded parts, glossy highlights, halftone in shadows, rim light sprites
const A=window.ART, PI=Math.PI;
const P=()=>new Path2D();
function hex(h){h=h.replace('#','');if(h.length===3)h=h.split('').map(x=>x+x).join('');return [0,2,4].map(i=>parseInt(h.substr(i,2),16));}
function mix(a,b,k){const x=hex(a),y=hex(b);return '#'+x.map((v,i)=>Math.max(0,Math.min(255,Math.round(v+(y[i]-v)*k))).toString(16).padStart(2,'0')).join('');}
function ellP(x,y,rx,ry,r){const p=P();p.ellipse(x,y,Math.max(.1,rx),Math.max(.1,ry),r||0,0,PI*2);return p;}
function rrP(x,y,w,h,r){const p=P();p.moveTo(x+r,y);p.arcTo(x+w,y,x+w,y+h,r);p.arcTo(x+w,y+h,x,y+h,r);p.arcTo(x,y+h,x,y,r);p.arcTo(x,y,x+w,y,r);p.closePath();return p;}
A.mix=mix; A.ellP=ellP; A.rrP=rrP;
// a shaded part: radial light from the top-left, a shadow crescent with halftone, a glossy spot, ink outline
function part(c,p,col,o){ o=o||{}; const r=o.r||50,x=o.x||0,y=o.y||0;
  const g=c.createRadialGradient(x-r*.42,y-r*.5,r*.04,x-r*.1,y-r*.12,r*1.38);
  g.addColorStop(0,mix(col,'#ffffff',o.hl==null?.45:o.hl)); g.addColorStop(.42,col); g.addColorStop(1,mix(col,o.dk||'#1a0030',o.dkk==null?.42:o.dkk));
  c.fillStyle=g; c.fill(p);
  if(o.lo!==false){ c.save(); c.clip(p); const d=o.lo||[-r*.2,-r*.24]; const q=P(); q.rect(-1e4,-1e4,2e4,2e4); q.addPath(p,new DOMMatrix([1,0,0,1,d[0],d[1]]));
    c.fillStyle=o.loc||'rgba(40,0,70,.26)'; c.fill(q,'evenodd');
    if(o.dots!==false){ c.clip(q,'evenodd'); cmDots(c,x-r*1.8,y-r*1.8,r*3.6,r*3.6,o.dc||'rgba(30,0,50,.8)',.2,o.ds||6); } c.restore(); }
  if(o.gl){ c.save(); c.clip(p); const gl=o.gl; c.fillStyle='rgba(255,255,255,.62)'; c.fill(ellP(gl[0],gl[1],gl[2],gl[3],gl[4]||-.6)); c.fillStyle='#fff'; c.fill(ellP(gl[0]+gl[2]*.95,gl[1]+gl[3]*1.5,gl[3]*.42,gl[3]*.42)); c.restore(); }
  if(o.lw!==0){ c.lineJoin='round'; c.lineCap='round'; c.lineWidth=o.lw||5; c.strokeStyle=INK; c.stroke(p);} }
A.part=part;
// a rounded tube limb: ink, dark, base, highlight
function tube(c,pts,w,col){ const p=P(); p.moveTo(pts[0],pts[1]); if(pts.length>=6) p.quadraticCurveTo(pts[2],pts[3],pts[4],pts[5]); else p.lineTo(pts[2],pts[3]);
  c.lineCap='round'; c.lineJoin='round'; c.strokeStyle=INK; c.lineWidth=w+8; c.stroke(p);
  c.strokeStyle=mix(col,'#140020',.38); c.lineWidth=w; c.stroke(p);
  c.save(); c.translate(-w*.13,-w*.13); c.strokeStyle=col; c.lineWidth=w*.6; c.stroke(p); c.translate(-w*.1,-w*.08); c.strokeStyle=mix(col,'#ffffff',.6); c.lineWidth=w*.16; c.stroke(p); c.restore(); }
A.tube=tube;
function line(c,pts,w,col){ c.beginPath(); c.moveTo(pts[0],pts[1]); for(let i=2;i<pts.length;i+=2) c.lineTo(pts[i],pts[i+1]); c.strokeStyle=col||INK; c.lineWidth=w; c.lineCap='round'; c.lineJoin='round'; c.stroke(); }
// record a point in canvas pixels (used for torch flames)
function mark(c,o,x,y){ if(!o||!o.out) return; const m=c.getTransform(); o.out.push({x:m.a*x+m.c*y+m.e,y:m.b*x+m.d*y+m.f}); }
// ---------- flames ----------
function flameP(sz,k,wob){ const p=P(), w=sz*.55*k, h=sz*1.9*k, f=wob||0;
  p.moveTo(-w,-h*.05); p.quadraticCurveTo(-w*1.2,-h*.42,-w*(.8+f),-h*.7); p.quadraticCurveTo(-w*.5,-h*.45,-w*.28,-h*.52);
  p.quadraticCurveTo(-w*.32,-h*.82,w*(.12-f),-h); p.quadraticCurveTo(w*.6,-h*.72,w*.38,-h*.5); p.quadraticCurveTo(w*.75,-h*.56,w*(.85+f),-h*.7);
  p.quadraticCurveTo(w*1.25,-h*.36,w,-h*.05); p.bezierCurveTo(w*.9,h*.32,-w*.9,h*.32,-w,-h*.05); p.closePath(); return p; }
A.flame=function(c,x,y,sz,t,cols){ cols=cols||['#e3200f','#ff7a12','#ffc61a','#fff6c0'];
  c.save(); c.translate(x,y);
  const gl=c.createRadialGradient(0,-sz*.7,0,0,-sz*.7,sz*2.2); gl.addColorStop(0,'rgba(255,190,60,.7)'); gl.addColorStop(.45,'rgba(255,110,20,.28)'); gl.addColorStop(1,'rgba(255,80,0,0)');
  c.save(); c.globalCompositeOperation='lighter'; c.fillStyle=gl; c.beginPath(); c.arc(0,-sz*.7,sz*2.2,0,PI*2); c.fill(); c.restore();
  [[1,0],[.76,1],[.52,2],[.28,3]].forEach(([k,i])=>{ const p=flameP(sz,k,Math.sin(t*9+i)*.08); c.fillStyle=cols[i]; c.fill(p); if(i===0){ c.lineWidth=Math.max(2.5,sz*.07); c.strokeStyle=INK; c.lineJoin='round'; c.stroke(p);} });
  const r=cmRand(Math.round(sz*13+t*7)); c.fillStyle='#ffe27a'; for(let i=0;i<7;i++){ const a=-PI/2+(r()-.5)*1.6, d=sz*(1.6+r()*1.4); c.beginPath(); c.arc(Math.cos(a)*d*.6,Math.sin(a)*d,sz*(.04+r()*.07),0,PI*2); c.fill(); }
  c.restore(); };
// ---------- cape ----------
function cape(c,outer,lining,t,o){ o=o||{}; const fl=Math.sin(t*5)*6, L=o.len||1;
  const p=P(); p.moveTo(-42,-194); p.quadraticCurveTo(60,-232+fl,150*L,-200+fl); p.quadraticCurveTo(205*L,-184,236*L,-150+fl);
  p.quadraticCurveTo(200*L,-132,212*L,-98); p.quadraticCurveTo(166*L,-98,164*L,-54); p.quadraticCurveTo(116*L,-62,98*L,-14); p.quadraticCurveTo(44,-34,2,-22); p.quadraticCurveTo(-38,-92,-42,-194); p.closePath();
  part(c,p,outer,{x:80,y:-150,r:150,lo:[30,-26],ds:7,dkk:.55});
  const q=P(); q.moveTo(-30,-196); q.quadraticCurveTo(60,-230+fl,150*L,-200+fl); q.quadraticCurveTo(205*L,-184,236*L,-150+fl); q.quadraticCurveTo(176*L,-168,140*L,-176); q.quadraticCurveTo(60,-198,-26,-180); q.closePath();
  part(c,q,lining,{x:120,y:-190,r:90,lo:false,lw:4});
  c.save(); c.clip(p); for(const f of [[30,-190,70,-120,96,-30],[80,-196,120,-120,160,-62],[130,-190,170,-140,206,-104]]){ c.beginPath(); c.moveTo(f[0],f[1]); c.quadraticCurveTo(f[2],f[3],f[4],f[5]); c.strokeStyle=mix(outer,'#000',.55); c.lineWidth=4; c.stroke(); c.save(); c.translate(-7,2); c.strokeStyle=mix(outer,'#fff',.3); c.lineWidth=3; c.stroke(); c.restore(); } c.restore(); }
// ---------- cartoon gloves ----------
function glove(c,x,y,ang,o){ o=o||{}; const col=o.col||'#ffffff', dk=o.dk||'#5a66b0'; c.save(); c.translate(x,y); c.rotate(ang);
  // cuff
  const cf=P(); cf.moveTo(-30,-15); cf.quadraticCurveTo(-14,-22,-12,-17); cf.lineTo(-12,17); cf.quadraticCurveTo(-14,22,-30,15); cf.quadraticCurveTo(-36,0,-30,-15); cf.closePath();
  if(o.cuff!==false){ part(c,cf,o.cuffCol||col,{x:-22,y:0,r:20,lw:4.5,dk,dots:false}); line(c,[-24,-12,-24,12],2.5,mix(dk,'#000',.2)); }
  if(o.open){ for(const [a,l,w] of [[-.75,30,6.5],[-.28,37,7.5],[.16,37,7.5],[.58,32,7]]){ const f=P(); f.ellipse(Math.cos(a)*l,Math.sin(a)*l,14,w,a,0,PI*2); part(c,f,col,{x:Math.cos(a)*l,y:Math.sin(a)*l,r:14,lw:4,dk,dots:false,lo:[-2,-3]}); }
    part(c,ellP(4,0,22,20),col,{x:4,y:0,r:22,lw:4.5,dk,lo:[-4,-5]});
    const th=P(); th.ellipse(2,-24,8,14,-.5,0,PI*2); part(c,th,col,{x:2,y:-24,r:14,lw:4,dk,dots:false});
    line(c,[14,-6,24,-8],2.5); line(c,[15,6,25,7],2.5);
  } else {
    part(c,ellP(4,0,24,21),col,{x:4,y:0,r:24,lw:4.5,dk,lo:[-5,-6]});
    for(const k of [-11,0,11]){ c.beginPath(); c.arc(22,k,7,-PI/2,PI/2); c.strokeStyle=INK; c.lineWidth=3; c.stroke(); }
    const th=P(); th.ellipse(6,-17,13,7,.25,0,PI*2); part(c,th,col,{x:6,y:-17,r:13,lw:4,dk,dots:false,lo:[-2,-3]});
    line(c,[-6,10,8,12],2.5,mix(dk,'#000',.2));
  }
  c.restore(); }
A.glove=glove;
function torch(c,x,y,ang,t,o){ c.save(); c.translate(x,y); c.rotate(ang);
  tube(c,[0,46,0,-30],11,'#8a5228');
  const cp=P(); cp.moveTo(-12,-30); cp.lineTo(12,-30); cp.lineTo(24,-58); cp.lineTo(-24,-58); cp.closePath(); part(c,cp,'#ffc20e',{x:0,y:-44,r:24,lw:4,dk:'#5a2a00',dots:false});
  line(c,[-14,-38,14,-38],3,'#9a5a00'); cmEll(c,0,-58,24,6); c.fillStyle='#3a1206'; c.fill(); c.lineWidth=3.5; c.strokeStyle=INK; c.stroke();
  mark(c,o,0,-110); A.flame(c,0,-56,(o&&o.big)||52,t+x*.01); c.restore(); }
// ---------- FLIX ----------
const FPOSE={
  hero:{tilt:-.05,wind:-1,arms:[[-56,-166,-100,-226,-100,-286,'torch',-.1],[56,-158,104,-150,112,-108,'open',0]],legs:[[-20,-104,-66,-54,-78,0],[20,-104,58,-58,70,0]]},
  land:{tilt:0,wind:-1,arms:[[-56,-162,-104,-174,-128,-216,'torch',-.28],[56,-162,106,-170,130,-208,'torch',.28]],legs:[[-20,-104,-70,-60,-84,0],[20,-104,70,-60,84,0]]},
  fight:{tilt:.08,wind:-1,arms:[[-56,-160,-96,-128,-118,-150,'fist',0],[56,-164,110,-178,158,-196,'torch',1.05]],legs:[[-20,-104,-50,-56,-86,0],[20,-104,72,-66,72,0]]},
  wave:{tilt:-.03,wind:-1,arms:[[-56,-160,-92,-130,-102,-92,'torch',-.2],[56,-166,100,-220,112,-276,'open',0]],legs:[[-20,-104,-36,-54,-46,0],[20,-104,38,-54,48,0]]}};
A.flixH=function(c,x,y,s,o,t){ o=o||{}; t=t||0; c.save(); c.translate(x,y); c.scale(o.flip?-s:s,s);
  const RED=o.body||'#e8231a', CR=o.crown||'#ef2b1c', NV=o.cape||'#22359a', LIN=o.lining||'#e01818', pz=FPOSE[o.pose||'hero'];
  const up=()=>{ c.translate(0,-104); c.rotate(pz.tilt); c.translate(0,104); };
  // cape behind
  c.save(); up(); c.scale(pz.wind<0?-1:1,1); cape(c,NV,LIN,t,{len:o.capeLen||.8}); c.restore();
  // legs + shoes
  for(const l of pz.legs) tube(c,l,13,'#2c2632');
  for(const l of pz.legs){ const d=l[4]<0?-1:1, sx=l[4]+d*12, sy=l[5]-17; const sp=P(); sp.ellipse(sx,sy,42,23,d*.06,0,PI*2);
    part(c,sp,o.shoe||'#e51d17',{x:sx,y:sy,r:40,lw:5.5,gl:[sx-d*12-12,sy-11,12,5.5,-.2],lo:[-6,-8]});
    c.save(); c.clip(sp); c.fillStyle='rgba(60,0,10,.45)'; c.fillRect(sx-50,sy+10,100,20); c.restore(); c.lineWidth=5.5; c.strokeStyle=INK; c.stroke(sp); }
  c.save(); up();
  // crown
  const cr=P(); cr.moveTo(-38,-188); cr.quadraticCurveTo(-74,-246,-104,-316); cr.lineTo(-64,-290); cr.lineTo(-58,-368); cr.lineTo(-22,-312); cr.lineTo(2,-398); cr.lineTo(24,-312); cr.lineTo(60,-366); cr.lineTo(64,-290); cr.lineTo(104,-318); cr.quadraticCurveTo(72,-246,38,-188); cr.closePath();
  part(c,cr,CR,{x:-6,y:-292,r:118,lo:[-26,-12],lw:6,ds:7});
  c.save(); c.clip(cr); for(const [tx,ty] of [[-96,-306],[-56,-354],[2,-384],[58,-352],[96,-306]]){ line(c,[0,-196,tx*.72,-196+(ty+196)*.72],3.5,mix(CR,'#000',.4)); }
  const hs=P(); hs.moveTo(-30,-200); hs.lineTo(-52,-342); hs.lineTo(-40,-326); hs.lineTo(-18,-206); hs.closePath(); c.fillStyle='rgba(255,255,255,.42)'; c.fill(hs); c.restore();
  // body bulb
  const bd=ellP(0,-150,68,62); part(c,bd,RED,{x:0,y:-150,r:66,lw:6.5,gl:[-30,-188,20,10,-.55],lo:[-16,-18],ds:6});
  // pauldrons
  for(const k of [-1,1]){ const pp=P(); pp.ellipse(k*58,-180,30,21,k*.5,PI,0); pp.closePath(); part(c,pp,'#cfd7e6',{x:k*58,y:-190,r:28,lw:4.5,dk:'#1a2050',dots:false,gl:[k*58-8,-194,9,4,-.4]});
    c.save(); c.translate(k*58,-180); c.rotate(k*.5); c.beginPath(); c.moveTo(-30,0); c.lineTo(30,0); c.strokeStyle='#ffc20e'; c.lineWidth=5; c.stroke(); c.restore(); cmEll(c,k*58,-192,3.5,3.5); c.fillStyle='#ffe27a'; c.fill(); }
  // face
  const lk=o.look==null?4:o.look;
  for(const k of [-1,1]){ const ex=k*24+2, ey=-160;
    part(c,ellP(ex,ey,15.5,21),'#ffffff',{x:ex,y:ey,r:21,lw:4.5,dk:'#5060b0',dots:false,lo:[-3,-5]});
    cmEll(c,ex+lk,ey+3,9,12.5); c.fillStyle='#1a1030'; c.fill(); cmEll(c,ex+lk,ey+3,5,7); c.fillStyle='#000'; c.fill();
    cmEll(c,ex+lk+3.5,ey-2,3.6,3.6); c.fillStyle='#fff'; c.fill(); cmEll(c,ex+lk-3,ey+8,1.7,1.7); c.fill();
    c.beginPath(); c.moveTo(k*6,-180); c.quadraticCurveTo(k*24,-194,k*44,-194); c.lineTo(k*42,-185); c.quadraticCurveTo(k*24,-184,k*8,-172); c.closePath(); c.fillStyle=INK; c.fill(); }
  const ms=o.shout?1.25:1; c.save(); c.translate(4,-118); c.scale(ms,ms);
  const m=P(); m.moveTo(-26,-14); m.quadraticCurveTo(2,-6,28,-18); m.quadraticCurveTo(28,14,2,16); m.quadraticCurveTo(-22,14,-26,-14); m.closePath();
  c.fillStyle='#4a0610'; c.fill(m); c.save(); c.clip(m); c.fillStyle='#fff'; c.beginPath(); c.moveTo(-28,-16); c.quadraticCurveTo(2,-8,30,-20); c.lineTo(30,-6); c.quadraticCurveTo(2,4,-28,-4); c.closePath(); c.fill(); cmEll(c,6,16,16,10); c.fillStyle='#ff5a6e'; c.fill(); c.restore();
  c.lineWidth=4.5; c.strokeStyle=INK; c.lineJoin='round'; c.stroke(m); c.restore();
  for(const k of [-1,1]){ cmEll(c,k*46+2,-128,10,6); c.fillStyle='rgba(255,170,90,.55)'; c.fill(); }
  // arms, torches, gloves
  pz.arms.forEach((a,i)=>{ tube(c,[a[0],a[1],a[2],a[3],a[4],a[5]],11,'#2c2632'); const ang=Math.atan2(a[5]-a[3],a[4]-a[2]), hx=a[4]+Math.cos(ang)*24, hy=a[5]+Math.sin(ang)*24;
    if(a[6]==='torch') torch(c,hx,hy,a[7],t+i,o); glove(c,hx,hy,ang,{open:a[6]==='open'}); });
  c.restore(); c.restore(); };
// ---------- KICK ----------
A.kickH=function(c,x,y,s,o,t){ o=o||{}; t=t||0; c.save(); c.translate(x,y); c.scale(o.flip?-s:s,s);
  const Y=o.body||'#ffd21a', R=o.cape||'#e22511', G=o.glove||'#e8261a', kick=o.pose==='kick';
  c.save(); c.scale(-1,1); c.translate(0,14); cape(c,R,mix(R,'#ffd21a',.35),t,{len:.58}); c.restore();
  const L=kick?[[-16,-92,-28,-50,-36,-10],[16,-92,64,-104,118,-132]]:[[-16,-92,-26,-50,-34,-10],[16,-92,26,-50,34,-10]];
  for(const l of L) tube(c,l,22,Y);
  for(const l of L){ const d=l[4]<0?-1:1, a=kick&&d>0?-.5:0; const bp=P(); bp.ellipse(l[4]+d*8,l[5],26,17,a,0,PI*2); part(c,bp,G,{x:l[4]+d*8,y:l[5],r:24,lw:5,gl:[l[4]+d*2-6,l[5]-9,9,4],lo:[-4,-6]});
    const cf=P(); cf.ellipse(l[4]-d*(kick&&d>0?-2:0),l[5]-16,18,8,a,0,PI*2); part(c,cf,mix(G,'#fff',.25),{x:l[4],y:l[5]-16,r:18,lw:4,dots:false,lo:false}); }
  if(kick){ c.save(); c.strokeStyle='#fff'; c.lineCap='round'; for(const [k,l] of [[-1,46],[0,64],[1,40]]){ c.lineWidth=6; c.beginPath(); c.moveTo(96-l*.2,-150+k*24); c.lineTo(40-l*.6,-130+k*24); c.stroke(); } c.restore(); }
  const tb=rrP(-42,-188,84,104,30); part(c,tb,Y,{x:0,y:-140,r:60,lw:5.5,dk:'#7a3000',gl:[-22,-170,12,6]});
  c.save(); c.clip(tb); c.fillStyle='#7a3a12'; c.fillRect(-44,-112,88,14); c.restore(); c.strokeStyle=INK; c.lineWidth=3.5; c.strokeRect(-41,-112,82,14);
  const bk=rrP(-11,-114,22,18,4); part(c,bk,'#ffc20e',{x:0,y:-105,r:12,lw:3,dots:false,lo:false});
  c.save(); c.translate(0,-152); c.beginPath(); for(let i=0;i<10;i++){ const a=-PI/2+i*PI/5, q=i%2?9:20; c.lineTo(Math.cos(a)*q,Math.sin(a)*q); } c.closePath(); c.fillStyle='#e22511'; c.fill(); c.lineWidth=3.5; c.strokeStyle=INK; c.stroke(); c.restore();
  const Ar=o.pose==='fist'?[[-38,-170,-72,-140,-80,-112],[38,-170,74,-206,90,-246]]:kick?[[-38,-170,-82,-162,-112,-180],[38,-170,74,-150,96,-128]]:[[-38,-170,-66,-136,-72,-104],[38,-170,66,-136,72,-104]];
  for(const a of Ar){ tube(c,a,18,Y); const ang=Math.atan2(a[5]-a[3],a[4]-a[2]); glove(c,a[4]+Math.cos(ang)*14,a[5]+Math.sin(ang)*14,ang,{col:G,dk:'#3a0010',cuffCol:mix(G,'#fff',.3)}); }
  // teardrop head
  const hd=P(); hd.moveTo(14,-372); hd.bezierCurveTo(-10,-330,-72,-300,-68,-236); hd.bezierCurveTo(-64,-174,64,-174,68,-236); hd.bezierCurveTo(72,-292,30,-320,14,-372); hd.closePath();
  part(c,hd,Y,{x:-4,y:-252,r:74,lw:6.5,dk:'#7a3000',gl:[-30,-292,13,22,-.5],lo:[-18,-16]});
  if(o.patch){ const pb=P(); pb.moveTo(-72,-262); pb.quadraticCurveTo(0,-294,72,-262); pb.lineTo(68,-244); pb.quadraticCurveTo(0,-274,-68,-244); pb.closePath(); part(c,pb,'#e22511',{x:0,y:-262,r:60,lw:3.5,dots:false,lo:false});
    c.beginPath(); c.moveTo(66,-256); c.quadraticCurveTo(96,-262,104,-240); c.moveTo(66,-250); c.quadraticCurveTo(90,-246,96,-224); c.strokeStyle=INK; c.lineWidth=12; c.lineCap='round'; c.stroke(); c.strokeStyle='#e22511'; c.lineWidth=6; c.stroke(); }
  for(const k of [-1,1]){ const ex=k*23, ey=-232;
    if(o.patch&&k<0){ cmEll(c,ex,ey,16,14); c.fillStyle=INK; c.fill(); line(c,[ex-14,ey-10,ex-30,ey-28],4); }
    else { part(c,ellP(ex,ey,13,17),'#fff',{x:ex,y:ey,r:17,lw:4,dk:'#5060b0',dots:false,lo:[-2,-4]}); cmEll(c,ex+4,ey+2,7.5,10); c.fillStyle='#2a1406'; c.fill(); cmEll(c,ex+4,ey+2,4,6); c.fillStyle='#000'; c.fill(); cmEll(c,ex+7,ey-2,3,3); c.fillStyle='#fff'; c.fill(); cmEll(c,ex+2,ey+7,1.4,1.4); c.fill(); }
    c.beginPath(); c.moveTo(k*6,-250); c.quadraticCurveTo(k*22,-262,k*40,-262); c.lineTo(k*39,-254); c.quadraticCurveTo(k*22,-254,k*8,-243); c.closePath(); c.fillStyle=INK; c.fill(); }
  const m=P(); m.moveTo(-24,-210); m.quadraticCurveTo(2,-202,28,-214); m.quadraticCurveTo(24,-186,2,-186); m.quadraticCurveTo(-20,-188,-24,-210); m.closePath();
  c.fillStyle='#4a1206'; c.fill(m); c.save(); c.clip(m); c.fillStyle='#fff'; c.beginPath(); c.moveTo(-26,-212); c.quadraticCurveTo(2,-204,30,-216); c.lineTo(30,-204); c.quadraticCurveTo(2,-194,-26,-202); c.fill(); cmEll(c,4,-186,12,7); c.fillStyle='#ff5a6e'; c.fill(); c.restore(); c.lineWidth=4; c.strokeStyle=INK; c.stroke(m);
  for(const k of [-1,1]){ cmEll(c,k*44,-208,10,6); c.fillStyle='rgba(255,110,60,.5)'; c.fill(); }
  c.restore(); };
// ---------- FLICK ----------
A.flickH=function(c,x,y,s,o,t){ o=o||{}; t=t||0; c.save(); c.translate(x,y); c.scale(o.flip?-s:s,s);
  const W=o.body||'#f8f9ff', S=o.scarf||'#2d6cff', DK=o.dk||'#4a58a8', fl=Math.sin(t*6)*5;
  const L=[[-17,-90,-22,-48,-26,-10],[17,-90,22,-48,26,-10]];
  for(const l of L) tube(c,l,22,W);
  for(const l of L){ const d=l[4]<0?-1:1, sp=P(); sp.ellipse(l[4]+d*8,l[5],26,15,0,0,PI*2); part(c,sp,o.shoe||S,{x:l[4]+d*8,y:l[5],r:24,lw:5,gl:[l[4]+d*2-6,l[5]-8,9,4],lo:[-4,-6]}); c.save(); c.clip(sp); c.fillStyle='#fff'; c.fillRect(l[4]-30,l[5]+6,64,12); c.restore(); c.lineWidth=5; c.strokeStyle=INK; c.stroke(sp); }
  const tb=rrP(-40,-182,80,98,32); part(c,tb,W,{x:0,y:-136,r:56,lw:5.5,dk:DK,gl:[-20,-166,10,5]});
  if(o.buttons) for(const by of [-160,-136,-112]){ cmEll(c,0,by,5.5,5.5); c.fillStyle=INK; c.fill(); }
  const pose=o.pose||'wave';
  const Ar=pose==='wave'?[[-36,-168,-64,-136,-70,-108],[36,-168,72,-202,82,-246]]:pose==='flick'?[[-36,-168,-64,-136,-70,-108],[36,-168,90,-180,124,-214]]:[[-36,-168,-62,-136,-68,-104],[36,-168,62,-136,68,-104]];
  for(const a of Ar){ tube(c,a,18,W); const ang=Math.atan2(a[5]-a[3],a[4]-a[2]); glove(c,a[4]+Math.cos(ang)*14,a[5]+Math.sin(ang)*14,ang,{col:'#ffffff',dk:DK,open:a===Ar[1],cuffCol:S}); }
  // scarf + tail
  const tl=P(); tl.moveTo(14,-176); tl.quadraticCurveTo(60,-170+fl,104,-138+fl); tl.lineTo(96,-120+fl); tl.lineTo(84,-130+fl); tl.lineTo(76,-112+fl); tl.quadraticCurveTo(44,-140,6,-160); tl.closePath();
  part(c,tl,S,{x:50,y:-150,r:50,lw:4.5,dk:'#000830',dots:false});
  c.save(); c.clip(tl); for(const k of [44,70]){ line(c,[k,-172,k-10,-128],9,'#fff'); } c.restore(); c.lineWidth=4.5; c.strokeStyle=INK; c.stroke(tl);
  const sc=P(); sc.moveTo(-48,-192); sc.quadraticCurveTo(0,-172,48,-192); sc.lineTo(48,-168); sc.quadraticCurveTo(0,-148,-48,-168); sc.closePath(); part(c,sc,S,{x:0,y:-180,r:40,lw:4.5,dk:'#000830',dots:false,gl:[-26,-188,10,3]});
  c.save(); c.clip(sc); for(const k of [-30,-6,18,42]) line(c,[k,-196,k-8,-150],7,'rgba(255,255,255,.85)'); c.restore(); c.lineWidth=4.5; c.strokeStyle=INK; c.stroke(sc);
  const hd=ellP(0,-256,76,72); part(c,hd,W,{x:0,y:-256,r:76,lw:6.5,dk:DK,gl:[-36,-298,18,9,-.55],lo:[-16,-16]});
  if(o.hat){ part(c,rrP(-48,-338,96,16,6),'#22222c',{x:0,y:-330,r:40,lw:3.5,dots:false,lo:false}); part(c,rrP(-32,-404,64,72,7),'#22222c',{x:0,y:-370,r:44,lw:4,dots:false,gl:[-18,-390,6,14,0]}); c.fillStyle=S; c.fillRect(-32,-352,64,11); }
  for(const k of [-1,1]){ const ex=k*25, ey=-266; cmEll(c,ex,ey,10,14); c.fillStyle='#16122a'; c.fill(); cmEll(c,ex+3,ey-5,3.6,3.6); c.fillStyle='#fff'; c.fill(); cmEll(c,ex-2,ey+6,1.7,1.7); c.fill();
    c.beginPath(); c.moveTo(k*12,-292); c.quadraticCurveTo(k*26,-300,k*40,-294); c.lineWidth=5; c.strokeStyle=INK; c.lineCap='round'; c.stroke(); }
  const m=P(); m.moveTo(-24,-240); m.quadraticCurveTo(0,-232,24,-240); m.quadraticCurveTo(20,-214,0,-214); m.quadraticCurveTo(-20,-214,-24,-240); m.closePath();
  c.fillStyle='#3a0a1a'; c.fill(m); c.save(); c.clip(m); cmEll(c,0,-214,13,8); c.fillStyle='#ff5a7e'; c.fill(); c.restore(); c.lineWidth=4; c.strokeStyle=INK; c.stroke(m);
  for(const k of [-1,1]){ cmEll(c,k*48,-238,12,7); c.fillStyle='rgba(255,110,150,.55)'; c.fill(); }
  c.restore(); };
// ---------- people ----------
A.person=function(c,x,y,s,o,t){ o=o||{}; t=t||0; c.save(); c.translate(x,y); c.scale(o.flip?-s:s,s);
  const z=o.zombie, skin=z?'#b8c0a4':(o.skin||'#f3c19a'), sh=o.shirt||'#3a8dff', pa=o.pants||'#2a3566', hair=o.hair||'#3a2416', pose=o.pose||'stand', hs=o.hs||0, kid=o.kid?1.14:1;
  c.translate(0,pose==='cheer'?-Math.abs(Math.sin(t*5+x*.01))*6:0);
  const L=pose==='cheer'?[[-12,-92,-20,-46,-26,0],[12,-92,22,-46,28,0]]:pose==='zomb'?[[-12,-92,-4,-46,-18,0],[12,-92,26,-50,32,0]]:pose==='walk'?[[-11,-92,-18,-46,-30,0],[11,-92,20,-46,26,0]]:[[-11,-92,-12,-46,-14,0],[11,-92,12,-46,14,0]];
  for(const l of L) tube(c,l,18,pa);
  for(const l of L){ const sp=P(); sp.ellipse(l[4]+(l[4]<0?-6:6),l[5]-5,16,8,0,0,PI*2); part(c,sp,o.shoes||'#2b2b36',{x:l[4],y:-5,r:15,lw:3.5,dots:false,gl:[l[4]-8,-9,5,2]}); }
  c.save(); c.translate(0,-92); c.rotate(pose==='hunch'?.28:pose==='zomb'?.16:0);
  const Ar=pose==='cheer'?[[-24,-64,-50,-92,-44,-130],[24,-64,50,-92,48,-128]]:pose==='zomb'?[[-22,-62,8,-64,46,-64],[22,-62,44,-58,66,-54]]:pose==='hunch'?[[-22,-62,-8,-30,14,-40],[22,-62,30,-30,22,-42]]:pose==='wave'?[[-24,-62,-30,-32,-28,-4],[24,-62,50,-88,48,-128]]:[[-24,-62,-30,-32,-28,-4],[24,-62,30,-32,28,-4]];
  const back=pose==='zomb'?Ar.slice(0,1):[], front=pose==='zomb'?Ar.slice(1):Ar;
  const arm=a=>{ tube(c,[a[0],a[1],a[2],a[3]],15,sh); tube(c,[a[2],a[3],a[4],a[5]],12,skin); part(c,ellP(a[4],a[5],9,9),skin,{x:a[4],y:a[5],r:9,lw:3.5,dots:false,lo:false});
    if(o.toy&&a[5]<-110){ cmFlixToy(c,a[4],a[5]-6,.5,o.toy,.15); } };
  back.forEach(arm);
  const tp=P(); tp.moveTo(-28,-70); tp.quadraticCurveTo(0,-80,28,-70); tp.quadraticCurveTo(32,-30,24,2); tp.lineTo(-24,2); tp.quadraticCurveTo(-32,-30,-28,-70); tp.closePath();
  part(c,tp,sh,{x:0,y:-40,r:44,lw:4.5,ds:5});
  if(z){ c.save(); c.clip(tp); c.fillStyle='rgba(0,0,0,.25)'; c.beginPath(); c.moveTo(-30,2); for(let i=0;i<=7;i++) c.lineTo(-30+i*60/7,i%2?-10:2); c.lineTo(30,6); c.lineTo(-30,6); c.fill(); c.restore(); }
  c.beginPath(); c.moveTo(-10,-74); c.lineTo(0,-62); c.lineTo(10,-74); c.strokeStyle=INK; c.lineWidth=3.5; c.stroke();
  if(o.stripe){ c.save(); c.clip(tp); c.fillStyle=o.stripe; c.fillRect(-32,-48,64,10); c.restore(); }
  front.forEach(arm);
  if(o.tablet){ c.save(); c.translate(18,-48); c.rotate(-.5); cmRR(c,-11,-15,22,30,3); c.fillStyle='#15151c'; c.fill(); c.lineWidth=3; c.strokeStyle=INK; c.stroke(); c.fillStyle='#e8f6ff'; c.shadowColor='#fff'; c.shadowBlur=14; c.fillRect(-8,-12,16,24); c.restore(); }
  // head
  c.save(); c.translate(0,-78); c.scale(kid,kid); if(pose==='hunch') c.rotate(.25);
  if(hs===1){ const hb=P(); hb.moveTo(-30,-44); hb.quadraticCurveTo(-40,10,-24,24); hb.lineTo(24,24); hb.quadraticCurveTo(40,10,30,-44); hb.closePath(); part(c,hb,hair,{x:0,y:-10,r:34,lw:4,dots:false}); }
  tube(c,[0,-2,0,-10],10,skin);
  for(const k of [-1,1]) part(c,ellP(k*26,-32,6,8),skin,{x:k*26,y:-32,r:8,lw:3.5,dots:false,lo:false});
  const hd=ellP(0,-36,26,30); part(c,hd,skin,{x:0,y:-36,r:30,lw:4.5,dk:z?'#202018':'#7a2a10',dkk:.38,dots:false,lo:[-6,-6]});
  // hair on top
  const hp=P();
  if(hs===2){ hp.moveTo(-28,-40); hp.quadraticCurveTo(-28,-70,0,-70); hp.quadraticCurveTo(28,-70,28,-40); hp.lineTo(44,-38); hp.quadraticCurveTo(30,-30,-28,-40); hp.closePath(); part(c,hp,o.cap||'#e22511',{x:0,y:-55,r:30,lw:4,dots:false,gl:[-10,-62,8,3]}); }
  else { hp.moveTo(-28,-36); hp.quadraticCurveTo(-34,-70,-4,-70); hp.lineTo(2,-78); hp.lineTo(8,-68); hp.lineTo(18,-74); hp.lineTo(18,-64); hp.quadraticCurveTo(32,-58,28,-34); hp.quadraticCurveTo(20,-52,4,-50); hp.quadraticCurveTo(-14,-54,-28,-36); hp.closePath(); part(c,hp,hair,{x:0,y:-58,r:30,lw:4,dots:false,gl:[-12,-62,8,3]}); }
  if(z){ for(const k of [-1,1]){ const ex=k*11, ey=-36; cmEll(c,ex,ey,9,9); c.fillStyle='#fff'; c.fill(); c.lineWidth=3; c.strokeStyle=INK; c.stroke(); c.beginPath(); for(let a=0;a<14;a+=.35){ const r=a*.6; c.lineTo(ex+Math.cos(a+k)*r,ey+Math.sin(a+k)*r); } c.lineWidth=1.8; c.stroke(); }
    c.beginPath(); c.moveTo(-10,-16); c.quadraticCurveTo(-4,-22,0,-16); c.quadraticCurveTo(4,-10,10,-17); c.lineTo(8,-10); c.quadraticCurveTo(0,-4,-8,-10); c.closePath(); c.fillStyle='#2a1a1a'; c.fill(); c.lineWidth=3; c.strokeStyle=INK; c.stroke();
    line(c,[-18,-52,-6,-48],3); line(c,[18,-52,6,-48],3); }
  else if(pose==='hunch'){ for(const k of [-1,1]){ line(c,[k*14-5,-34,k*14+5,-34],3.5); } line(c,[-7,-18,7,-18],3); }
  else { for(const k of [-1,1]){ const ex=k*11, ey=-38; cmEll(c,ex,ey,4.5,6.5); c.fillStyle='#1a1020'; c.fill(); cmEll(c,ex+1.5,ey-2.5,1.6,1.6); c.fillStyle='#fff'; c.fill(); line(c,[k*5,-50,k*17,-52],3); }
    const m=P(); m.moveTo(-12,-24); m.quadraticCurveTo(0,-20,12,-24); m.quadraticCurveTo(10,-8,0,-8); m.quadraticCurveTo(-10,-8,-12,-24); m.closePath(); c.fillStyle='#4a0a12'; c.fill(m); c.save(); c.clip(m); cmEll(c,0,-8,7,4); c.fillStyle='#ff6a7e'; c.fill(); c.restore(); c.lineWidth=3; c.strokeStyle=INK; c.stroke(m);
    for(const k of [-1,1]){ cmEll(c,k*18,-26,5,3); c.fillStyle='rgba(255,100,100,.45)'; c.fill(); } }
  c.restore(); c.restore(); c.restore(); };
// ---------- a freed soul: a little Flix ghost ----------
A.soul=function(c,x,y,s,t,o){ o=o||{}; c.save(); c.translate(x,y); c.scale(o.flip?-s:s,s); c.rotate(o.rot||0);
  const gl=c.createRadialGradient(0,0,0,0,0,110); gl.addColorStop(0,'rgba(140,240,255,.55)'); gl.addColorStop(1,'rgba(140,240,255,0)'); c.save(); c.globalCompositeOperation='lighter'; c.fillStyle=gl; c.beginPath(); c.arc(0,0,110,0,PI*2); c.fill(); c.restore();
  c.save(); c.strokeStyle='rgba(170,245,255,.8)'; c.lineCap='round'; c.shadowColor='#7ff0ff'; c.shadowBlur=18; for(const [w,k] of [[10,0],[4,10]]){ c.lineWidth=w; c.beginPath(); c.moveTo(-6+k,26); c.bezierCurveTo(-40,70+k,40,100,-10,150+k); c.stroke(); } c.restore();
  const b=P(); b.moveTo(-38,-4); b.bezierCurveTo(-40,-56,40,-56,38,-4); b.bezierCurveTo(37,22,26,30,14,34); b.quadraticCurveTo(4,50,-12,62); b.quadraticCurveTo(-8,44,-14,34); b.bezierCurveTo(-30,28,-37,18,-38,-4); b.closePath();
  c.save(); c.translate(0,-40); const lp=P(); lp.moveTo(-16,4); lp.lineTo(-24,-22); lp.lineTo(-10,-12); lp.lineTo(0,-30); lp.lineTo(10,-12); lp.lineTo(24,-22); lp.lineTo(16,4); lp.closePath(); part(c,lp,'#a8f8e0',{x:0,y:-10,r:22,lw:3,dk:'#0a4a6a',dots:false,lo:false}); c.restore();
  c.save(); c.shadowColor='#8ff4ff'; c.shadowBlur=26; c.fillStyle='#dffcff'; c.fill(b); c.restore();
  part(c,b,'#c6f6ff',{x:0,y:-6,r:42,lw:3.5,dk:'#1a5a9a',dots:false,lo:[-6,-6],hl:.7});
  for(const k of [-1,1]){ cmEll(c,k*14,-12,6,8.5); c.fillStyle='#14305a'; c.fill(); cmEll(c,k*14+2,-15,2.2,2.2); c.fillStyle='#fff'; c.fill(); }
  c.beginPath(); c.moveTo(-12,4); c.quadraticCurveTo(0,9,12,4); c.quadraticCurveTo(10,20,0,20); c.quadraticCurveTo(-10,20,-12,4); c.fillStyle='#14305a'; c.fill(); for(const k of [-1,1]){ cmEll(c,k*26,2,6,4); c.fillStyle='rgba(255,130,190,.6)'; c.fill(); }
  c.restore(); };
// ---------- sprite with rim lights ----------
// rims: [[dx,dy,inset,color,alpha]] in px; light comes from the side opposite to (dx,dy)
A.sprite=function(W,H,draw,rims){ const cv=document.createElement('canvas'); cv.width=W; cv.height=H; const q=cv.getContext('2d'); draw(q);
  for(const [dx,dy,k0,col,a] of (rims||[])){ const r=document.createElement('canvas'); r.width=W; r.height=H; const z=r.getContext('2d');
    z.drawImage(cv,0,0); z.globalCompositeOperation='destination-out'; z.drawImage(cv,dx,dy);
    z.globalCompositeOperation='destination-in'; const n=Math.hypot(dx,dy); z.drawImage(cv,dx/n*k0,dy/n*k0);
    z.globalCompositeOperation='source-in'; z.fillStyle=col; z.fillRect(0,0,W,H);
    q.save(); q.globalCompositeOperation='source-atop'; q.globalAlpha=a==null?.9:a; q.drawImage(r,0,0); q.restore(); }
  return cv; };
// place a sprite with a soft glow and a contact shadow
A.place=function(c,spr,o){ o=o||{}; c.save(); if(o.glow){ c.shadowColor=o.glow; c.shadowBlur=o.blur||40; } c.drawImage(spr,0,0); c.restore(); };
})();
