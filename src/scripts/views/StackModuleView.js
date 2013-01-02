define(['views/SelectView', 'views/SliderView', 'views/CheckboxView', 'views/ButtonView', 'views/FileUploadView'
      , "views/MeterView", "views/SpectrumView", "views/WaveformView", "views/WaveformStaticView"
      , "views/IndicatorView", "views/ReductionMeterView"], 

function(SelectView, SliderView, CheckboxView, ButtonView, FileUploadView
       , MeterView, SpectrumView, WaveformView, WaveformStaticView
       , IndicatorView, ReductionMeterView) {

  var StackModuleView = Backbone.View.extend({
    className : "stack-module",
    rendered : false,
    events : {
      'click .active-toggle' : "onToggle",
      'click .arrow-box' : 'onModuleClick',
      'change .module-menu select' : 'onMenuChange',
      'change .bypassFx input[type=checkbox]' : 'onFxBypass'
    },
    initialize : function() {
      var self = this;
      _.bindAll(this);
      this.template = env === "web" ? _.template($('#templates #stack-module-template').html()) : templates.stack_module_template;
      this.$container = this.options.$container;
      this.components = new Backbone.Collection();

      var modules = this.$container.children();
      var module = this.model.get('module');

      if (modules.length < 1) {
        this.$container.append(this.el);
      } else {
        this.$container.children().eq(this.options.insertIndex.index).before(this.el);
      }
      this.model.off('change');
      this.model.on('change', this.render);
      this.model.on('change:settings', this.onSettingsChange);
      this.model.on('change:collapsed', this._checkCollapsed);
      this.model.on('reference-select', this.onReference);
      
      module.on('stop pause', function() {
        self.$el.find('.ui-button[data-name=Play]').removeClass('pressed');
      });
      module.on('play', function() {
        self.$el.find('.ui-button[data-name=Play]').addClass('pressed');
      });
      module.on('start-record', function() {
        self.$el.find('.ui-button[data-name=Record]')
                .addClass('pressed-red')
                .find('input[type=button]')
                .attr('value', 'Recording...');
      });
      module.on('pause-record', function() {
        self.$el.find('.ui-button[data-name=Record]')
                .removeClass('pressed-red')
                .find('input[type=button]')
                .attr('value', 'Record(paused)');
      });
      module.on('stop-record', function() {
        self.$el.find('.ui-button[data-name=Record]')
                .removeClass('pressed-red')
                .find('input[type=button]')
                .attr('value', 'Record');
      });

      this.render();
    },
    render : function() {
      var self = this;

      if (!this.rendered) {
        this.$el.html(this.template(this.model.toJSON()));
        this._checkCollapsed();
        if (!parseInt(this.model.get('draggable'))) {
          this.$el.addClass('drag-disable');
        }
        this.buildInterface();
        this.rendered = true;
        this.$el.attr('data-cid', this.model.cid);
      }
    },
    buildInterface : function() {
      var self = this;
      var interface = this.model.get('interface').interface;
      var row, component;

      this.$el.find('.ui-row').each(function(index) {
        row = interface[index];

        $(this).find('.ui-component').each(function(index2) {
          var $el = $(this);
          var $sliders    = $el.has('.ui-slider');
          var $selects    = $el.has('.ui-select');
          var $checkboxes = $el.has('.ui-checkbox');
          var $buttons    = $el.has('.ui-button');
          var $files      = $el.has('.ui-file');
          var $meters     = $el.has('.ui-meter');
          var $spectrums  = $el.has('.ui-spectrum');
          var $waveforms  = $el.has('.ui-waveform');
          var $reductions = $el.has('.ui-reduction');
          var $staticWaveforms  = $el.has('.ui-waveform-static');
          var $indicators  = $el.has('.ui-indicator');


          component = row[index2];

          $selects.find('.ui-select').each(function() {
            (function(component) {
              self.components.add(new SelectView({
                component : component,
                el : this,
                model : self.model
              }));
            }.call(this, component))
          });

          $sliders.find('.ui-slider').each(function() {
            (function(component) {
              self.components.add(new SliderView({
                model : self.model,
                component : component,
                el : this
              }));
            }.call(this, component));
          });

          $checkboxes.find('.ui-checkbox').each(function() {
            (function(component) {
              self.components.add(new CheckboxView({
                model : self.model,
                component : component,
                el : this
              }));
            }.call(this, component));
          });

          $buttons.find('.ui-button').each(function() {
            (function(component) {
              self.components.add(new ButtonView({
                model : self.model,
                component : component,
                el : this
              }));
            }.call(this, component));
          });

          $meters.find('.ui-meter').each(function() {
            (function(component) {
              self.components.add(new MeterView({
                model : self.model,
                component : component,
                el : this
              }));
            }.call(this, component));
          });

          $spectrums.find('.ui-spectrum').each(function() {
            (function(component) {
              self.components.add(new SpectrumView({
                model : self.model,
                component : component,
                el : this
              }));
            }.call(this, component));
          });

          $waveforms.find('.ui-waveform').each(function() {
            (function(component) {
              self.components.add(new WaveformView({
                model : self.model,
                component : component,
                el : this
              }));
            }.call(this, component));
          });

          $staticWaveforms.find('.ui-waveform-static').each(function() {
            (function(component) {
              self.components.add(new WaveformStaticView({
                model : self.model,
                component : component,
                el : this
              }));
            }.call(this, component));
          });

          $indicators.find('.ui-indicator').each(function() {
            (function(component) {
              self.components.add(new IndicatorView({
                model : self.model,
                component : component,
                el : this
              }));
            }.call(this, component));
          });

          $reductions.find('.ui-reduction').each(function() {
            (function(component) {
              self.components.add(new ReductionMeterView({
                model : self.model,
                component : component,
                el : this
              }));
            }.call(this, component));
          });

          $files.find('.ui-file').each(function() {
            (function(component) {
              self.components.add(new FileUploadView({
                model : self.model,
                component : component,
                el : this,
                collection : self.collection
              }));
            }.call(this, component));
          });

        });
      });
    },
    onFxBypass : function(e) {
      this.model.set('bypassFx', !e.target.checked);
      
      this.collection.trigger("bypass-fx");
    },
    onReference : function(bool) {
      this.model.set('reference', bool);

      this.collection.trigger("reference-select");
    },
    onToggle : function(e) {
      var input = this.$el.find('.active-toggle input')[0];

      if (!input.checked) {
        this.model.enable();
        input.checked = true;
        this.$el.find('.power-switch').addClass('on').removeClass('off');
      } else {
        this.model.disable();
        input.checked = false;
        this.$el.find('.power-switch').addClass('off').removeClass('on');
      }
      // e.stopPropagation();
    },
    _checkCollapsed : function() {
      var collapsed = parseInt(this.model.get('collapsed'), 10);

      if (collapsed) {
        this.$el.addClass('collapsed')
                .find('.arrow-box')
                .addClass('collapsed')
                .removeClass('uncollapsed')
                .siblings('.rail-screw-bottom-left, .rail-screw-bottom-right')
                .addClass('hide');
      } else {
        this.$el.removeClass('collapsed')
                .find('.arrow-box')
                .removeClass('collapsed')
                .addClass('uncollapsed')
                .siblings('.rail-screw-bottom-left, .rail-screw-bottom-right')
                .removeClass('hide');;
      }
    },
    onSettingsChange : function() {
      var settings = this.model.get('settings');
      var component;
      var setValue;

      for (var key in settings) {
        component = this.components.find(function(module) {
          return module.get('component').name.replace(' ', '') === key;
        });
        setValue = component.get('setValue');
        if (!_.isUndefined(setValue)) {
          setValue(settings[key]);
        }
      }
    },
    onMenuChange : function(e) {
      var value = e.target.selectedOptions[0].value;

      switch (value) {
        case "remove": this.onModuleRemove(); break;
        case "collapse" : this.onModuleClick(); break;
        case "disable" : this.onToggle(); break;
      }

      e.target.selectedIndex = 0;
    },
    onModuleRemove : function(e) {
      // this.model.get('module').destroy();
      this.collection.remove(this.model);
    },
    onModuleClick : function() {
      var collapsed = parseInt(this.model.get('collapsed'), 10);

      if (collapsed) {
        this.model.setCollapsed(0);
      } else {
        this.model.setCollapsed(1);
      }
    },
    destroy : function() {
      this.remove();
    }
  });

  return StackModuleView;

});
