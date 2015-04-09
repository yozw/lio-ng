/**
 * Job runner service
 */
app.service('jobRunnerService', function ($q, $log) {
  "use strict";
  var currentJob = {};

  function onJobStopped(job) {
    $log.info("Job finished in " + job.stopWatch.getElapsed() + " msec");
    currentJob = {};
  }

  function startJob(parameters, callback) {
    var job = {};
    job.parameters = parameters;
    job.callback = callback;
    job.worker = new Worker("/application/workers/worker.js");
    job.worker.onmessage = function (e) {
      var obj = e.data;
      switch (obj.action) {
        case 'log':
          if (callback.log !== undefined) {
            callback.log(obj.message);
          }
          break;
        case 'output':
          if (callback.output !== undefined) {
            callback.output(obj.message);
          }
          break;
        case 'error':
          onJobStopped(job);
          if (callback.error !== undefined) {
            callback.error(obj.message);
          }
          break;
        case 'emit-table':
          if (callback.emitTable !== undefined) {
            callback.emitTable(obj.table, obj.target);
          }
          break;
        case 'emit-graph':
          if (callback.emitGraph !== undefined) {
            callback.emitGraph(obj.graph, obj.target);
          }
          break;
        case 'success':
          onJobStopped(job);
          if (callback.success !== undefined) {
            callback.success(obj.returnValue);
          }
          break;
      }
    };

    job.stopWatch = new Stopwatch();
    job.stopWatch.start();
    job.worker.postMessage(parameters);
    if (job.callback.start !== undefined) {
      job.callback.start(parameters);
    }
    return job;
  }

  function terminateJob(job) {
    job.worker.onmessage = function () {};
    job.worker.terminate();
    $log.info("Terminating job");
    if (job.callback.error !== undefined) {
      job.callback.error("Cancelled by user.");
    }
  }

  function runJobAsPromise(parameters) {
    var deferred = $q.defer();

    currentJob = startJob(parameters, {
      error: function (message) {
        deferred.reject(message);
      },
      success: function (returnValue) {
        deferred.resolve(returnValue);
      }
    });

    return deferred.promise;
  }

  return {
    runJob: function (parameters, callback) {
      if (callback !== undefined) {
        currentJob = startJob(parameters, callback);
      } else {
        return runJobAsPromise(parameters);
      }
    },
    terminateJob: function () {
      if (angular.isDefined(currentJob.worker)) {
        terminateJob(currentJob);
      }
    }
  };
});

