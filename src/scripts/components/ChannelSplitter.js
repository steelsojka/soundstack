/**
 * The base ChannelSplitter object module. Splits incoming inputs into a multiple outputs.
 * @module ChannelSplitter
 * @requires BaseNode
 */
define(["components/BaseNode"], function(BaseNode) {
  /**
   * @constructor
   * @alias module:ChannelSplitter
   */
  var ChannelSplitter = BaseNode.extend({
    /**
     * Constructor function
     * @param  {Object} context     AudioContext
     */
    init : function() {
      this._super.apply(this, arguments);
      var node = this.context.createChannelSplitter();
      this.node = this.inputNode = this.outputNode = node;
    }
  });
  
  return ChannelSplitter;

});