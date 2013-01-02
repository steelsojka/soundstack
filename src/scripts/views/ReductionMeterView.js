define(function() {

  var ReductionMeterView = Backbone.View.extend({
    events : {
      "click" : "disableDraw"
    },
    initialize : function() {
      _.bindAll(this);
      this.component = this.options.component;
      this.type = 0;
      this.previousValue = 0;
      this.cleared = true;
      this.disable = false;
      this.build();
    },
    build : function(argument) {
      var self = this;
      var $el = this.$el;
      var template = env === "web" ? _.template($('#stack-module-reduction-meter').html()) : templates.stack_module_reduction_meter;
      $el.html(template(this.component));
      this.canvas            = $el.find('canvas')[0];
      this.context           = this.canvas.getContext('2d');
      this.context.fillStyle = "#FF0000";
      this.context.font = "16px sans-serif";
      this.$counter = $el.find('.counter');
      this.module            = this.model.get('module');
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
      if (_.isUndefined(this.model.collection)) return;
      if (this.disable) return;
      
      var isPlaying = this.model.collection.chain()
                          .filter(function(m) { return m.get('category') === "Source"; })
                          .any(function(m) { return m.get('module').isPlaying; })
                          .value();

      if (!this.model.get('collapsed') && isPlaying) {
        this.draw();
        this.cleared = false;
      } else if (!this.cleared && !isPlaying) {
        this.clear();
        this.cleared = true;
      }
      requestAnimFrame(this.onFrame);
    },
    clear : function() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.previousValue = 0;
    },
    draw : function() {
      var ctx = this.context;
      var canvas = this.canvas;
      var data = this.module.getReduction();
      var width = this.canvas.width;
      var height = this.canvas.height;
      var type = this.type;
      var prev = this.previousValue;
      var calculated;

      calculated = data;

      if (_.isFinite(calculated)) {
        var fillWidth = -(calculated - prev);

        // ctx.fillStyle = "#FF0000";
        ctx.clearRect(0, 0, width, height);
        ctx.fillRect(width + calculated, 0, -(calculated), height);
        // ctx.fillStyle = "#FFFFFF";
        this.$counter.html(calculated.toFixed(0) + "db");
        // ctx.fillRect(width + calculated, 0, -calculated, height);

        
        
        this.previousValue = calculated;

      }
    }
  });

  return ReductionMeterView;

});