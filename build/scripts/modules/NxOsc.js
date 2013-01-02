define(["modules/BaseModule","components/Oscillator","controllers/Envelope","components/Gain","components/Filter","controllers/Potentiometer"],function(e,t,n,r,i,s){var o=e.extend({init:function(e,o){this._super.apply(this,arguments),this.oscillators=o,this.setLabel(o+"xOsc"),this.midiController=null;var u,a,f,l,c,h;for(var p=1;p<=o;p++)u=new t(this.context),a=new i(this.context),f=new n(this.context,0,1,1,.1),l=new n(this.context,0,0,0,0),c=new r(this.context),h=new r(this.context),gainPot=new s,c.setGain(0),u.setType(0),gainPot.setType(gainPot.Types.LOG),a.setType(a.Types.BANDPASS),u.connect(a).connect(c).connect(h),f.connect(c.getParameters("gain")),l.connect(a.getParameters("frequency")),gainPot.connect(h.getParameters("gain")),this.connectToOutput(h),u.start(0),this.nodes["osc"+p]=u,this.nodes["filter"+p]=a,this.nodes["filterEnvelope"+p]=l,this.nodes["gain"+p]=c,this.nodes["gainEnvelope"+p]=f,this.nodes["outputGain"+p]=h,this.nodes["gainPot"+p]=gainPot},connectMIDIController:function(e){var t=this;for(var n=1;n<=this.oscillators;n++)e.connect(this.nodes["osc"+n].getParameters("frequency"));this.midiController=e,this.midiController.on("controller:note-on",function(e){t.noteOn(e)}),this.midiController.on("controller:note-off",function(){t.noteOff()})},noteOn:function(e){for(var t=1;t<=this.oscillators;t++){var n=this.nodes["filterEnvelope"+t];this.nodes["osc"+t].setFrequency(e),this.nodes["gainEnvelope"+t].trigger(),n.trigger()}},noteOff:function(){for(var e=1;e<=this.oscillators;e++)this.nodes["gainEnvelope"+e].release(),this.nodes["filterEnvelope"+e].release()},setOscType:function(e,t){this.nodes["osc"+e].setType(t)},setOscGain:function(e,t){this.nodes["gainPot"+e].setValue(t)},setOscFrequency:function(e,t){this.nodes["osc"+e].setFrequencyOffset(t)},setGainEnvelopeAttack:function(e,t){this.nodes["gainEnvelope"+e].setAttack(t)},setGainEnvelopeDecay:function(e,t){this.nodes["gainEnvelope"+e].setDecay(t)},setGainEnvelopeSustain:function(e,t){this.nodes["gainEnvelope"+e].setSustain(t)},setGainEnvelopeRelease:function(e,t){this.nodes["gainEnvelope"+e].setRelease(t)},setFilterEnvelopeAttack:function(e,t){this.nodes["filterEnvelope"+e].setAttack(t)},setFilterEnvelopeDecay:function(e,t){this.nodes["filterEnvelope"+e].setDecay(t)},setFilterEnvelopeSustain:function(e,t){this.nodes["filterEnvelope"+e].setSustain(t)},setFilterEnvelopeRelease:function(e,t){this.nodes["filterEnvelope"+e].setRelease(t)},setFilterStartValue:function(e,t){this.nodes["filterEnvelope"+e].setStartValue(t)},setFilterMaxValue:function(e,t){this.nodes["filterEnvelope"+e].setMaxValue(t)}});return o});