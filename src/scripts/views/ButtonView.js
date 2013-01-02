define(function() {
  
  var ButtonView = Backbone.View.extend({
    initialize : function() {
      _.bindAll(this);
      this.component = this.options.component;
      this.build();
    },
    build : function() {
      var self = this;
      var $el = this.$el;
      var template = env === "web" ? _.template($('#stack-module-button').html()) : templates.stack_module_button;
      $el.html(template(this.component));

      $el.find('input[type=button]').on('click', this.onButtonClick);
    },
    onButtonClick : function(e) {
      var self = this;
      var func = this.component.func;
      var module = this.model.get('module');
      var v = e.target.value;
      var params = _.chain(func.parameters)
                    .map(function(param) {
                      if (param.value === "@VALUE@") {
                        return v;
                      } else {
                        return param.value;
                      }
                    })
                  .value();

      // if (!_.isUndefined(this.component.addClassOnPress)) {
      //   var _class = this.component.addClassOnPress;
      //   var action = this.$el.hasClass(_class) ? "remove" : "add";
      //   this.$el[action + "Class"](_class);
      // }

      // if (!_.isUndefined(this.component.removeClassOnEvent)) {
      //   _.each(this.component.removeClassOnEvent, function(o) {
      //     (function(o) {
            
      //       global_relay.on(o.event, function() {
      //         self.$el.removeClass(o._class)
      //       });

      //     }(o));
      //   });
      // }

      module[func.name].apply(module, params);
    }
  });

  return ButtonView;

});