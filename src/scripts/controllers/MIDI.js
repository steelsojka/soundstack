define(["controllers/BaseController"], function(BaseController) {

  var _isDefined = function(object) {
    return typeof object !== "undefined";
  };
  var _inRange = function(min, max, value) {
    return Math.max(Math.min(value, max), min);
  };
  var _inBounds = function(min, max, value) {
    return value >= min && value <= max;
  };
  var config = {
    NOTES : ['C ','C#','D ','D#','E ','F ','F#','G ','G#','A ','A#','B '],
    BASE_A4 : 440
  };

  var MIDI = BaseController.extend({
    init : function() {
      this._super.apply(this, arguments);
      this.setType(this.Types.NOTE_TO_FREQUENCY);
    },
    noteToFrequency : function(note) {
      if (_inBounds(0, 119, note)) {
        return config.BASE_A4 * Math.pow(2, (note - 69) / 12);
      } else {
        return -1;
      }
    },
    noteToName : function(note) {
      if (_inBounds(0, 119, note)) {
        return (config.NOTES[note % 12] + (Math.round(note / 12)).toString()).replace(/\s+/g, '');
      } else {
        return '---';
      }
    },
    frequencyToNote : function(freq) {
      return Math.round(12 * (Math.log(freq / config.BASE_A4) / Math.log(2))) + 69;
    },
    nameToNote : function(string) { 
      var c, i, s, _len;

      if (string.length === 2) {
        s = string[0] + " " + string[1];
      } else if (string.length > 2) {
        return -1;
      }
      s.toUpperCase();
      c = -1;
      for (i = 0, _len = config.NOTES.length; i < _len; i++) {
        if (config.NOTES[i] === s[0] + s[1]) {
          c = i;
          break;
        }
      }
      try {
        i = parseInt(s[2], 10);
        return i * 12 + c;
      } catch(err) {
        return -1;
      }

      if (c < 0) return -1;
    },
    convert : function(value) {
      var converted;
      switch (this._type) {
        case 0:
          converted = this.noteToFrequency(value);
          break;
        case 1:
          converted = this.noteToName(value);
          break;
        case 2:
          converted = this.frequencyToNote(value);
          break;
        case 3:
          converted = this.nameToNote(value);
          break;
      }
      this.trigger(converted);
    },
    setType : function(type) {
      this._type = type;
    }
  });

  MIDI.prototype.Types = {
    NOTE_TO_FREQUENCY : 0,
    NOTE_TO_NAME      : 1,
    FREQUENCY_TO_NOTE : 2,
    NAME_TO_NOTE      : 3
  };

  return MIDI;

});