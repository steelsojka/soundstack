define("TapDelay", ["Delay", "Gain", "BaseModule"], function(Delay, Gain, BaseModule) {

  var TapDelay = BaseModule.extend({
    init : function(taps) {
      this._super();
      var gain;
      var delay;
      var inputGain = new Gain();
      var outputGain = new Gain();
      this.taps = taps;
      inputGain.setLabel("TapDelay/Input Gain");
      outputGain.setLabel("TapDelay/Output Gain");

      var interval = 1 / (taps + 1);
      var decay = 1 - interval;
      this.setLabel(taps + " Tap Delay");
      for (var i = 1; i <= taps; i++) {
        delay = new Delay(20);
        delay.setLabel("TapDelay/Delay " + i);
        gain = new Gain();
        gain.setLabel("TapDelay/Gain " + i);
        gain.setGain(decay); 
        decay -= interval;

        inputGain.connect(delay);
        delay.connect(gain);
        gain.connect(outputGain);
        
        (function(nodes,delay, gain) {
          nodes["delay" + i] = delay;
          nodes["delay" + i + "_gain"] = gain;
        }(this.nodes, delay, gain));
      }

      this.setDelayTime(1);
      inputGain.connect(outputGain);
      this.inputNode = inputGain.getInputNode();
      this.outputNode = outputGain.getOutputNode();
    },
    setDelayTime : function(time) {
      for (var i = 1; i <= this.taps; i++) {
        this.nodes["delay" + i].setTime(time * i);
      }
    }
  });

  return TapDelay;

});