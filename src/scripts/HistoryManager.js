(function(exports) {

  // var worker = new Worker('HistoryWorker.js');

  var Level = function(module) {
    this.module = module;
    this.settings = _.clone(module.get('settings'));
  };

  Level.prototype.applyLevel = function() {
    this.module.applySettings(this.settings, true);
  };

  Level.prototype.destroy = function() {
    this.module.off("change:history");
  };

  var _handleChange = function() {
    HistoryManager.push(new Level(this));
  };

  var HistoryManager = {
    levels : [],
    listening : false,
    listen : function() {
      this.listening = true;
    },
    push : function(level) {
      this.levels.push(level);
    },
    undo : function() {
      if (this.levels.length < 1) return;

      var level = this.levels.pop();

      level.applyLevel();
    },
    register : function(module) {
      module.on('change:history', _handleChange);
    },
    unregister : function(module) {
      var removedLevels = _.filter(this.levels, function(level) {
        return level.module === module;
      });

      _.invoke(removedLevels, "destroy");

      this.levels = _.filter(this.levels, function(level) {
        return level.module !== module;
      });
    }
  };

  _.bindAll(HistoryManager);

  global_relay.on("global-undo", HistoryManager.undo);

  exports.HistoryManager = HistoryManager;

}(this));