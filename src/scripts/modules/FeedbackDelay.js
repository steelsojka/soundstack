define(["modules/BaseModule", "components/Delay", "components/Gain", "controllers/BPMSync"], 

function(BaseModule, Delay, Gain, BPMSync) {

  var FeedbackDelay = BaseModule.extend({
    init : function(context, delayTime, feedback) {
      this._super.apply(this, arguments);
      this.setLabel("FeedbackDelay");
      var _delayTime     = delayTime || 4;
      var _feedback  = feedback || 0.5;
      var delay      = new Delay(this.context, _delayTime + 1);
      var bpm        = new BPMSync(this.context);
      var gain       = new Gain(this.context);
      var delayGain  = new Gain(this.context);
      var inputGain  = new Gain(this.context);
      var outputGain = new Gain(this.context);
      
      this._bpmEnabled = false;

      delay.setLabel("FeedbackDelay/Delay");
      gain.setLabel("FeedbackDelay/Gain");
      delayGain.setLabel("FeedbackDelay/Delay Gain");
      inputGain.setLabel("FeedbackDelay/Input Gain");
      outputGain.setLabel("FeedbackDelay/Output Gain");
      
      this.nodes.delay      = delay;
      this.nodes.gain       = gain;
      this.nodes.inputGain  = inputGain;
      this.nodes.outputGain = outputGain;
      this.nodes.delayGain  = delayGain;
      this.nodes.bpm        = bpm;

      this.setFeedback(_feedback);
      this.setDelayTime(_delayTime);

      delay.connect(gain).connect(delay);
      inputGain.connect(delay).connect(delayGain).connect(outputGain);
      inputGain.connect(outputGain);
      
      this.connectToInput(inputGain);
      this.connectToOutput(outputGain);
    },
    setFeedback : function(amount) {
      this.nodes.gain.setGain(amount);
    },
    setDelayTime : function(time) {
      this.nodes.delay.setTime(time);
    },
    setInputGain : function(value) {
      this.nodes.inputGain.setGain(value);
    },
    setOutputGain : function(value) {
      this.nodes.outputGain.setGain(value);
    },
    setDelayGain : function(value) {
      this.nodes.delayGain.setGain(value);
    },
    setBPM : function(bpm) {
      this.nodes.bpm.setBPM(bpm);
      if (this._bpmEnabled) {
        this.setDelayTime(this.nodes.bpm.getTimeValue());
      }
    },
    enableBPM : function() {
      this._bpmEnabled = true;
      console.log("bpm enabled");
    },
    disableBPM : function() {
      this._bpmEnabled = false;
      console.log("bpm disabled");
    },
    toggleBPM : function(enable) {
      if (enable) {
        this.enableBPM();
      } else {
        this.disableBPM();
      }
    },
    getIndicatorValue : function() {
      return this.nodes.bpm.getSineSpeed();
    },
    setInterval : function(interval) {
      this.nodes.bpm.setInterval(interval);
      if (this._bpmEnabled) {
        this.setDelayTime(this.nodes.bpm.getTimeValue());
      }
    }
  });

  FeedbackDelay.prototype.Intervals = FeedbackDelay.Intervals = BPMSync.Intervals;

  return FeedbackDelay;

});