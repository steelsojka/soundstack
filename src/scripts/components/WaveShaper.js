/**
 * The base WaveShaper object module. Shapes a wave to create warming effects.
 * @module WaveShaper
 * @requires BaseNode
 */
define(["components/BaseNode"], function(BaseNode) {
  /**
   * @constructor
   * @alias module:WaveShaper
   * @augments BaseNode
   */
  var WaveShaper = BaseNode.extend({
     /**
     * Constructor function
     * @param  {Object} context     AudioContext
     */
    init : function() {
      this._super.apply(this, arguments);
      var node = this.context.createWaveShaper();
      this.setLabel("WaveShaper");
      this.node = this.inputNode = this.outputNode = node;
    },
    /**
     * Sets the curve of the wave.
     * @param {Float32Array} curve Array to apply
     * @return {WaveShaper} WaveShaper
     */
    setCurve : function(curve) {
      this.node.curve = curve;
      return this;
    }
  });

  return WaveShaper;

});