define(function() {

  var SpectrumView = Backbone.View.extend({
    initialize : function() {
      _.bindAll(this);
      this.component = this.options.component;
      this.channel = parseInt(this.component.channel, 10);
      this.barPadding = 2;
      this.previousValue = 1;
      this.cleared = true;
      this.color = "#DBDBDB";
      this.build();
    },
    build : function(argument) {
      var self = this;
      var $el = this.$el;
      var template = env === "web" ? _.template($('#stack-module-spectrum').html()) : templates.stack_module_spectrum;
      $el.html(template(this.component));

      this.canvas = $el.find('canvas')[0];
      this.module = this.model.get('module');
      this.canvas.width = this.module.binCount;
      
      this.context = this.canvas.getContext('2d');

      this.onFrame();
    },
    onFrame : function() {
      if (_.isUndefined(this.model.collection)) return;
      
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
    },
    draw : function() {
      var ctx = this.context;
      var canvas = this.canvas;
      var data = this.module.getByteFrequencyData(this.channel);
      var prev = this.previousValue;
      var calculated;
      this.type = this.module.spectrumType;
      this.bars = this.module.bars;
      var bitsPerBar = this.module.binCount / this.bars;
      var barWidth = (this.canvas.width / this.bars) - 2


      ctx.clearRect(0, 0, this.canvas.width, 300)

      ctx.fillStyle = this.color;
      ctx.strokeStyle = this.color;

      if (this.type === 0) {
        ctx.moveTo(0, 300)
        ctx.beginPath();
        ctx.moveTo(this.canvas.width, 300);
        for (var i = data.length - 1; i >= 0; i--) {
          ctx.lineTo((-i) + this.canvas.width, (-data[i]) + 300);
        };
        ctx.closePath();
        ctx.fill();
      } else if (this.type === 1) {
        ctx.moveTo(this.canvas.width, 300);
        ctx.beginPath();
        for (var i = data.length - 1; i >= 0; i--) {
          ctx.lineTo((-i) + this.canvas.width, (-data[i]) + 300);
        };
        ctx.stroke();
      } else if (this.type === 2) {

        for (var i = data.length - 1; i >= 0; i -= bitsPerBar) {
          var height = _.max(_.slice(data, i, i - bitsPerBar));
          ctx.fillRect((-(i + 1)) + this.canvas.width, 300, barWidth, -height);
        };
  
      }

    }
  });

  return SpectrumView;

});