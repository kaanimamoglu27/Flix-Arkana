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
function rimmed(x,W,H,u,sc,draw,cols){ cols=cols||['#ffd34a','#ff3dd2']; const r=11*sc, k0=7*sc; const spr=A.sprite(W,H,draw,[[r,r*.35,k0,cols[0],.85],[-r,-r*.2,k0,cols[1],.5]]); x.save(); x.shadowColor='rgba(0,0,0,.55)'; x.shadowBlur=34*u; x.drawImage(spr,0,0); x.restore(); return spr; }
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
  const s=H*(wide?0.66:0.52)/400, hx=W*(wide?0.65:0.66), hy=H*(wide?0.9:0.87);
  const out=[]; const spr=A.sprite(W,H,q=>A.flixH(q,hx,hy,s,{pose:'hero',out,shout:true},t),[[11*s,4*s,7*s,'#ffd34a',.9],[-11*s,-2*s,7*s,'#ff3dd2',.5]]);
  const f=out[0]||{x:hx,y:hy-H*.6};
  A.fire2(x,[f.x,f.y, f.x+W*0.02,H*0.0, W*0.97,-H*0.04, W*1.04,H*0.5],30*u*(wide?1:1.15),3);
  A.fire2(x,[f.x,f.y+20*u, f.x-W*0.14,H*0.55, W*0.5,H*1.02, W*1.06,H*0.82],20*u,8);
  const gl=x.createRadialGradient(hx,hy,0,hx,hy,H*.5); gl.addColorStop(0,'rgba(255,170,60,.45)'); gl.addColorStop(1,'rgba(255,120,30,0)'); x.save(); x.globalCompositeOperation='lighter'; x.fillStyle=gl; x.fillRect(hx-H*.6,hy-H*.7,H*1.2,H*.9); x.restore();
  A.vignette(x,W,H,.5); band(x,W,H,u,H*0.8);
  x.save(); x.shadowColor='rgba(255,140,30,.85)'; x.shadowBlur=70*u; x.drawImage(spr,0,0); x.restore();
  x.save(); x.fillStyle='rgba(0,0,0,.35)'; x.beginPath(); x.ellipse(hx,hy-6*u,170*s,22*s,0,0,7); x.globalCompositeOperation='destination-over'; x.restore();
  { const r=cmRand(5531); for(let i=0;i<10;i++) A.spark(x,hx+(r()-.5)*W*.35,hy-r()*H*.8,(8+r()*16)*u,'#fff6c0'); }
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
  let ch=(ipad?H*0.36:H*0.62), cx=ipad?W*0.17:W*0.15, cy=ipad?H*0.86:H*0.86;
  const gl=x.createRadialGradient(cx,cy-ch*.5,0,cx,cy-ch*.5,ch*.8); gl.addColorStop(0,['rgba(255,150,40,.45)','rgba(255,210,40,.4)','rgba(140,255,120,.35)','rgba(90,200,255,.4)','rgba(255,80,20,.5)'][i]); gl.addColorStop(1,'rgba(0,0,0,0)'); x.save(); x.globalCompositeOperation='lighter'; x.fillStyle=gl; x.fillRect(cx-ch,cy-ch*1.4,ch*2,ch*1.6); x.restore();
  if(i===4) A.fire2(x,[cx-ch*.6,cy+ch*.05, cx-ch*.2,cy-ch*.9, cx+ch*.6,cy-ch*.1, cx+ch*1.1,cy-ch*.9],22*u,12);
  if(i===0){ const sc=ch/400*1.05; cx+=W*0.025; rimmed(x,W,H,u,sc,q=>A.flixH(q,cx,cy,sc,{pose:'fight'},t)); }
  else if(i===1){ const sc=ch/372; rimmed(x,W,H,u,sc,q=>A.kickH(q,cx,cy,sc,{pose:'fist'},t)); }
  else if(i===2){ const sc=ch/250; rimmed(x,W,H,u,sc*.8,q=>cmKing(q,cx,cy,sc,t),['#9dff6a','#ff3dd2']); }
  else if(i===3){ const sc=ch/330; rimmed(x,W,H,u,sc,q=>A.flickH(q,cx,cy,sc,{pose:'flick'},t),['#7ff0ff','#ff3dd2']);
    const hx=cx+138*sc, hy=cy-228*sc;
    x.save(); x.strokeStyle='rgba(255,255,255,.85)'; x.lineWidth=6*u; x.lineCap='round'; x.setLineDash([2*u,18*u]); x.beginPath(); x.moveTo(hx+10*sc,hy-20*sc); x.quadraticCurveTo(hx+90*sc,hy-150*sc,hx+200*sc,hy-60*sc); x.stroke(); x.restore();
    for(const [ox,oy,k,col,r] of [[60,-70,.7,'#e22511',.4],[170,-30,.6,'#ffc20e',-.3],[120,-150,.5,'#2ee6ff',.8]]){ const tx=hx+ox*sc, ty=hy+oy*sc+60*sc*k; x.save(); x.shadowColor='rgba(255,255,255,.9)'; x.shadowBlur=24*u; cmFlixToy(x,tx,ty,k*sc,col,r); x.restore(); A.spark(x,tx-40*sc,ty-110*sc*k,12*u,'#fff6c0'); } }
  else { const sc=ch/372; rimmed(x,W,H,u,sc,q=>A.kickH(q,cx,cy,sc,{pose:'kick',patch:1},t),['#ffd34a','#ff6a1a']); }
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
  back.forEach(([k,oo],j)=>{ const bx=mid+W*(ipad?[-0.42,-0.31,0.31,0.42]:[-0.3,-0.235,0.235,0.285])[j], sc=hh*0.58; x.save(); x.shadowColor='rgba(0,0,0,.5)'; x.shadowBlur=20*u; if(k==='k') A.kickH(x,bx,base-H*0.06,sc/372,oo,t); else A.flickH(x,bx,base-H*0.06,sc/330,oo,t); x.restore(); });
  const gl=x.createRadialGradient(mid,base-hh*.5,0,mid,base-hh*.5,hh); gl.addColorStop(0,'rgba(255,190,60,.5)'); gl.addColorStop(1,'rgba(0,0,0,0)'); x.save(); x.globalCompositeOperation='lighter'; x.fillStyle=gl; x.fillRect(mid-hh*1.2,base-hh*1.6,hh*2.4,hh*1.8); x.restore();
  const k1=hh*0.86/372, f1=hh*0.84/330, x1=hh*1.08/400;
  rimmed(x,W,H,u,k1,q=>A.kickH(q,mid-W*(ipad?0.21:0.155),base,k1,{pose:'fist'},t));
  rimmed(x,W,H,u,f1,q=>A.flickH(q,mid+W*(ipad?0.21:0.155),base,f1,{pose:'wave'},t),['#7ff0ff','#ff3dd2']);
  rimmed(x,W,H,u,x1,q=>A.flixH(q,mid,base+H*0.02,x1,{pose:'hero',shout:true},t));
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
  const s=S*0.84/400; const spr=A.sprite(S,S,q=>A.flixH(q,S*0.52,S*1.0,s,{pose:'hero'},t),[[11*s,4*s,7*s,'#ffd34a',.9],[-11*s,-2*s,7*s,'#ff3dd2',.5]]); x.save(); x.shadowColor='rgba(0,0,0,.55)'; x.shadowBlur=30*u; x.drawImage(spr,0,0); x.restore(); A.vignette(x,S,S,.35);
  return c.toDataURL('image/png'); };
// ---------- launch screen ----------
A.splash=function(S,lang,L){ const [c,x]=canvas(S,S); const u=S/1290, t=0.5;
  A.bg(x,S,S,S*0.5,S*0.52,u); cmBurst(x,S*0.5,S*0.55,S*0.2,S*0.3,16,YEL,5,8*u);
  const s=S*0.5/400; const spr=A.sprite(S,S,q=>A.flixH(q,S*0.52,S*0.8,s,{pose:'hero',shout:true},t),[[11*s,4*s,7*s,'#ffd34a',.9],[-11*s,-2*s,7*s,'#ff3dd2',.5]]); x.save(); x.shadowColor='rgba(255,140,30,.8)'; x.shadowBlur=50*u; x.drawImage(spr,0,0); x.restore();
  A.logoArkana(x,S*0.5,S*0.16,170*u,-0.05);
  const lh=120*u, lw=lh*L.width/L.height; x.drawImage(L,S*0.5-lw/2,S*0.84,lw,lh);
  return c.toDataURL('image/png'); };
})();
