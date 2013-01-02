define(["components/Gain", "components/WaveShaper", "components/Filter", 
                     "modules/BaseModule"],

function(Gain, WaveShaper, Filter, BaseModule) {


  Math.tanh = function(arg) {
    return (Math.exp(arg) - Math.exp(-arg)) / (Math.exp(arg) + Math.exp(-arg));
  };

  var getCurve = function(amount) {
    var samples = 22050;
    var wsCurve = new Float32Array(samples);

    var k = 2 * amount / (1 - amount);

    for (var i = 0; i < samples; i+=1) {
        var x = (i - 0) * (1 - (-1)) / (samples - 0) + (-1);
        wsCurve[i] = (1 + k) * x / (1+ k * Math.abs(x));
        // wsCurve[i] = Math.tanh(k * Math.sin(x));
    }

    return wsCurve;
  };

  var Overdrive = BaseModule.extend({
    init : function(context) {
      this._super.apply(this, arguments);
      this.setLabel("Overdrive");
      var tone  = this.nodes.tone  = new Filter(this.context);
      var drive = this.nodes.drive = new WaveShaper(this.context);
      var gain  = this.nodes.gain  = new Gain(this.context);

      this.setParameters({
        tone  : tone.getParameters(),
        drive : drive.getParameters(),
        gain  : gain.getParameters()
      });

      tone.setType(tone.Types.LOWPASS);

      drive.connect(tone);
      tone.connect(gain);
      this.connectToInput(drive);
      this.connectToOutput(gain);
    },
    setDrive : function(amount) {
      this.nodes.drive.setCurve(getCurve(amount));
    },
    setTone : function(amount) {
      this.nodes.tone.setFrequency(1000 + parseInt(amount));
    },
    setGain : function(amount) {  
      this.nodes.gain.setGain(amount);
    }
  });

  return Overdrive;

});