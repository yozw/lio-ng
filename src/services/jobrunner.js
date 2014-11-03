/**
 * Job runner service
 */
app.service('jobRunnerService', function () {
  "use strict";
  var currentJob = {};

  function onJobStopped(job) {
    console.log("Job finished in " + job.stopWatch.getElapsed() + " msec");
    currentJob = {};
  }

  function startJob(parameters, callback) {
    var job = {};
    job.parameters = parameters;
    job.callback = callback;
    job.worker = new Worker("/src/workers/worker.js");
    job.worker.onmessage = function (e) {
      var obj = e.data;
      switch (obj.action) {
        case 'log':
          callback.log(obj.message);
          break;
        case 'error':
          onJobStopped(job);
          callback.error(obj.message);
          break;
        case 'emit-table':
          callback.emitTable(obj.table);
          break;
        case 'emit-graph':
          callback.emitGraph(obj.graph);
          break;
        case 'success':
          onJobStopped(job);
          callback.success(obj.status);
          break;
      }
    };

    job.stopWatch = new Stopwatch();
    job.stopWatch.start();
    job.worker.postMessage(parameters);
    job.callback.start(parameters);
    return job;
  }

  function terminateJob(job) {
    job.worker.onmessage = function () {};
    job.worker.terminate();
    console.log("Terminating job");
    job.callback.error("Cancelled by user.");
  }

  return {
    runJob: function (parameters, callback) {
      currentJob = startJob(parameters, callback);
    },
    terminateJob: function () {
      if (angular.isDefined(currentJob.worker)) {
        terminateJob(currentJob);
      }
    }
  };
});

