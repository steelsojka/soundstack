/**
 * The base Controller that all controllers extend from.
 * @module BaseController
 * @requires BaseNode
 * @requires underscore
 */
define(["components/BaseNode"],

function(BaseNode, _) {
  /**
   * @constructor
   * @alias module: BaseController
   * @augments BaseNode
   */
  var BaseController = BaseNode.extend({
    /**
     * Constructor function
     * @param {Object} context AudioContext
     */
    init : function(context) {
      this._super.apply(this, arguments);
      this.params = [];
    },
    /**
     * Connects the controller to an AudioParam.
     * @param  {AudioParam} audioParam AudioParam from a base component
     * @return {BaseController}     
     */
    connect : function(audioParam) {
      this.params.push(audioParam);
      return this;
    },
    /**
     * Disconnects a specific AudioParam or removes all AudioParams if nothing is passed in.
     * @param  {AudioParam} [audioParam] AudioParam to disconnect
     * @return {BaseController}
     */
    disconnect : function(audioParam) {
      if (typeof audioParam !== "undefined") {
        this.params = _.without(this.params, audioParam);
      } else {
        this.params = [];
      }
      return this;
    },
    /**
     * Sets the value of the controller to all AudioParams.
     * @param  {Integer|String|Object|Array} value Value to set all AudioParams
     * @return {BaseController}
     */
    trigger : function(value) {
      for (var i = 0, _len = this.params.length; i < _len; i++) {
        var param = this.params[i];
        param.value = value;
      }
      return this;
    }
  });

  BaseController.prototype.Types = {};

  return BaseController;

});