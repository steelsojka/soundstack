define(["views/StackModuleView"], function(StackModuleView) {

  var StackView = Backbone.View.extend({
    id : "effects-stack",
    className : "tab-content",
    initialize : function() {
      _.bindAll(this);
      this._sortStartIndex = 0;
      this._sortEndIndex = 0;
      this.template   = env === "web" ? _.template($('#templates #effects-stack-template').html()) : templates.effects_stack_template;
      this.$container = $('.right-pane');
      this.$container.prepend(this.$el);
      this.loader = this.options.loader;
      // this.model.on('module-added', this.render);
      this.collection.on('add', this.renderModule);
      this.collection.on('remove load-remove', this.removeModule);

      this.bindSortable();
      this.render();
    },
    renderModule : function(model, e ,i) {
      new StackModuleView({
        model : model,
        $container : this.$el,
        insertIndex : i,
        collection : this.collection
      });
      this.$el.sortable('refresh');
    },
    removeModule : function(module) {
      var cid = module.cid;
      this.$el.children('div[data-cid=' + cid +']').remove();
    },
    render : function() {
      var self = this;

      this.$el.html("");

      // if (this.model.get('tabs')[0].selected) {
      //   this.$el.addClass('selected');
      // }
      this.$el.addClass('selected');

      this.collection.each(function(model) {
        self.renderModule(model);
      });
    },
    destroySortable : function() {
      this.$el.sortable('destroy');
      this.$el.off('update');
    },
    bindSortable : function() {
      this.$el.sortable({
        items    : ".stack-module:not(.drag-disable)",
        handle   : ".handle",
        distance : 15,
        opacity  : 0.7,
        axis     : "y",
        update   : this.onStackSorted,
        start    : this.onStackSortStart
      });
      this.$el.disableSelection();
    },
    onStackSorted : function(e, ui) {
      this._sortEndIndex = ui.item.index();
      this.collection.updateItemPosition(this._sortStartIndex, this._sortEndIndex);
    },
    onStackSortStart : function(e, ui) {
      this._sortStartIndex = ui.item.index();
    },
    resetStack : function() {

    },
    load : function(presetName) {
      var moduleArray = this.loader.getModulesToLoad(presetName);

      this.collection.each(this.removeModule);
      this.collection.reset();

      this._loadIndex = 0;

      this._load(moduleArray)

      // for (var i = 0, _len = moduleArray.length; i < _len; i++) {
        // (function(module, stack) {

        //   module.model.loadModule(function() {
        //     stack.createModule(module.model, module.settings, module.globals);
        //     // module.model.applySettings(module.settings);
        //   });

        // }(moduleArray[i], this.collection));
      // }
    },
    _load : function(moduleArray) {
      var self = this;
      var stack = this.collection;
      var module = moduleArray[this._loadIndex];
      var _moduleArray = moduleArray;

      module.model.loadModule(function() {
        stack.createModule(module.model, module.settings, module.globals, function() {
          if (!_.isUndefined(_moduleArray[self._loadIndex + 1])) {
            self._loadIndex++;
            self._load(_moduleArray);
          }
        });
        // module.model.applySettings(module.settings);
      });
    }
  });

  return StackView;

});