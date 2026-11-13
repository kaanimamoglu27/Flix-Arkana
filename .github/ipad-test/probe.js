/* iPad test only: lists tappable elements that fall outside the visible screen. */
(function(){
  var STAGE = '__STAGE__';
  function vis(el){var s=getComputedStyle(el);if(s.display==='none'||s.visibility==='hidden'||+s.opacity===0)return false;var r=el.getBoundingClientRect();return r.width>2&&r.height>2;}
  function label(el){return ((el.innerText||el.getAttribute('aria-label')||el.id||el.className||el.tagName)+'').replace(/\s+/g,' ').trim().slice(0,22);}
  function tappables(){var out=[];document.querySelectorAll('button,a,[onclick],[role=button],[data-open],[data-t],.btn,input,select').forEach(function(el){if(vis(el))out.push(el);});document.querySelectorAll('body *').forEach(function(el){if(out.indexOf(el)<0&&getComputedStyle(el).cursor==='pointer'&&vis(el)&&!el.closest('button,a,[onclick],[role=button]'))out.push(el);});return out;}
  function probe(){
    var W=innerWidth,H=innerHeight,bad=[];
    tappables().forEach(function(el){var r=el.getBoundingClientRect();if(r.bottom>H+1||r.top<-1||r.right>W+1||r.left<-1)bad.push(label(el)+' ['+Math.round(r.top)+'..'+Math.round(r.bottom)+']');});
    var sb=document.documentElement.scrollHeight;
    var d=document.getElementById('__ipadprobe')||document.createElement('div');d.id='__ipadprobe';
    d.style.cssText='position:fixed;left:0;right:0;top:0;z-index:2147483647;pointer-events:none;font:11px/1.3 -apple-system,sans-serif;color:#fff;padding:4px 6px;background:'+(bad.length?'rgba(200,0,0,.85)':'rgba(0,140,60,.85)');
    d.textContent=STAGE+' | '+W+'x'+H+' | scrollH '+sb+' | '+(bad.length?('TASAN '+bad.length+': '+bad.slice(0,6).join(' · ')):'tum butonlar ekranda');
    document.body.appendChild(d);
  }
  function clickText(re){var c=tappables().filter(function(el){var r=el.getBoundingClientRect();return re.test(el.innerText||'')&&r.bottom<=innerHeight&&r.top>=0;});if(c.length){c[0].click();return true;}return false;}
  addEventListener('load',function(){
    setTimeout(function(){
      if(STAGE==='play')clickText(/^\s*(▶\s*)?(oyna|ba[sş]la|play|start|devam|giri[sş]|ba[sş]lat)\b/i)||clickText(/oyna|ba[sş]la|play|start/i);
      if(STAGE==='menu2'){clickText(/ayar|settings|⚙/i);}
      setTimeout(probe,2500);setInterval(probe,3000);
    },7000);
  });
})();
