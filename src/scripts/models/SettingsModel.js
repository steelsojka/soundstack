define(function() {
  
  var SettingsModel = Backbone.Model.extend({
    defaults : {
      "bufferSize" : 512,
      "sampleRate" : 44100
    },
    initialize : function() {
      _.bindAll(this);
    },
    load : function() {
      var self = this;

      if (env === "web") {
        if ("ss-settings" in localStorage) {
          this.set(JSON.parse(localStorage.getItem("ss-settings")));        
        } else {
          this.save();
        }
        this.format();
        this.trigger('loaded');
      } else if (env === "app") {
        chrome.storage.sync.get('settings', function(settings) {
          self.set(settings);
          self.format();
          self.trigger('loaded');
        });
      }
    },
    format : function() {
      var settings = this.attributes;

      settings.bufferSize = parseInt(settings.bufferSize, 10);
    },
    save : function(callback) {
      var self = this;

      if (env === "web") {
        localStorage.setItem("ss-settings", JSON.stringify(this.attributes));
        if (_.isFunction(callback)) {
          callback(this.attributes);
        }
      } else if (env === "app") {
        chrome.storage.sync.set({settings : this.attributes}, function() {
          if (_.isFunction(callback)) {
            callback(self.attributes);
          }
        });
      }
    }
  });

  return SettingsModel;

});