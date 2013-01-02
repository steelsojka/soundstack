/**
 * Module for routing a signal to other paths in the chain. Also could be called a "switch".
 * @module Router
 * @requires BaseNode
 * @requires underscore
 * @requires Gain
 */

define(["components/BaseNode", "components/Gain"], function(BaseNode, Gain) {

  var _isDefined = function(object) {
    return typeof object !== "undefined";
  };

  /**
   * @constructor
   * @alias module:Router
   * @augments BaseNode
   */
  var Router = BaseNode.extend({
    init : function() {
    /**
     * Constructor function
     * @param  {Object} context     AudioContext
     */
      this._super.apply(this, arguments);
      /**
       * Current route.
       * @type {Integer}
       */
      this.route  = 0;
      /**
       * Array of routes.
       * @type {Array}
       */
      this.routes = [];
      this.node = new Gain(this.context); // Acts as a buffer
      this.setInputNode(this.node.getInputNode());
      this.setOutputNode(this.node.getOutputNode());
    },
    /**
     * Adds a node to a route. If a route is not passed in the node will be added to a new route.
     * @param {Object} node  Node to add to route
     * @param {Integer} route Optional. The route to add the node to.
     * @return {Router} Router
     */
    addRouteTo : function(node, route) {
      var length = this.routes.length;
      if (_isDefined(route)) {
        if (route > length) {
          if (route - length > 1) {
            for (var i = 1, _len = route - length; i < _len; i++) {
              this.routes.push([]);
            }
          } 
          this.routes.push([node]);
        } else {
          this.routes[route - 1].push(node);
        }
      } else {
        this.routes.push([node]);
      }
      return this;
    },
    /**
     * Removes a node from a route. If a route is not passed, it will remove the node from all routes.
     * @param  {Object} node  Node to removefrom route
     * @param  {Integer} route Optional. Route to remove from
     * @return {Router}      Router
     */
    removeRouteTo : function(node, route) {
      if (_isDefined(node)) {
        if (_isDefined(route)) {
          this.routes[route - 1] = _.without(this.routes[route - 1], node);
        } else {
          for (var i = 0, _len = this.routes.length; i < _len; i++) {
            this.routes[i] = _.without(this.routes[i], node);
          }
        }
      } else {
        this.routes = [];
        this.route = 0;
      }
      return this;
    },
    /**
     * Set the current route.
     * @param {Integer} route Route to set to
     * @return {Router} Router
     */
    setRoute : function(route) {
      (function(self, args, route) {

        self._setRoute.apply(self, args);
        setTimeout(function() {           // For some reason we have to do this twice.
          self._setRoute.apply(self, args);    // Seems like a race condition?
        }, 10);
        
      }(this, arguments, route));
      return this;
    },
    /**
     * Internal route set
     * @param {Integer} route Route to set to
     * @private
     */
    _setRoute : function(route) {
      var node, i;
      var self = this;
      route = parseInt(route);

      if (route > this.routes.length && this.routes.length === 0) return false;
      
      this.disconnect();
      
      if (route !== 0) {
        for (i = 0, _len = this.routes[route - 1].length; i < _len; i++) {
          node = this.routes[route - 1][i];
          this.connect(node);
        }
      }
      this.route = route;
    },
    /**
     * Sets the gain of the router.
     * @return {Router} Router
     */
    setGain : function() {
      this.node.setGain.apply(this.node, arguments);
      return this;
    }
  });

  return Router;

});