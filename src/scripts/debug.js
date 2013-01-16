(function(exports, console) {
 
  var Timer = function(enabled, context) {
    this.startTime = 0;
    this.enabled = enabled;
    this.context = context;
  };

  Timer.prototype = {
    start : function() {
      if (!this.enabled) return;
      this.startTime = this.context.currentTime;
    },
    stop : function() {
      if (!this.enabled) return;
      return this.context.currentTime - this.startTime;
    },
    setContext : function(context) {
      if (!this.enabled) return
      this.context = context;
    }
  };

  exports.debug = {
    context : null,
    enabled : true,
    Timer : null,
    log : function(a, tempDisable) {
      if (this.enabled && !tempDisable) {
        console.log(a);
      }
    },
    clear : function() {
      if (console.clear) {
        console.clear();
      }
    },
    export : function(name, obj) {
      if (this.enabled) {
        exports[name] = obj;
      }
    },
    set : function(name, obj) {
      this[name] = obj;
    },
    createTimer : function(context) {
      this.Timer = new Timer(this.enabled, context);
    } 
  };
  
}(this, console));