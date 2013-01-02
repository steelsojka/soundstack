/**
 * The base ChannelMerger object module. Merges incoming inputs into a single output.
 * @module ChannelMerger
 * @requires BaseNode
 */
define(["components/BaseNode"], function(BaseNode) {

  /**
   * @constructor
   * @alias module:ChannelMerger
   */
  var ChannelMerger = BaseNode.extend({
    /**
     * Constructor function
     * @param  {Object} context     AudioContext
     */
    init : function() {
      this._super.apply(this, arguments);
      var node = this.context.createChannelMerger();
      this.node = this.inputNode = this.outputNode = node;
    }
  });
  
  return ChannelMerger;

});