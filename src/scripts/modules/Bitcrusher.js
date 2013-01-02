define(["modules/BaseModule", "components/ScriptNode"], function(BaseModule, ScriptNode) {

  var config = {
    MAX_BITS : 32
  };

  var Bitcrusher = BaseModule.extend({
    init : function() {
      this._super.apply(this, arguments);
      var crusher = new ScriptNode(this.context, 512, 2, 2);
      var self = this;
      this._bits = 8;
      
      this.setLabel("Bitcrusher");

      this.connectToInput(crusher);
      this.connectToOutput(crusher);

      this.nodes.bitcrusher = crusher;

      crusher.onAudioProcess(function(e) {
        self.calculate(e);
      });
    },
    calculate : function(e) {

      var outputBuffer    = e.outputBuffer;
      var dataLeft        = e.inputBuffer.getChannelData(0);
      var dataRight       = e.inputBuffer.getChannelData(1);
      var outputDataLeft  = outputBuffer.getChannelData(0);
      var outputDataRight = outputBuffer.getChannelData(1);
      var length          = outputBuffer.length;
      var step            = config.MAX_BITS / this._bits;
      var x               = 0;

      for (var i = 0; i < length; i += step) {
        var bitLeft = dataLeft[i];
        var bitRight = dataRight[i];
        for (x = 0; x < step; x++) {
          outputDataLeft[i + x] = bitLeft;
          outputDataRight[i + x] = bitRight;
        }
      }
    },
    setBits : function(bits) {
      if (!(config.MAX_BITS % bits)) {
        this._bits = bits;
      }
    }
  });

  return Bitcrusher;

});