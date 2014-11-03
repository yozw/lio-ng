/**
 * Solver service
 */
app.service('solverService', function (jobRunnerService) {
  "use strict";

  var defaultCallback = {};

  function runJob(parameters, callback) {
    if (angular.isUndefined(callback)) {
      callback = defaultCallback;
    }
    jobRunnerService.runJob(parameters, callback);
  }

  return {
    setCallback: function (callback) {
      defaultCallback  = callback;
    },
    solve: function (code, callback) {
      runJob({action: 'solve', code: code}, callback);
    },
    performSensitivityAnalysis: function (code, minValue, maxValue, callback) {
      var parameters = {
        action: 'sensitivity',
        code: code,
        minValue: minValue,
        maxValue: maxValue
      };
      runJob(parameters, callback);
    },
    terminateWorker: function() {
      jobRunnerService.terminateJob();
    }
  };
});

