define([],function(){var e=Backbone.View.extend({events:{click:"disableDraw"},initialize:function(){_.bindAll(this),this.component=this.options.component,this.disable=!1,this.build()},build:function(){var e=this,t=this.$el,n=env==="web"?_.template($("#stack-module-indicator").html()):templates.stack_module_indicator;t.html(n(this.component)),this.canvas=this.$el.find("canvas")[0],this.context=this.canvas.getContext("2d"),this.module=this.model.get("module"),this.onFrame()},disableDraw:function(){this.disable=!this.disable,this.disable?this.$el.addClass("disable-meter"):(this.$el.removeClass("disable-meter"),this.onFrame())},onFrame:function(){!this.model.get("collapsed")&&!this.disable&&this.draw(),requestAnimFrame(this.onFrame)},draw:function(){var e=this.context,t=this.canvas.width,n=this.canvas.height;e.clearRect(0,0,t,n),e.fillStyle="rgba(255,255,0,"+this.module.getIndicatorValue()+")",e.fillRect(0,0,t,n)}});return e});