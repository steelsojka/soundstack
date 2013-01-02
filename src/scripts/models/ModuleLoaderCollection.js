define(['models/BaseModel'], function(BaseModel) {

  var ModuleLoaderCollection = Backbone.Collection.extend({
    url : env === "web" ? "api/web-service.php?request=get_modules&v=" + _.random(0, 100000)
                        : "modules.json",
    model : BaseModel,
    initialize : function() {
      _.bindAll(this);
      global_relay.on('stop-record', this.onStopRecord);
    },
    parse : function(res) {
      return res.modules;
    },
    onStopRecord : function(recorder) {
      var model = this.getModuleByName("Audio Player");
      model.loadModule(function() {
        global_relay.trigger("load-recorded-audio", model, function(module) {
          recorder.getBuffer(function(buffers) {
            var _module = module.get('module');
            _module.importBuffer(buffers);
          });

        });
      });
    },
    getModuleByName : function(name) {
      return this.find(function(m) {
        return m.get('name') === name;
      });
    },
    _getModules : function(data) {
      var moduleArray = [];
      var module, moduleToLoad, globals;

      for (var i = 0, _len = data.modules.length; i < _len; i++) {
        module = data.modules[i];
        globals = _.omit(module, "settings");

        moduleArray.push({
          globals : globals,
          settings : module.settings,
          model : this.find(function(model) {
            return parseInt(model.get('id'), 10) === parseInt(module.id, 10);
          })
        });
      }

      return _.without(moduleArray, _.last(moduleArray));
    },
    getModulesToLoad : function(key, callback) {
      var self = this;
      var data, module, moduleToLoad, globals;
      key = key;

      if (env === "web") {
        if (key in localStorage) {
          data = JSON.parse(localStorage.getItem(key));
          if (_.isFunction(callback)) {
            callback(this._getModules(data));
          }
        }
      } else if (env === "app") {
        chrome.storage.sync.get(key, function(items) {
          data = items[key];
          if (_.isFunction(callback)) {
            callback(self._getModules(data));
          }
        });
      }
    },
    getPresets : function(callback) {
      var presetArray = [];

      if (env === "web") {
        for (var i = 0, _len = localStorage.length; i < _len; i++) {
          var key = localStorage.key(i);
          if (key.search("preset") !== -1) {
            presetArray.push({presetName: key.replace("ss-preset-", ""), key : key});
          }
        }
        if (_.isFunction(callback)) {
          callback(presetArray);
        }

      } else if (env === "app") {
        chrome.storage.sync.get(null, function(items) {          
          presetArray = _.filter(items, function(i) { return i.key.search('preset') !== -1 });
          if (_.isFunction(callback)) {
            callback(presetArray);
          }
        });
      }

    }
  });

  return ModuleLoaderCollection;

});