define(function() {

  var SettingsView = Backbone.View.extend({
    id : "settings",
    className : "hide",
    hasChanged : [],
    bufferValues : [256, 512, 1024, 2048, 4096, 8192, 16384],
    initialize : function() {
      _.bindAll(this);

      this.valid = false;
      this.$container = this.options.$container;
      this.template = env === "web" ? _.template($('#settings-template').html()) : templates.settings_template;
      // this.model.on('change', this.render);
      this.model.on('show', this.onShow);
      this.render();

      global_relay.on('global-exit', this.onHide);
      this.$el.find("#buffer-size").on('blur', this.validateBufferSize);
    },
    render : function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$container.append(this.$el);
    },
    validateBufferSize : function(e) {
      if (_.contains(this.bufferValues, parseInt(e.target.value, 10))) {
        this.valid = true;
        $(e.target).removeClass("setting-error");
      } else {
        $(e.target).addClass("setting-error");
      }
    },
    onHide : function() {
      var self = this;
      var settings = {};
      var $inputs = this.$el.find('input');
      this.valid = false;
      this.hasChanged = [];

      $inputs.blur().each(function() {
        var attr = this.getAttribute('data-setting');
        if (self.model.get(attr) != this.value) {
          self.hasChanged.push(attr);
        }
        settings[attr] = this.value;
      });

      if (this.valid) {
        this.model.set(settings);

        this.model.save(function() {
          if (_.contains(self.hasChanged, "bufferSize")) {
            self.model.trigger('restart');
          }
          self.$el.addClass('hide');
        });        
      }
    },
    onShow : function() {
      this.$el.removeClass('hide');
    }
  });

  return SettingsView;

});
