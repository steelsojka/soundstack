/**
 * The base Compressor object module.  Used for compression effects.
 * @module Compressor
 * @requires BaseNode
 */
define(["components/BaseNode"], function(BaseNode) {

  /**
   * @constructor
   * @alias module:Compressor
   * @augments BaseNode
   */
  var Compressor = BaseNode.extend({
    /**
     * Constructor function
     * @param  {Object} context AudioContext
     */
    init : function(context) {
      this._super.apply(this, arguments);
      this.node = this.context.createDynamicsCompressor();
      this.setInputNode(this.node);
      this.setOutputNode(this.node);
      this.setParameters({
        attack    : this.node.attack,
        knee      : this.node.knee,
        ratio     : this.node.ratio,
        reduction : this.node.reduction,
        release   : this.node.release,
        threshold : this.node.threshold
      });
    },
    /**
     * Set threshold of compressor.
     * @param {Integer} value Value to set
     */
    setThreshold : function(value) {
      this.node.threshold.value = value;
      return this;
    },
    /**
     * Set release of compressor.
     * @param {Integer} value Value to set
     */
    setRelease : function(value) {
      this.node.release.value = value;
      return this;
    },
    /**
     * Set ratio of compressor.
     * @param {Integer} value Value to set
     */
    setRatio : function(value) {
      this.node.ratio.value = value;
      return this;
    },
    /**
     * Set knee of compressor.
     * @param {Integer} value Value to set
     */
    setKnee : function(value) {
      this.node.knee.value = value;
      return this;
    },
    /**
     * Set attack of compressor.
     * @param {Integer} value Value to set
     */
    setAttack : function(value) {
      this.node.attack.value = value;
      return this;
    }, 
    /**
     * Get threshold of compressor.
     * @return {Integer} Value to return
     */
    getThreshold : function() {
      return this.node.threshold.value;
    },
    /**
     * Get threshold of compressor.
     * @return {Integer} Value to return
     */
    getRelease : function() {
      return this.node.release.value;
    },
    /**
     * Get threshold of compressor.
     * @return {Integer} Value to return
     */
    getRatio : function() {
      return this.node.ratio.value;
    },
    /**
     * Get threshold of compressor.
     * @return {Integer} Value to return
     */
    getKnee : function() {
      return this.node.knee.value;
    },
    /**
     * Get threshold of compressor.
     * @return {Integer} Value to return
     */
    getAttack : function() {
      return this.node.attack.value;
    },
    /**
     * Get reduction of compressor.
     * @return {Integer} Value to return
     */
    getReduction : function() {
      return this.node.reduction.value;
    }
  });

  return Compressor;

});