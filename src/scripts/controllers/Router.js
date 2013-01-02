define("Router", ["BaseNode", "underscore", "Gain"], function(BaseNode, _, Gain) {

  var _isDefined = function(object) {
    return typeof object !== "undefined";
  };

  var Router = BaseNode.extend({
    init : function() {
      this._super.apply(this, arguments);
      this.route  = 0;
      this.routes = [];
      this.node = new Gain(this.context); // Acts as a buffer
      this.setInputNode(this.node.getInputNode());
      this.setOutputNode(this.node.getOutputNode());
    },
    addRouteTo : function(node, route) {
      if (_isDefined(route)) {
        if (route > this.routes.length) {
          this.routes.push([node]);
        } else {
          this.routes[route - 1].push(node);
        }
      } else {
        this.routes.push([node]);
      }
    },
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
    },
    setRoute : function(route) {
      var node, i;
      route = parseInt(route);
      // if (route > this.routes.length && this.routes.length === 0) return false;
     
      this.disconnectAll();
      
      if (route !== 0) {
        for (i = 0, _len = this.routes[route - 1].length; i < _len; i++) {
          node = this.routes[route - 1][i];
          this.connect(node);
        }
      }
      this.route = route;
    }
  });

  return Router;

});