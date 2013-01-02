define(["controllers/BaseController"], function(BaseController) {

  var _bpmToMs = function(bpm, sub) {
    return sub / bpm;
  };

  var _bpmToHz = function(bpm, sub) {
    return bpm / sub;
  };

  var BPMSync = BaseController.extend({
    init : function(context) {
      this._super.apply(this, arguments);
      this._bpm = 120;
      this._tapEnabled = true;
      this._notes   = [240, 180, 120, 80, 90, 60, 40, 45, 30, 20, 22.5, 15, 10, 11.25, 7.5, 5];
      this._labels  = ["1/1", "1/2.", "1/2", "1/2T", "1/4.", "1/4", "1/4T", "1/8.", "1/8", "1/8T",
                       "1/16.", "1/16", "1/16T", "1/32.", "1/32", "1/32T"];
      this.MS       = 0;
      this.HZ       = 0;
      this.valuesMS = [];
      this.valuesHZ = [];
      this.interval = 5;
      this.taps     = [];

      this.setType(0);
      this.setInterval(this.interval);
    },
    calculate : function() {
      this.valuesMS = [];
      this.valuesHZ = [];
      for (var i = 0, _len = this._notes.length; i < _len; i ++) {
        this.valuesMS.push(_bpmToMs(this._bpm, this._notes[i]));
        this.valuesHZ.push(_bpmToHz(this._bpm, this._notes[i]));
      }
      return this;
    },
    setBPM : function(bpm) {
      this._bpm = bpm;
      this.calculate();
      this.setInterval(this.interval);
      return this;
    },
    setType : function(type) {
      this.type = type;
      return this;
    },
    setInterval : function(interval) {
      this.calculate();
      this.MS = this.valuesMS[interval];
      this.HZ = this.valuesHZ[interval];
      this.interval = interval;
      return this;
    },
    getBPM : function() {
      return this._bpm;
    },
    getSineSpeed : function() {
      return (2 * Math.PI) * this.HZ;
    },
    getTimeTable : function() {
      return this.valuesMS;
    },
    getHertzTable : function() {
      return this.valuesHZ;
    },
    getTimeValue : function() {
      return this.MS;
    },
    getHertzValue : function() {
      return this.HZ;
    },
    enableTap : function() {
      this._tapEnabled = true;
    },
    disableTap : function() {
      this._tapEnabled = false;
    },
    tap : function() {
      var average = 0;
      this.taps.push(this.context.currentTime);

      if (this.taps.length > 1) {
        // Wait 2 seconds to reset
        if (this.taps[this.taps.length - 1] - this.taps[this.taps.length - 2] > 2) {
          this.resetTaps();
          return;
        } else {
          var milli = this.taps[this.taps.length - 1] - this.taps[0];
          var minutes = milli / 60;
          average = (this.taps.length - 1) / minutes;
        }

        if (this._tapEnabled) {
          this.setBPM(Math.round(average));
        } else {
          return average;
        }
      }
    },
    resetTaps : function() {
      this.taps = [];
      this.taps.push(this.context.currentTime);
    }
  });

  BPMSync.Intervals = 
  BPMSync.prototype.Intervals = {
    WHOLE                  : 0,
    HALF_DOTTED            : 1,
    HALF                   : 2,
    HALF_TRIPLET           : 3,
    QUARTER_DOTTED         : 4,
    QUARTER                : 5,
    QUARTER_TRIPLET        : 6,
    EIGHTH_DOTTED          : 7,
    EIGHTH                 : 8,
    EIGHTH_TRIPLET         : 9,
    SIXTEENTH_DOTTED       : 10,
    SIXTEENTH              : 11,
    SIXTEENTH_TRIPLET      : 12,
    THIRTYSECONDTH_DOTTED  : 13,
    THIRTYSECONDTH         : 14,
    THIRTYSECONDTH_TRIPLET : 15,
  };

  return BPMSync;

});