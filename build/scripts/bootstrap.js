var env="app";window.global_relay=_.extend({},Backbone.Events),window.requestAnimFrame=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(e){window.setTimeout(e,1e3/60)}}(),_.mixin({modify:function(e,t){return t(e)},slice:function(e,t,n){var r=Array.prototype.slice;return t>n?r.call(e,n,t):r.call(e,t,n)},round:function(e,t){return Math.round(e/t)*t},inRange:function(e,t,n){return e>=t?e<=n?e:n:t},pad:function(e,t){var n=parseInt(e,10)+"";while(n.length<t)n=0+n;return n}}),Math.log10=function(e){return Math.log(e)/Math.log(10)},window.worker=new Worker("scripts/worker.js"),window.globals={isPlaying:!1,version:"0.1.2b"},require(["views/MainView","models/MainModel","components/AudioContext"],function(e,t,n){window.mainView=new e({model:new t,el:document.getElementById("main-content-wrapper")})});