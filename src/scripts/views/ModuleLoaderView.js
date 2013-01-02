define(["views/ModuleView"], function(ModuleView) {

  var ModuleLoaderView = Backbone.View.extend({
    id : "module-loader",
    className : "tab-content",
    initialize : function() {
      _.bindAll(this);
      this.template   = env === "web" ? _.template($('#templates #module-loader-template').html()) : templates.module_loader_template;
      this.$container = $('.right-pane');
      this.$container.prepend(this.$el);
      this.collection.on('reset', this.render);
      this.collection.fetch();
    },
    render : function() {
      var self = this;
      // this.$el.html(this.template(this.model.toJSON()));
      this.collection.each(function(model) {
        new ModuleView({
          model : model,
          stack : self.options.stack,
          $container : self.$el
        });
      });
    }
  });

  return ModuleLoaderView;

});