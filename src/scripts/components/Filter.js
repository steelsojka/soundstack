/**
 * The base Filter object module. Creates various filter effects.
 * @module Filter
 * @requires BaseNode
 */
define(["components/BaseNode"], function(BaseNode) {
  
  /**
   * @constructor
   * @alias module:Filter
   * @augments BaseNode
   */
  var Filter = BaseNode.extend({
    /**
     * Constructor function
     * @param  {Object} context     AudioContext
     */
    init : function() {
      this._super.apply(this, arguments);
      var node = this.context.createBiquadFilter();
      this.setLabel("Filter")
      this.setParameters({
        frequency : node.frequency,
        Q         : node.Q,
        gain      : node.gain
      });
      
      this.node = this.inputNode = this.outputNode = node;
    },
    /**
     * Sets the type of filter.
     * @param {Integer} type Filter type
     * @return {Object} Filter
     */
    setType : function(type) {
      this.node.type = type;
      return this;
    },
    /**
     * Sets the frequency of the filter.
     * @param {Integer} freq FIlter frequency
     * @see <a href="https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html#BiquadFilterNode-description">W3C Web Audio API Documentation</a>
     * @return {Object} Filter
     */
    setFrequency : function(freq) {
      this.modify("frequency", freq);
      return this;
    },
    /**
     * Sets the Q if the filter.
     * @param {Integer} q Q of the filter
     * @return {Object} Filter
     */
    setQ : function(q) {
      this.modify("Q", q);
      return this;
    },
    /**
     * Sets the gain of the filter.  Only has affect on certain filters.
     * @see <a href="https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html#BiquadFilterNode-description">W3C Web Audio API Documentation</a>
     * @param {Integer} gain Value of gain
     * @return {Object} Filter
     */
    setGain : function(gain) {
      this.modify("gain", gain);
      return this;
    }
  });
  
  Filter.prototype.Types = {};
  Filter.Types = {};

  /** @constant */
  Filter.prototype.Types.ALLPASS   = Filter.Types.ALLPASS   = 7;
  /** @constant */
  Filter.prototype.Types.BANDPASS  = Filter.Types.BANDPASS  = 2;
  /** @constant */
  Filter.prototype.Types.HIGHPASS  = Filter.Types.HIGHPASS  = 1;
  /** @constant */
  Filter.prototype.Types.HIGHSHELF = Filter.Types.HIGHSHELF = 4;
  /** @constant */
  Filter.prototype.Types.LOWPASS   = Filter.Types.LOWPASS   = 0;
  /** @constant */
  Filter.prototype.Types.LOWSHELF  = Filter.Types.LOWSHELF  = 3;
  /** @constant */
  Filter.prototype.Types.NOTCH     = Filter.Types.NOTCH     = 6;
  /** @constant */
  Filter.prototype.Types.PEAKING   = Filter.Types.PEAKING   = 5;

  return Filter;

});