define([],function(){var e=Backbone.Model.extend({initialize:function(){var e=this,t=this.get("module");this.set("parameters",t.getParameters()),this.set("settings",{}),t.on("reference-change",function(t){e.trigger("reference-select",t)})},disable:function(){var e=this.get("module");e.disable(),this.set("enabled",0),this.trigger("disabled")},enable:function(){var e=this.get("module");this.set("enabled",1),e.enable(),this.trigger("enabled")},setSetting:function(e,t,n){var r=this.get("settings");n||this.trigger("change:history"),r[e]=t,this.set("settings",r)},initializeSetting:function(e,t){var n=this.get("settings");n[e]=t,this.set("settings",n,{silent:!0})},applySettings:function(e,t){var n=this.get("settings");for(var r in e)e.hasOwnProperty(r)&&(n[r]=e[r]);this.set("settings",n,{silent:!0}),this.trigger("change:settings",t)},setCollapsed:function(e){this.set({collapsed:e},{silent:!0}),this.trigger("change:collapsed")},setBpm:function(e){_.isUndefined(this.get("module").setBPM)||this.get("module").setBPM(e)}});return e});