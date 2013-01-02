define(["views/NavigationView", "views/RightPaneView", "models/SettingsModel", "views/SettingsView"
  , "models/StackCollection"], 

function(NavigationView, RightPaneView, SettingsModel, SettingsView, StackCollection) {

  var MainView = Backbone.View.extend({
    initialize : function() {
      _.bindAll(this);

      var self = this;
      var settings = new SettingsModel();
      var stack = new StackCollection();

      new RightPaneView({
        model : self.model,
        stack : stack
      });
      new NavigationView({
        model : self.model,
        settings : settings,
        stack : stack
      });

      new SettingsView({
        model : settings,
        $container : $(this.el)
      });

    },
    render : function() {

    }
  });

  return MainView;

});