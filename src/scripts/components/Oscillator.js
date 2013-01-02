/**
 * The base Oscillator object module.
 * @module Oscillator
 * @requires BaseNode
 */
define(["components/BaseNode"], function(BaseNode) {
  /**
   * @constructor
   * @alias module:Oscillator
   * @augments BaseNode
   */
  var Oscillator = BaseNode.extend({
    /**
     * Constructor function
     * @param  {Object} context     AudioContext
     */
    init : function() {
      this._super.apply(this, arguments);
      this.setLabel("Oscialltor");
      var node = this.context.createOscillator();
      this.setParameters(node);
      this.node = this.inputNode = this.outputNode = node;
      /**
       * Offset value of the frequency.
       * @type {Integer}
       */
      this.offset = 0;

      this.Types = {};
      /** @constant */
      this.Types.CUSTOM   = node.CUSTOM;
      /** @constant */
      this.Types.SAWTOOTH = node.SAWTOOTH;
      /** @constant */
      this.Types.SINE     = node.SINE;
      /** @constant */
      this.Types.SQUARE   = node.SQUARE;
      /** @constant */
      this.Types.TRIANGLE = node.TRIANGLE;
    },
    /**
     * Starts the oscillator.
     * @param  {Integer} time Start time based on this nodes AudioContexts' current time
     * @return {Oscillator} Oscillator
     */
    noteOn : function(time) {
      this.node.noteOn(time);
      return this;
    },
    /**
     * Stops the oscillator
     * @param  {Integer} time Stop time based on this nodes AudioContexts' current time.
     * @return {Oscillator} Oscillator
     */
    noteOff : function(time) {
      this.node.noteOff(time);
      return this;
    },
    /**
     * Starts the oscillator.
     * @param  {Integer} time Start time based on this nodes AudioContexts' current time.
     * @return {Oscillator} Oscillator
     */
    start : function(time) {
      this.node.start(time);
      return this;
    },
    /**
     * Reconnects the output of the audio node into the nodes in the outputTo array.
     * @return {Oscillator} Oscillator
     */
    unpause : function() {
      this.reconnect(this.outputTo);
      return this;
    },
    /**
     * Mutes the output of the oscillator by disconnecting from its output nodes.
     * @return {Oscillator} Oscillator
     */
    pause : function(){
      this.disconnect();
      return this;
    },
    /**
     * Stops the oscillator.
     * @return {Oscillator} Oscillator
     */
    stop : function() {
      this.node.stop();
      return this;
    },
    /**
     * Sets the type of the oscillator.
     * @param {Integer} type Type
     * @return {Oscillator} Oscillator
     */
    setType : function(type) {
      this.node.type = type;
      return this;
    },
    /**
     * Set frequency of the oscillator.
     * @param {Integer} freq Frequency
     * @return {Oscillator} Oscillator
     */ 
    setFrequency : function(freq) {
      this.node.frequency.value = freq + this.offset;
      return this;
    },
    /**
     * Sets the offset value of the frequency.
     * @param {Integer} amount Offset amount
     * @return {Oscillator} Oscillator
     */
    setFrequencyOffset : function(amount) {
      this.offset = parseInt(amount, 10);
      return this;
    },
    /**
     * Sets the detune of the oscillator.
     * @param {Integer} detune Detune value
     * @return {Oscillator} Oscillator
     */
    setDetune : function(detune) {
      this.node.detune.value = detune;
      return this;
    },
    /**
     * Sets a wave table to the oscillator.
     * @param {WaveTable} wavetable Wavetable
     * @return {Oscillator} Oscillator
     */
    setWaveTable : function(wavetable) {
      this.node.setWaveTable.apply(this.node, arguments);
      return this;
    }
  });

  return Oscillator;

});