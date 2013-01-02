define(function() {

  var ModuleInstanceModel = Backbone.Model.extend({
    initialize : function() {
      var self = this;
      var module = this.get('module');
      this.set("parameters", module.getParameters());
      this.set("settings", {});
      module.on("reference-change", function(bool) {
        self.trigger('reference-select', bool);
      });
    },
    disable : function() {
      var module = this.get('module');
      module.disable();
      this.set('enabled', 0);
      this.trigger('disabled');
    },
    enable : function() {
      var module = this.get('module');
      this.set('enabled', 1);
      module.enable();
      this.trigger('enabled');
    },
    setSetting : function(name, value) {
      var settings = this.get('settings');
      settings[name] = value;
      this.set('settings', settings);
    },
    applySettings : function(settings) {
      this.set('settings', settings, {silent: true});
      this.trigger('change:settings');
    },
    setCollapsed : function(value) {
      this.set({collapsed : value}, {silent:true});
      this.trigger('change:collapsed');
    },
    setBpm : function(value) {
      if (!_.isUndefined(this.get('module').setBPM)) {
        this.get('module').setBPM(value);
      }
    }
  });

  return ModuleInstanceModel;

});