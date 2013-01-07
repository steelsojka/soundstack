define(function() {
  
  var CheckboxView = Backbone.View.extend({
    initialize : function() {
      _.bindAll(this);
      this.component = this.options.component;
      this.build();
    },
    build : function() {
      var self = this;
      var $el = this.$el;
      var component = this.component;
      var disableOnTrue = component.disableOnTrue;
      var disableOnFalse = component.disableOnFalse;
      var template = env === "web" ? _.template($('#stack-module-checkbox').html()) : templates.stack_module_checkbox;
      $el.html(template(component));

      this.checkbox = $el.find('input[type=checkbox]')[0];
      this.$checkbox = $(this.checkbox);

      this.$checkbox.on('change', function(e) {
        var $container = $el.parents('.ui-controls');
        var onTrueFunc = e.target.checked ? 'addClass' : "removeClass";
        var onFalseFunc = e.target.checked ? "removeClass" : "addClass";

        if (!_.isUndefined(disableOnTrue)) {
          var $disableTrueElements = $container.find('*[' + _.map(disableOnTrue, function(name) { return "data-name=" + name;}).join(", ") + "]");
          
          $disableTrueElements.each(function() {
            var $this = $(this);
            var type = $this.attr('data-type');

            if (type === 'slider') {
              $this.slider(e.target.checked ? 'disable' : 'enable');
            } else if (type === 'select') {
              $this.attr('disabled', e.target.checked ? 'disabled' : 'enabled');
            }

            $this[onTrueFunc]('ui-disable-class');
          });
          
        }
        if (!_.isUndefined(disableOnFalse)) {
          
          var $disableFalseElements = $container.find('*[' + _.map(disableOnFalse, function(name) { return "data-name=" + name;}).join(", ") + "]");

          $disableFalseElements.each(function() {
            var $this = $(this);
            var type = $this.attr('data-type');

            if (type === 'slider') {
              $this.slider(e.target.checked ? 'enable' : 'disable');
              $this[onFalseFunc]('ui-disable-class');
            } else if (type === 'select') {
              if (e.target.checked) {
                $this.removeAttr('disabled');
              } else {
                $this.attr('disabled', 'disabled');
              }
            } else {
              $this[onFalseFunc]('ui-disable-class');
            }

          });
        }

        self.onCheckboxChange(e);
      });

      if (!_.isUndefined(component.triggerOnStart)) {
        if (parseInt(component.triggerOnStart)) {
          this.$checkbox.trigger('change');
        }
      } else {
        // this.$checkbox.trigger('change');
      }
    },
    onCheckboxChange : function(e, undo) {
      var func = this.component.func;
      var module = this.model.get('module');
      var v = e.target.checked;
      var params = _.chain(func.parameters)
                    .map(function(param) {
                      if (param.value === "@VALUE@") {
                        return v;
                      } else {
                        return param.value;
                      }
                    })
                  .value();

      this.model.setSetting(this.component.name.replace(" ", ""), v, undo);
      module[func.name].apply(module, params);
    },
    setValue : function(value, undo) {
      this.checkbox.checked = value;
      this.$checkbox.trigger('change', undo);
    }
  });

  return CheckboxView;

});