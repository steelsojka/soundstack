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

    debug.log("WORKER QUEUE: Initialized...");

  };

  WorkerQueue.prototype = {
    push : function(job) {
      // job.workerJob.totalProcesses += 1;
      // job.workerJob.remainingProcesses += 1;
      this.queue.push(job);
      this.isComplete = false;

      // debug.clear();
      debug.log("WORKER QUEUE: Process " + job.postData.processID + " for job " + job.workerJob.id + " pushed to queue", true);

    },
    process : function() {
      var job = this.queue.shift();
      this._tempJob = job.workerJob;

      job.workerJob.outstandingProcesses += 1;

      // debug.log("S: " + job.postData.processID);

      // debug.clear();
      debug.log("WORKER QUEUE: Sending process " + job.postData.processID + " for job " + job.workerJob.id + " to worker...", true);
      this.worker.postMessage(job.postData);
    },
    onMessage : function(e) {
      // this.returnQueue.push(e.data);
      
      if (e.data.action === "log") {
        debug.log(e.data);
        return;
      }

      // debug.log("R: " + e.data.processID);

      this._tempJob.pushReturn(e.data);

      if (this.queue.length > 0) {
        this.process();
      } else {
        // this.onQueueEmpty();
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
      debug.log("WORKER QUEUE: Queue is empty.  Terminating...");
      this.worker.terminate();
      this.manager.removeQueue(this);
    }
  };

  var WorkerJob = function(options) {

    this.onReconstruct = function() {};
    this.onProgress = function() {};
    this.isComplete = false;
    this.returnQueue = [];
    this.totalProcesses = 0;
    this.outstandingProcesses = 0;

    for (var key in options) {
      if (options.hasOwnProperty(key)) {
        this[key] = options[key];
      }
    }

    this.remainingProcesses = this.totalProcesses;

    debug.log("WORKER JOB " + this.id + ": Initialized...");

  };

  WorkerJob.prototype = {
    checkJobStatus : function() {
      var queues = this.manager.getQueues();

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

      if (this.remainingProcesses === 0 && !this.isComplete) {
        this.isComplete = true;
        this.reconstruct();
      }

    },
    pushReturn : function(data) {
      this.returnQueue[data.processID - 1] = data.data;
      this.outstandingProcesses -= 1;
      this.remainingProcesses -= 1;
      this.checkJobStatus();
      this.onProgress(~~(((this.totalProcesses - this.remainingProcesses) / this.totalProcesses) * 100), data);
    },
    reconstruct : function() {
      // this.returnQueue.sort(function(a, b) {
      //   return a.processID - b.processID;
      // });

      // _.each(this.returnQueue, function(q) {
      //   if (q.data[0].length > 5) {
      //     debug.log(q.data);
      //   }
      // });

      debug.log("WORKER JOB " + this.id + ": Job finished");

      // debug.log(_.pluck(this.returnQueue, "data"));

      this.onReconstruct(this.returnQueue);

      // this.onReconstruct(_.pluck(this.returnQueue, "data"));


      // this.manager.processJob();
    }
  };

  var WorkerManager = function() {
    this.WORKER_COUNT = 8;
    this.WORKER_URL = "scripts/worker.js";
    this.workers = [];
    this.queues = [];
    this.jobQueue = [];
    this.jobInProgress = false;
    this.currentJobID = 0;
  };

  WorkerManager.prototype = {
    removeQueue : function(queue) {
      this.queues = _.without(this.queues, queue);
    },
    getQueues : function() {
      return this.queues;
    },
    addJob : function(options) {
      this.jobQueue.push(options);
      debug.log("WORKER: Job added");
      this.processJob();
    },
    createWorkers : function(amount) {
      for (var i = 0, _len = amount; i < _len; i++) {
        var worker = new Worker(this.WORKER_URL);

        this.workers.push(worker);
        this.queues.push(new WorkerQueue(worker, this));
      }
      debug.log("WORKER: workers created");
    },
    processJob : function() {
      var splitCount, worker_num = 0, id = 0;
      var self = this;


      if (this.jobInProgress || this.jobQueue.length === 0) return;

      debug.log("WORKER: Job process started...");

      options = this.jobQueue.shift();

      var splitter = options.onSplit || function() {};
      this.workers = [];
      this.queues = [];
      this.workerCount = options.workers || this.WORKER_COUNT;
      
      var workerJob = new WorkerJob({
        onReconstruct : options.onReconstruct || function() {},
        onProgress : options.onProgress || function() {},
        totalProcesses : options.totalProcesses,
        id : ~~(Math.random() * 10000),
        manager : this
      });

      if (options.split) {
        this.createWorkers(this.workerCount);

        buffers = splitter.call(this, options, options.split, function(data) {
          
          var job = _.omit(options, "data", "onReconstruct", "onSplit", "onProgress");
          job.altData = [];
          job.data = [];
          for (var x = 0; x < data.length; x++) {
            job.data.push(data[x].data);
            job.altData.push(data[x].altData);
          }

          job._pos = data[0]._pos;
          job.processID = ++id;
          job.jobID = workerJob.id;

          self.queues[worker_num].push({
            postData : job,
            jobID : workerJob.id,
            workerJob : workerJob
          });

          self.queues[worker_num].process();

          if (worker_num >= this.WORKER_COUNT) worker_num = 0;
        });
        // splitCount = buffers[0].length;
                // debug.log("pre worker creation");

        // this.createWorkers(splitCount < this.workerCount ? splitCount : this.workerCount);
               // debug.log("post worker creation");

        // for (var i = 0; i < splitCount; i++) {
        //   var job = clone(options);
        //   job.data = [];
        //   job.altData = [];
        //   for (var x = 0; x < buffers.length; x++) {
        //     job.data.push(buffers[x][i].data);
        //     job.altData.push(buffers[x][i].altData);
        //   }

        //   job._pos = buffers[0][i]._pos;
        //   job.processID = ++id;
        //   job.jobID = workerJob.id;

        //   this.queues[worker_num++].push({
        //     postData : job,
        //     jobID : workerJob.id,
        //     workerJob : workerJob
        //   });

        //   if (worker_num >= this.WORKER_COUNT) worker_num = 0;
        // }
      } else {
        splitCount = 1;
        buffers = options.data;
        debug.log("pre worker creation");
        this.createWorkers(splitCount);

        debug.log("post worker creation");
        // delete options.data;
        // delete options.onReconstruct;
        // delete options.onProgress;
        // delete options.onSplit;

        var job = _.omit(options, "data", "onReconstruct", "onSplit", "onProgress");
        job.data = buffers;
        job.processID = ++id;
        job.jobID = workerJob.id;

        this.queues[0].push({
          postData : job,
          jobID : workerJob.id,
          workerJob : workerJob
        });
        
        this.queues[0].process();
      }
      


      // for (i = 0, _len = splitCount < this.WORKER_COUNT ? splitCount : this.WORKER_COUNT; i < _len; i++) {
      //   this.queues[i].process();
      // }
    }
  };

  exports.WorkerManager = new WorkerManager();


}(this));