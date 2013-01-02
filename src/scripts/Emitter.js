define(['library/EventEmitter'], function(EventEmitter) {
  
  var emitter = new EventEmitter();
  
  console.log("DEBUG: EventEmitter Module Loaded");

  return emitter;
});