(function(relay) {

  var keyStates = [];
  var lastEvent;
  var clearTimer;
  var ctrl = 17;
  var space = 32;

  var keys = [
    { codes : [space], event : "global-play"},
    { codes : [ctrl, 82], event : "global-record"},
    { codes : [ctrl, 79], event : "global-open"},
    { codes : [ctrl, 83], event : "global-save"},
    { codes : [ctrl, space], event : "global-stop"},
    { codes : [ctrl, 72], event : "global-help"},
    { codes : [ctrl, 69], event : "global-expand"},
    { codes : [ctrl, 67], event : "global-collapse"},
    { codes : [ctrl, 65], event : "global-about"}
  ];

  $(window).on('keydown', function(e) {

    clearTimeout(clearTimer);

    clearTimer = setTimeout(function() {
      keyStates = [];
    }, 2000);

    if (lastEvent && lastEvent.keyCode === e.keyCode) return;

    keyStates.push(e.keyCode);

    for (var i = 0, _len = keys.length; i < _len; i++) {
      var triggerEvent = true;
      var codes = keys[i].codes;
      var event = keys[i].event;
      for (var x = 0, _len2 = codes.length; x < _len2; x++) {
        if (codes.length === keyStates.length) {
          if (codes[x] !== keyStates[x] && triggerEvent) {
            triggerEvent = false;
          }
        } else {
          triggerEvent = false;
        }
      }
      if (triggerEvent) {
        e.preventDefault();
        relay.trigger(event);
      }

    }
    // if (e.keyCode === 32 && keyStates.length === 1) {
    //   relay.trigger('global-play');
    // }
    // if (e.keyCode === 82 && _.contains(keyStates, 17)) {
    //   relay.trigger('global-record');
    // }
    
    lastEvent = e;
  });

  $(window).on('keyup', function(e) {
    lastEvent = null;
    keyStates = _.without(keyStates, e.keyCode);
  });

}(global_relay));