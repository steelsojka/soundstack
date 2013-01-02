define(["modules/BaseModule", "components/Gain", "components/Oscillator", "controllers/BPMSync",
        "controllers/Envelope", "components/ScriptNode", "components/MonoToStereo"], 

function(BaseModule, Gain, Oscillator, BPMSync, Envelope, ScriptNode, MonoToStereo) {

  var Metronome = BaseModule.extend({
    init : function(context) {
      this._super.apply(this, arguments);
      this._started         = false;
      this._startTime       = 0;
      this._nextTriggerTime = 0;
      this._accentNote      = true;
      this._totalClicks     = 0;
      this._bpmClicks       = 0;
      this._baseTime        = 4;
      this._beatsPerMeasure = 4;
      this._accentVolume    = 1;
      this._destroy         = this.destroy;
      this.reference        = true;
      this.isPlaying = true;

      var self = this;
      var gain       = new Gain(this.context);
      var outputGain = new Gain(this.context);
      var bpm        = new BPMSync(this.context);
      var envelope   = new Envelope(this.context, 0, 0.1, 0.1, 0.05);
      var osc        = new Oscillator(this.context);
      var scriptNode = new ScriptNode(this.context, settings.get('bufferSize'), 1, 1);
      var mono2Stereo = new MonoToStereo(this.context);

      _.extend(this, Backbone.Events);

      osc.connect(gain).connect(outputGain).connect(mono2Stereo);
      this.connectToOutput(mono2Stereo);
      scriptNode.connectToMaster();

      osc.noteOn(0).setType(osc.Types.SQUARE);
      gain.setGain(0);

      envelope.connect(gain.getParameters("gain"));

      bpm.setBPM(120).setInterval(bpm.Intervals.QUARTER);

      scriptNode.onAudioProcess(function(e) {
        var time = e.target.context.currentTime;
        if (self._started && time >= self._nextTriggerTime) {
          if (self._bpmClicks % self._beatsPerMeasure === 0) {
            self.nodes.envelope.setMaxValue(self._accentVolume);
          } else {
            self.nodes.envelope.setMaxValue(0.5);
          }
          self._trigger(time);
        }
      });

      this.nodes.gain       = gain;
      this.nodes.outputGain = outputGain;
      this.nodes.bpm        = bpm;
      this.nodes.envelope   = envelope;
      this.nodes.osc        = osc;
      this.nodes.scriptNode = scriptNode;

      this.disable = function() {
        self.stop();
      }
      this.enable = function() {
        self.start();
      }
      this.destroy = function() {
        self.stop();
        self._destroy();
      }

    },
    setGain : function(gain) {
      this.nodes.outputGain.setGain(gain);
    },
    setReference : function(bool) {
      this.reference = bool;
      this.isPlaying = !bool;
      this.trigger("reference-change", bool);
    },
    setBPM : function(bpm) {
      var time = this.context.currentTime;
      this.nodes.bpm.setBPM(bpm);
      this._bpmClicks = 0;
      this._nextTriggerTime = time + this.nodes.bpm.getTimeValue();
    },
    setType : function(type) {
      this.nodes.osc.setType(type);
    },
    setBeatsPerMeasure : function(beats) {
      this._beatsPerMeasure = beats;
    },
    setAccentVolume : function(volume) {
      this._accentVolume = volume;
    },
    _trigger : function() {
      var time = this.context.currentTime;
      this.nodes.envelope.trigger(0.02);
      this._nextTriggerTime = time + this.nodes.bpm.getTimeValue();
      this._totalClicks++;
      this._bpmClicks++;
    },
    start : function() {
      this._started = true;
      this._startTime = this.context.currentTime;
      this._nextTriggerTime = this._startTime + this.nodes.bpm.getTimeValue();
    },
    stop : function() {
      this._started = false;
    },
    tap : function() {
      this.nodes.bpm.tap();
    },
    setInterval : function(interval) {
      this.nodes.bpm.setInterval(interval);
    }
  });

  Metronome.Intervals = 
  Metronome.prototype.Intervals = {
    WHOLE     : BPMSync.Intervals.WHOLE,
    HALF      : BPMSync.Intervals.HALF,
    QUARTER   : BPMSync.Intervals.QUARTER,
    EIGHTH    : BPMSync.Intervals.EIGHTH,
    SIXTEENTH : BPMSync.Intervals.SIXTEENTH
  };

  return Metronome;

});