var env = "app";

window.global_relay = _.extend({}, Backbone.Events);

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       || 
          window.webkitRequestAnimationFrame || 
          window.mozRequestAnimationFrame    || 
          window.oRequestAnimationFrame      || 
          window.msRequestAnimationFrame     || 
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

_.mixin({
  modify : function(obj, interceptor) {
    return interceptor(obj);
  },
  slice : function(array, start, end) {
    var slice = Array.prototype.slice;
    if (start > end) {
      return slice.call(array, end, start);
    } else {
      return slice.call(array, start, end);
    }
  },
  round : function(num, pre) {
    return Math.round(num / pre) * pre;
  },
  inRange : function(value, min, max) {
    return value >= min ? value <= max ? value : max : min;
  },
  pad : function(num, size) {
    var s = parseInt(num, 10) + "";
    while (s.length < size) s = 0 + s;
    return s;
  },
  arrayTo32Float : function(array) {
    return new Float32Array(array);
  },
  remove : function(array, from, to) {
    var rest = array.slice((to || from) + 1 || array.length);
    array.length = from < 0 ? array.length + from : from;
    return array.push.apply(array, rest);
  }
});

Array.prototype.remove = function() {
  var what, a = arguments, L = a.length, ax;
  while (L && this.length) {
    what = a[--L];
    while ((ax = this.indexOf(what)) !== -1) {
        this.splice(ax, 1);
    }
  }
  return this;
};

Math.log10 = function(val) {
  return Math.log(val) / Math.log(10);
}

window.worker = new Worker("scripts/worker.js");

window.globals = {
  isPlaying : false,
  version : "0.1.7"
};

require(["views/MainView", "models/MainModel", "components/AudioContext"], 

function(MainView, MainModel, AudioContext) {

  window.mainView = new MainView({
    model : new MainModel(),
    el : document.getElementById("main-content-wrapper")
  });

  
});