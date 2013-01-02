define(function() {

  var SettingsView = Backbone.View.extend({
    id : "settings",
    className : "hide",
    initialize : function() {
      _.bindAll(this);
      this.$container = this.options.$container;
      this.template = env === "web" ? _.template($('#settings-template').html()) : templates.settings_template;
      this.model.on('change', this.render);
      this.model.on('toggle', this.onToggle);
      this.render();
    },
    render : function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$container.append(this.$el);
    },
    onToggle : function() {
      if (this.model.get('show')) {
        this.$el.removeClass('hide');
      } else {
        this.$el.addClass('hide');
      }
    }
  });

  return SettingsView;

});
