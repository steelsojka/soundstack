self.onmessage=function(e){var t;switch(e.data.action){case"waveform-peaks":t=calculateWaveformPeaks(e.data.data,e.data.width);break;case"default":t={}}var n={data:t,action:e.data.action};self.postMessage(n)};var calculateWaveformPeaks=function(e,t){var n=e[0].length/t,r=Array.prototype.slice,i=[];for(var s=0,o=t;s<o;s++){var u=0;for(var a=0,f=e.length;a<f;a++){var l=r.call(e[a],s*n,(s+1)*n),c=Math.max.apply(Math,l.map(Math.abs));typeof c=="undefined"&&(c=0),u+=c}i[s]=u}return i};