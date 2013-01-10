var conf = {
  BUFFER_SIZE : 1000
};

self.onmessage = function(e) {

	var data;

	switch (e.data.action) {
		case "waveform-peaks":
			data = calculateWaveformPeaks(e.data.data, e.data.width);
			break;
    case "get-selection-buffer":
      data = getSelectionBuffer(e.data.data, e.data._pos, e.data.start, e.data.end, e.data.fps);
      break;
    case "normalize-buffer":
      data = normalizeBuffer(e.data.data, e.data.start, e.data.end);
      break;
    case "cut-buffer":
      data = cutBuffer(e.data.data, e.data.start, e.data.end);
      break;
    case "insert-buffer":
      data = insertBuffer(e.data.data, e.data.insertBuffer, e.data.start);
      break;
    case "adjust-buffer-gain":
      data = adjustBufferGain(e.data.data, e.data.amount, e.data.start, e.data.end);
      break;
    case "dummy":
      data = e.data.data;
      break;
		case "default":
			data = {};
	}

	var res = {
		data : data,
		action : e.data.action,
    processID : e.data.processID,
    jobID : e.data.jobID
	};

	self.postMessage(res);

};

var getMax = function(array, start, end) {
  var max = 0;
  var temp;
  var x = start;

  for (var i = 0, _len = end - start; i < _len; i++) {
    var temp = array[x++];
    if (temp < 0) temp = -temp;
    max = temp > max ? temp : max;
  };

  return max;
};

var normalizeBuffer = function(buffers, start, end) {
  var prevMax = 0;
  var max = 0;
  end = Math.round(end);
  start = Math.round(start);

  for (var i = 0, _len = buffers.length; i < _len; i++) {
      max = getMax(buffers[i], start, end);
      max = prevMax < max ? max : prevMax;
      prevMax = max;
  }
  
  var factor = 1 / max;

  for (i = 0, _len = buffers.length; i < _len; i++) {
    var _start = start;
    var buffer = buffers[i];
    for (var x = 0, _len2 = end - start; x < _len2; x++) {
      var amount = buffer[_start] * factor;
      buffer[_start] = amount > 1 ? 1 : amount < -1 ? -1 : amount;
      _start++;
    }
  }

  return buffers;

};

var adjustBufferGain = function(buffers, factor, start, end) {
  end = Math.round(end);
  start = Math.round(start);
  
  for (i = 0, _len = buffers.length; i < _len; i++) {
    var _start = start;
    var buffer = buffers[i];
    for (var x = 0, _len2 = end - start; x < _len2; x++) {
      buffer[_start] = buffer[_start] * factor;
      _start++;
    }
  }

  return buffers;
};

var cutBuffer = function(buffers, start, end) {
  var newLength, length = buffers[0].length, cutLength,
      newData = [], cutBuffers = [];

  start = Math.round(start);
  end = Math.round(end);
  cutLength = end - start;
  newLength = length - cutLength;

  for (var i = 0, _len = buffers.length; i < _len ; i++) {
    var buffer = buffers[i], newBuffer = [], x = 0, cut = [], c = 0, k = 0;
    for (var j = 0; j < newLength; j++) {
      if (x >= start && x < end) {
        cut[c] = buffer[x];
        c++;
      } else {
        newBuffer[k] = buffer[x];
        k++;
      }
      x++;
    }
    cutBuffers.push(cut);
    newData.push(newBuffer);
  }

  return {buffers : newData, cutBuffers : cutBuffers};

};

var insertBuffer = function(buffers, insertBuffers, start) {
  var newLength, length = buffers[0].length, newData = [], insertEnd, progress = 0, chunk = [], c = 0;

  start = Math.round(start);
  newLength = length + insertBuffers[0].length;
  insertEnd = start + insertBuffers[0].length;

  for (var i = 0, _len = buffers.length; i < _len; i++) {
    var buffer = buffers[i], newBuffer = [], k = 0, l = 0;
    for (var j = 0; j < newLength; j++) {
      if (j >= start && j < insertEnd) {
        chunk[c++] = insertBuffers[i][k];
        // newBuffer[j] = insertBuffers[i][k];
        k++;
      } else {
        chunk[c++] = buffer[l];
        // newBuffer[j] = buffer[l];
        l++;
      }
      progress = (((j / newLength) / buffers.length) * 100) * (i + 1);
      if (j % conf.BUFFER_SIZE === 0 || j === newLength - 1) {
        self.postMessage({
          action : "progress",
          percent : ~~progress,
          data : chunk,
          channel : i
        });
        c = 0;
        chunk = [];
      }
    }
    // newData.push(newBuffer);
  }

  // return newData;

};

var getSelectionBuffer = function(buffers, _pos, start, end, fps) {
  var newBuffer, y, buffer;
  var newData = [];
  var startFrame = Math.round(start * fps);
  var endFrame = Math.round(end * fps);
  var length = buffers[0].length;

  for (var i = 0, _len = buffers.length; i < _len; i++) {  
    newBuffer = [], buffer = buffers[i], y = 0;
    for (var x = 0; x < length; x++) {
      if (_pos + x >= startFrame && _pos + x < endFrame) {
        newBuffer[y++] = buffer[x];
      }
    }
    newData.push(newBuffer);
  }

  // for (var i = 0, _len = buffers.length; i < _len; i++) {
  //   newBuffer = [], y = 0;

  //   for (var x = startFrame; x <= endFrame; x++) {
  //     newBuffer[y++] = buffers[i][x];
  //   }
  //   newData.push(newBuffer);
  // }

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
    self.postMessage({
      action : "progress",
      percent : ~~(i / width * 100)
    });
  }

  return newData;
};