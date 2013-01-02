define(["modules/BaseModule", "components/AudioFile"],

function(BaseModule, AudioFile) {

  var AudioPlayer = BaseModule.extend({
    init : function(context) {
      this._super.apply(this, arguments);
     
      var audioSource = new AudioFile(this.context);
      this.nodes.audioSource = audioSource;

      this.connectToOutput(audioSource);
    },
    onFileLoad : function(e) {
      this.nodes.audioSource.decodeAudio(e.target.result, this.onAudioDecode);
    },
    onAudioDecode : function() {

    }
  });

  return AudioPlayer;

});