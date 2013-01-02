define(function() {

  var ModuleView = Backbone.View.extend({
    className : 'module-select',
    events : {
      "click .add-btn" : "onClick",
      "click" : "onExpand"
    },
    initialize : function() {
      _.bindAll(this);
      this.$container = this.options.$container;
      this.stack = this.options.stack;
      this.hide = true;
      this.template = env === "web" ? _.template($('#templates #module-select-template').html()) : templates.module_select_template;
      this.render();
      // this.model.on('change', this.render);
    },
    render : function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$container.append(this.$el);
    },
    onExpand : function() {
      this.hide = !this.hide;
      
      if (this.hide) {
        this.$el.find('.module-description').addClass('hide');
      } else {
        this.$el.find('.module-description').removeClass('hide');        
      }
    },
    load : function() {
      this.model.loadModule(function() {
        self.stack.createModule(self.model);
      });
    },
    onClick : function(e) {
      var self = this;

      e.stopPropagation();

      this.model.loadModule(function() {
        self.stack.createModule(self.model);
        $('.cancel-add-btn').trigger('click');
      });
    }
  });

  return ModuleView;

});