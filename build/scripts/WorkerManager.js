(function(e){var t=function(e){var t={};for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);return t},n=function(e,t){this.worker=e,this.queue=[],this.returnQueue=[],this.isComplete=!0,this.manager=t,this._tempWorker=null,this.worker.onmessage=this.onMessage.bind(this),debug.log("WORKER QUEUE: Initialized...")};n.prototype={push:function(e){this.queue.push(e),this.isComplete=!1,debug.log("WORKER QUEUE: Process "+e.postData.processID+" for job "+e.workerJob.id+" pushed to queue",!0)},process:function(){var e=this.queue.shift();this._tempJob=e.workerJob,e.workerJob.outstandingProcesses+=1,debug.log("WORKER QUEUE: Sending process "+e.postData.processID+" for job "+e.workerJob.id+" to worker...",!0),this.worker.postMessage(e.postData)},onMessage:function(e){if(e.data.action==="log"){debug.log(e.data);return}this._tempJob.pushReturn(e.data),this.queue.length>0&&this.process()},getReturnQueue:function(){return this.returnQueue},getQueue:function(){return this.queue},kill:function(){this.isComplete=!0,debug.log("WORKER QUEUE: Queue is empty.  Terminating..."),this.worker.terminate(),this.manager.removeQueue(this)}};var r=function(e){this.onReconstruct=function(){},this.onProgress=function(){},this.isComplete=!1,this.returnQueue=[],this.totalProcesses=0,this.outstandingProcesses=0;for(var t in e)e.hasOwnProperty(t)&&(this[t]=e[t]);this.remainingProcesses=this.totalProcesses,debug.log("WORKER JOB "+this.id+": Initialized...")};r.prototype={checkJobStatus:function(){var e=this.manager.getQueues();debug.log(this.remainingProcesses),this.remainingProcesses===0&&!this.isComplete&&(this.isComplete=!0,this.reconstruct())},pushReturn:function(e){this.returnQueue[e.processID-1]=e.data,this.outstandingProcesses-=1,this.remainingProcesses-=1,this.checkJobStatus(),this.onProgress(~~((this.totalProcesses-this.remainingProcesses)/this.totalProcesses*100),e)},reconstruct:function(){debug.log("WORKER JOB "+this.id+": Job finished"),this.onReconstruct(this.returnQueue),this.manager.killQueues()}};var i=function(){this.WORKER_COUNT=8,this.WORKER_URL="scripts/worker.js",this.workers=[],this.queues=[],this.jobQueue=[],this.jobInProgress=!1,this.currentJobID=0};i.prototype={removeQueue:function(e){this.queues=_.without(this.queues,e)},getQueues:function(){return this.queues},killQueues:function(){_.invoke(this.queues,"kill")},addJob:function(e){this.jobQueue.push(e),debug.log("WORKER: Job added"),this.processJob()},createWorkers:function(e){for(var t=0,r=e;t<r;t++){var i=new Worker(this.WORKER_URL);this.workers.push(i),this.queues.push(new n(i,this))}debug.log("WORKER: workers created")},processJob:function(){var e,t=0,n=0,i=this;if(this.jobInProgress||this.jobQueue.length===0)return;debug.log("WORKER: Job process started..."),options=this.jobQueue.shift();var s=options.onSplit||function(){};this.workers=[],this.queues=[],this.workerCount=options.workers||this.WORKER_COUNT;var o=new r({onReconstruct:options.onReconstruct||function(){},onProgress:options.onProgress||function(){},totalProcesses:options.totalProcesses,id:~~(Math.random()*1e4),manager:this});if(options.split)this.createWorkers(this.workerCount),buffers=s.call(this,options,options.split,function(e){var r=_.omit(options,"data","onReconstruct","onSplit","onProgress");r.altData=[],r.data=[];for(var s=0;s<e.length;s++)r.data.push(e[s].data),r.altData.push(e[s].altData);r._pos=e[0]._pos,r.processID=++n,r.jobID=o.id,i.queues[t].push({postData:r,jobID:o.id,workerJob:o}),i.queues[t].process(),t>=this.WORKER_COUNT&&(t=0)});else{e=1,buffers=options.data,debug.log("pre worker creation"),this.createWorkers(e),debug.log("post worker creation");var u=_.omit(options,"data","onReconstruct","onSplit","onProgress");u.data=buffers,u.processID=++n,u.jobID=o.id,this.queues[0].push({postData:u,jobID:o.id,workerJob:o}),this.queues[0].process()}}},e.WorkerManager=new i})(this);