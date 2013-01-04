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

  Level.prototype.getSettings = function() {
    return this.module.get('settings');
  };

  var _handleChange = function() {
    HistoryManager.push(new Level(this));
  };

  var HistoryManager = {
    levels : [],
    redoLevels : [],
    listening : false,
    maxLevels : 25,
    listen : function() {
      this.listening = true;
    },
    push : function(level) {
      if (this.levels.length >= this.maxLevels) {
        this.levels.shift();
      }
      this.levels.push(level);
    },
    pushRedo : function(level) {
      if (this.redoLevels.length >= this.maxLevels) {
        this.redoLevels.shift();
      }
      this.redoLevels.push(level);
    },
    undo : function() {
      if (this.levels.length < 1) return;

      var level = this.levels.pop();
      var currentLevel = new Level(level.module);

      level.applyLevel();

      this.pushRedo(currentLevel);
    },
    redo : function() {
      if (this.redoLevels.length < 1) return;

      var level = this.redoLevels.pop();

      this.push(new Level(level.module));

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
  global_relay.on("global-redo", HistoryManager.redo);

  exports.HistoryManager = HistoryManager;

}(this));