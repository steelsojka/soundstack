var env="app";window.global_relay=_.extend({},Backbone.Events),window.requestAnimFrame=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(e){window.setTimeout(e,1e3/60)}}(),_.mixin({modify:function(e,t){return t(e)},slice:function(e,t,n){var r=Array.prototype.slice;return t>n?r.call(e,n,t):r.call(e,t,n)},round:function(e,t){return Math.round(e/t)*t},inRange:function(e,t,n){return e>=t?e<=n?e:n:t},pad:function(e,t){var n=parseInt(e,10)+"";while(n.length<t)n=0+n;return n},arrayTo32Float:function(e){return new Float32Array(e)},remove:function(e,t,n){var r=e.slice((n||t)+1||e.length);return e.length=t<0?e.length+t:t,e.push.apply(e,r)}}),Array.prototype.remove=function(){var e,t=arguments,n=t.length,r;while(n&&this.length){e=t[--n];while((r=this.indexOf(e))!==-1)this.splice(r,1)}return this},Math.log10=function(e){return Math.log(e)/Math.log(10)},window.worker=new Worker("scripts/worker.js"),window.globals={isPlaying:!1,version:"0.1.7"},require(["views/MainView","models/MainModel","components/AudioContext"],function(e,t,n){window.mainView=new e({model:new t,el:document.getElementById("main-content-wrapper")})});