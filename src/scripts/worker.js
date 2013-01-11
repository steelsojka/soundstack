var conf = {
  BUFFER_SIZE : 1000
};

self.onmessage = function(e) {

	var data, pData = e.data;

	switch (pData.action) {
		case "waveform-peaks":
			data = calculateWaveformPeaks(pData.data, pData.width);
			break;
    case "get-selection-buffer":
      data = getSelectionBuffer(pData.data, pData.altData, pData.start, pData.end);
      break;
    case "normalize-buffer":
      data = normalizeBuffer(pData.data, pData.max);
      break;
    case "cut-buffer":
      data = cutBuffer(pData.data, pData.start, pData.end);
      break;
    case "insert-buffer":
      data = insertBuffer(pData.data, pData.insertBuffer, pData.start);
      break;
    case "get-buffer-max":
      data = getMax(pData.data, pData.start, pData.end);
      break;
    case "replace-buffer-section":
      data = replaceBufferSection(pData.data, pData.altData, pData.altData);
      break;
    case "adjust-buffer-gain":
      data = adjustBufferGain(pData.data, pData.amount, pData.start, pData.end);
      break;
    case "dummy":
      data = pData.data;
      break;
		case "default":
			data = {};
	}

	var res = {
		data : data,
		action : pData.action,
    processID : pData.processID,
    jobID : pData.jobID
	};

	self.postMessage(res);

};


var splice = function(start, amount, _addArray) {
  var slice = Array.prototype.slice;
  var addArray = _addArray || [];

  var startArray = slice.call(this, 0, start);
  var endArray = slice.call(this, amount + start, this.length);
  var returnArray = slice.call(this, start, amount);

  return startArray.concat(addArray, endArray);
};



var getMax = function(buffers, start, end) {
  var max = 0;
  var temp;
  var x = start;

  for (var y = 0, _len2 = buffers.length; y < _len2; y++) {
    for (var i = 0, _len = end - start; i < _len; i++) {
      var temp = buffers[y][x++];
      if (temp < 0) temp = -temp;
      max = temp > max ? temp : max;
    }
  }

  return max;
};

var replaceBufferSection = function(buffers, altData) {
  for (var i = 0, _len = buffers.length; i < _len; i++) {
    Array.prototype.splice.call(buffers[i], altData[i]._rPos, altData[i]._rBuff.length, altData[i]._rBuff);
  }

  return buffers;
};

var normalizeBuffer = function(buffers, max) {
  var factor = 1 / max;

  for (i = 0, _len = buffers.length; i < _len; i++) {
    var buffer = buffers[i];
    for (var x = 0, _len2 = buffer.length; x < _len2; x++) {
      var amount = buffer[x] * factor;
      buffer[x] = amount > 1 ? 1 : amount < -1 ? -1 : amount;
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
  // var newLength, length = buffers[0].length, cutLength,
  //     newData = [], cutBuffers = [];
  var slice = Array.prototype.slice;

  start = Math.round(start);
  end = Math.round(end);
  var cutLength = end - start;
  var cutBuffers = [];
  var newData = [];
  // newLength = length - cutLength;


  for (var i = 0, _len = buffers.length; i < _len ; i++) {
    cutBuffers.push(slice.call(buffers[i], start, start + cutLength));
    newData.push(splice.call(buffers[i], start, cutLength));
  }

  return {buffers : newData, cutBuffers : cutBuffers};

};

var insertBuffer = function(buffers, insertBuffers, start) {
  var length = buffers[0].length, newData = [];
  var slice = Array.prototype.slice;
  start = Math.round(start);

  for (var i = 0, _len = buffers.length; i < _len; i++) {

    var startArray = slice.call(buffers[i], 0, start);
    var endArray = slice.call(buffers[i], start, length);

    newData.push(startArray.concat(insertBuffers[i], endArray));
  }

  return newData;

};

var getSelectionBuffer = function(buffers, altData, start, end) {
  // var newData = [];
  // var startFrame = Math.round(start * fps);
  // var endFrame = Math.round(end * fps);

  // for (var i = 0, _len = buffers.length; i < _len; i++) {  
  //   newData.push(Array.prototype.slice.call(buffers[i], startFrame, endFrame));
  // }

  // return newData;

  var newBuffer, y, buffer;
  var newData = [];
  var startFrame = Math.round(start);
  var endFrame = Math.round(end);
  var length = buffers[0].length;

  for (var i = 0, _len = buffers.length; i < _len; i++) {  
    newBuffer = [], buffer = buffers[i], y = 0;
    for (var x = 0; x < length; x++) {
      if (altData[i]._pos + x >= startFrame && altData[i]._pos + x < endFrame) {
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
  var bit = 0;

  for (var x = 0, _len2 = data.length; x < _len2; x++) {
    var values = data[x];
    var peak = Math.max.apply(Math, values);
    if (typeof peak === "undefined") {
      peak = 0;
    }
    bit += peak;
  }

  return [bit];
};