define([],function(){var e=Backbone.View.extend({initialize:function(){_.bindAll(this),this.component=this.options.component,this.barPadding=2,this.previousValue=1,this.color="#0000FF",this.build()},build:function(e){var t=this,n=this.$el,r=env==="web"?_.template($("#stack-module-waveform").html()):templates.stack_module_waveform;n.html(r(this.component)),this.canvas=n.find("canvas")[0],this.module=this.model.get("module"),this.canvas.width=this.module.binCount,this.context=this.canvas.getContext("2d"),this.onFrame()},onFrame:function(){this.draw(),requestAnimFrame(this.onFrame)},draw:function(){var e=this.context,t=this.canvas,n=this.module.getByteTimeDomainData(0),r=this.module.getByteTimeDomainData(1);e.clearRect(0,0,this.canvas.width,300)}});return e});