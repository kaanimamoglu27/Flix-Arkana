/* iPad test only: AdMob/ATT disabled so no prompt covers the screen. */
window.FlixAds=new Proxy({},{get:function(t,k){if(typeof k!=='string')return undefined;if(/Required$|Ready$/.test(k))return function(){return false};return function(){return Promise.resolve('closed')}}});
