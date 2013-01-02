define(["controllers/BaseController"], function(BaseController) {

  var _trigger = function(param, length) {
    var self = this;
    var current = this.context.currentTime;
    var type = this.type === 0 ? "linear" : "exponential";
    param.cancelScheduledValues(current);
    param.setValueAtTime(this._startValue, current);
    param[type + "RampToValueAtTime"](this._maxValue, current + this._attack);
    current += this._attack;
    param[type + "RampToValueAtTime"](this._maxValue, current + this._decay);
    if (length) {
      setTimeout(function() {self.release();}, length * 1000);
    }
  };

  var _release = function(param) {
    var self = this;
    var current = this.context.currentTime;
    var type = this.type === 0 ? "linear" : "exponential";
    param.cancelScheduledValues(current);
    param.setValueAtTime(param.value, current);
    param[type + "RampToValueAtTime"](this._startValue, current + this._release);
  };

  var Envelope = BaseController.extend({
    init : function(context, a, d, s, r) {
      this._super.apply(this, arguments);
      this._attack  = a;
      this._decay   = d;
      this._sustain = s;
      this._release = r;
      this._startValue = 0;
      this._maxValue = 1;
      this.type = 0;

      this.Types.LINEAR      = 0;
      this.Types.EXPONENTIAL = 1;

    },
    trigger : function(length) {
      for (var i = 0, _len = this.params.length; i < _len; i++) {
        // this.params[i].startValue = start;
        _trigger.call(this, this.params[i], length);
      }
    },
    triggerFromCurrentValue : function(max, length) {
      var start, _max;
      for (var i = 0, _len = this.params.length; i < _len; i++) {
        start = this.params[i].value;
        this.params[i].startValue = start;
        _max = start + max;
        _trigger.call(this, this.params[i], start, _max, length);
      }
    },
    release : function() {
      var _min;
      for (var i = 0, _len = this.params.length; i < _len; i++) {
        // _min = typeof min === "undefined" ? this.params[i].startValue : min;
        _release.call(this, this.params[i]);
      }
    },
    setType : function(type) {
      this.type = type;
    },
    setAttack : function(a) {
      this._attack = parseFloat(a, 10);
    },
    setDecay : function(d) {
      this._decay = parseFloat(d, 10);
    },
    setSustain : function(s) {
      this._sustain = parseFloat(s, 10);
    },
    setRelease : function(r) {
      this._release = parseFloat(r, 10);
    },
    setStartValue : function(value) {
      this._startValue = parseFloat(value, 10);
    },
    setMaxValue : function(value) {
      this._maxValue = parseFloat(value, 10);
    }
  });

  return Envelope;

});