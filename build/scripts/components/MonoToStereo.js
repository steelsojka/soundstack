define(["components/ScriptNode","components/BaseNode"],function(e,t){var n=t.extend({init:function(){this._super.apply(this,arguments),this.node=new e(this.context,256,2,2),this.setInputNode(this.node.inputNode),this.setOutputNode(this.node.outputNode),this.node.onAudioProcess(function(e){var t=e.outputBuffer,n=e.inputBuffer.getChannelData(0),r=e.inputBuffer.getChannelData(1),i=t.getChannelData(0),s=t.getChannelData(1);for(var o=r.length-1;o>=0;o--)i[o]=n[o],s[o]=n[o]})}});return n});