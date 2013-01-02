/**
 * The base Gain object module. Controls gain of the signal passing through it.
 * @module Gain
 * @requires BaseNode
 */
define(["components/BaseNode"], function(BaseNode) {
  
  /**
   * @constructor
   * @alias module:Gain
   * @augments BaseNode
   */
  var Gain = BaseNode.extend({
    init : function() {
      /**
       * Constructor function
       * @param  {Object} context     AudioContext
       */
      this._super.apply(this, arguments);
      this.setLabel("Gain")
      var node = this.context.createGainNode();
      this.setParameters({
        gain : node.gain
      });
      this.node = this.inputNode = this.outputNode = node;
    },
    /**
     * Sets the gain of the node.
     * @param {Integer} gain Gain value
     * @return {Object} Gain
     */
    setGain : function(gain) {
      this.node.gain.value = gain;
      return this;
    },
    getGain : function(gain) {
      return this.node.gain.value
    }
  });

  return Gain;

});