define(["controllers/BaseController", "components/ScriptNode"],

function(BaseController, ScriptNode) {

  var _isDefined = function(object) {
    return typeof object !== "undefined";
  };
  var _inRange = function(min, max, value) {
    return Math.max(Math.min(value, max), min);
  };
  var _getFormula = function() {
    switch (this._type) {
        // Sine LFO
      case 0:
        return function(e) {
          var time = e.target.context.currentTime;
          this._value = (Math.sin(time * this._speed) * (this._amplitude / 2)) + 0.5;
          this.trigger((this._value * this._max) + this._offset);
        };
        // Square LFO
      case 1:
        return function(e) {
          var time = e.target.context.currentTime;
          var sinValue = Math.sin(time * this._speed);
          var amp = this._amplitude;
          this._value = sinValue > 0 ? 1 * amp : sinValue < 0 ? -1 * amp : sinValue === 0 ? 0 : 0;
          this._value = (this._value / 2 + 0.5); 
          this.trigger(this._value * this._max + this._offset)
        };
        // Step LFO
      case 2:
        return function(e) {
          var time = e.target.context.currentTime;
          var sinValue = (Math.sin(time * this._speed) + 0.66666) * 0.75;
          var amp = this._amplitude;
          var interval = 1 / (this._steps);
          var base = 0;
          for (var i = 1; i <= this._steps + 1; i++) {
            if (sinValue >= base && sinValue <= base + interval) {
              this._value = base * amp;
            }
            base += interval;
          }
          this.trigger(this._value * this._max + this._offset)
        };
        // Sawtooth
      case 3:
        return function(e) {
          var time = e.target.context.currentTime;
          this._value = ((this._speed / 10) * time % 1);
          this.trigger((this._value * this._max) + this._offset);
        };
        // Triangle
      case 4:
        return function(e) {     
          var time = e.target.context.currentTime;     
          // var value = (Math.sin(time * (this._speed)) + 0.5;
          // this._value = 1 - 4 * Math.abs(Math.round(value) - value);
          this._value = ((this._speed / 10) * time % 2 < 1) ? 
            (this._speed / 10) * time % 1 - 0.5 : 
            0.5 - ((this._speed / 10) * time % 1);
          // var array = [];
          // for (var i = 0; i < this._value; i += 0.1) {
          //   array.push("*");
          // }
          // console.log(array.join(""));
          this.trigger((this._value * this._max) + this._offset);
        }
      default: 
        return function() {};
    }
  };

  var LFO = BaseController.extend({
    init : function(context, speed, amplitude, max, offset) {
      this._super.apply(this, arguments);
      var self = this;
      var node = new ScriptNode(this.context, settings.get('bufferSize'), 1, 1);
      node.onAudioProcess(function(e) {
        self.calculate(e);
      });
      this.node       = node;
      this._amplitude = _isDefined(amplitude) ? _inRange(0, 1, amplitude) : 1;
      this._speed     = _isDefined(speed) ? speed : 1;
      this._value     = 0;
      this._max       = _isDefined(max) ? max : 1;
      this._offset    = _isDefined(offset) ? offset : 0;
      this._steps     = 4;

      this.setType(0);
      this.enable();
    },
    connectParameter : function(audioParam) {
      this.params.push(audioParam);
    },
    calculate : function(e) {
      // var time = e.target.context.currentTime;
      // this._value = (Math.sin(time * this._speed) * (this._amplitude / 2)) + 0.5;
      // this.trigger((this._value * this._max) + this._offset);
    },
    setSpeed : function(speed) {
      this._speed = speed;
    },
    setAmplitude : function(amplitude) {
      this._amplitude = _inRange(0, 1, amplitude);
    },
    setMax : function(max) {
      this._max = max;
    },
    setOffset : function(offset) {
      this._offset = offset;
    },
    setType : function(type) {
      this._type = parseInt(type);
      this.calculate = _getFormula.call(this);
    },
    getPreProcessValue : function() {
      return this._value;
    },
    disable : function() {
      this.node.getInputNode().disconnect();
    },
    enable : function() {
      this.node.getInputNode().connect(this.node.getContext().destination);
    }
  });

  LFO.prototype.Types = {
    SINE     : 0,
    SQUARE   : 1,
    STEP     : 2,
    SAWTOOTH : 3
    // TRIANGLE : 4
  }

  return LFO;

});