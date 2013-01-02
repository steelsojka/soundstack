define(function() {

  var WaveformStaticView = Backbone.View.extend({
    initialize : function() {
      _.bindAll(this);
      var self = this;
      var $el = this.$el;

      this.component = this.options.component;
      this.color = "#0000FF";
      this.status = "No audio loaded";

      var template = env === "web" ? _.template($('#stack-module-static-waveform').html()) : templates.stack_module_static_waveform;
      this.tooltipTemplate = env === "web" ? _.template($('#mouse-tooltip-template').html()) : templates.mouse_tooltip_template;
      
      $el.html(template(this.component));
      
      this.canvas = $el.find('canvas')[0];
      this.overlayCanvas = $el.find('canvas')[1];
      this.context = this.canvas.getContext('2d');
      this.overlayContext = this.overlayCanvas.getContext('2d');
      this.canvas.width = this.overlayCanvas.width = 4096;

      this.module = this.model.get('module');
      this.module.on('audio-loaded', this.build);
      this.module.on('status-update', this.onStatusUpdate);
      this.module.on('play', this.drawLoop);
      this.module.on('stop', this.clearProgress);

      this.$el.find('.frosted-glass').on('click', this.onMouseClick)
                                     .on('mousemove', this.onMouseMove)
                                     .on('mouseover', this.onMouseOver)
                                     .on('mouseout', this.onMouseOut);

    },
    build : function(argument) {
      this.buffer = this.module.getBuffer();
      this.getPeaks();
    },
    clearWaveform : function() {
      var ctx = this.context;
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    clearProgress : function() {
      var ctx = this.overlayContext;
      ctx.clearRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);
    },
    onStatusUpdate : function(status) {
      this.clearWaveform();
      this.$el.find('.waveform-status').html(status);
    },
    _getMousePosition : function(e) {
      var rect = this.canvas.getBoundingClientRect();
      return {
        x : e.clientX - rect.left,
        y : e.clientY - rect.top
      }
    },
    onMouseClick : function(e) {
      var pos = this._getMousePosition(e);
      var canvasWidth = $(this.canvas).width();
      var x = pos.x / canvasWidth;

      var newPosition = this.module.getDuration() * x;

      this.module.setPosition(newPosition);
     
      if (!this.module.isPlaying) {
        this.drawProgress()
      }
    },
    onMouseOver : function(e) {
      $('#tooltip-container').removeClass('hide');
    },
    onMouseOut : function(e) {
      $('#tooltip-container').addClass('hide');
    },
    renderTooltip : function(e) {
      $('#tooltip-container').html(this.tooltipTemplate(this.getMouseTime(e)))
                             .css({top : e.clientY - 50, left : e.clientX - 35});
    },
    getMouseTime : function(e) {
      var pos = this._getMousePosition(e);
      var canvasWidth = $(this.canvas).width();
      var x = pos.x / canvasWidth;

      var newPosition = this.module.getDuration() * x;

      return {
        minutes : ~~ ((newPosition % 3600) / 60),
        seconds : newPosition % 60,
        milliseconds : ((newPosition % 60) - ~~(newPosition % 60)) * 1000
      }
    },
    onMouseMove : function(e) {
      this.renderTooltip(e);
    },
    clearStatus : function() {
      this.$el.find('.waveform-status').html("");
    },
    getPeaks : function() {
      var self = this;
      var buffer = this.module.getBuffer();

      var channelData = function() {
        var array = [];
        for (var i = 0; i < buffer.numberOfChannels; i++) {
          array.push(buffer.getChannelData(i));
        }
        return array;
      }();

      this.fps = buffer.length / buffer.duration;
      this.fpp = channelData[0].length / this.canvas.width;

      worker.postMessage({
        action : "waveform-peaks",
        data : channelData,
        width : this.canvas.width
      });

      worker.onmessage = function(res) {
        if (res.data.action === "waveform-peaks") {
          self.peaks = res.data.data;
          self.draw(res.data.data);
          self.clearStatus();
        }
      };

      this.onStatusUpdate('Building waveform...');
    },
    drawLoop : function() {
      if (this.module.isPlaying) {
        if (!this.model.get('collapsed')) {
          this.drawProgress();
        }
        requestAnimFrame(this.drawLoop);
      }
    },
    drawProgress : function() {
      var ctx = this.overlayContext;
      var position = (this.module.getPosition() * this.fps) / this.fpp;
      ctx.clearRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);
      ctx.fillStyle = 'rgba(255,255,255, 0.7)';
      ctx.fillRect(0, 0, position, this.overlayCanvas.height);

    },
    draw : function() {
      var ctx = this.context;
      var canvas = this.canvas;
      var maxPeak = _.max(this.peaks);
      var self = this;
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

      _.each(this.peaks, function(peak, i) {
        self.drawFrame(i, peak, maxPeak);
      });
    },
    drawFrame: function (index, value, max) {
        var w = 1;
        var h = Math.round(value * (this.canvas.height / max));

        var x = index * w;
        var y = Math.round((this.canvas.height - h) / 2);

        // var lingrad = this.context.createLinearGradient(w,y,w,y + h);
        // lingrad.addColorStop(0, "#F5F5F5");
        // lingrad.addColorStop(0.5, "#DBDBDB");
        // lingrad.addColorStop(1, "#F5F5F5");


        this.context.fillStyle = "#DBDBDB";
        this.context.fillRect(x, y, w, h);
    },
  });

  return WaveformStaticView;

});