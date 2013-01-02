define(["modules/BaseModule", "components/Oscillator", "controllers/Envelope", "components/Gain",
        "components/Filter", "controllers/Potentiometer"], 

function(BaseModule, Oscillator, Envelope, Gain, Filter, Potentiometer) {

  var NxOsc = BaseModule.extend({
    init : function(context, oscillators) {
      this._super.apply(this, arguments);
      this.oscillators = oscillators;
      this.setLabel(oscillators + "xOsc");
      this.midiController = null;

      var osc;
      var filter;
      var gainEnvelope;
      var filterEnvelope;
      var gain;
      var oscOutputGain;


      for (var i = 1; i <= oscillators; i++) {
        osc            = new Oscillator(this.context);
        filter         = new Filter(this.context);
        gainEnvelope   = new Envelope(this.context, 0, 1, 1, 0.1);
        filterEnvelope = new Envelope(this.context, 0, 0, 0, 0);
        gain           = new Gain(this.context);
        oscOutputGain  = new Gain(this.context);
        gainPot        = new Potentiometer();

        gain.setGain(0);
        osc.setType(0);
        gainPot.setType(gainPot.Types.LOG);
        filter.setType(filter.Types.BANDPASS);

        osc.connect(filter).connect(gain).connect(oscOutputGain);
        gainEnvelope.connect(gain.getParameters("gain"));
        filterEnvelope.connect(filter.getParameters("frequency"));
        gainPot.connect(oscOutputGain.getParameters("gain"));

        this.connectToOutput(oscOutputGain);

        osc.start(0);

        this.nodes["osc" + i]            = osc;
        this.nodes["filter" + i]         = filter;
        this.nodes["filterEnvelope" + i] = filterEnvelope;
        this.nodes["gain" + i]           = gain;
        this.nodes["gainEnvelope" + i]   = gainEnvelope;
        this.nodes["outputGain" + i]     = oscOutputGain;
        this.nodes["gainPot" + i]        = gainPot;
      }

    },
    connectMIDIController : function(controller) {
      var self = this;
      for (var i = 1; i <= this.oscillators; i++) {
        controller.connect(this.nodes["osc" + i].getParameters("frequency"));
      }
      this.midiController = controller;
      this.midiController.on("controller:note-on", function(freq) {
        self.noteOn(freq);
      });
      this.midiController.on("controller:note-off", function() {
        self.noteOff();
      });
    },
    noteOn : function(baseFreq) {
      for (var i = 1; i <= this.oscillators; i++) {
        var filter = this.nodes["filterEnvelope" + i];
        this.nodes["osc" + i].setFrequency(baseFreq);
        this.nodes["gainEnvelope" + i].trigger();
        filter.trigger();
      }
    },
    noteOff : function() {
      for (var i = 1; i <= this.oscillators; i++) {
        this.nodes["gainEnvelope" + i].release();
        this.nodes["filterEnvelope" + i].release();
      }
    },
    setOscType : function(osc, type) {
      this.nodes["osc" + osc].setType(type);
    },
    setOscGain : function(osc, gain) {
      this.nodes["gainPot" + osc].setValue(gain);
    },
    setOscFrequency : function(osc, freq) {
      this.nodes["osc" + osc].setFrequencyOffset(freq);
    },
    setGainEnvelopeAttack : function(osc, a) {
      this.nodes["gainEnvelope" + osc].setAttack(a);
    },
    setGainEnvelopeDecay : function(osc, d) {
      this.nodes["gainEnvelope" + osc].setDecay(d);
    },
    setGainEnvelopeSustain : function(osc, s) {
      this.nodes["gainEnvelope" + osc].setSustain(s);
    },
    setGainEnvelopeRelease : function(osc, r) {
      this.nodes["gainEnvelope" + osc].setRelease(r);
    },
    setFilterEnvelopeAttack : function(osc, a) {
      this.nodes["filterEnvelope" + osc].setAttack(a);
    },
    setFilterEnvelopeDecay : function(osc, d) {
      this.nodes["filterEnvelope" + osc].setDecay(d);
    },
    setFilterEnvelopeSustain : function(osc, s) {
      this.nodes["filterEnvelope" + osc].setSustain(s);
    },
    setFilterEnvelopeRelease : function(osc, r) {
      this.nodes["filterEnvelope" + osc].setRelease(r);
    },
    setFilterStartValue : function(osc, r) {
      this.nodes["filterEnvelope" + osc].setStartValue(r);
    },
    setFilterMaxValue : function(osc, r) {
      this.nodes["filterEnvelope" + osc].setMaxValue(r);
    }
  });

  return NxOsc;

});