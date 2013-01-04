define(function() {
  
  var SliderView = Backbone.View.extend({
    initialize : function() {
      _.bindAll(this);
      var self = this;
      this.component = this.options.component;
      this.build();
      this.$handle = this.$el.find('.ui-slider-handle');
      
      $(function() {
        self.$tooltip = self.$el.siblings('.slider-tooltip');
        self.$input = self.$el.siblings('.slider-input');
                
        self.$tooltip.css('left', self.$handle.css('left')).text(self.$el.slider('value'));
        self.$input.css('left', self.$handle.css('left'));

        self.$handle.dblclick(function() {
          self.$input.on('keydown', function(e) {
            if (e.keyCode === 13) {
              self.$input.blur();
            }
          });
          self.$input.removeClass('hide').focus();
        });

        self.$input.on('blur', function(e) {
          var v = _.inRange(parseFloat(self.$input.attr('value'))
                          , parseFloat(self.component.minValue)
                          , parseFloat(self.component.maxValue));
          $(this).addClass('hide');
          self.$el.slider('value', v)
          self.onSliderChange(e, {value : v})
        })
      });
    },
    repositionFloats : function() {

    },
    build : function() {
      var self = this;
      var $el = this.$el;
      var component = this.component;
      $el.slider({
        animate     : "fast",
        range       : "min",
        max         : component.maxValue,
        min         : component.minValue,
        orientation : component.orientation,
        step        : component.step,
        value       : component.defaultValue,
        slide : function(e, ui) {
          self.onSliderChange.call(self, e, ui);
        },
        start : function() {
          self.$tooltip.addClass('fade-in').removeClass('fade-out');
        },
        stop : function(e, ui) {
          self.$tooltip.removeClass('fade-in').addClass('fade-out');
          self.onSliderStop(e, ui);
        }
      });
      this.model.initializeSetting(this.component.name.replace(" ", ""), component.defaultValue);
      $el.data('slider')._trigger('slide', {}, {value : $el.data('slider').value()});
    },
    onSliderStop : function(e, ui) {
      this.model.setSetting(this.component.name.replace(" ", ""), ui.value);
    },
    onSliderChange : function(e, ui) {
      var comp = this.component;
      var func       = this.component.func;
      var valueArray = this.component.value;
      var behavior   = this.component.behavior;
      var v          = ui.value;
      var $tooltip   = this.$tooltip;
      var $input     = this.$input;
      var $handle    = this.$handle;
      var module     = this.model.get('module');
      var params = _.chain(func.parameters)
                    .map(function(param) {
                      if (param.value === "@VALUE@") {
                        if (!_.isUndefined(valueArray)) {
                          return valueArray.split('|')[v];
                        } else {
                          return v;
                        }
                      } else {
                        return param.value;
                      }
                    })
                  .value();

      module[func.name].apply(module, params);

      var parsedV = !(this.$el.slider('option').step % 1) ? parseInt(v) : v.toFixed(2);
      if (!_.isUndefined($tooltip)) {
        $tooltip.css('left', $handle.css('left')).text(parsedV);
      }
      if (!_.isUndefined($input)) {
        $input.css('left', $handle.css('left')).addClass('hide').attr('value', parsedV);
      }
    },
    setValue : function(value) {
      this.$el.slider('value', value);
      this.$el.data('slider')._trigger('slide', {}, {value : this.$el.data('slider').value()});
    }
  });

  return SliderView;

});