define(["views/NavigationView","views/RightPaneView","models/SettingsModel","views/SettingsView","models/StackCollection"],function(e,t,n,r,i){var s=Backbone.View.extend({initialize:function(){_.bindAll(this),this.settings=new n,this.settings.on("loaded",this.onSettingsLoaded),window.settings=this.settings,this.settings.load()},onSettingsLoaded:function(){var n=this,s=new i;new t({model:n.model,stack:s}),new e({model:n.model,settings:this.settings,stack:s}),new r({model:this.settings,$container:$(n.el)})},render:function(){}});return s});