define(["modules/BaseModule", "components/Gain"], function(BaseModule, Gain) {

  var SpectrumAnalyser = BaseModule.extend({
    init : function() {
      this._super.apply(this, arguments);
      var self = this;
      
      this.spectrumType = 0;
      this.nodes.gain = new Gain(this.context);

      this.connectToInput(this.nodes.gain);
      this.connectToOutput(this.nodes.gain);
    },
    setType : function(type) {
      this.spectrumType = parseInt(type, 10);
    },
    setBars : function(bars) {
      this.bars = parseInt(bars, 10);
    }
  });

  return SpectrumAnalyser;

});