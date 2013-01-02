define(function() {

  var PresetCollection = Backbone.Collection.extend({
    initialize : function() {

    },
    load : function(model) {
      var key = model.get('key');
      this.trigger('load', key);
    }
  });

  return PresetCollection;

});