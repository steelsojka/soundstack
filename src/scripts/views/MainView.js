define(["views/NavigationView", "views/RightPaneView", "models/SettingsModel", "views/SettingsView"
  , "models/StackCollection"], 

function(NavigationView, RightPaneView, SettingsModel, SettingsView, StackCollection) {

  var MainView = Backbone.View.extend({
    initialize : function() {
      _.bindAll(this);

      this.settings = new SettingsModel();
      this.settings.on('loaded', this.onSettingsLoaded);
      window.settings = this.settings;

      this.settings.load();
    },
    onSettingsLoaded : function() {
      var self = this;
      var stack = new StackCollection();

      new RightPaneView({
        model : self.model,
        stack : stack
      });
      new NavigationView({
        model : self.model,
        settings : this.settings,
        stack : stack
      });

      new SettingsView({
        model : this.settings,
        $container : $(self.el)
      });
    },
    render : function() {

    }
  });

  return MainView;

});