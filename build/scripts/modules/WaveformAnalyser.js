define(["modules/BaseModule","components/Gain"],function(e,t){var n=e.extend({init:function(){this._super.apply(this,arguments);var e=this;this.nodes.gain=new t(this.context),this.connectToInput(this.nodes.gain),this.connectToOutput(this.nodes.gain)}});return n});