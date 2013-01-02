define(["components/BaseNode", "components/Gain", "components/Router", "components/Analyser", "components/ChannelSplitter", "components/ChannelMerger"], 
  function(BaseNode, Gain, Router, Analyser, ChannelSplitter, ChannelMerger) {

  var BaseModule = BaseNode.extend({
    init : function(context) {
      this._super.apply(this, arguments);
      this.nodes = {};
      this._enabled = true;
      this.nodes.inputBuffer   = new Router(this.context);
      this.nodes.outputBuffer  = new Gain(this.context);
      this.nodes.splitter      = new ChannelSplitter(this.context);
      this.nodes.analyserLeft  = new Analyser(this.context);
      this.nodes.analyserRight = new Analyser(this.context);
      this.nodes.merger        = new ChannelMerger(this.context);

      this.fftSize = 1024;
      this.binCount = this.fftSize / 2;
      this.nodes.analyserLeft.setFFTSize(this.fftSize)
                             .setSmoothing(0.3);

      this.nodes.analyserRight.setFFTSize(this.fftSize)
                              .setSmoothing(0.3);
      
      this.setOutputNode(this.nodes.merger.getOutputNode());
      this.setInputNode(this.nodes.inputBuffer.getInputNode()); 

      this.nodes.outputBuffer.connect(this.nodes.splitter)
                             .connect(this.nodes.analyserLeft, 0, 0)
                             .connect(this.nodes.merger, 0, 0);
      
      this.nodes.splitter.connect(this.nodes.analyserRight, 1, 0)
                         .connect(this.nodes.merger, 0, 1);


      
      this.nodes.inputBuffer.addRouteTo(this.nodes.outputBuffer, 2);
      this.enable();

      this.nodes.inputBuffer.setLabel("*| Module Input Buffer");
      this.nodes.outputBuffer.setLabel("Module Output Buffer |*");
    },
    connectToInput : function(node) {
      this.nodes.inputBuffer.addRouteTo(node, 1);
      return this;
    },
    connectToOutput : function(node) {
      node.connect(this.nodes.outputBuffer);
      return this;
    },
    connectToMaster : function() {
      this.outputNode.connect(this.outputNode.context.destination);
      console.log(this.getLabel() + " connected to master output");
      return this;
    },
    setInputBuffer : function(amount) {
      this.nodes.inputBuffer.setGain(amount);
      return this;
    },
    setOutputBuffer : function(amount) {
      this.nodes.outputBuffer.setGain(amount);
      return this;
    },
    getAnalyser : function(channel) {
      if (channel === 0) {
        return this.nodes.analyserLeft;
      } else if (channel === 1) {
        return this.nodes.analyserRight;
      }
    },
    setParameters : function() {
      for (node in this.nodes) {
        if (this.nodes.hasOwnProperty(node)) {
          if (!(node in this.parameters)) {
            this.parameters[node] = this.nodes[node].getParameters();
          }
        }
      }
      return this;
    },
    getByteFrequencyData : function(channel) {
      var data = new Uint8Array(this.binCount);
      if (channel === 0) {
        return this.nodes.analyserLeft.getByteFrequencyData(data);
      } else if (channel === 1) {
        return this.nodes.analyserRight.getByteFrequencyData(data);
      }
    },
    getByteTimeDomainData : function(channel) {
      var data = new Uint8Array(this.binCount);
      if (channel === 0) {
        return this.nodes.analyserLeft.getByteTimeDomainData(data);
      } else if (channel === 1) {
        return this.nodes.analyserRight.getByteTimeDomainData(data);
      }   
    },
    getFloatFrequencyData : function(channel) {
      var data = new Float32Array(this.binCount);
     if (channel === 0) {
        return this.nodes.analyserLeft.getFloatFrequencyData(data);
      } else if (channel === 1) {
        return this.nodes.analyserRight.getFloatFrequencyData(data);
      }   
    },
    enable : function() {
      this.nodes.inputBuffer.setRoute(1);
      this._enabled = true;
      return this;
    },
    disable : function() {
      var self = this;

      this.nodes.inputBuffer.setRoute(2);
      this._enabled = false;
      return this;
      // setTimeout(function() {
      //   self.nodes.inputBuffer.setRoute.call(self.nodes.inputBuffer, 2);
      // }, 10);
    },
    destroy : function() {
      
    }
  });

  return BaseModule;

});