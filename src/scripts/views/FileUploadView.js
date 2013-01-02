define(function() {
  
  var FileUploadView = Backbone.View.extend({
    initialize : function() {
      _.bindAll(this);
      this.component = this.options.component;
      this.build();
    },
    build : function() {
      var self = this;
      var $el = this.$el;
      var template = env === "web" ? _.template($('#stack-module-file-upload').html()) : templates.stack_module_file_upload;
      $el.html(template(this.component));

      $el.find('input[type=file]').on('change', this.onFileUpload);
    },
    onFileUpload : function(e) {
      var self = this;
      var func = this.component.func;
      var module = this.model.get('module');
      var params = _.chain(func.parameters)
                    .map(function(param) {
                      if (param.value === "@VALUE@") {
                        return e;
                      } else {
                        return param.value;
                      }
                    })
                  .value();
      params.push(function() {
        self.collection.trigger('manual-connect');
      });
      module[func.name].apply(module, params);
    }
  });

  return FileUploadView;

});