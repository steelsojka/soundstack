define(["modules/BaseModule", "components/Compressor", "components/Gain"], 

function(BaseModule, Compressor, Gain) {

  var CompressorModule = BaseModule.extend({
    init : function(context) {
      this._super.apply(this, arguments);
      
      var comp    = new Compressor(this.context);
      var inGain  = new Gain(this.context);
      var outGain = new Gain(this.context);

      inGain.connect(comp).connect(outGain);

      this.connectToInput(inGain);
      this.connectToOutput(outGain);

      this.nodes.inGain  = inGain;
      this.nodes.outGain = outGain;
      this.nodes.comp    = comp;
    },
    setAttack : function(value) {
      this.nodes.comp.setAttack(value);
    },
    setThreshold : function(value) {
      this.nodes.comp.setThreshold(value);
    },
    setRelease : function(value) {
      this.nodes.comp.setRelease(value);
    },
    setRatio : function(value) {
      this.nodes.comp.setRatio(value);
    },
    setKnee : function(value) {
      this.nodes.comp.setAttack(value);
    },
    setOutputGain : function(value) {
      this.nodes.outGain.setGain(value);
    },
    setInputGain : function(value) {
      this.nodes.inGain.setGain(value);
    },
    getReduction : function() {
      return this.nodes.comp.getReduction();
    }
  });

  return CompressorModule;

});