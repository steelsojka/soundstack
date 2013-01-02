define(["modules/BaseModule", "components/ScriptNode"], function(BaseModule, ScriptNode) {

  var _inRange = function(min, max, value) {
    return value >= min ? value <= max ? value : max : min;
  };  

  var Distortion = BaseModule.extend({
    init : function(context) {
      this._super.apply(this, arguments);
      this._amount = 1;

      var self = this;
      var clipper = new ScriptNode(this.context, settings.get('bufferSize'), 2, 2);
      

      clipper.onAudioProcess(function(e) {
        var len = e.inputBuffer.length;
        var inputLeft = e.inputBuffer.getChannelData(0);
        var inputRight = e.inputBuffer.getChannelData(1);
        var outputLeft = e.outputBuffer.getChannelData(0);
        var outputRight = e.outputBuffer.getChannelData(1);

        for (var i = 0; i < len; i++) {
          var inputLeftBit = inputLeft[i] * self._amount;
          var inputRightBit = inputRight[i] * self._amount;

          if (inputLeftBit >= 1) {
            outputLeft[i] = 0.5;
          } else if (inputLeftBit < 1 && inputLeftBit >= 0) {
            outputLeft[i] = -0.5 * Math.pow(inputLeftBit, 2) + inputLeftBit;
          } else if (inputLeftBit < 0 && inputLeftBit > -1) {
            outputLeft[i] = 0.5 * Math.pow(inputLeftBit, 2) + inputLeftBit;
          } else {
            outputLeft[i] = -0.5
          }

          if (inputRightBit >= 1) {
            outputRight[i] = 0.5;
          } else if (inputRightBit < 1 && inputRightBit >= 0) {
            outputRight[i] = -0.5 * Math.pow(inputRightBit, 2) + inputRightBit;
          } else if (inputRightBit < 0 && inputRightBit > -1) {
            outputRight[i] = 0.5 * Math.pow(inputRightBit, 2) + inputRightBit;
          } else {
            outputRight[i] = -0.5
          }
        }
      });
      

      this.connectToInput(clipper)
          .connectToOutput(clipper);

      this.nodes.clipper = clipper;
      this.setType(0);
    },
    setAmount : function(amount) {
      this._amount = _inRange(1, 1000, amount);
    },
    setType : function(type) {
      this._type = type;
    }
  });

  return Distortion; 

});