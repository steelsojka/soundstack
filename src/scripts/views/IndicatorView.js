define(function() {
  
  var IndicatorView = Backbone.View.extend({
    events : {
      "click" : "disableDraw"
    },
    initialize : function() {
      _.bindAll(this);
      this.component = this.options.component;
      this.disable = false;
      this.build();
    },
    build : function() {
      var self = this;
      var $el = this.$el;
      var template = env === "web" ? _.template($('#stack-module-indicator').html()) : templates.stack_module_indicator;
      $el.html(template(this.component));
      this.canvas = this.$el.find('canvas')[0];
      this.context = this.canvas.getContext('2d');
      this.module = this.model.get('module');

      this.onFrame();
    },
    disableDraw : function() {
      this.disable = !this.disable;
      if (!this.disable) {
        this.$el.removeClass('disable-meter');
        this.onFrame();
      } else {
        this.$el.addClass('disable-meter');
      }
    },
    onFrame : function() {
      if (!this.model.get('collapsed') && !this.disable) {
        this.draw();
      }
      requestAnimFrame(this.onFrame);
    },
    draw : function() {
      var ctx = this.context;
      var width = this.canvas.width;
      var height = this.canvas.height;

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "rgba(255,255,0," + this.module.getIndicatorValue() + ")";
      ctx.fillRect(0, 0 , width, height);

      // this.$indicator.css('opacity', this.module.getIndicatorValue());
    }
  });

  return IndicatorView;

});