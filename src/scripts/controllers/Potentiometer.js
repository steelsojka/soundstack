define(["controllers/BaseController"], function(BaseController) {

  var _isDefined = function(object) {
    return typeof object !== "undefined";
  };
  var _inRange = function(min, max, value) {
    return value <= max ? value >= min ? value : min : max;
  };

  var Potentiometer = BaseController.extend({
    init : function(context, min, max) {
      this._super.apply(this, arguments);
      this._min   = _isDefined(min) ? min : 0;
      this._max   = _isDefined(max) ? max : 1;
      this._type  = 0; // Linear by default
      this._value = this._min;
      this._curve = 2;

      this.Types.LINEAR = 0;
      this.Types.LOG    = 1;
    },
    setMax : function(value) {
      this._max = value;
    },
    setMin : function(value) {
      this._min = value;
    },
    setType : function(type) {
      this._type = type;
    },
    setCurve : function(value) { 
      this.curve = value;
    },
    setValue : function(value) {
      value = parseFloat(value);
      if (this._type === 1) {
        this._value = Math.pow(value, this._curve);
      } else {
        this._value = value * this._max;
      }
      this.trigger(_inRange(this._min, this._max, this._value));
    }
  });

  return Potentiometer;

});