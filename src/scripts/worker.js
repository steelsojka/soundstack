self.onmessage = function(e) {

	var data;

	switch (e.data.action) {
		case "waveform-peaks":
			data = calculateWaveformPeaks(e.data.data, e.data.width);
			break;
    case "get-selection-buffer":
      data = getSelectionBuffer(e.data.data, e.data.start, e.data.end, e.data.fps);
      break;
    case "normalize-buffer":
      data = normalizeBuffer(e.data.data);
      break;
		case "default":
			data = {};
	}

	var res = {
		data : data,
		action : e.data.action
	};

	self.postMessage(res);

};

var getMax = function(array) {
  var max = 0;
  var temp;

  for (var i = 0, _len = array.length; i < _len; i++) {
    var temp = array[i];
    if (temp < 0) temp = -temp;
    max = temp > max ? temp : max;
  };

  return max;
};

var normalizeBuffer = function(buffers) {
  var prevMax = 0;
  var newData = [];
  var max = 0;
  var chunkSize = 1000;
  var chunk = 0;

  for (var i = 0, _len = buffers.length; i < _len; i++) {
      max = getMax(buffers[i]);
      max = prevMax < max ? max : prevMax;
      prevMax = max;
  }
  
  var factor = 1 / max;

  for (i = 0, _len = buffers.length; i < _len; i++) {
    var newBuffer = [], buffer = buffers[i];
    for (var x = 0, _len2 = buffer.length; x < _len2; x++) {
      newBuffer[x] = buffer[x] * factor;
    }

    newData.push(newBuffer);
  }

  return newData;

};

var getSelectionBuffer = function(buffers, start, end, fps) {
  var newBuffer, y;
  var newData = [];
  var startFrame = Math.round(start * fps);
  var endFrame = Math.round(end * fps);

  for (var i = 0, _len = buffers.length; i < _len; i++) {
    newBuffer = [], y = 0;

    for (var x = startFrame; x <= endFrame; x++) {
      newBuffer[y++] = buffers[i][x];
    }
    newData.push(newBuffer);
  }

  return newData;
};

var calculateWaveformPeaks = function(data, width) {
  var fpp = data[0].length / width;
  var slice = Array.prototype.slice;

  var newData = [];

  for (var i = 0, _len = width; i < _len; i++) {
    var bit = 0;
    for (var x = 0, _len2 = data.length; x < _len2; x++) {
      var values = slice.call(data[x], i * fpp, (i + 1) * fpp);
      var peak = Math.max.apply(Math, values.map(Math.abs));
      if (typeof peak === "undefined") {
        peak = 0;
      }
      bit += peak;
    }
    newData[i] = bit;
  }

  return newData;
};