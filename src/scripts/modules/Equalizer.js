define(["components/Filter", "components/Gain", "modules/BaseModule"], 
  function(Filter, Gain, BaseModule) {

  var config = {
    RANGE_MAX : 22000,
    RANGE_MIN : 40
  };

  var Equalizer = BaseModule.extend({
    init : function(context, bands) {
      this._super.apply(this, arguments);
      this.setLabel("Equalizer");
      var filter;
      var _bands     = bands || 3;
      var filters    = [];
      var interval   = config.RANGE_MAX / _bands + config.RANGE_MIN;
      var startFreq  = interval;
      var inputGain  = new Gain(this.context);
      var outputGain = new Gain(this.context);
      inputGain.setLabel("Equalizer/Input Gain");
      outputGain.setLabel("Equalizer/Output Gain");
      this.bands = _bands;
      this.nodes.inputGain = inputGain;
      this.nodes.outputGain = outputGain;

      for (var i = 1; i <= bands; i++) {
        filter = new Filter(this.context);
        filter.setType(filter.Types.PEAKING);
        filter.setLabel("Equalizer/Filter" + i);
        filter.setFrequency(startFreq);
        (function(nodes, filter) {
          filters.push(filter);
          nodes["filter" + i] = filter;
        }(this.nodes, filter));
        startFreq += interval;
        startFreq = startFreq > config.RANGE_MAX ? config.RANGE_MAX : startFreq;
        this.addParameter("filter" + i, filter.getParameters());
      }
      for (i = 1; i <= _bands; i++) {
        inputGain.connect(this.nodes["filter" + i]);
        this.nodes["filter" + i].connect(outputGain);
      }
  
      this.addParameter("inputGain", inputGain.getParameters());
      this.addParameter("outputGain", outputGain.getParameters());

      this.connectToInput(inputGain);
      this.connectToOutput(outputGain);

      this.filters    = filters;
    },
    setFilterFrequency : function(filterNumber, value) {
      this.nodes["filter" + filterNumber].setFrequency(value);
      return this;
    },
    setFilterGain : function(filterNumber, value) {
      this.nodes["filter" + filterNumber].setGain(value);
      return this;
    },
    setFilterQ : function(filterNumber, value) {
      this.nodes["filter" + filterNumber].setQ(value);
      return this;
    },
    setFilterType : function(filterNumber, value) {
      this.nodes["filter" + filterNumber].setType(value);
      return this;
    },
    setInputGain : function(value) {
      this.nodes.inputGain.setGain(value);
      return this;
    },
    setOutputGain : function(value) {
      this.nodes.outputGain.setGain(value);
      return this;
    }
  });

  Equalizer.Types = Equalizer.prototype.Types = Filter.Types;

  console.log("DEBUG: Equalizer Module Loaded");

  return Equalizer;

});