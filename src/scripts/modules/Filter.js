define(["modules/BaseModule", "components/Filter"], 

function(BaseModule, FilterComponent) {

  var Filter = BaseModule.extend({
    init : function() {
      this._super.apply(this, arguments);
      var filter  = new FilterComponent(this.context);

      this.connectToInput(filter);
      this.connectToOutput(filter);

      this.nodes.filter = filter;
    },
    setFrequency : function() {
      this.nodes.filter.setFrequency.apply(this.nodes.filter, arguments);
    },
    setType : function() {
      this.nodes.filter.setType.apply(this.nodes.filter, arguments);
    },
    setQ : function() {
      this.nodes.filter.setQ.apply(this.nodes.filter, arguments);
    },
    setGain : function() {
      this.nodes.filter.setGain.apply(this.nodes.filter, arguments);
    }
  });

  return Filter;

});