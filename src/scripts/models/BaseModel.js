define(["models/ModuleInstanceModel"], function(ModuleInstanceModel) {

  var BaseModel = Backbone.Model.extend({
    initialize : function() {
      _.bindAll(this);
    },
    loadModule : function(callback) {
      var self = this;  
      var path = self.get('path');

      require(["scripts/" + path], function(_Module) {
        self.set("module", _Module);
        callback();
      });
    },
    createInstance : function() {
      var args = arguments;
      var _Module = this.get('module');
      var instance;

      var _module = (function() {
        function Module(args) {
            return _Module.apply(this, args);
        }
        Module.prototype = _Module.prototype;

        return function() {
            return new Module(args);
        }
      })();

      var instanceObject = _.clone(this.attributes);
      _.extend(instanceObject, {
        module : new _module(),
        bypassFx : false
      });

      instance = new ModuleInstanceModel(instanceObject);
      instance.id = _.uniqueId();

      HistoryManager.register(instance);

      return instance;
    }
  });

  return BaseModel;

});