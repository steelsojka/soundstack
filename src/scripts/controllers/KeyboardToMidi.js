define(["controllers/BaseController", "controllers/MIDI"], function(BaseController, MIDI) {

  var config = {
    ATTACH_LISTENER : true,
    BASE : {
      65 : 45,
      87 : 46,
      83 : 47,
      69 : 48,
      68 : 49,
      70 : 50,
      84 : 51,
      71 : 52,
      89 : 53,
      72 : 54,
      85 : 55,
      74 : 56,
      75 : 57,
      79 : 58,
      76 : 59
    }
  };

  var KeyboardToMidi = BaseController.extend({
    init : function() {
      this._super.apply(this, arguments);
      this.MIDI = new MIDI();
      this.notes = config.BASE;
      this.buttonPressed = false;
      if (config.ATTACH_LISTENER) {
        this.createListener();
      }
    },
    convert : function(_char) {
      if (_char === 190) {
        this.shiftOctaveUp();
      } else if (_char === 188) {
        this.shiftOctaveDown();
      } else {
        if (_char in this.notes) {
          this.MIDI.convert(this.notes[_char]);
          this.emit("controller:note-on", this.notes[_char]);
        }
      }
    },
    connect : function(param) {
      this.MIDI.connect(param);
    },
    setType : function(type) {
      this._type = type;
    },
    shiftOctaveUp : function() {
      for (var note in this.notes) {
        this.notes[note] += 12;
      }
    },
    shiftOctaveDown : function() {
      for (var note in this.notes) {
        this.notes[note] -= 12;
      }
    },
    createListener : function() {
      var self = this;

      window.addEventListener("keydown", function(e) {
        if (!self.buttonPressed) {
          self.convert(e.keyCode);
          self.buttonPressed = true;
        }
      });
      window.addEventListener("keyup", function(e) {
        self.emit("controller:note-off");
        self.buttonPressed = false;
      });
    }
  });

  return KeyboardToMidi;

});