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
      data = normalizeBuffer(pData.data, pData.start, pData.end, pData.altData, pData.max);
      break;
    case "cut-buffer":
      data = cutBuffer(pData.data, pData.altData, pData.start, pData.end);
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
  // var returnArray = slice.call(this, start, amount);

  return startArray.concat(addArray, endArray);
};



var getMax = function(buffers, start, end) {
  var max = 0;
  var temp;
  var x = start;

  for (var y = 0, _len2 = buffers.length; y < _len2; y++) {
    var i = end - start;
    while (i--) {
      
      var temp = buffers[y][x++];
      if (temp < 0) temp = -temp;
      max = temp > max ? temp : max;
    }
  }

  return max;
};

var replaceBufferSection = function(buffers, altData) {

  for (var i = 0, _len = buffers.length; i < _len; i++) {
    buffers[i] = splice.call(buffers[i], altData[i]._rPos, altData[i]._rBuff.length, altData[i]._rBuff);
  }

  return buffers;
};

var normalizeBuffer = function(buffers, start, end, alt, max) {
  var factor = 1 / max;
  var pos = alt[0]._pos;
  var i = buffers.length;

  while(i--) {
    var buffer = buffers[i], x = buffer.length;
    while (x--) {
      var _pos = pos + x;
      if (_pos >= start && _pos <= end) {
        var amount = buffer[x] * factor;
        buffer[x] = amount > 1 ? 1 : amount < -1 ? -1 : amount;
      } 
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

var cutBuffer = function(buffers, altData, start, end) {
  // var newLength, length = buffers[0].length, cutLength,
  //     newData = [], cutBuffers = [];
  var slice = Array.prototype.slice;
  var pos = altData[0]._pos;

  start = Math.round(start);
  end = Math.round(end);
  var cutLength = end - start;
  var cutBuffers = [];
  var newData = [];
  // newLength = length - cutLength;


  for (var i = 0, _len = buffers.length; i < _len ; i++) {
    if (pos >= start && pos <= end) {
      var startCut = pos - start >= buffers[i].length ? 0 : pos - start;
      var endCut = end - pos >= buffers[i].length ? buffers[i].length : end - pos;
      // self.postMessage({
      //   action : "log",
      //   start : startCut,
      //   end : endCut
      // });

      cutBuffers.push(slice.call(buffers[i], startCut, endCut));
      newData.push(splice.call(buffers[i], startCut, endCut - startCut));
    } else {
      cutBuffers.push([]);
      newData.push(buffers[i]);      
    }
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

  var newBuffer, buffer;
  var newData = [];
  var startFrame = Math.round(start);
  var endFrame = Math.round(end);
  var length = buffers[0].length;
  var pos = altData[0]._pos;

 

  for (var i = 0, _len = buffers.length; i < _len; i++) {  
    newBuffer = [], buffer = buffers[i];
    if (pos >= startFrame && pos <= endFrame) {

      var startCut = pos - startFrame >= buffer.length 
        ? 0
        : pos - startFrame;
      var endCut = (endFrame - pos) >= buffer.length 
        ? buffer.length
        : (endFrame - pos);
      newBuffer = Array.prototype.slice.call(buffer, startCut, endCut);
    }
    // for (var x = 0; x < length; x++) {
      // if (altData[i]._pos + x >= startFrame && altData[i]._pos + x < endFrame) {
      //   newBuffer[y++] = buffer[x];
      // }
    // }
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

var log = function(obj) {
  self.postMessage({
    action : "log",    
    message : obj
  });
};

var calculateWaveformPeaks = function(data, width) {
  var bit = 0;
  var i = data.length;

  while (i--) {
    var values = data[i];
    // var peak = getMax(values, 0, values.length);

    var peak = Math.max.apply(Math, values);
    if (typeof peak === "undefined") {
      peak = 0;
    }
    bit += peak;
  }

  return [bit];
};