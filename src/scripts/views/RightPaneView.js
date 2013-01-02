define(["views/TabView", "views/StackView", "views/ModuleLoaderView", "models/ModuleLoaderCollection", "models/StackCollection"], 

function(TabView, StackView, ModuleLoaderView, ModuleLoaderCollection, StackCollection) {

  var RightPaneView = Backbone.View.extend({
    className : "right-pane",
    initialize : function() {

      var self = this;
      var stack = this.options.stack;
      var moduleLoader = new ModuleLoaderCollection();

      stack.loader = moduleLoader;

      _.bindAll(this);
      this.template   = env === "web" ? _.template($('#templates #right-pane-template').html()) : templates.right_pane_template;
      this.$container = $('#right-pane-container');
      this.$container.prepend(this.$el);


      // new TabView({
      //   model : this.model,
      //   className : "tab-view right-pane-tabs"
      // });


      new ModuleLoaderView({
        collection : moduleLoader,
        model : this.model,
        stack : stack
      });
      new StackView({ 
        model : this.model,
        collection : stack,
        loader : moduleLoader
      });

      this.render();

    },
    render : function() {
      this.$el.prepend(this.template());
    }
  });

  return RightPaneView;

});