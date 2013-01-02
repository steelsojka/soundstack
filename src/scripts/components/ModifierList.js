define("ModifierList", ["Modifier", "Emitter", "Class"], function(Modifier, emitter, Class) {

  var ModifierList = Class.extend({
    init : function(list) {
      var modifier;
      this.label = "ModifierList";
      if (list) {
        for (modifier in list) {
          if (list.hasOwnProperty(modifier)) {
            this.addModifier(modifier, list[modifier]);
          }
        }
      }
    },
    getModifier : function(name) {
      if (name in this) {
        return this[name];
      }
    },
    addModifier : function(name, modifier) {
      this[name] = modifier;
    }
  });

  return ModifierList;

});