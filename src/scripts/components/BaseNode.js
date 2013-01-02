/**
 * The base node that all components, modules, and controllers inherit from.
 * @module BaseNode
 * @requires Emitter
 * @requires underscore
 * @requires Class
 */
define(["Emitter", "components/Class"], function(emitter, Class) {

  var parsePath = function(path) {
    return path.split(".");
  };

  var _isDefined = function(object) {
    return typeof object !== "undefined";
  };

  /**
   * @constructor
   * @alias module:BaseNode
   * @augments Class
   */
  var BaseNode = Class.extend({
    /**
     * Constructor function
     * @param  {Object} context     AudioContext
     */
    init : function(context) {
      /**
       * Context to create node.
       */
      this.context    = _isDefined(context) && 
        context instanceof webkitAudioContext ? context : null;
      /**
       * The underlining node created from the audio context.
       * @type {Object}
       */
      this.node       = null;
      /**
       * Contains nodes AudioParams
       * @type {Object}
       */
      this.parameters = {};
      /**
       * Array of nodes that connect to this nodes input.
       * @type {Array}
       */
      this.inputFrom  = [];
      /**
       * Array of nodes that this nodes output connects to.
       * @type {Array}
       */
      this.outputTo   = [];
      /**
       * Node that underlining nodes connect to.
       * @type {Object}
       */
      this.inputNode = null;
      /**
       * Node that this node uses to output from.
       * @type {Object}
       */
      this.outputNode = null;
      this._enabled = true;
    },
    isEnabled : function() {
      return this._enabled;
    },
    /**
     * Sets nodes parameters to the passed in object.
     * @param {Object} object Object of parameters
     * @return {Object}   BaseNode
     */
    setParameters : function(object) {
      this.parameters = object;
      return this;
    },
    /**
     * Returns this nodes AudioContext node that created it.
     * @return {Object} AudioContext
     */
    getContext : function() {
      return this.node.context;
    },
    /**
     * Returns this nodes parameters or a spefied parameter.
     * @param  {String} [path] Parameter to return
     * @return {Object}      Parameter(s)
     */
    getParameters : function(path) {
      var object = this.parameters;
      if (path && path !== "") {
        if (!_.isArray(path)) {
          path = parsePath(path);
        } else {
          if (path.length === 0) {
            return object;
          }
        }
        for (var i = 0, _len = path.length; i < _len; i++) {
          if (path[i] in object) {
            object = object[path[i]];
          } else {
            console.error("Parameter path does not exist");
          }
        }
      }
      return object;
    },
    /**
     * Disconnects the node from all nodes or a specifed node.
     * @param  {Object} [node] Node to disconnect
     * @return {Object}      BaseNode
     */
    disconnect : function(node) {
      if (typeof node === "undefined") {
        this.outputNode.disconnect();
        console.log(this.getLabel() + " disconnected all outputs");
      } else {
        this.outputNode.disconnect(node.getInputNode());
        console.log(this.getLabel() + " disconnected from " + node.getLabel());
      }
      return this;
    },
    /**
     * Disconnects a node and reconnects it to other nodes in the outputTo Array.
     * @param  {Object} node The node to disconnect
     * @return {Object}      BaseNode
     */
    disconnectNode : function(node) {
      this.outputNode.disconnect();
      this.outputTo = _.without(this.outputTo, node);
      this.reconnect();
      return this;
    },
    /**
     * Disconnects all outputs and resets the outputTo array.
     * @return {Object} BaseNode
     */
    disconnectAll : function() {
      this.disconnect();
      this.outputTo = [];
      return this;
    },
    /**
     * Connects this node to its AudioContext destination node.
     * @return {Object} BaseNode
     */
    connectToMaster : function() {
      this.getOutputNode().connect(this.getContext().destination);
      this.setOutput(this.context);
      console.log(this.getLabel() + " connected to master output");
      return this;
    },
    /**
     * "Fans" the output of the node to all the nodes passed in.
     * @param {...Object} node Nodes to connect to
     * @return {Array} The nodes connected to
     */
    split : function(node) {
      var nodes = [];
      for (var i = 0, _len = arguments.length; i < _len; i++) {
        var node = arguments[i];
        if (node instanceof Class) {
          this.connect(node);
          nodes.push(node);
        }
      }
      return nodes;
    },
    /**
     * Connects nodes to other nodes. 
     * This is the universal connector function that works for components and modules.
     * The connect method is also chainable like most methods, but this one returns the
     * node that was just passed in.
     * AudioFile => EQ => Gain => Destination
     * @example
     * audioFile.connect(eq).connect(gain).connectToMaster();
     * @param  {Object} component Node to connect to
     * @return {Object}           Returns the node that has been connected to
     */
    connect : function(component, output, input) {
      // if (_.isArray(this.outputNode)) {
      //   for (var x = 0, node; node = this.outputNode[x]; x++) {
      //     if (_.isArray(node.outputNode)) {
      //       for (var i = 0, _component; _component = node[i]; i++) {
      //         node.outputNode.connect(_component.getInputNode());
      //         console.log(node.getLabel() + " => " + _component.getLabel());
      //         node.setOutput(_component);
      //         _component.setInput(node);
      //         return _component;
      //       }
      //     } else {
      //       node.outputNode.connect(component.getInputNode());
      //       console.log(node.getLabel() + " => " + component.getLabel());
      //       node.setOutput(component);
      //       component.setInput(node);
      //       return component;
      //     }
      //   }     
      // } else {
      //   if (_.isArray(component.getInputNode())) {
      //     var inputNodes = component.getInputNode();
      //     for (var i = 0, _component; _component = inputNodes[i]; i++) {
      //       this.outputNode.connect(_component.getInputNode());
      //       console.log(this.getLabel() + " => " + _component.getLabel());
      //       this.setOutput(_component);
      //       _component.setInput(this);
      //       return _component;
      //     }
      //   } else {
          var _output = _.isUndefined(output) ? 0 : output;  
          var _input  = _.isUndefined(input) ? 0 : input;
          var outputs = this.outputNode.numberOfOutputs;
          var inputs  = component.inputNode.numberOfInputs;
          var auto    = _.isUndefined(output) || _.isUndefined(input);
          var i;

          if (outputs === inputs && auto) {
            for (i = 0; i < inputs; i++) {
              this.outputNode.connect(component.getInputNode(), i, i);
            }
          } else if (outputs === 1 && inputs > 1 && auto) {
            for (i = 0; i < inputs; i++) {
              this.outputNode.connect(component.getInputNode(), 0, i);
            } 
          } else if (outputs > 1 && inputs === 1 && auto) {
            for (i = 0; i < outputs; i++) {
              this.outputNode.connect(component.getInputNode(), i, 0);
            }
          } else {
            this.outputNode.connect(component.getInputNode(), _output, _input);
          }
          console.log(this.getLabel() + " => " + component.getLabel());
          this.setOutput(component);
          component.setInput(this);
          return component;
        // }
      // }
    },
    /**
     * Reconnects this node to all the nodes in the outputTo array or the array of nodes passed in
     * @param  {Array} components Nodes to reconnect to
     * @return {Object}            BaseNode
     */
    reconnect : function(components) {
      var _components = components || this.outputTo;
      if (_.isArray(_components)) {
        for (var i = 0, _len = _components.length; i < _len; i++) {
          this.getOutputNode().connect(_components[i].getInputNode());
        }
      }
      return this;
    },
    /**
     * Returns input node.
     * @return {Object} Inputnode
     */
    getInputNode : function() {
      return this.inputNode;
    },
    /**
     * Returns output node.
     * @return {Object} Output node
     */
    getOutputNode : function() {
      return this.outputNode;
    },
    /**
     * Adds the node passed in into the outputTo array.
     * @param {Object} node Node to output to
     * @return {Object} BaseNode
     */
    setOutput : function(node) {
      if (!_.contains(this.outputTo, node)) {
        this.outputTo.push(node);
      }
      return this;
    },
    /**
     * Adds the node passed in into the inputFrom array.
     * @param {Object} node Node to input from
     * @return {Object} BaseNode
     */
    setInput : function(node) {
      if (!_.contains(this.inputFrom, node)) {
        this.inputFrom.push(node);
      }
      return this;
    },
    /**
     * Sets the underlining node to use as this objects input connection node.
     * @param {Object} node Audio node
     * @return {Object} BaseNode
     */
    setInputNode : function(node) {
      this.inputNode = node;
      return this;
    },
    /**
     * Sets the underlining node to use as this objects output connection node.
     * @param {Object} node Audio node
     * @return {Object} BaseNode
     */
    setOutputNode : function(node) {
      this.outputNode = node;
      return this;
    },
    /**
     * Sets this nodes label.  Used mostly in debugging or for naming specific components.
     * @param {String} label Label string
     * @return {Object} BaseNode
     */
    setLabel : function(label) {
      this.label = label;
      return this;
    },
    /**
     * Returns the nodes label.
     * @return {String} Label
     */
    getLabel : function() {
      return this.label;
    },
    /**
     * Returns this objects base node.
     * @return {Object|Null} The nodes base node
     */
    getNode : function() {
      if (typeof this.node !== "undefined") {
        return this.node;
      } else {
        return null;
      }
    },
    // addModifier : function(name, modifier) {
    //   this.modifiers[name] = modifier;
    //   return this;
    // },
    /**
     * Modifies a parameter in the parameters object.  Can be used to set nested properties as well.
     * @example
     * eq.modify("filter1.frequency", 440);
     * @param  {String} property Property
     * @param  {Integer|String|Object} value    Value to set
     * @return {Object}          BaseNode
     */
    modify : function(property, value) {
      var path = parsePath(property);
      var parameter = this.getParameters(path);
      parameter.value = value;
      return this;
    },
    automate : function(properties) {
      // IMPLINMENT THIS
      // var type = properties.type;
      // var prop = this.getModifiers(properties.property);
      // var time = properties.time;
      // switch(type) {
      //   case "set":

      //   case "linear":
      //   case "exponential":
      // }
    },
    /**
     * Adds a parameter to the parameters object.
     * @param {String} name     Parameter name
     * @param {Object} modifier AudioParam object
     * @return {Object} BaseNode
     */
    addParameter : function(name, modifier) {
      this.parameters[name] = modifier;
      return this;
    },
    /**
     * Listens for an event on the event emitter and performs the callback function when recieved.
     * @param  {String}   event    Event to listen for
     * @param  {Function} callback The function performed when a specific event is recieved
     * @return {Object}            BaseNode
     */
    listen : function(event, callback) {
      var self = this;
      emitter.on(event, function() {
        callback.apply(self, arguments);
      });
      return this;
    }
  });

  //Register BaseNode to the emitter. All objects now have the ability to emit and listen for events.
  emitter.register(BaseNode);

  return BaseNode;
});