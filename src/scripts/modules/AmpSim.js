define([
  "modules/BaseModule", "components/WaveShaper", "components/Gain", "modules/Equalizer",
  "components/Filter", "components/Convolver", "components/Router", "modules/Distortion"
], function(BaseModule, WaveShaper, Gain, Equalizer, Filter, Convolver, Router, Distortion) {

  Math.tanh = function(arg, amount) {
    return (Math.exp(arg * amount) - Math.exp(-arg * amount * 1.2)) / (Math.exp(arg * amount) + Math.exp(-arg * amount));
  };

  var _getCurve = function(amount) {
    var samples = 22050;
    var wsCurve = new Float32Array(samples);

    var k = 2 * amount / (1 - amount);

    for (var i = 0; i < samples; i+=1) {
        var x = (i - 0) * (1 - (-1)) / (samples - 0) + (-1);
        wsCurve[i] = (1 + k) * x / (1+ k * Math.abs(x));
        // wsCurve[i] = Math.tanh(Math.sin(x), );
    }

    return wsCurve;
  };

  var AmpSim = BaseModule.extend({
    init : function(context) {
      this._super.apply(this, arguments);
      
      var inputGain    = new Gain(this.context);
      var outputGain   = new Gain(this.context);
      var userEQ       = new Equalizer(this.context, 3);
      var postEQ       = new Equalizer(this.context, 3);
      var preEQ        = new Equalizer(this.context, 3);
      var distortion   = new Distortion(this.context);
      var waveStage1   = new WaveShaper(this.context);
      var waveStage2   = new WaveShaper(this.context);
      var filterStage1 = new Filter(this.context);
      var filterStage2 = new Filter(this.context);
      var cabSim       = new Convolver(this.context);

      inputGain.setLabel("AmpSim/Input Gain");   
      outputGain.setLabel("AmpSim/Output Gain");  
      userEQ.setLabel("AmpSim/EQ");          
      waveStage1.setLabel("AmpSim/WaveStage 1");  
      waveStage2.setLabel("AmpSim/WaveStage 2");
      filterStage1.setLabel("AmpSim/FilterStage 1");
      filterStage2.setLabel("AmpSim/FilterStage 2");
      cabSim.setLabel("AmpSim/Cab Sim");     

      // inputGain.split(filterStage1, filterStage2);
      // filterStage1.connect(waveStage1).connect(eq);
      // filterStage2.connect(waveStage2).connect(eq);
      // eq.connect(cabSim).connect(outputGain);
      inputGain.connect(preEQ)
               .connect(distortion)
               .connect(postEQ)
               .connect(userEQ)
               .connect(cabSim)
               .connect(outputGain);

      this.connectToInput(inputGain)
          .connectToOutput(outputGain);

      this.nodes.inputGain    = inputGain;   
      this.nodes.outputGain   = outputGain;  
      this.nodes.userEQ       = userEQ;
      this.nodes.postEQ       = postEQ;
      this.nodes.preEQ        = preEQ; 
      this.nodes.distortion   = distortion; 
      this.nodes.waveStage1   = waveStage1;  
      this.nodes.waveStage2   = waveStage2;  
      this.nodes.filterStage1 = filterStage1;
      this.nodes.filterStage2 = filterStage2;
      this.nodes.cabSim       = cabSim;      
      
      this.setDefaults();
    },
    setDefaults : function() {
      this.nodes.outputGain.setGain(1);
      this.nodes.inputGain.setGain(1);
      
      this.nodes.filterStage1.setType(this.nodes.filterStage1.Types.HIGHPASS)
          .setFrequency(100);
      this.nodes.filterStage2.setType(this.nodes.filterStage1.Types.HIGHPASS)
          .setFrequency(400);
      
      this.nodes.waveStage1.setCurve(_getCurve(0.8)); 
      this.nodes.waveStage2.setCurve(_getCurve(0.8));

      this.nodes.userEQ.setFilterFrequency(1, 90)
                       .setFilterFrequency(2, 725)
                       .setFilterFrequency(3, 4800)
                       .setFilterGain(1, 0)
                       .setFilterGain(2, 0)
                       .setFilterGain(3, 0);

      this.nodes.postEQ.setFilterType(3, Equalizer.Types.LOWPASS)
                       .setFilterType(1, Equalizer.Types.HIGHPASS)
                       .setFilterFrequency(1, 10000)
                       .setFilterFrequency(2, 3000);
      
      this.nodes.preEQ.setFilterFrequency(1, 1500)
                      .setFilterGain(1, 10)
                      .setFilterType(1, Equalizer.Types.HIGHPASS)
                      .setFilterType(3, Equalizer.Types.LOWPASS)
                      .setFilterFrequency(2, 700);
    },
    loadCab : function() {
      this.nodes.cabSim.loadImpulse.apply(this.nodes.cabSim, arguments);
    },
    setGainStage : function(stage, value) {
      this.nodes["waveStage" + stage].setCurve(_getCurve(value));
    },
    setDrive : function(value) {
      this.nodes.distortion.setAmount(value);
    },
    setLow : function(value) {
      this.nodes.userEQ.setFilterGain(1, value);
    },
    setHigh : function(value) {
      this.nodes.userEQ.setFilterGain(3, value);
    },
    setMid : function(value) {
      this.nodes.userEQ.setFilterGain(2, value);
    },
    setInputGain : function(value) {
      this.nodes.inputGain.setGain(value);
    },
    setOutputGain : function(value) {
      this.nodes.outputGain.setGain(value);
    }
  });

  return AmpSim;

});