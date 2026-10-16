(function(){
const A=window.ART, YEL='#ffc20e', NAVY='#0b0f3a';
const T={
 en:{s1:{eb:'A FLIX ADVENTURE',t:['A CITY THAT','LOST ITS COLOR.'],sub:'Free the souls. Paint New York back.',st:[['5','MODES'],['4','BOSSES'],['24','WEAPONS']]},
  m:[{eb:'GAME MODE 1/5',t:['STORY','MODE'],sub:'A comic-book adventure across New York',st:[['40','LEVELS'],['4','BOSSES']]},
     {eb:'GAME MODE 2/5',t:['ENDLESS','MODE'],sub:'Every 10 waves the army grows stronger',st:[['50+','WAVES'],['+10%','EVERY 10 WAVES']]},
     {eb:'GAME MODE 3/5',t:['BOSS','RUSH'],sub:'5 bosses back to back. VORTEKS waits at the end',st:[['5','BOSSES'],['0','BREAKS']]},
     {eb:'GAME MODE 4/5',t:['FLIX','HUNT'],sub:'Find the Flix figures hidden across the city',st:[['40','FLIX'],['4','MINUTES']]},
     {eb:'GAME MODE 5/5',t:['HELL','MODE'],sub:'Fire rain, rising lava, a boss every 5 waves',st:[['4','DIFFICULTIES'],['11','MAPS']]}],
  s7:{eb:'COLLECT THEM ALL',t:['3 HEROES.','27 SKINS.'],sub:'FLIX, KICK and FLICK fight side by side',st:[['3','HEROES'],['27','SKINS'],['8','COMPANIONS']]},
  tag:'Kick it, Flick it, Flix it!'},
 tr:{s1:{eb:'BİR FLIX MACERASI',t:['RENGİNİ KAYBEDEN','BİR ŞEHİR.'],sub:"Ruhları kurtar. New York'u yeniden renklendir.",st:[['5','MOD'],['4','PATRON'],['24','SİLAH']]},
  m:[{eb:'OYUN MODU 1/5',t:['HİKAYE','MODU'],sub:"New York'ta çizgi roman macerası",st:[['40','SEVİYE'],['4','PATRON']]},
     {eb:'OYUN MODU 2/5',t:['SONSUZ','MOD'],sub:'Her 10 dalgada ordu güçleniyor',st:[['50+','DALGA'],['+%10','HER 10 DALGADA']]},
     {eb:'OYUN MODU 3/5',t:['PATRON','KOŞUSU'],sub:'5 patron arka arkaya. Sonda VORTEKS bekliyor',st:[['5','PATRON'],['0','MOLA']]},
     {eb:'OYUN MODU 4/5',t:['FLIX','AVI'],sub:'Şehre saklanan Flix figürlerini bul',st:[['40','FLIX'],['4','DAKİKA']]},
     {eb:'OYUN MODU 5/5',t:['CEHENNEM','MODU'],sub:'Ateş yağmuru, yükselen lav, 5 dalgada bir patron',st:[['4','ZORLUK'],['11','HARİTA']]}],
  s7:{eb:'HEPSİNİ TOPLA',t:['3 KAHRAMAN.','27 KOSTÜM.'],sub:'FLIX, KICK ve FLICK omuz omuza',st:[['3','KAHRAMAN'],['27','KOSTÜM'],['8','YOL ARKADAŞI']]},
  tag:'Kick it, Flick it, Flix it!'}};
A.T=T;
function canvas(W,H){ const c=document.createElement('canvas'); c.width=W; c.height=H; return [c,c.getContext('2d')]; }
function headline(x,X,Y,maxW,d,u,o){ o=o||{}; // eyebrow box, two lines, sub box; returns bottom y
  let y=Y; const eb=A.box(x,d.eb,X,y,Math.round(46*u*(o.k||1)),YEL,INK,{rot:-0.03,align:o.align});
  y+=eb.h+22*u*(o.k||1);
  if(o.single){ const full=d.t.join(' '), big=A.fit(x,full,Math.round((o.big||128)*u),maxW); y+=big*0.92; const w0=A.text(x,d.t[0]+' ',X,y,big,'#fff',{rot:-0.03}); A.text(x,d.t[1],X+w0,y,big,YEL,{rot:-0.03}); y+=big*0.06; }
  else { const big=Math.min(...d.t.map(t=>A.fit(x,t,Math.round((o.big||128)*u),maxW)));
  for(let i=0;i<d.t.length;i++){ y+=big*0.92; A.text(x,d.t[i],o.align==='center'?X:X,y,big,i?YEL:'#fff',{rot:-0.03,align:o.align}); y+=big*0.06; } }
  y+=24*u*(o.k||1);
  const ss=A.fit(x,d.sub,Math.round((o.sub||40)*u),maxW*1.05,'FredokaX');
  const sb=A.box(x,d.sub,X,y,ss,INK,'#fff',{fam:'F',rot:-0.02,align:o.align}); return y+sb.h;
}
function band(x,W,H,u,y0){ const g=x.createLinearGradient(0,y0,0,H); g.addColorStop(0,'rgba(8,10,46,0)'); g.addColorStop(0.35,'rgba(8,10,46,.9)'); g.addColorStop(1,'#060824'); x.fillStyle=g; x.fillRect(0,y0,W,H-y0); }
function logos(x,W,H,u,L,o){ o=o||{}; const lh=(o.lh||150)*u, lw=lh*L.width/L.height; x.save(); x.shadowColor='rgba(0,0,0,.5)'; x.shadowBlur=18*u; x.drawImage(L,(o.lx||40)*u,(o.ly||28)*u,lw,lh); x.restore();
  if(!o.noArk) A.logoArkana(x,W-(o.ax||210)*u,(o.ay||90)*u,(o.as||88)*u,-0.06); }
// ---------- 1 / cover: the split city ----------
A.key=function(W,H,lang,L,o){ o=o||{}; const [c,x]=canvas(W,H); const u=Math.min(H/1290,W/2796*1.25), d=T[lang].s1, t=0.6, wide=W/H>1.9;
  const fx=W*(wide?0.64:0.6), fy=H*0.5; A.bg(x,W,H,fx,fy,u);
  const base=H*(wide?0.86:0.84), x1=W*(wide?0.52:0.5), x0=W*(wide?0.44:0.38);
  A.grayCity(x,W,H,x0,x1,base,u*(wide?1:1.15),t); A.colorCity(x,W,H,x0,x1,base,u*(wide?1:1.15),t);
  // boundary glow
  x.save(); x.strokeStyle='#ffd34a'; x.lineWidth=10*u; x.shadowColor='#ff8a1a'; x.shadowBlur=40*u; x.beginPath(); x.moveTo(x1,0); x.lineTo(x0,H); x.stroke(); x.restore();
  // darken behind the headline
  const lg=x.createLinearGradient(0,0,W*0.55,0); lg.addColorStop(0,'rgba(6,8,36,.78)'); lg.addColorStop(1,'rgba(6,8,36,0)'); x.fillStyle=lg; x.fillRect(0,0,W*0.6,H);
  const s=H*(wide?0.6:0.5)/306, hx=W*(wide?0.66:0.66), hy=H*(wide?0.86:0.8);
  A.fire(x,[hx-104*s,hy-260*s, hx-40*s,H*0.08, W*0.95,H*0.05, W*1.02,H*0.42],34*u*(wide?1:1.2));
  A.fire(x,[hx+118*s,hy-230*s, W*0.9,hy-80*s, W*0.8,H*0.98, W*0.5,H*1.05],20*u);
  x.save(); x.shadowColor='rgba(255,140,30,.8)'; x.shadowBlur=60*u; cmFlix(x,hx,hy,s,{pose:'land',shout:true},t); x.restore();
  band(x,W,H,u,H*0.8);
  const L0=logos(x,W,H,u,L,{lh:wide?150:170,as:wide?92:100});
  headline(x,W*0.045,H*(wide?0.22:0.2),W*(wide?0.42:0.5),d,u,{big:wide?132:150,sub:wide?40:46});
  A.stats(x,d.st,W*0.045,H-110*u,(wide?96:110)*u,W*0.55);
  if(!o.noFooter) A.footer(x,W,H,u,o.page||'01/07');
  return c.toDataURL('image/png'); };
// ---------- 2-6: mode slides with a real screenshot ----------
A.mode=function(W,H,lang,i,shot,L,page){ const [c,x]=canvas(W,H); const ipad=W/H<1.6, u=ipad?H/2048*1.55:H/1290, d=T[lang].m[i], t=0.4;
  A.bg(x,W,H,W*0.7,H*0.55,u);
  x.save(); x.globalAlpha=0.55; x.scale(u,u); cmCity(x,W/u,H/u*0.98,31+i,{cols:['#3a1a9a','#5a2ad8','#2a1370'],hMin:160,hMax:420,bw:130,win:'#ffd36a',lit:0.35,lw:4}); x.restore();
  // frame
  let fw,fh,fxp,fyp; if(ipad){ fw=W*0.6; fh=fw*1024/1366; fxp=W-fw-W*0.045; fyp=H-fh-H*0.1; } else { fh=H*0.66; fw=fh*932/430; fxp=W-fw-W*0.035; fyp=H*0.15; }
  A.frame(x,shot,fxp,fyp,fw,fh,-0.025,u);
  // character, breaking over the frame
  const ch=(ipad?H*0.36:H*0.62), cx=ipad?W*0.17:W*0.15, cy=ipad?H*0.86:H*0.86;
  x.save(); x.shadowColor='rgba(0,0,0,.45)'; x.shadowBlur=30*u;
  if(i===0) cmFlix(x,cx,cy,ch/306,{pose:'fight'},t);
  else if(i===1) A.kick(x,cx,cy,ch/372,{pose:'fist'},t);
  else if(i===2){ cmKing(x,cx,cy,ch/250,t); }
  else if(i===3){ A.flick(x,cx,cy,ch/330,{pose:'wave'},t); for(const [ox,oy,k,col] of [[-0.09,-0.5,0.55,'#e22511'],[0.1,-0.62,0.45,'#ffc20e'],[0.12,-0.2,0.5,'#2ee6ff']]) cmFlixToy(x,cx+W*ox,cy+ch*oy,k*u*1.4,col,0.2); }
  else A.kick(x,cx,cy,ch/372,{pose:'kick',patch:1},t);
  x.restore();
  band(x,W,H,u,H*(ipad?0.86:0.82));
  const hX=ipad?W*0.05:W*0.035, hY=ipad?H*0.075:H*0.05;
  headline(x,hX,hY,ipad?W*0.62:W*0.3,d,u,{big:ipad?120:112,sub:ipad?30:30,k:ipad?0.9:0.85,single:ipad});
  A.stats(x,d.st,ipad?W*0.05:W*0.035,H-(ipad?100:96)*u,(ipad?78:80)*u,ipad?W*0.9:W*0.5);
  const lh=(ipad?110:96)*u, lw=lh*L.width/L.height; x.drawImage(L,W-lw-(ipad?60:46)*u,ipad?H*0.06:22*u,lw,lh);
  A.footer(x,W,H,u,page); return c.toDataURL('image/png'); };
// ---------- 7: heroes ----------
A.heroes=function(W,H,lang,L,page){ const [c,x]=canvas(W,H); const ipad=W/H<1.6, u=ipad?H/2048*1.55:H/1290, d=T[lang].s7, t=0.3;
  A.bg(x,W,H,W*0.62,H*0.6,u);
  x.save(); x.scale(u,u); cmCity(x,W/u,H/u*0.86,77,{cols:['#7a2cff','#ff3d7f','#2ec4ff','#ffb81a'],hMin:200,hMax:520,bw:140,win:'#fff27a',lit:0.55,lw:5}); x.restore();
  const base=H*(ipad?0.84:0.84), hh=H*(ipad?0.4:0.56), mid=ipad?W*0.5:W*0.66;
  // skins in the back row
  const back=[['k',{body:'#ff8ad8',cape:'#7a2cff'}],['f',{body:'#9fe8ff',scarf:'#ff3d7f'}],['k',{body:'#7dff6a',cape:'#0a2a5e',patch:1}],['f',{body:'#ffe14d',scarf:'#e22511',hat:1}]];
  back.forEach(([k,oo],j)=>{ const bx=mid+W*(ipad?[-0.42,-0.31,0.31,0.42]:[-0.3,-0.235,0.235,0.285])[j], sc=hh*0.58; x.save(); x.globalAlpha=0.95; if(k==='k') A.kick(x,bx,base-H*0.06,sc/372,oo,t); else A.flick(x,bx,base-H*0.06,sc/330,oo,t); x.restore(); });
  x.save(); x.shadowColor='rgba(0,0,0,.5)'; x.shadowBlur=30*u;
  A.kick(x,mid-W*(ipad?0.21:0.155),base,hh*0.86/372,{pose:'fist'},t); A.flick(x,mid+W*(ipad?0.21:0.155),base,hh*0.84/330,{pose:'wave'},t);
  cmFlix(x,mid,base+H*0.02,hh/306,{pose:'land',shout:true},t); x.restore();
  band(x,W,H,u,H*0.82);
  headline(x,ipad?W*0.05:W*0.035,ipad?H*0.075:H*0.05,ipad?W*0.6:W*0.3,d,u,{big:ipad?120:112,sub:30,k:ipad?0.9:0.85});
  A.stats(x,d.st,ipad?W*0.05:W*0.035,H-(ipad?100:96)*u,(ipad?78:80)*u,ipad?W*0.9:W*0.6);
  const lh=(ipad?110:96)*u, lw=lh*L.width/L.height; x.drawImage(L,W-lw-(ipad?60:46)*u,ipad?H*0.06:22*u,lw,lh);
  A.footer(x,W,H,u,page); return c.toDataURL('image/png'); };
// ---------- icon ----------
A.icon=function(S){ const [c,x]=canvas(S,S); const u=S/1024, t=0.55;
  const g=x.createRadialGradient(S*0.5,S*0.5,0,S*0.5,S*0.5,S*0.75); g.addColorStop(0,'#5a2ad8'); g.addColorStop(0.55,'#1a1366'); g.addColorStop(1,'#080a2e'); x.fillStyle=g; x.fillRect(0,0,S,S);
  cmSpeed(x,S,S,S*0.5,S*0.52,40,'rgba(255,194,14,.6)',5,0.25); cmSpeed(x,S,S,S*0.5,S*0.52,30,'rgba(255,45,138,.5)',9,0.25);
  cmBurst(x,S*0.5,S*0.56,S*0.3,S*0.44,14,YEL,3,8*u);
  cmDots(x,0,0,S,S,'rgba(255,255,255,.5)',0.1,Math.round(14*u));
  const s=S*1.08/306; x.save(); x.shadowColor='rgba(0,0,0,.5)'; x.shadowBlur=30*u; cmFlix(x,S*0.5,S*1.13,s,{pose:'land'},t); x.restore();
  return c.toDataURL('image/png'); };
// ---------- launch screen ----------
A.splash=function(S,lang,L){ const [c,x]=canvas(S,S); const u=S/1290, t=0.5;
  A.bg(x,S,S,S*0.5,S*0.52,u); cmBurst(x,S*0.5,S*0.55,S*0.2,S*0.3,16,YEL,5,8*u);
  x.save(); x.shadowColor='rgba(255,140,30,.8)'; x.shadowBlur=50*u; cmFlix(x,S*0.5,S*0.78,S*0.4/306,{pose:'land',shout:true},t); x.restore();
  A.logoArkana(x,S*0.5,S*0.16,170*u,-0.05);
  const lh=120*u, lw=lh*L.width/L.height; x.drawImage(L,S*0.5-lw/2,S*0.84,lw,lh);
  return c.toDataURL('image/png'); };
})();
