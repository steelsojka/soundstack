/**
 * The base module for MediaStreamSource object module. Allows for real time user input.
 * @module MediaStream
 * @requires BaseNode
 */

define(["components/BaseNode"], function(BaseNode) {

  /**
   * @constructor
   * @alias module:MediaStream
   * @augments BaseNode
   */
  var MediaStream = BaseNode.extend({
    /**
     * Constructor function
     * @param  {Object} context     AudioContext
     * @param {Function} callbacK Callback function
     */
    init : function(context, callback) {
      this._super.apply(this, arguments);
      var self = this;
      try {
        navigator.webkitGetUserMedia({audio:true, video:false, toString : function() {return "audio";}}, function(stream) {
          self.node = self.context.createMediaStreamSource(stream);
          self.setInputNode(self.node);
          self.setOutputNode(self.node);
          callback.apply(self, arguments);
        }, function(err) {console.log(err)});
      } catch (err) {
        log(err);
        alert("Your browser does not support User Media Input");
      }

    }
  })

  return MediaStream;

});