define(function() {

  var models = [
    {
      title : "Enabling audio line input",
      description : "Line in audio is not enabled by default in Google Chrome. To enable it please follow these steps<br><br>"
        + "- Enter chrome://flags into the omnibar\n- Scroll down to the \"Web Audio Input\" flag<br><br>"
        + "- Click \"Enable\""
    }, {
      title : "Improving performance",
      description : "When adding lots of modules performance can become an issue. Performance is heavily affected by browser redrawing."
        + " Meters are mostly affected by this performance hit since they are redrawing at 60 FPS at optimum conditions. "
        + "To counter this you can do one of 2 things:<br><br>"
        + "- You can disable meters by clicking on them to toggle the drawing on and off.<br><br>"
        + "- You can collapse the module to not show any of the controls.  Drawing will not occur in this state."
        + "<br><br>It may be best to toggle meters on and off with use if performance starts becoming sluggish."
    }, {
      title : "Recording audio",
      description : "Audio can be captured and exported out of SoundStack. The audio signal coming out of the"
        + " master input module is the signal that is geting recorder. Recording can be paused by hitting record again. Recording is done once the stop button"
        + " is pressed. The audio data will be loaded up in an Audio Player module for further processing or export to a 16bit WAV"
        + "<br><br>Audio Players can bypass the recording process by selecting \"Reference\" on the module.  This is useful"
        + " when wanting to record a line input and not the audio player you are playing with."
    }, {
      title : "Shortcut Keys",
      description : "There are many shortcut keys to make using SoundStack better:<br><ul>"
        + "<li>Ctrl + H - Help</li>"
        + "<li>Ctrl + A - About</li>"
        + "<li>Ctrl + S - Save Stack</li>"
        + "<li>Ctrl + O - Open Stack</li>"
        + "<li>Ctrl + C - Collapse all</li>"
        + "<li>Ctrl + E - Expand all</li>"
        + "<li>Ctrl + R - Record/Pause record</li>"
        + "<li>Space - Global play for audio players</li>"
        + "<li>Ctrl + Space - Global stop for audio players</li></ul>"
    }
  ];

  return new Backbone.Collection(models);

});