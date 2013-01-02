define(["controllers/LFO", "modules/BaseModule", "components/Gain", "controllers/BPMSync"], 

function(LFO, BaseModule, Gain, BPMSync) {

  var _isDefined = function(object) {
    return typeof object !== "undefined";
  };

  var Tremelo = BaseModule.extend({
    init : function(context, speed, amplitude) {
      this._super.apply(this, arguments);
      var gain = this.nodes.gain = new Gain(this.context);
      var lfo  = this.nodes.lfo  = new LFO(this.context);
      var bpm  = this.nodes.bpm  = new BPMSync(this.context);

      this._bpmEnabled = true;

      lfo.connect(gain.getParameters("gain"));

      this.setSpeed(_isDefined(speed) ? speed : 10);
      this.setAmplitude(_isDefined(amplitude) ? setAmplitude : 1);

      this.connectToInput(gain);
      this.connectToOutput(gain);
    },
    setSpeed : function(speed) {
      this.nodes.lfo.setSpeed(speed);
    },
    setAmplitude : function(amp) {
      this.nodes.lfo.setAmplitude(amp);
    },
    setType : function(type) {
      this.nodes.lfo.setType(type);
    },
    setBPM : function(bpm) {
      this.nodes.bpm.setBPM(bpm);
      if (this._bpmEnabled) {
        this.setSpeed(this.nodes.bpm.getSineSpeed());
      }
    },
    enableBPM : function() {
      this._bpmEnabled = true;
    },
    disableBPM : function() {
      this._bpmEnabled = false;
    },
    toggleBPM : function(enable) {
      if (enable) {
        this.enableBPM();
      } else {
        this.disableBPM();
      }
    },
    setInterval : function(interval) {
      this.nodes.bpm.setInterval(interval);
      if (this._bpmEnabled) {
        this.setSpeed(this.nodes.bpm.getSineSpeed());
      }
    },
    getIndicatorValue : function() {
      return this.nodes.lfo.getPreProcessValue();
    }
  });

  return Tremelo;
});