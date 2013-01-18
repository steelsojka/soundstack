define(function() {

  var WaveformStaticView = Backbone.View.extend({
    initialize : function() {
      _.bindAll(this);
      var self = this;
      var $el = this.$el;

      this.component = this.options.component;
      this.color = "#0000FF";
      this.status = "No audio loaded";
      this.animateWaveform = true;
      this.currentPos = [0, 0];
      this.peaks = [];

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
        threshold : 1,
        duration : 0
      };

      $el.find('.file-menu').on('change', this.onFileMenuChange);
      $el.find('.edit-menu').on('change', this.onEditMenuChange);
      $el.find('.process-menu').on('change', this.onProcessMenuChange);

      this.canvas.width = this.selectionCanvas.width = this.overlayCanvas.width = 4096;

      this.module = this.model.get('module');

      this.module.on('audio-loaded', this.build);
      this.module.on('status-update', this.onStatusUpdate);
      this.module.on('play', this.drawLoop);
      this.module.on('stop', this.clearProgress);
      this.module.on('file-read', this.onFileRead);

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
      // this.clearWaveform();
    },
    clearWaveform : function() {
      var ctx = this.context;
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    clearProgress : function() {
      var ctx = this.overlayContext;
      ctx.clearRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);
    },
    onStatusUpdate : function(status, percent) {
      // this.clearWaveform();
      this.$el.find('.waveform-status').html(status);
      if (percent >= 100) {
        this.clearStatus();
      }
    },
    _getMousePosition : function(e) {
      var rect = this.canvas.getBoundingClientRect();
      return {
        x : e.clientX - rect.left,
        y : e.clientY - rect.top
      }
    },
    onFileRead : function() {
      this.animateWaveform = true;
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
      var time = this.module.getDuration() * (pos.x / $(this.canvas).width());

      this.mouse.pressed = true;
      this.mouse.startX = pos.x;
      this.mouse.startY = pos.y;
      
      if (this.selection.set) {
        if (time < this.selection.startTime + this.selection.duration / 2) {
          this.selection.tempStartTime = this.selection.endTime;
        } else if (time > this.selection.endTime - this.selection.duration / 2) {
          this.selection.tempStartTime = this.selection.startTime;
        }
      } else {
        this.selection.tempStartTime = time;
      }

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
        this.selection.duration = this.selection.endTime - this.selection.startTime;

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
      var time = this.module.getDuration() * (pos.x / $(this.canvas).width());

      if (this.mouse.pressed) {
        this.mouse.distanceX = distance;
        
        if (distance > this.selection.threshold || distance < -this.selection.threshold) {
          this.selection.tempEndTime = time;
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
      var index = 0;

      var channelData = this.module.getChannelData();
      var processes = (channelData[0].length / 4096) % 0 
        ? channelData[0].length / 4096 
        : ~~((channelData[0].length / 4096) + 0.5);

      this.fps = buffer.length / buffer.duration;
      this.fpp = channelData[0].length / this.canvas.width;

      // worker.onmessage = function(res) {
      //   if (res.data.action === "waveform-peaks") {
      //     self.peaks = res.data.data;
      //     self.draw(res.data.data);
      //     self.clearStatus();
      //   } else if (res.data.action === "progress") {
      //     self.module.trigger('status-update', "Building waveform... " + res.data.percent + "%");
      //   }
      // };
      if (this.animateWaveform) {
        this.clearWaveform();
      }
      
      debug.log("WAVEFORM: Sending to worker manager...");
      WorkerManager.addJob({
        action : "waveform-peaks",
        data : channelData,
        split : channelData[0].length / 4096,
        width : 4096,
        totalProcesses : 4096,
        onSplit : this.module.splitBuffers,
        onReconstruct : function(data) {
          // self.peaks = Array.prototype.concat([], _.map(data, function(d) { return d[0]; }));
          if (!self.animateWaveform) {
            self.draw(self.peaks);
          }
          self.clearStatus();
          self.animateWaveform = false;
        },
        onProgress : function(percent, data) {
          debug.log(data);
          if (self.animateWaveform) {
            self.drawFrame(data.processID, data.data[0]);
          };
          self.module.trigger('status-update', "Building waveform... " + percent + "%", percent);
          self.peaks[data.processID] = data.data[0];
        }
      });

      // worker.postMessage({
      //   action : "waveform-peaks",
      //   data : channelData,
      //   width : this.canvas.width
      // });

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
      ctx.fillStyle = 'rgba(255,255,255, 0.6)';
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
      // var maxPeak = _.max(this.peaks);
      var self = this;
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)


      _.each(this.peaks, function(peak, i) {
        self.drawFrame(i, peak);
      });
    },
    drawFrame: function (index, value, max) {
        var w = 1;
        var h = Math.round(value * this.canvas.height);

        var x = index * w;

        var y = Math.round((this.canvas.height - h) / 2);

        // var lingrad = this.context.createLinearGradient(w,y,w,y + h);
        // lingrad.addColorStop(0, "#F5F5F5");
        // lingrad.addColorStop(0.5, "#DBDBDB");
        // lingrad.addColorStop(1, "#F5F5F5");

        this.context.fillStyle = "#DBDBDB";
        // this.context.lineTo(x, y);
        // this.context.lineTo(x, y - this.canvas.height / 2);
        // this.context.stroke();
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
        case "cut":
          this.module.cutSelection();
          break;
        case "paste":
          this.module.insertBuffer();
          break;
        case "copy":
          this.module.copySelection();
          break;
      }

      e.target.selectedIndex = 0;
    },
    onProcessMenuChange : function(e) {
      var self = this;

      switch(e.target.selectedOptions[0].value) {
        case "normalize":
          this.module.normalize();
          break;
        case "adjust gain":
          this.module.adjustGain();
          break;
      }

      e.target.selectedIndex = 0;
    }
  });

  return WaveformStaticView;

});