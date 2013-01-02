define(function() {

  var TabView = Backbone.View.extend({
    className : "tab-view",
    events : {
      "click .tab" : "onClick"
    },
    initialize : function() {
      _.bindAll(this);
      this.template = _.template($('#templates #tab-view-template').html());
      this.$container = $('#right-pane-container');
      this.$container.prepend(this.$el);
      this.model.on('change', this.render);
      this.render();
    },
    render : function() {
      this.$el.html(this.template(this.model.toJSON()));
    },
    queryTabViews : function() {
      var tabViews = _.map($('.tab', this.$el), function(tab) {
        return tab.getAttribute("data-view");
      });
      return $(tabViews.join(", "));
    },
    onClick : function(e) {
      this.model.updateTabs(e.target.getAttribute("data-view"));

      $('.tab', this.$el).removeClass('selected');
      var viewToShow = $(e.target).addClass('selected').attr("data-view");
      var $tabViews = this.queryTabViews();
      $tabViews.removeClass("selected").filter(viewToShow).addClass('selected');
    }
  });

  return TabView;

});