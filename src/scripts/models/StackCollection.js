define(["models/ModuleInstanceModel", "components/AudioContext", 
        "models/BaseModel", "modules/MasterOut"], 

function(ModuleInstanceModel, AudioContext, BaseModel, MasterOut) {

  var masterInterface = {
      "version" : 1,
      "interface" :
      [
        [{
            "type" : "button",
            "name" : "Record",
            "disableClass" : "",
            "class" : "int-width-half",
            "addClassOnPress" : "pressed-red",
            "removeClassOnEvent" : [
              {
                "event" : "stop-record",
                "_class" : "pressed-red"
              }
            ],
            "func" : {
              "name" : "record",
              "parameters" : [
                {
                  "type" : "Integer",
                  "value" : 0
                }
              ]
            }
          }, {
            "type" : "button",
            "name" : "Stop",
            "disableClass" : "",
            "class" : "int-width-half",
            "func" : {
              "name" : "stopRecord",
              "parameters" : [
                {
                  "type" : "Integer",
                  "value" : 0
                }
              ]
            }
          },
          {
            "type" : "slider",
            "name" : "Output",
            "minValue" : 0,
            "maxValue" : 2,
            "defaultValue" : 1,
            "step" : 0.01,
            "orientation" : "horizontal",
            "disableClass" : "",
            "behavior" : "log",
            "func" : {
              "name" : "setGain",
              "parameters" : [
                {
                  "type" : "Float",
                  "value" : "@VALUE@"
                }
              ]
            }
          },
          {
            "type" : "meter",
            "name" : "Output Left",
            "channel" : 0
          },
          {
            "type" : "meter",
            "name" : "Output Right",
            "channel" : 1
          }
        ]
      ]
   };

  var StackCollection = Backbone.Collection.extend({
    model : ModuleInstanceModel,
    initialize : function() {
      _.bindAll(this);
      var self = this;
      window.stack = this;
      this.BPM = 120;
      this.context = new AudioContext().getContext();

      // var userInput = new LineInput(this.context, function() {
      //   self.trigger('user-input:loaded', userInput);
      // });

      this.on('add', this.connectStack);
      this.on('reset', this.initializeStack);
      this.on('positions-updated', this.connectStack);
      this.on('bypass-fx reference-select', this.connectStack);
      this.on('manual-connect', function() {
        self.connectStack();
      });
      this.on('remove', this.onRemove);
      this.on('change:BPM', this.updateBPM);

      // settings.on('restart', this.onRestart);
      
      global_relay.on('load-recorded-audio', function(model, callback) {
        self.createModule(model, undefined, undefined, callback);
      });
      global_relay.on('get-recorder', function(callback) {
        callback(self.getRecorder());
      });
      this.initializeStack();
      // this.on('user-input:loaded', this.initializeStack);
    },
    onRestart : function() {
      var self = this;
      
      this.each(function(model) {
        self.remove(model);
      });
      
      this.reset();
    },
    initializeStack : function() {

      window.masterOut = new ModuleInstanceModel({
        module    : new MasterOut(this.context),
        name      : "Output",
        category  : "Output",
        disable   : 1,
        collapsed : 0,
        draggable : 0,
        position  : 1,
        removable : 0,
        enabled   : 1,
        interface : masterInterface
      });
      this.add(masterOut);

      // this.off('reset', this.initializeStack);
    },
    getRecorder : function() {
      var output = this.find(function(m) { return m.get('name') === "Output"; });
      return output.get('module').getRecorder();
    },
    load : function(key) {
      var self = this;
      
      this.loader.getModulesToLoad(key, function(moduleArray) {
        var modules = self.pluck('module');
        _.invoke(_.compact(modules), "destroy");

        self.each(function(m) {
          self.trigger("load-remove", m);
        });

        self.reset();

        self._loadIndex = 0;

        self._load(moduleArray);
      });

      // for (var i = 0, _len = moduleArray.length; i < _len; i++) {
        // (function(module, stack) {

        //   module.model.loadModule(function() {
        //     stack.createModule(module.model, module.settings, module.globals);
        //     // module.model.applySettings(module.settings);
        //   });

        // }(moduleArray[i], this.collection));
      // }
    },
    _load : function(moduleArray) {
      var self = this;
      var stack = this;
      var module = moduleArray[this._loadIndex];
      var _moduleArray = moduleArray;

      module.model.loadModule(function() {
        stack.createModule(module.model, module.settings, module.globals, function() {
          if (!_.isUndefined(_moduleArray[self._loadIndex + 1])) {
            self._loadIndex++;
            self._load(_moduleArray);
            // module.model.applySettings(module.settings);
          }
        });
      });
    },
    getPresets : function(callback) {
      this.loader.getPresets(callback);
    },
    save : function(presetName, callback) {
      var output = [];
      this.each(function(model) {
        var obj = {};
        for (var key in model.attributes) {
          if (model.attributes.hasOwnProperty(key)) {
            var type = typeof model.attributes[key];
            if (type !== "function" && type !== "object" ) {
              obj[key] = model.attributes[key];
            }
          }
        }
        obj.settings = model.attributes.settings;
        output.push(obj);
      });
      var key = "ss_preset_" + presetName
      var postObj = {
        key : key,
        presetName : presetName,
        modules : output
      };

      var storage = {};
      storage['ss_preset_' + presetName] = postObj;

      if (env === "web") {
        localStorage.setItem("ss-preset-" + presetName, JSON.stringify(postObj));
        if (_.isFunction(callback)) {
          callback(postObj);
        }
      } else if (env === "app") {
        chrome.storage.sync.set(storage, function() {
          if (_.isFunction(callback)) {
            callback(postObj);
          }
        });
      }

      // $.post('api/web-service.php?request=save_stack', {data:JSON.stringify(postObj), user:"Steel", name:presetName}, function(res) {
      //   console.log(res);
      // });
    },
    checkSource : function() {
      var self = this;
      this.each(function(module) {
        if (module.get('category') === "Source") {
          self.remove(module);
        }
      });
    },
    onRemove : function(module) {
      module.get('module').destroy();

      HistoryManager.unregister(module);

      this.connectStack();
    },
    updateItemPosition : function(start, end) {
      var item = this.models[start];
      var temp = _.without(this.models, item);
      temp.splice(end, 0, item);
      this.models = temp;
      this.trigger('positions-updated');
    },
    connectStack : function() {
      var modules = this.pluck('module');
      var module, nonSource;
      var referenceNode = this.last().get('module').getReferenceNode();
      var self = this;

      _.invoke(modules, 'disconnectAll');
      
      this.each(function(model, i) {
        var module = model.get('module');

        if (i === self.length - 1) {
          module.connectToMaster();
        } else {
          if (model.get('category') === "Source") {
            nonSource = self.chain()
                            .filter(function(m) { return m.get('category') !== "Source"})
                            .first()
                            .value();

            if (module.reference) {
              module.connect(referenceNode);
            } else if (model.get('bypassFx')) {
              module.connect(self.last().get('module'));
            } else {
              module.connect(nonSource.get('module'));
            }
          } else {
            module.connect(self.models[i + 1].get('module'));
          }
        }
      });

      this.updateBPM();

      // for (var i = 0, _len = modules.length; i < _len; i++) {
      //   module = modules[i];
      //   if (typeof modules[i + 1] === "undefined") {
      //     module.connectToMaster();
      //   } else {

      //     module.connect(modules[i + 1]);
      //   }
      // }
    },
    updateBPM : function() {
      this.invoke("setBpm", this.BPM);
    },
    createModule : function(model, settings, globals, callback) {
      var self = this;
      var applySettings = !_.isUndefined(settings);
      var newModule   = model.createInstance(this.context);
      var stackSize   = this.length;
      var fixPosition = newModule.get('fix_position');
      var interface   = newModule.get('interface_path');
      var version     = parseInt(newModule.get('version'), 10);
      var cacheInterface = parseInt(newModule.get('cach_interface'), 10);
      var localInterface = "interface-" + interface;
      var category    = newModule.get('category').toLowerCase();
      fixPosition     = fixPosition ? parseInt(fixPosition) : fixPosition;
      var insertIndex = fixPosition === 0 ? 0 :
                        fixPosition === 1 ? stackSize : 
                        stackSize - 1;

      var getNewInterface = true;

      if (!_.isUndefined(globals)) {
        newModule.set(globals);
      }

      if (newModule.get('enabled')) {
        newModule.enable();
      } else {
        newModule.disable();
      }

      if (env === "app") {
        this.add(newModule, {at : insertIndex});

        if (applySettings) {
          newModule.applySettings(settings);
        }
        if (_.isFunction(callback)) {
          callback(newModule);
        }
        return;
      }

      if (localInterface in localStorage) {
        var parsedInterface = JSON.parse(localStorage.getItem(localInterface));
        var userVersion = parseInt(parsedInterface.version, 10);

        if (version === userVersion) {

          newModule.set('interface', parsedInterface);
          
          if (category === "source") {
              // this.checkSource();
          }
          this.add(newModule, {at : insertIndex});

          if (applySettings) {
            newModule.applySettings(settings);
          }
          getNewInterface = false;
        }

        if (_.isFunction(callback)) {
          callback(newModule);
        }
      }

      if (getNewInterface) {

        $.get('api/web-service.php?request=get_interface&v=' + _.random(0, 100000) + '&module=' + interface + "&version=" + version, function(res) {
          
          localStorage.setItem(localInterface, JSON.stringify(res));
          
          newModule.set('interface', res);

          if (category === "source") {
            self.checkSource();
          }

          self.add(newModule, {at : insertIndex});
          
          if (applySettings) {
            newModule.applySettings(settings);
          }

        if (_.isFunction(callback)) {
          callback(newModule);
        }

        }); 
      }
    }
  });

  return StackCollection;

});