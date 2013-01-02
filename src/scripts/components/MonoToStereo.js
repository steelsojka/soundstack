define(["components/ScriptNode", "components/BaseNode"], function(ScriptNode, BaseNode) {

	var MonoToStereo = BaseNode.extend({
		init : function() {
			this._super.apply(this, arguments);
      this.node = new ScriptNode(this.context, 256, 2, 2);
      this.setInputNode(this.node.inputNode);
      this.setOutputNode(this.node.outputNode);

      this.node.onAudioProcess(function(e) {

	      var outputBuffer    = e.outputBuffer;
	      var dataLeft        = e.inputBuffer.getChannelData(0);
	      var dataRight       = e.inputBuffer.getChannelData(1);
	      var outputDataLeft  = outputBuffer.getChannelData(0);
	      var outputDataRight = outputBuffer.getChannelData(1);
	     

	      for (var i = dataRight.length - 1; i >= 0; i--) {
	      	outputDataLeft[i] = dataLeft[i];
	      	outputDataRight[i] = dataLeft[i];
	      };
      });

		}
	});

	return MonoToStereo;

});