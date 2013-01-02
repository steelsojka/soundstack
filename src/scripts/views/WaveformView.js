define(function() {

  var WaveformView = Backbone.View.extend({
    initialize : function() {
      _.bindAll(this);
      this.component = this.options.component;
      this.barPadding = 2;
      this.previousValue = 1;
      this.color = "#0000FF";
      this.build();
    },
    build : function(argument) {
      var self = this;
      var $el = this.$el;
      var template = env === "web" ? _.template($('#stack-module-waveform').html()) : templates.stack_module_waveform;
      $el.html(template(this.component));

      this.canvas = $el.find('canvas')[0];
      this.module = this.model.get('module');
      this.canvas.width = this.module.binCount;
      
      this.context = this.canvas.getContext('2d');

      this.onFrame();
    },
    onFrame : function() {
      this.draw();
      requestAnimFrame(this.onFrame);
    },
    draw : function() {
      var ctx = this.context;
      var canvas = this.canvas;
      var dataLeft = this.module.getByteTimeDomainData(0);
      var dataRight = this.module.getByteTimeDomainData(1);

      ctx.clearRect(0, 0, this.canvas.width, 300)

      // ctx.fillStyle = this.color;
      // ctx.strokeStyle = this.color;

      // if (this.type === 0) {
      //   ctx.moveTo(0, 300)
      //   ctx.beginPath();
      //   ctx.moveTo(this.canvas.width, 300);
      //   for (var i = data.length - 1; i >= 0; i--) {
      //     ctx.lineTo((-i) + this.canvas.width, (-data[i]) + 300);
      //   };
      //   ctx.closePath();
      //   ctx.fill();
      // } else if (this.type === 1) {
      //   ctx.moveTo(this.canvas.width, 300);
      //   ctx.beginPath();
      //   for (var i = data.length - 1; i >= 0; i--) {
      //     ctx.lineTo((-i) + this.canvas.width, (-data[i]) + 300);
      //   };
      //   ctx.stroke();
      // } else if (this.type === 2) {

      //   for (var i = data.length - 1; i >= 0; i -= bitsPerBar) {
      //     var height = _.max(_.slice(data, i, i - bitsPerBar));
      //     ctx.fillRect((-(i + 1)) + this.canvas.width, 300, barWidth, -height);
      //   };
  
      // }

    }
  });

  return WaveformView;

});