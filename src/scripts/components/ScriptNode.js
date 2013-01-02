/**
 * The base ScriptProcessorNode object module. Process signal data in Javascript.
 * @module ScriptNode
 * @requires BaseNode
 */
define(["components/BaseNode"], function(BaseNode) {
  /**
   * @constructor
   * @alias module:ScriptNode
   * @augments BaseNode
   */
  var ScriptNode = BaseNode.extend({
   /**
    * Constructor function
    * @param  {Object} context        AudioContext
    * @param  {Integer} bufferSize     Buffer size
    * @param  {Integer} inputChannels  Number of input channels
    * @param  {Integer} outputChannels Number of output channels
    */
    init : function(context, bufferSize, inputChannels, outputChannels) {
      this._super.apply(this, arguments);
      this.setLabel("Script Node");
      var node = this.context.createJavaScriptNode(bufferSize, inputChannels, outputChannels);
      this.node = this.inputNode = this.outputNode = node;
    },
    /**
     * Sets the function to be called on audio process.
     * @param  {Function} func Function to be called on audio process
     * @return {ScriptNode}      ScriptNode
     */
    onAudioProcess : function(func) {
      this.node.onaudioprocess = func;
      return this;
    }
  });

  return ScriptNode;

});