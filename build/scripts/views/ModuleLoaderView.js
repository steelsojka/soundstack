define(["views/ModuleView"],function(e){var t=Backbone.View.extend({id:"module-loader",className:"tab-content",initialize:function(){_.bindAll(this),this.template=env==="web"?_.template($("#templates #module-loader-template").html()):templates.module_loader_template,this.$container=$(".right-pane"),this.$container.prepend(this.$el),this.collection.on("reset",this.render),this.collection.fetch()},render:function(){var t=this;this.collection.each(function(n){new e({model:n,stack:t.options.stack,$container:t.$el})})}});return t});