define(function() {

  var HelpItemView = Backbone.View.extend({
    events : {
      "click .title" : "onToggle"
    },
    className : "help-item",
    initialize : function() {
      _.bindAll(this);
      this.collection = this.options.collection;
      this.collection.on('item-toggle', this.onItemToggle);
      this.$container = this.options.$container;
      this.expand = false;
      this.template = this.template = env === "web" ? _.template($('#help-template').html()) : templates.help_template;
      this.render();
    },
    render : function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$container.append(this.$el);
    },
    onToggle : function() {
      this.expand = !this.expand;

      if (this.expand) {
        this.$el.find('.description')
                .removeClass('hide')
                .addClass('expand')
                .siblings()
                .addClass('expand');
      } else {
        this.$el.find('.description')
                .addClass('hide')
                .removeClass('expand')
                .siblings()
                .removeClass('expand');
      }
      this.collection.trigger('item-toggle', this.model);
    },
    onItemToggle : function(model) {
      if (model !== this.model) {
        this.$el.find('.description').addClass('hide');
      }
    }
  });

  var HelpView = Backbone.View.extend({
    id : "help",
    className : "hide",
    events : {
      "click .close" : "onToggle"
    },
    initialize : function() {
      _.bindAll(this);
      this.$container = this.options.$container;
      this.$container.after(this.$el);
      this.$el.prepend('<div class="close">&times</div>');
      this.collection = this.options.collection;
      this.show = false;
      // this.template = env === "web" ? _.template($('#help-template').html()) : templates.help_template;
      this.render();
    },
    render : function() {
      var self = this;

      this.collection.each(function(model) {
        new HelpItemView({
          model : model,
          collection : self.collection,
          $container : self.$el
        });
      });
      // this.$el.html(this.template(this.model.toJSON()));
      // this.$container.append(this.$el);
    },
    onToggle : function() {
      if (!this.show) {
        this.$el.removeClass('hide');
        $(window).on('keydown', this.onKeydown);
      } else {
        this.$el.addClass('hide');
        $(window).off('keydown', this.onKeydown);
      }
      this.show = !this.show;
    },
    onKeydown : function(e) {
      if (e.keyCode === 27) {
        this.onToggle();
      }
    }
  });

  return HelpView;

});
