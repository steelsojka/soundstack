/**
 * The base component for creating an audio buffer
 * @module AudioFile
 * @requires BaseNode
 */
define(["components/BaseNode"], function(BaseNode) {

  /**
   * @constructor
   * @alias module:AudioFile
   * @augments BaseNode
   */
  var AudioFile = BaseNode.extend({
     /**
     * Constructor function
     * @param  {Object} context     AudioContext
     */
    init : function() {
      this._super.apply(this, arguments);
      this.setLabel("Audio File");
      this.loop = false;
      this.source = this.outputNode = this.inputNode = this.node = this.context.createBufferSource();

    },
    /**
     * Decodes audio to an audio buffer asynchronously.
     * @param  {Array}   data     Array of audio data
     * @param  {Function} callback Callback function
     */
    decodeAudio : function(data, callback) {
      var self = this;
      this.context.decodeAudioData(data, function(buffer) {
        self.setSource(buffer, callback);
      });
    },
    /**
     * Creates and sets the buffer source of the AudioNode.
     * @param {Object}   buffer   Audio buffer
     * @param {Function} callback Callback function
     */
    setSource : function(buffer, callback) {
      if (_.isArray(buffer)) {
        var newBuffer = this.context.createBuffer(2, buffer[0].length, this.context.sampleRate);
        newBuffer.getChannelData(0).set(buffer[0]);
        newBuffer.getChannelData(1).set(buffer[1]);
        buffer = newBuffer;
      }
      this.buffer = buffer
      this.source = this.context.createBufferSource();
      this.source.buffer = buffer;
      this.source.loop = this.loop;
      // this.buffer = buffer;
      this.node = this.inputNode = this.outputNode = this.source;
      this.setParameters(this.source);
      if (typeof callback === "function") {
        callback.call(this, this.source);
      }
    },
    /**
     * Returns objects buffer.
     * @return {Object} Audio buffer
     */
    getBuffer : function() {
      return this.buffer;
    },
    getDuration : function() {
      return this.buffer.duration;
    },
    setGain : function(value) {
      this.source.gain.value = value;
    },
    /**
     * Stops the audio source.
     */
    pause : function() {
      this.source.stop();
    },
    /**
     * Reconnects the audio source to resume playing.
     */
    unpause : function() {
      this.setSource(this.buffer, function() {
        this.reconnect(this.outputTo);
      });
    },
    /**
     * Starts the audio source playback at a certain time.
     * @param  {Integer} time Time to start playback based on the AudioContext currentTime
     */
    start : function(pos, a,duration) {
      this.source.noteGrainOn(pos, a, duration);
    },
    /**
     * Stops audio source. 
     * @param  {Integer} time Time to stop playback based on the AudioContext currentTime
     */
    stop : function(time) {
      this.source.noteOff(time);
    },
    /**
     * Sets the loop parameter of the audio source.
     * @param {Boolean} value Sets whether to loop the playback
     */
    setLoop : function(value) {
      this.loop = value;
      this.source.loop = value;
    }
  });

  return AudioFile;
 
});