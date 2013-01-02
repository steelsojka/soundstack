define(["components/MediaStream", "modules/BaseModule", "components/MonoToStereo"],

function(MediaStream, BaseModule, MonoToStereo) {

  var LineInput = BaseModule.extend({
    init : function(context , callback) {
      this._super.apply(this, arguments);
      this._enable = this.enable;
      this._disable = this.disable;
      this.isPlaying = true;
      this.reference = false;
      var self = this;
      this.mono2Stereo = new MonoToStereo(this.context);
      this.stream = new MediaStream(this.context, function() {
        self.stream.connect(self.mono2Stereo);
        self.connectToOutput(self.mono2Stereo);
        self.disable = function() {
          self.mono2Stereo.disconnectAll();
          self._disable();
          self.isPlaying = false;
        };
        self.enable = function() {
          self.connectToOutput(self.mono2Stereo);
          self._enable();
          self.isPlaying = true;
        };
        if (typeof callback === "function") {
          callback();
        }
      });
    },
    destroy : function() {
      _.invoke(this.nodes, "disconnectAll");
      this.stream = null;
      this.mono2Stereo = null;
      this.nodes = null;
    }
  });

  return LineInput;

});