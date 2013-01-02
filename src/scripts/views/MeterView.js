define(function() {

  MeterView = Backbone.View.extend({
    events : {
      "click" : "disableDraw"
    },
    initialize : function() {
      _.bindAll(this);
      this.component = this.options.component;
      this.channel = parseInt(this.component.channel, 10);
      this.type = 0;
      this.cleared = true;
      this.disable = false;
      this.previousValue = 0;
      this.build();
    },
    build : function(argument) {
      var self = this;
      var $el = this.$el;
      var template = env === "web" ? _.template($('#stack-module-meter').html()) : templates.stack_module_meter;
      $el.html(template(this.component));
      this.$meter            = $el.find('.meter');
      this.canvas            = $el.find('canvas')[0];
      // this.canvasOverlay  = $el.find('canvas')[1];
      this.context           = this.canvas.getContext('2d');
      this.context.fillStyle = "#FFFF00";
      // this.oContext       = this.canvasOverlay.getContext('2d');
      this.module            = this.model.get('module');
      // this.draw = _.throttle(this.draw, 32);
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
                          .filter(function(m) { return m.get('category') === "Source" })
                          .any(function(m) { return m.get('module').isPlaying })
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
      var data = this.module.getByteFrequencyData(this.channel);
      // var oWidth = this.canvasOverlay.width;
      // var oHeight = this.canvasOverlay.height;
      var width = this.canvas.width;
      var height = this.canvas.height;
      var type = this.type;
      var prev = this.previousValue;
      var calculated;
      // var oCtx = this.oContext;
      // var gradient = oCtx.createLinearGradient(0, 0, oWidth, oHeight);
      // gradient.addColorStop(0, 'rgba(255,0,0,0)');
      // gradient.addColorStop(0.7, 'rgba(255,0,0,0)');
      // gradient.addColorStop(1, 'rgba(255,0,0,1)');
      // oCtx.fillStyle = gradient;

      // RMS
      if (type === 1) {
        calculated =  _.chain(data)
                       .map(function(value) { return value * value; })
                       .reduce(function(m, n) { return m + n; }, 0)
                       .modify(function(a) { return a / data.length;})
                       .modify(function(a) { return 10 * Math.log10(a);})
                       .value();

      } else if (type === 0) {
        calculated = _.chain(data)
                      .max()
                      .modify(function(v) {return (v + prev) / 2 ;})
                      .value();
      } else if (type === 2) {
        calculated = _.chain(data)
                      .max()
                      .modify(function(v) {return 20 * Math.log10(v / 1024);})
                      .value();
      }

      calculated = ~~(0.5 + calculated);

      // var RMS = Math.sqrt(average);
      if (_.isFinite(calculated)) {
        if (calculated > this.previousValue) {
          ctx.fillRect(this.previousValue, 0, calculated - this.previousValue, height);
        } else {
          ctx.clearRect(calculated, 0, width - calculated, height);
        }
        
        this.previousValue = calculated;

      }
    }
  });

  return MeterView;

});