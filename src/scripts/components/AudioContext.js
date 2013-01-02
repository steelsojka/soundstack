/**
 * The base AudioContext object module.
 * @module AudioContext
 * @requires BaseNode
 */
define(["components/BaseNode"], function(BaseNode) {

  /**
   * @constructor
   * @alias module:AudioContext
   * @augments BaseNode
   */
  var AudioContext = BaseNode.extend({
     /**
     * Constructor function
     */
    init : function() {
      this._super();
      try {
        /**
         * Base AudioContext.
         * @type {webkitAudioContext}
         */
        this.context = new webkitAudioContext();
        this.inputNode = this.outputNode = this.context.destination;
        this.setLabel("Audio Context");
      } catch (err) {
        alert("Web Audio API is not supported in your browser!");
      }
    },
    /**
     * Gets the root AudioContext object.
     * @return {webkitAudioContext} Audio context
     */
    getContext : function() {
      return this.context;
    },
    /**
     * Shorthand for getting the current time of the context.
     * @return {Integer} Current time
     */
    getCurrentTime : function() {
      return this.context.currentTime;
    },
    /**
     * Starts the rendering for the audio context.
     */
    startRendering : function() {
      this.context.startRendering();
    }
  });

  return AudioContext;

});