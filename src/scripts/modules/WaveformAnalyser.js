define(["modules/BaseModule", "components/Gain"], function(BaseModule, Gain) {

  var WaveformAnalyser = BaseModule.extend({
    init : function() {
      this._super.apply(this, arguments);
      var self = this;
      
      this.nodes.gain = new Gain(this.context);

      this.connectToInput(this.nodes.gain);
      this.connectToOutput(this.nodes.gain);
    }
  });

  return WaveformAnalyser;

});