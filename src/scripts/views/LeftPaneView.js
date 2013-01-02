define(function() {

  var RightPaneView = Backbone.View.extend({
    className : "left-pane",
    initialize : function() {
      _.bindAll(this);
      this.template = env === "web" ? _.template($('#templates #left-pane-template').html()) : templates.left_pane_template;
      this.$container = $('#left-pane-container');

      this.model.on('change', this.render);
    },
    render : function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$container.html(this.$el);
    }
  });

  return RightPaneView;

});