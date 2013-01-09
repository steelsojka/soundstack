define(["modules/BaseModule", "components/AudioFile"],

function(BaseModule, AudioFile) {

  var AudioFilePlayer = BaseModule.extend({
    init : function(context) {
      _.bindAll(this);

      _.extend(this, Backbone.Events);

      this._super.apply(this, arguments);
      this._enablePlay          = false;
      this.spectrumType         = 2;
      this.currentPosition      = 0;
      this.contextStartTime     = 0;
      this.playFromPosition     = 0;
      this.isPlaying            = false;
      this.reference            = false;
      this.selection            = {};
      this.clipboard            = {buffer : []};
      this.gainAdjustmentFactor = 0.5;
      this.SAMPLE_RATE          = 44100;
     
      var audioSource = new AudioFile(this.context);
      this.nodes.audioSource = audioSource;

      this.connectToOutput(audioSource);

      this.enable = function() {
        this._enabled = true;
      };

      this.disable = function() {
        this.pause();
        this._enabled = false;
      };

      global_relay.on('global-play', this.play);
      global_relay.on('global-stop', this.stop);
    },
    onFileLoad : function(e, callback) {
      var files = e.target.files;
      var reader = new FileReader();
      var self = this;
      this.stop();
      reader.onload = function(e) {
        self.onFileRead(e, callback);
      };
      
      reader.readAsArrayBuffer(files[0]);
      this._enablePlay = false;
    },
    getBuffer : function() {
      return this.nodes.audioSource.getBuffer.apply(this.nodes.audioSource, arguments);
    },
    onFileRead : function(e, callback) {
      var self = this;
      self.trigger('status-update', "Decoding audio...");
      this.nodes.audioSource.decodeAudio(e.target.result, function() {
        self.onAudioDecode(e, callback);
      });
    },
    importBuffer : function(buffers, callback) {
      var self = this;

      this.nodes.audioSource.setSource(buffers, function() {
        self.onAudioDecode({}, callback);
      });
    },
    onAudioDecode : function(e, callback) {
      this._enablePlay = true;
      var self = this;
      this.duration = this.nodes.audioSource.getDuration();
      self.trigger("audio-loaded");
      if (typeof callback === "function") {
        callback();
      }
    },
    setLoop : function(loop) {
      this.loop = loop;
      if (this.isPlaying) {
        this.pause();
        this.play();
      }
      // this.nodes.audioSource.setLoop.apply(this.nodes.audioSource, arguments);
    },
    setRate : function() {
      this.nodes.audioSource.setRate.apply(this.nodes.audioSource, arguments);
    },
    setPosition : function(position) {
      this.currentPosition = position;
      if (this.isPlaying) {
        this.pause();
        this.play();
      }
    },
    trimToSelection : function(callback) {
      var self = this;

      self.trigger('status-update', "Trimming selection...");

      this.getSelectionBuffer(function(res) {
        self.importBuffer(res.data.data, callback);
      });
    },
    setSelection : function(start, end) {
      this.selection.start = start;
      this.selection.end = end;
      this.selection.set = true;
      this.currentPosition = start;
      if (this.isPlaying) {
        this.pause();
        this.play();
      }
    },
    clearSelection : function() {
      this.selection.start = 0;
      this.selection.end = 0;
      this.selection.set = false;
    },
    cutSelection : function(callback) {
      var self = this;

      if (!this.selection.set) return;

      self.trigger('status-update', "Cutting selection...");

      worker.onmessage = function(res) {
        self.clipboard.buffer = res.data.data.cutBuffers;
        self.importBuffer(res.data.data.buffers, callback);
      };

      worker.postMessage({
        action : "cut-buffer",
        data : this.getChannelData(),
        start : this.selection.start * this.SAMPLE_RATE,
        end : this.selection.end * this.SAMPLE_RATE
      });
    },
    copySelection : function() {
      var self = this;

      if (!this.selection.set) return;

      this.getSelectionBuffer(function(res) {
        self.clipboard.buffer = res.data.data;
      });
    },
    insertBuffer : function(callback) {
      var self = this;

      if (this.clipboard.buffer.length === 0) return;

      worker.onmessage = function(res) {
        self.importBuffer(res.data.data, callback);
      };

      this.trigger('status-update', 'Pasting...');

      worker.postMessage({
        action : "insert-buffer",
        data : this.getChannelData(),
        insertBuffer : this.clipboard.buffer,
        start : this.currentPosition * this.SAMPLE_RATE
      });
    },
    getDuration : function() {
      return this.duration;
    },
    getPlaybackRate : function() {
      return this.nodes.audioSource.getPlaybackRate();
    },
    setReference : function(bool) {
      this.reference = bool;
      this.isPlaying = !bool;
      this.pause();
      this.play();
      this.trigger("reference-change", bool);
    },
    play : function() {
      if (!this._enablePlay || !this._enabled) return;

      this.isStopped = false;

      if (this.isPlaying) {
        this.pause();
      } else {
        this.contextStartTime = this.context.currentTime;
        this.playFromPosition = this.currentPosition;
        this.lastFrameTime = 0;
        this.nodes.audioSource.unpause();
        if (this.selection.set) {
          this.nodes.audioSource.start(0, this.currentPosition, this.selection.end - this.currentPosition);
        } else {
          this.nodes.audioSource.start(0, this.currentPosition, this.duration - this.currentPosition);
        }
        this.isPlaying = true;
        this.trigger('play');
        requestAnimFrame(this.onFrame);
      }

    },
    pause: function() {
      this.nodes.audioSource.stop(0);
      this.isPlaying = false;
      this.trigger('pause');
    },
    onFrame : function() {
      var end;

      if (this.isPlaying) {

        // this.currentPosition = this.playFromPosition + (this.context.currentTime - this.contextStartTime);
        this.currentPosition += ((this.context.currentTime - this.contextStartTime) - this.lastFrameTime) * this.getPlaybackRate();
        this.lastFrameTime = (this.context.currentTime - this.contextStartTime);

        requestAnimFrame(this.onFrame);
        
        end = this.selection.set ? this.selection.end : this.duration;

        if (this.currentPosition >= end) {
          if (this.loop) {
            this.restartLoop();
          } else {
            this.stop();
          }
        } 
      }
    },
    restartLoop : function() {
      this.stop();
      if (this.selection.set) {
        this.currentPosition = this.selection.start;
      }
      this.play();
    },
    setGain : function(value) {
      this.nodes.audioSource.setGain(value);
    },
    exportSelection : function() {
      var self = this;

      this.trigger('status-update', 'Exporting selection...');

      this.getSelectionBuffer(function(res) {
        self.export(res.data.data);
      });
    },
    getChannelData : function() {
      var array = [];
      var buffer = this.getBuffer();

      for (var i = 0; i < buffer.numberOfChannels; i++) {
        array.push(buffer.getChannelData(i));
      }
      return array;
    },
    getSelectionBuffer : function(callback) {
      var buffer = this.getBuffer();
      var self = this;

      var channelData = this.getChannelData();

      worker.postMessage({
        action : "get-selection-buffer",
        data : channelData,
        fps : buffer.length / buffer.duration,
        start : this.selection.start,
        end : this.selection.end
      });

      worker.onmessage = function(res) {
        callback(res);
        // console.log(res);
        // if (res.data.action === "get-selection-buffer") {
        //   self.export(res.data.data);
        // }
      };
    },
    setGainAdjustment : function(value) {
      this.gainAdjustmentFactor = value;
    }, 
    normalize : function(callback) {
      var self = this;

      worker.onmessage = function(e) {
        self.importBuffer(_.map(e.data.data, _.arrayTo32Float), callback);
      };

      this.trigger('status-update', 'Normalizing...');

      worker.postMessage({
        action : "normalize-buffer",
        data : this.getChannelData(),
        start : this.selection.set ? this.selection.start * this.SAMPLE_RATE : 0,
        end : (this.selection.set ? this.selection.end : this.getDuration()) * this.SAMPLE_RATE
      });
    },
    // normalizeSelection : function(callback) {
    //   var self = this;
     
    //   worker.onmessage = function(e) {
    //     self.importBuffer(_.map(e.data.data, _.arrayTo32Float), callback);
    //   };

    //   worker.postMessage({
    //     action : "normalize-buffer",
    //     data : this.getChannelData(),
    //     start : this.selection.start * this.SAMPLE_RATE,
    //     end : this.selection.end * this.SAMPLE_RATE
    //   });
    // },
    adjustGain : function(callback) {
      var self = this;

      worker.onmessage = function(e) {
        self.importBuffer(_.map(e.data.data, _.arrayTo32Float), callback);
      };

      this.trigger('status-update', 'Adjusting gain...');

      worker.postMessage({
        action : "adjust-buffer-gain",
        data : this.getChannelData(),
        amount : this.gainAdjustmentFactor,
        start : this.selection.set ? this.selection.start * this.SAMPLE_RATE : 0,
        end : (this.selection.set ? this.selection.end : this.getDuration()) * this.SAMPLE_RATE
      });

    },
    export : function(buffers) {
      if (!buffers) {
        var buffer = this.nodes.audioSource.getBuffer();
        var buffers = [];
        for (var i = 0; i < buffer.numberOfChannels; i ++) {
          buffers.push(buffer.getChannelData(i));
        }
      }

      this.trigger('status-update', 'Exporting...');

      global_relay.trigger('get-recorder', function(recorder) {
        recorder.exportWAV(function(blob) {
          Recorder.forceDownload(blob);
        }, 'audio/wav', buffers);
      });
    },
    getPosition : function() {
      return this.currentPosition;
    },
    getStartTime : function() {
      return this.contextStartTime;
    },
    stop : function(event) {
      this.isPlaying = false;
      this.isStopped = true;
      this.currentPosition = this.selection.set ? this.selection.start : 0;
      this.playFromPosition = 0;
      this.nodes.audioSource.stop(0);
      this.trigger('stop');
    },
    destroy : function() {
      this.stop();
      this.nodes = null;
      global_relay.off("global-play", this.play);
      global_relay.off("global-stop", this.stop);
    }
  });

  return AudioFilePlayer;

});