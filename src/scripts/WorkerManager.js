(function(exports) {

  var clone = function(obj) {
    var o = {};

    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        o[key] = obj[key];
      }
    }

    return o;
  };

  var WorkerQueue = function(worker, manager) {
    this.worker = worker;
    this.queue = [];
    this.returnQueue = [];
    this.isComplete = true;
    this.manager = manager;
    this._tempWorker = null;
    this.worker.onmessage = this.onMessage.bind(this);
  };

  WorkerQueue.prototype = {
    push : function(job) {
      job.workerJob.totalProcesses += 1;
      job.workerJob.remainingProcesses += 1;
      this.queue.push(job);
      this.isComplete = false;
    },
    process : function() {
      var job = this.queue.shift();
      this._tempJob = job.workerJob;

      job.workerJob.outstandingProcesses += 1;

      this.worker.postMessage(job.postData);
    },
    onMessage : function(e) {
      // this.returnQueue.push(e.data);
      this._tempJob.pushReturn(e.data);

      if (this.queue.length > 0) {
        this.process();
      } else {
        this.onQueueEmpty();
        // this.manager.checkQueues();
      }
    },
    getReturnQueue : function() {
      return this.returnQueue;
    },
    getQueue : function() {
      return this.queue;
    },
    onQueueEmpty : function() {
      this.isComplete = true;
      this.worker.terminate();
    }
  };

  var WorkerJob = function(options) {

    this.onReconstruct = function() {};
    this.onProgress = function() {};
    this.isComplete = true;
    this.returnQueue = [];
    this.totalProcesses = 0;
    this.remainingProcesses = 0;
    this.outstandingProcesses = 0;

    for (var key in options) {
      if (options.hasOwnProperty(key)) {
        this[key] = options[key];
      }
    }
  };

  WorkerJob.prototype = {
    checkJobStatus : function() {
      var queues = this.manager.getQueues();
      var isComplete = true;

      // for (var i = 0, _len = queues.length; i < _len; i++) {
      //   var queue = queues[i];
      //   for (var x = 0, _len2 = queue.getQueue().length; x < _len2; x++) {
      //     if (queue.queue[x].jobID == this.id) {
      //       isComplete = false;
      //       break;
      //     }
      //   }
      //   if (!isComplete) break;
      // }

      if (this.outstandingProcesses === 0) {
        this.isComplete = true;
        this.reconstruct();
      }

    },
    pushReturn : function(data) {
      this.returnQueue.push(data);
      this.outstandingProcesses -= 1;
      this.remainingProcesses -= 1;
      this.checkJobStatus();
      this.onProgress(~~(((this.totalProcesses - this.remainingProcesses) / this.totalProcesses) * 100), data);
    },
    reconstruct : function() {
      this.returnQueue.sort(function(a, b) {
        return a.processID - b.processID;
      });

      this.onReconstruct(_.pluck(this.returnQueue, "data"));
      this.manager.processJob();
    }
  };

  var WorkerManager = function() {
    this.WORKER_COUNT = 16;
    this.WORKER_URL = "scripts/worker.js";
    this.workers = [];
    this.queues = [];
    this.jobQueue = [];
    this.jobInProgress = false;
    this.currentJobID = 0;
  };

  WorkerManager.prototype = {
    splitBuffers : function(buffers, split) {
      var _buffers = [];

      for (var x = 0, _len = buffers.length; x < _len; x++) {
        var splits = [], buffer = buffers[x];

        for (var i = 0, j = buffer.length; i < j; i += split) {
          splits.push({
            data : Array.prototype.slice.call(buffer, i, i + split),
            _pos : i
          });
        }
        
        _buffers.push(splits);        
      }

      return _buffers;
    },
    getQueues : function() {
      return this.queues;
    },
    addJob : function(options) {
      this.jobQueue.push(options);
      this.processJob();
    },
    createWorkers : function(amount) {
      for (var i = 0, _len = amount; i < _len; i++) {
        var worker = new Worker(this.WORKER_URL);

        this.workers.push(worker);
        this.queues.push(new WorkerQueue(worker, this));
      }
    },
    processJob : function() {
      var splitCount, worker_num = 0, id = 0;
      
      if (this.jobInProgress || this.jobQueue.length === 0) return;

      options = this.jobQueue.shift();

      this.workers = [];
      this.queues = [];
      
      var workerJob = new WorkerJob({
        onReconstruct : options.onReconstruct,
        onProgress : options.onProgress,
        id : ~~(Math.random() * 10000),
        manager : this
      });


      if (options.split) {
        buffers = this.splitBuffers(options.data, options.split);
        splitCount = buffers[0].length;
        
        this.createWorkers(splitCount < this.WORKER_COUNT ? splitCount : this.WORKER_COUNT);
       
        delete options.data;
        delete options.onReconstruct;
        delete options.onProgress;

        for (var i = 0; i < splitCount; i++) {
          var job = clone(options);
          job.data = [];
          for (var x = 0; x < buffers.length; x++) {
            job.data.push(buffers[x][i].data);
          }
          job._pos = buffers[0][i]._pos;
          job.processID = ++id;
          job.jobID = workerJob.id;

          this.queues[worker_num++].push({
            postData : job,
            jobID : workerJob.id,
            workerJob : workerJob
          });

          if (worker_num >= this.WORKER_COUNT) worker_num = 0;
        }
      } else {
        splitCount = 1;
        
        this.createWorkers(splitCount);

        var job = clone(options);
        job.data = options.data
        job.processID = ++id;
        job.jobID = workerJob.id;

        this.queues[0].push({
          postData : job,
          jobID : workerJob.id,
          workerJob : workerJob
        });
      }
      


      for (i = 0, _len = splitCount < this.WORKER_COUNT ? splitCount : this.WORKER_COUNT; i < _len; i++) {
        this.queues[i].process();
      }
    }
  };

  exports.WorkerManager = new WorkerManager();


}(this));