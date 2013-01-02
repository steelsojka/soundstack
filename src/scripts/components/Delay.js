/**
 * The base Delay object module.  Delays a single the given number of seconds.
 * @module Delay
 * @requires BaseNode
 */

define(["components/BaseNode"], function(BaseNode) {

  /**
   * @constructor
   * @alias module:Delay
   * @augments BaseNode
   */
  var Delay = BaseNode.extend({
    /**
     * Constructor function
     * @param  {Object} context     AudioContext
     * @param  {Integer} defaultTime Delay time in seconds
     */
    init : function(context, defaultTime) {
      this._super.apply(this, arguments);
      var _time = typeof defaultTime === "undefined"
        ? 1
        : defaultTime; 
      var node = "createDelay" in context 
        ? context.createDelay(_time)
        : context.createDelayNode(_time);
      this.setParameters(node);
      this.node = this.inputNode = this.outputNode = node;
    },
    /**
     * Sets the delay time in seconds.
     * @param {Integer} time Delay time in seconds
     * @return {Object} Delay
     */
    setTime : function(time) {
      this.modify('delayTime', time);
      return this;
    }
  });

  return Delay;

});