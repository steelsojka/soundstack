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
      this.enableProcessing     = false;
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
      self.trigger('file-read');
      this.nodes.audioSource.decodeAudio(e.target.result, function() {
        self.onAudioDecode(e, callback);
      });
    },
    importBuffer : function(buffers, callback) {
      var self = this;
      console.log("importing buffer start");
      self.trigger('status-update', 'Importing buffer...');
      
      this.nodes.audioSource.setSource(buffers, function() {
        self.onAudioDecode({}, callback);
      });
    },
    splitBuffers : function(data, split) {
      var _buffers = [];
      var buffers = data.data;

      for (var x = 0, _len = buffers.length; x < _len; x++) {
        var splits = [], buffer = buffers[x];

        for (var i = 0, j = buffer.length; i < j; i += split) {
          splits.push({
            data : Array.prototype.slice.call(buffer, i, i + split),
            altData : {
              _pos : i
            }
          });
        }
        
        _buffers.push(splits);        
      }

      return _buffers;
    },
    onAudioDecode : function(e, callback) {
      this._enablePlay = true;
      var self = this;
      this.duration = this.nodes.audioSource.getDuration();
      this.trigger("audio-loaded");
      this.enableProcessing = true;
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

      if (!this.enableProcessing) return;
      this.enableProcessing = false;

      self.trigger('status-update', "Trimming selection...");

      this.getSelectionBuffer(function(res) {
        self.importBuffer(res, callback);
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
    replaceBufferSelection : function(replaceBuffers, callback) {
      var self = this;
      var start = this.selection.start * this.SAMPLE_RATE;
      var end = this.selection.end * this.SAMPLE_RATE;

      WorkerManager.addJob({
        action : "replace-buffer-section",
        start : start,
        end : end,
        data : this.getChannelData(),
        split : 500,
        replaceBuffers : replaceBuffers,
        onReconstruct : function(res) {
          callback(self.reconstructBuffer(res));
        },
        onSplit : function(options) {
          var _buffers = [];
          var buffers = options.data;
          var rBuffers = options.replaceBuffers;
          var start = Math.round(options.start);
          var end = start + rBuffers[0].length;
          var _rBuff = [];
          var _rPos = 0;
          var split = options.split;

          for (var x = 0, _len = buffers.length; x < _len; x++) {
            var _remaining = rBuffers[0].length
            var splits = [], buffer = buffers[x];

            for (var i = 0, j = buffer.length; i < j; i += split) {
              if (i >= start && i <= end) {
                var amount = i - start > split ? split : i - start;
                _rBuff = Array.prototype.splice.call(rBuffers[x], 0, amount);
                _rPos = split - amount;
              }
              splits.push({
                data : Array.prototype.slice.call(buffer, i, i + split),
                altData : {
                  _pos : i,
                  _rPos : _rPos,
                  _rBuff : _rBuff
                }
              });
            }
            
            _buffers.push(splits);        
          }
          return _buffers;
        }
      });
    },
    cutSelection : function(callback) {
      var self = this;

      if (!this.selection.set) return;
      
      if (!this.enableProcessing) return;
      this.enableProcessing = false;

      self.trigger('status-update', "Cutting selection...");

      WorkerManager.addJob({
        action : "cut-buffer",
        data : this.getChannelData(),
        start : this.selection.start * this.SAMPLE_RATE,
        end : this.selection.end * this.SAMPLE_RATE,
        split : 500,
        onSplit : self.splitBuffers,
        onReconstruct : function(res) {
          self.clipboard.buffer = self.reconstructBuffer(_.pluck(res, "cutBuffers"));
          self.importBuffer(self.reconstructBuffer(_.pluck(res, "buffers")), callback);
        }
      });

      // worker.onmessage = function(res) {
      //   self.clipboard.buffer = res.data.data.cutBuffers;
      //   self.importBuffer(res.data.data.buffers, callback);
      // };

      // worker.postMessage({
      //   action : "cut-buffer",
      //   data : this.getChannelData(),
      //   start : this.selection.start * this.SAMPLE_RATE,
      //   end : this.selection.end * this.SAMPLE_RATE
      // });
    },
    copySelection : function() {
      var self = this;

      if (!this.selection.set) return;

      if (!this.enableProcessing) return;
      this.enableProcessing = false;

      this.getSelectionBuffer(function(res) {
        self.clipboard.buffer = res.data.data;
      });
    },
    insertBuffer : function(callback) {
      var self = this;

      if (this.clipboard.buffer.length === 0) return;

      if (!this.enableProcessing) return;
      this.enableProcessing = false;

      WorkerManager.addJob({
        action : "insert-buffer",
        data : this.getChannelData(),
        insertBuffer : this.clipboard.buffer,
        start : this.currentPosition * this.SAMPLE_RATE,
        onReconstruct : function(res) {
          self.importBuffer(res[0], callback);
        }
      });

      // worker.onmessage = function(res) {
      //   if (res.data.action === "progress") {

      //     self.trigger('status-update', 'Pasting... ' + res.data.percent + "%");
      //   } else {
      //     self.importBuffer(res.data.data, callback);
      //   }
      // };

      // worker.postMessage({
      //   action : "insert-buffer",
      //   data : this.getChannelData(),
      //   insertBuffer : this.clipboard.buffer,
      //   start : this.currentPosition * this.SAMPLE_RATE
      // });
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

      if (!this.enableProcessing) return;

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
    onProgress : function(message, percent) {
      this.trigger('status-update', message + " " + percent + "%", percent);
    },
    reconstructBuffer : function(data) {
      var channel1 = [];
      var channel2 = [];

      _.each(data, function(buff) {
        channel1.push(buff[0]);
        channel2.push(buff[1]);
      });

      channel1 = Array.prototype.concat.apply([], channel1);
      channel2 = Array.prototype.concat.apply([], channel2);

      return [channel1, channel2];
    },
    getSelectionBuffer : function(callback) {
      var buffer = this.getBuffer();
      var self = this;

      var channelData = this.getChannelData();

      if (!this.selection.set) {
        callback(this.getChannelData());
        return;
      }

      // WorkerManager.addJob({
      //   action : "get-selection-buffer",
      //   fps : buffer.length / buffer.duration,
      //   start : this.selection.start,
      //   end : this.selection.end,
      //   data : channelData,
      //   onReconstruct : function(data) {
      //     callback(data[0]);
      //   }
      // });
      // 
      WorkerManager.addJob({
        action : "get-selection-buffer",
        start : this.selection.start * (buffer.length / buffer.duration),
        end : this.selection.end * (buffer.length / buffer.duration),
        data : channelData,
        split : 500,
        onReconstruct : function(data) {
          callback(self.reconstructBuffer(data));
        },
        onSplit : this.splitBuffers,
        onProgress : function(percent) {
          self.onProgress("Getting selection...", percent);
        }
      });
    },
    setGainAdjustment : function(value) {
      this.gainAdjustmentFactor = value;
    }, 
    normalize : function(callback) {
      var self = this;

      if (!this.enableProcessing) return;
      this.enableProcessing = false;

      // worker.onmessage = function(e) {
      //   self.importBuffer(_.map(e.data.data, _.arrayTo32Float), callback);
      // };

      // this.trigger('status-update', 'Normalizing...');
      this.getSelectionBuffer(function(buffers) {
        WorkerManager.addJob({
          action : "get-buffer-max",
          data : buffers,
          start : 0,
          end : buffers[0].length,
          onReconstruct : function(res) {
            WorkerManager.addJob({
              action : "normalize-buffer",
              data : buffers,
              max : res[0],
              split : 500,
              onSplit : self.splitBuffers,
              onReconstruct : function(res) {
                var data = self.reconstructBuffer(res);
                self.replaceBufferSelection(data, function(res) {
                  self.importBuffer(res, callback);
                });
              },
              onProgress : function(percent) {
                self.onProgress("Normalizing...", percent);
              }
            })
          }
        });
      
      });

      // worker.postMessage({
      //   action : "normalize-buffer",
      //   data : this.getChannelData(),
      //   start : this.selection.set ? this.selection.start * this.SAMPLE_RATE : 0,
      //   end : (this.selection.set ? this.selection.end : this.getDuration()) * this.SAMPLE_RATE
      // });
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

      if (!this.enableProcessing) return;
      this.enableProcessing = false;

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
      var self = this;

      if (!this.enableProcessing) return;
      this.enableProcessing = false;

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
          self.enableProcessing = true;
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