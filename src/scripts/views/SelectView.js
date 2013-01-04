define(function() {
  
  var SelectComponent = Backbone.View.extend({
    initialize : function() {
      _.bindAll(this);
      this.component = this.options.component;
      this.build();
    },
    build : function() {
      var self = this;
      var $el = this.$el;
      var template = env === "web" ? _.template($('#stack-module-select').html()) : templates.stack_module_select;
      $el.html(template(this.component));

      this.$select = $el.find('select');
      this.select = this.$select[0];

      this.$select.on('change', this.onSelectChange);

      this.$select.trigger('change');
    },
    onSelectChange : function(e, undo) {
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
                  .compact()
                  .value();

      this.model.setSetting(this.component.name.replace(" ", ""), this.select.selectedIndex, undo);
      module[func.name].apply(module, params);
    },
    setValue : function(value, undo) {
      this.select.selectedIndex = value;
      this.$select.trigger('change', undo);
    }
  });

  return SelectComponent;

});