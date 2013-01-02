/**
 * The base Analyser object module.  Used for analysing a signal.
 * @module Analyser
 * @requires BaseNode
 */
define(["components/BaseNode"], function(BaseNode) {

  /**
   * @constructor
   * @alias module:Analyser
   * @augments BaseNode
   */
  var Analyser = BaseNode.extend({
    /**
     * Constructor function
     * @param  {Object} context AudioContext
     */
    init : function(context) {
      this._super.apply(this, arguments);
      this.node = this.context.createAnalyser();
      this.setInputNode(this.node);
      this.setOutputNode(this.node);
    },
    /**
     * Set FFT size.
     * @param {Integer} value Value to set
     * @return {Analyser} Return Analyser
     */
    setFFTSize : function(value) {
      this.node.fftSize = value;
      this.node.frequencyBinCount = value / 2;
      return this;
    },
    /**
     * Set max decibels.
     * @param {Integer} value Value to set
     * @return {Analyser} Return Analyser
     */
    setMaxDecibels : function(value) {
      this.node.maxDecibels = value;
      return this;
    },
    /**
     * Set min decibels.
     * @param {Integer} value Value to set
     * @return {Analyser} Return Analyser
     */
    setMinDecibels : function(value) {
      this.node.minDecibels = value;
      return this;
    },
    /**
     * Set smoothing time constant.
     * @param {Integer} value Value to set
     * @return {Analyser} Return Analyser
     */
    setSmoothing : function(value) {
      this.node.smoothingTimeConstant = value;
      return this;
    },
    /**
     * Get max decibels.
     * @return {Integer} Max decibels
     */
    getMaxDecibels : function() {
      return this.node.maxDecibels;
    },
    /**
     * Get minimum decibels.
     * @return {Integer} minimum decibels
     */
    getMinDecibels : function() {
      return this.node.minDecibels;
    },
    /**
     * Get smoothing time constant value.
     * @return {Integer} Smoothing time constant value
     */
    getSmoothing : function() {
      return this.node.smoothingTimeConstant;
    },
    /**
     * Copy current frequency data into a floating point array.
     * @param  {Float32Array} array Array to copy to
     * @return {Float32Array}       Array copy
     */
    getFloatFrequencyData : function(array) {
      this.node.getFloatFrequencyData(array);
      return array;
    },
    /**
     * Copy current frequency data into a unsigned byte array.
     * @param  {Uint32Array} array Array to copy to
     * @return {Uint32Array}       Array copy
     */
    getByteFrequencyData : function(array) {
      this.node.getByteFrequencyData(array);
      return array;
    },
    /**
     * Copy current time domain data into a unsigned byte array.
     * @param  {Uint32Array} array Array to copy to
     * @return {Uint32Array}       Array copy
     */
    getByteTimeDomainData : function(array) {
      this.node.getByteTimeDomainData(array);
      return array;
    }

  });

  return Compressor;

});