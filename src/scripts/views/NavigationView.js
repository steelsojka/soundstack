define(["views/PresetLoaderView", "models/PresetCollection", "views/HelpView"
      , "models/HelpCollection"], 

function(PresetLoaderView, PresetCollection, HelpView, helpCollection) {

  var NavigationView = Backbone.View.extend({
    className : "navbar",
    events : {
      "click .add-module-btn" : "onAddModule",
      "click .cancel-add-btn" : "onAddModule",
      "change .main-menu select" : "onMenuChange",
      "blur #bpm input" : "onBpmChange",
      "keydown #bpm input" : "onBpmChange"
    },
    initialize : function() {
      _.bindAll(this);
      var self = this;
      this.stack = this.options.stack;
      this.template = env === "web" ? _.template($('#templates #navbar-template').html()) : templates.navbar_template;
      this.$container = $('#navbar-container');
      this.model.set({
        'saveOpen' : false,
        'loadOpen' : false,
        'aboutOpen' : false,
        'helpOpen' : false
      });
      
      this.presetLoaderView = new PresetLoaderView({
        collection : new PresetCollection(),
        $container : this.$container
      });

      this.helpView = new HelpView({
        collection : helpCollection,
        $container : this.$container
      });

      this.stack.getPresets(function(presets) {
        self.presetLoaderView.collection.reset(presets);
        self.presetLoaderView.collection.on('load', function(key) {
          self.stack.load(key);
        });
      });

      global_relay.on('global-open', this.onLoad);
      global_relay.on('global-save', this.onSave);
      global_relay.on('global-help', this.onHelp);
      global_relay.on('global-expand', function() {self.onCollapseAll(0);});
      global_relay.on('global-collapse', function() {self.onCollapseAll(1);});
      global_relay.on('global-about', this.onAbout);
      // this.model.on('change', this.render);
      this.render();
    },
    render : function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$container.html(this.$el);
      this.$container.append(env === "web"
        ? _.template($('#templates #save-input-template').html(), {})
        : templates.save_input_template()
      ).after(env === "web"
        ? _.template($('#templates #about-template').html(), {version : globals.version})
        : templates.about_template({version : "0.1"})
      );
      this.$saveDialog = this.$container.find('#save-dialog');
      this.$aboutDialog = $('#about-dialog');
      this.$aboutDialog.find('.close').on('click', this.toggleAbout);
      this.$saveDialog.on('keydown', this.onSaveSubmit);
      $(window).on('resize', this.onResize).trigger('resize');

    },
    onResize : function(e) {
      this.$aboutDialog.css({
        left : (window.innerWidth / 2) - (this.$aboutDialog.width() / 2),
        top : (window.innerHeight / 2) - (this.$aboutDialog.height() / 2),
      });
    },
    onAddModule : function(e) {
      var loaderAction = $(e.target).hasClass('add-module-btn') ? "addClass" : "removeClass";
      var stackAction = loaderAction === "addClass" ? "removeClass" : "addClass";

      $("#module-loader")[loaderAction]('selected')
                         .siblings('#effects-stack')
                         [stackAction]('selected');

      $('.left-rail, .right-rail')[loaderAction]('hide');

      $(".main-view-hide")[loaderAction]('hide');

      this.$el.find('.add-module-btn')
              [loaderAction]('hide')
              .siblings('.cancel-add-btn')
              [stackAction]('hide');
    },
    onMenuChange : function(e) {
      var value = e.target.selectedOptions[0].value;

      switch (value) {
        case "load": this.onLoad(); break;
        case "save" : this.onSave(); break;
        case "settings" : this.onSettings(); break;
        case "about" : this.onAbout(); break;
        case "collapseAll" : this.onCollapseAll(1); break;
        case "expandAll" : this.onCollapseAll(0); break;
        case "help" : this.onHelp(); break;
        case "metronome" : this.onMetronomeToggle(); break;
      }

      e.target.selectedIndex = 0;
    },
    toggleAbout : function() {
      var self = this;
      var aboutOpen = this.model.get('aboutOpen');
      var action = aboutOpen ? "addClass" : "removeClass";

      this.$aboutDialog[action]('hide');
      $('.body-overlay')[action]('hide');

      if (!aboutOpen) {
        $(window).on('keydown', function(e) { 
          if (e.keyCode === 27 || e.keyCode === 13) {
            self.toggleAbout(); 
          }
        });
        this.onResize();
      } else {
        $(window).off('keydown', this.onSaveSubmit);
      }

      this.model.set("aboutOpen", !aboutOpen);
    },
    toggleSaveDialog : function() {
      var saveOpen = this.model.get('saveOpen');
      var action = saveOpen ? "addClass" : "removeClass";

      this.$saveDialog[action]('hide');
      $('.body-overlay')[action]('hide');

      if (!saveOpen) {
        this.$saveDialog.find('input').focus();
      }

      this.model.set("saveOpen", !saveOpen);
    },
    toggleLoadDialog : function() {
      var loadOpen = this.model.get('saveOpen');
      var action = loadOpen ? "addClass" : "removeClass";
      
      this.model.set("loadOpen", !loadOpen);
    },
    onLoad : function() {
      this.presetLoaderView.toggle();
    },
    onSave : function() {
      this.toggleSaveDialog();
    },
    onSaveSubmit : function(e) {
      var self = this;
      switch(e.keyCode) {
        case 13: 
          this.stack.save(e.target.value, function(preset) {
            self.presetLoaderView.collection.add(preset);
          });
        case 27: e.target.value = ""; this.toggleSaveDialog(); break;
        default: break;
      }
    },
    onSettings: function() {
      var show = !this.options.settings.get('show');
      this.options.settings.set('show', show, {silent : true});
      this.options.settings.trigger('toggle');
    },
    onBpmChange : function(e) {
      if (e.type === "keydown") {
        if (e.keyCode !== 13) return;
        $(e.target).blur();
        return;
      }

      if (!e.target.validity.valid) {
        e.target.value = this.stack.BPM;
        return;
      } 
      
      var value = parseInt(e.target.value, 10);
      this.stack.BPM = value;
      this.stack.trigger('change:BPM');
    },
    onAbout : function() {
      this.toggleAbout();
    },
    onHelp : function() {
      this.helpView.onToggle();
    },
    onCollapseAll : function(value) {
      this.stack.invoke("setCollapsed", value);
    }
  });

  return NavigationView;

});