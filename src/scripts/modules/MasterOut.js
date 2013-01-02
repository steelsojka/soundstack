define(["components/Gain", "modules/BaseModule", "components/ChannelMerger", "components/Analyser"],

function(Gain, BaseModule, ChannelMerger, Analyser) {

  var MasterOut = BaseModule.extend({
    init : function(context , callback) {
      this._super.apply(this, arguments);
      this._enable = this.enable;
      this._disable = this.disable;
      this._isRecording = false;
      
      _.bindAll(this);
      _.extend(this, Backbone.Events);

      var self = this;
      this.nodes.merger   = new ChannelMerger(this.context);
      this.nodes.gain     = new Gain(this.context);
      this.nodes.reference = new Gain(this.context);

      this.nodes.merger.connect(this.nodes.gain).connect(this.nodes.reference);

      this.recorder = new Recorder(this.nodes.gain.getOutputNode(), {
        workerPath : "scripts/library/RecorderWorker.js",
        bufferLen : settings.get('bufferSize')
      });

      this.connectToOutput(this.nodes.reference);
      this.connectToInput(this.nodes.merger);

      this.disable = function() {
        self.nodes.inputBuffer.disconnectAll();
        // self._disable();
      };
      this.enable = function() {
        self.nodes.inputBuffer.connect(self.nodes.merger);
        // self._enable();
      };

      global_relay.on('global-record', this.record);
    },
    getReferenceNode : function() {
      return this.nodes.reference;
    },
    record : function() {
      if (this._isRecording) {
        this.recorder.stop();
        this._isRecording = false;
        this.trigger('pause-record');
      } else {
        if (this._clearRecording) {
          this.recorder.clear();
          this._clearRecording = false;
        }
        this.trigger('start-record');
        this.recorder.record(); 
        this._isRecording = true;
      }
    },
    getRecorder : function() {
      return this.recorder;
    },
    stopRecord : function() {
      this.recorder.stop();
      this._isRecording = false;
      this._clearRecording = true;
      this.trigger('stop-record');
      global_relay.trigger('stop-record', this.recorder);
    },
    setGain : function() {
      this.nodes.gain.setGain.apply(this.nodes.gain, arguments);
    },
    getGain : function() {
      return this.nodes.gain.getGain();
    }
  });

  return MasterOut;

});