define(["components/BaseNode"],function(e){var t=e.extend({init:function(){this._super();try{this.context=new webkitAudioContext,this.inputNode=this.outputNode=this.context.destination,this.setLabel("Audio Context")}catch(e){alert("Web Audio API is not supported in your browser!")}},getContext:function(){return this.context},getCurrentTime:function(){return this.context.currentTime},startRendering:function(){this.context.startRendering()}});return t});