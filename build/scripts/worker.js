self.onmessage=function(e){var t,n=e.data;switch(n.action){case"waveform-peaks":t=calculateWaveformPeaks(n.data,n.width);break;case"get-selection-buffer":t=getSelectionBuffer(n.data,n.altData,n.start,n.end);break;case"normalize-buffer":t=normalizeBuffer(n.data,n.start,n.end,n.altData,n.max);break;case"cut-buffer":t=cutBuffer(n.data,n.altData,n.start,n.end);break;case"insert-buffer":t=insertBuffer(n.data,n.insertBuffer,n.start);break;case"get-buffer-max":t=getMax(n.data,n.start,n.end);break;case"replace-buffer-section":t=replaceBufferSection(n.data,n.altData,n.altData);break;case"adjust-buffer-gain":t=adjustBufferGain(n.data,n.amount,n.start,n.end);break;case"dummy":t=n.data;break;case"default":t={}}var r={data:t,action:n.action,processID:n.processID,jobID:n.jobID};self.postMessage(r)};var splice=function(e,t,n){var r=Array.prototype.slice,i=n||[],s=r.call(this,0,e),o=r.call(this,t+e,this.length);return s.concat(i,o)},getMax=function(e,t,n){var r=0,i,s=t;for(var o=0,u=e.length;o<u;o++){var a=n-t;while(a--){var i=e[o][s++];i<0&&(i=-i),r=i>r?i:r}}return r},replaceBufferSection=function(e,t){for(var n=0,r=e.length;n<r;n++)e[n]=splice.call(e[n],t[n]._rPos,t[n]._rBuff.length,t[n]._rBuff);return e},normalizeBuffer=function(e,t,n,r,i){var s=1/i,o=r[0]._pos,u=e.length;while(u--){var a=e[u],f=a.length;while(f--){var l=o+f;if(l>=t&&l<=n){var c=a[f]*s;a[f]=c>1?1:c<-1?-1:c}}}return e},adjustBufferGain=function(e,t,n,r){r=Math.round(r),n=Math.round(n);for(i=0,_len=e.length;i<_len;i++){var s=n,o=e[i];for(var u=0,a=r-n;u<a;u++)o[s]=o[s]*t,s++}return e},cutBuffer=function(e,t,n,r){var i=Array.prototype.slice,s=t[0]._pos;n=Math.round(n),r=Math.round(r);var o=r-n,u=[],a=[];for(var f=0,l=e.length;f<l;f++)if(s>=n&&s<=r){var c=s-n>=e[f].length?0:s-n,h=r-s>=e[f].length?e[f].length:r-s;u.push(i.call(e[f],c,h)),a.push(splice.call(e[f],c,h-c))}else u.push([]),a.push(e[f]);return{buffers:a,cutBuffers:u}},insertBuffer=function(e,t,n){var r=e[0].length,i=[],s=Array.prototype.slice;n=Math.round(n);for(var o=0,u=e.length;o<u;o++){var a=s.call(e[o],0,n),f=s.call(e[o],n,r);i.push(a.concat(t[o],f))}return i},getSelectionBuffer=function(e,t,n,r){var i,s,o=[],u=Math.round(n),a=Math.round(r),f=e[0].length,l=t[0]._pos;for(var c=0,h=e.length;c<h;c++){i=[],s=e[c],log({pos:l,startFrame:u,endFrame:a});if(l>=u&&l<=a){var p=l-u>=s.length?0:l-u,d=a-l>=s.length?s.length:a-l;i=Array.prototype.slice.call(s,p,d)}o.push(i)}return o},log=function(e){self.postMessage({action:"log",message:e})},calculateWaveformPeaks=function(e,t){var n=0,r=e.length;while(r--){var i=e[r],s=Math.max.apply(Math,i);typeof s=="undefined"&&(s=0),n+=s}return[n]};