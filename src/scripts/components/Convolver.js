/**
 * The base Convoler object module.  Used for convolution effects.
 * @module Convolver
 * @requires BaseNode
 */
define(["components/BaseNode"], function(BaseNode) {

  /**
   * @constructor
   * @alias module:Convolver
   * @augments BaseNode
   */
  var Convolver = BaseNode.extend({
    /**
     * Constructor function
     * @param  {Object} context     AudioContext
     */
    init : function() {
      this._super.apply(this, arguments);
      this.node = this.context.createConvolver();
      this.setInputNode(this.node);
      this.setOutputNode(this.node);
    },
    /**
     * Loads an impulse audio file.
     * @param  {Object} buffer An AudioBuffer object of the impule after it has been decoded.
     * @return {Object}        Convolver
     */
    loadImpulse : function(buffer) {
      this.node.buffer = buffer;
      return this;
    }
  });

  return Convolver;

});