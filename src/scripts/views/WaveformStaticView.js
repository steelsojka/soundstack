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
      var menuTemplate = env === "web" ? _.template($('#waveform-menu-bar').html()) : templates.waveform_menu_bar;

      this.tooltipTemplate = env === "web" ? _.template($('#mouse-tooltip-template').html()) : templates.mouse_tooltip_template;
      
      $el.append(menuTemplate());
      $el.append(template(this.component));
      
      this.canvas          = $el.find('canvas')[0];
      this.overlayCanvas   = $el.find('canvas')[1];
      this.selectionCanvas = $el.find('canvas')[2];

      this.context          = this.canvas.getContext('2d');
      this.overlayContext   = this.overlayCanvas.getContext('2d');
      this.selectionContext = this.selectionCanvas.getContext('2d');

      this.mouse = {};
      this.selection = {
        threshold : 2
      };

      $el.find('.file-menu').on('change', this.onFileMenuChange);
      $el.find('.edit-menu').on('change', this.onEditMenuChange);

      this.canvas.width = this.selectionCanvas.width = this.overlayCanvas.width = 4096;

      this.module = this.model.get('module');

      this.module.on('audio-loaded', this.build);
      this.module.on('status-update', this.onStatusUpdate);
      this.module.on('play', this.drawLoop);
      this.module.on('stop', this.clearProgress);

      this.$el.find('.frosted-glass').on('mousedown', this.onMouseDown)
                                     .on('mouseup', this.onMouseUp)
                                     .on('mousemove', this.onMouseMove)
                                     .on('mouseover', this.onMouseOver)
                                     .on('mouseout', this.onMouseOut)
                                     .on('dblclick', this.onDoubleClick);

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
    onDoubleClick : function(e) {
      this.module.setPosition(0);
      this.clearSelection();
      this.clearProgress();
    },
    onMouseClick : function(e) {
      var pos = this._getMousePosition(e);
      var canvasWidth = $(this.canvas).width();
      var x = pos.x / canvasWidth;

      var newPosition = this.module.getDuration() * x;

      this.module.setPosition(newPosition);
      
      this.clearSelection();

      if (!this.module.isPlaying) {
        this.drawProgress()
      }
    },
    onMouseDown : function(e) {
      var pos = this._getMousePosition(e);

      this.mouse.pressed = true;
      this.mouse.startX = pos.x;
      this.mouse.startY = pos.y;
      this.selection.tempStartTime = this.module.getDuration() * (pos.x / $(this.canvas).width());
    },
    onMouseUp : function(e) {
      var pos = this._getMousePosition(e);
      var tempStart;

      this.mouse.pressed = false;
      if (this.mouse.distanceX > this.selection.threshold 
       || this.mouse.distanceX < -this.selection.threshold) {
        
        this.selection.endTime = this.module.getDuration() * (pos.x / $(this.canvas).width())
        this.selection.startTime = this.selection.tempStartTime;

        if (this.selection.startTime > this.selection.endTime) { // Swap is start time is > endtime
          tempStart = this.selection.startTime;
          this.selection.startTime = this.selection.endTime;
          this.selection.endTime = tempStart;
        }

        this.selection.set = true;

        this.module.setSelection(this.selection.startTime, this.selection.endTime);

      } else {
        this.module.clearSelection();
        this.onMouseClick(e);
      }
    },
    onMouseOver : function(e) {
      $('#tooltip-container').removeClass('hide');
    },
    onMouseOut : function(e) {
      $('#tooltip-container').addClass('hide');
      if (this.mouse.pressed) {
        this.onMouseUp(e);
      }
    },
    onMouseMove : function(e) {
      var pos = this._getMousePosition(e);
      var distance = pos.x - this.mouse.startX;


      if (this.mouse.pressed) {
        this.mouse.distanceX = distance;
        
        if (distance > this.selection.threshold || distance < -this.selection.threshold) {
          this.selection.tempEndTime = this.module.getDuration() * (pos.x / $(this.canvas).width())
          this.drawSelection();
        }
      } else {
        this.mouse.distanceX = 0;
      }
      this.renderTooltip(e);
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
    clearSelection : function() {
      this.selectionContext.clearRect(0, 0, this.selectionCanvas.width, this.selectionCanvas.height);
      this.selection.startTime = 0;
      this.selection.endTime = 0;
      this.selection.set = false;
    },
    drawProgress : function() {
      var ctx = this.overlayContext;
      var position = (this.module.getPosition() * this.fps) / this.fpp;
      var x = this.selection.set ? this.selection.startTime * this.fps / this.fpp : 0;

      ctx.clearRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);
      ctx.fillStyle = 'rgba(255,255,255, 0.7)';
      ctx.fillRect(x, 0, position - x, this.overlayCanvas.height);

    },
    drawSelection : function() {
      var ctx = this.selectionContext;
      var start = (this.selection.tempStartTime * this.fps) / this.fpp;
      var end = (this.selection.tempEndTime * this.fps) / this.fpp;
      var width, x;
      if (start > end) {
        width = start - end;
      } else {
        width = end - start;
      }

      ctx.clearRect(0, 0, this.selectionCanvas.width, this.selectionCanvas.height);
      ctx.fillStyle = 'rgb(0,0,0)';
      ctx.fillRect(start, 0, 1, this.selectionCanvas.height);
      ctx.fillRect(end - 1, 0, 1, this.selectionCanvas.height);
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.fillRect(start, 0, end - start, this.selectionCanvas.height);
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
    onFileMenuChange : function(e) {
      switch(e.target.selectedOptions[0].value) {
        case "export":
          this.module.export();
          break;
        case "export selection":
          this.module.exportSelection();
          break;
      }

      e.target.selectedIndex = 0;
    },
    onEditMenuChange : function(e) {
      var self = this;

      switch(e.target.selectedOptions[0].value) {
        case "trim to selection":
          this.module.trimToSelection(function() {
            self.clearSelection();
            self.clearProgress();
            self.module.clearSelection();
            self.module.setPosition(0);
          });
          break;
      }

      e.target.selectedIndex = 0;
    }
  });

  return WaveformStaticView;

});