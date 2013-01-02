define(function() {

  var PresetView = Backbone.View.extend({
    className : "preset",
    events : {
      "click" : "onLoad"
    },
    initialize : function() {
      this.template = env === "web" ? _.template($("#preset-template").html()) : templates.preset_template;
      this.render();
    },
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.options.$container.append(this.$el);
    },
    onLoad : function() {
      this.options.collection.load(this.model);
    }
  });

  var PresetLoaderView = Backbone.View.extend({
    id : "preset-loader",
    className : "hide",
    initialize : function() {
      _.bindAll(this);
      this.collection = this.options.collection;
      this.$container = this.options.$container;
      this.open = false;

      this.$container.after(this.$el);
      this.collection.on('reset', this.render);
      this.collection.on('load', this.toggle);
      this.collection.on('add', this.render);
    },
    render : function() {
      var self = this;
      self.$el.html("");

      this.collection.each(function(preset) {
        new PresetView({
          model : preset,
          $container : self.$el,
          collection : self.collection
        });
      });
    },
    toggle : function() {
      var action = this.open ? "addClass" : "removeClass";

      if (!this.open) {
        $(window).on('keydown', this.onKeydown);
      } else {
        $(window).off('keydown', this.onKeydown);
      }

      this.$el[action]('hide');
      this.open = !this.open;
    },
    onKeydown : function(e) {
      if (e.keyCode === 27) {
        this.toggle();
      }
    }
  });

  return PresetLoaderView;

});