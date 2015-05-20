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

  function getMessageHandler(job, callback) {
    return function (e) {
      var obj = e.data;
      switch (obj.action) {
        case 'log':
          if (callback.log) {
            callback.log(obj.message);
          }
          break;
        case 'error':
          onJobStopped(job);
          if (callback.error) {
            callback.error(obj.message);
          }
          break;
        case 'success':
          onJobStopped(job);
          if (callback.success) {
            callback.success(obj.returnValue);
          }
          break;
        case 'output':
          if (callback.output) {
            callback.output(obj.target, obj.type, obj.data);
          }
          break;
        default:
          console.log("Job sent message of unknown type " + obj.action);
      }
    };
  }

  function startJob(parameters, callback) {
    var job = {};
    job.parameters = parameters;
    job.callback = callback;
    job.worker = new Worker("/application/workers/worker.js");
    job.worker.onmessage = getMessageHandler(job, callback);
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
    if (job.callback.error) {
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
      if (callback) {
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
