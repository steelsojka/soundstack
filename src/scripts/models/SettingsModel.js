define(function() {
  
  var SettingsModel = Backbone.Model.extend({
    defaults : {
      "show" : false
    },
    initialize : function() {
    
    }
  });

  return SettingsModel;

});