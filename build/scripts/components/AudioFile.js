define(["components/BaseNode"],function(e){var t=e.extend({init:function(){this._super.apply(this,arguments),this.setLabel("Audio File"),this.loop=!1,this.playbackRate=1,this.source=this.outputNode=this.inputNode=this.node=this.context.createBufferSource()},decodeAudio:function(e,t){var n=this;this.context.decodeAudioData(e,function(e){n.setSource(e,t)})},setSource:function(e,t){if(_.isArray(e)){var n=this.context.createBuffer(2,e[0].length,this.context.sampleRate);n.getChannelData(0).set(e[0]),n.getChannelData(1).set(e[1]),e=n}this.buffer=e,this.source=this.context.createBufferSource(),this.source.buffer=e,this.source.loop=this.loop,this.node=this.inputNode=this.outputNode=this.source,this.setParameters(this.source),this.setRate(this.playbackRate),typeof t=="function"&&t.call(this,this.source)},setRate:function(e){this.source.playbackRate.value=e,this.playbackRate=e},getPlaybackRate:function(){return this.source.playbackRate.value},getBuffer:function(){return this.buffer},getDuration:function(){return this.buffer.duration},setGain:function(e){this.source.gain.value=e},pause:function(){this.source.stop()},unpause:function(){this.setSource(this.buffer,function(){this.reconnect(this.outputTo)})},start:function(e,t,n){this.source.noteGrainOn(e,t,n)},stop:function(e){this.source.noteOff(e)},setLoop:function(e){this.loop=e,this.source.loop=e}});return t});