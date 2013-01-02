define(["modules/BaseModule", "components/Convolver", "components/Gain"], 

function(BaseModule, Convolver, Gain) {

  var Reverb = BaseModule.extend({
    init : function() {
      this._super.apply(this, arguments);
      var convolver  = new Convolver(this.context);
      var wetGain    = new Gain(this.context);
      var dryGain    = new Gain(this.context);
      var inputGain  = new Gain(this.context);
      var outputGain = new Gain(this.context);

      inputGain.connect(convolver).connect(wetGain).connect(outputGain);
      inputGain.connect(dryGain).connect(outputGain);

      this.connectToInput(inputGain);
      this.connectToOutput(outputGain);

      this.nodes.convolver  = convolver;
      this.nodes.wetGain    = wetGain;
      this.nodes.dryGain    = dryGain;
      this.nodes.inputGain  = inputGain;
      this.nodes.outputGain = outputGain;
    },
    setWetGain : function() {
      this.nodes.wetGain.setGain.apply(this.nodes.wetGain, arguments);
    },
    setDryGain : function() {
      this.nodes.dryGain.setGain.apply(this.nodes.dryGain, arguments);
    },
    loadImpulse : function() {
      this.nodes.convolver.loadImpulse.apply(this.nodes.convolver, arguments);
    }
  });

  return Reverb;

});