/**
 * Solver service
 */
// TODO: Write unit tests
app.service('solverService', function () {
  "use strict";
  var currentJob = {};

  return {
    solve: function (code, callback) {
      var stopWatch = new Stopwatch();
      var worker = new Worker("/src/workers/solver.js");

      worker.onmessage = function (e) {
        var obj = e.data;
        switch (obj.action) {
          case 'log':
            callback.log(obj.message);
            break;
          case 'error':
            currentJob = {};
            callback.error(obj.message);
            break;
          case 'emit-table':
            callback.emitTable(obj.table);
            break;
          case 'emit-graph':
            callback.emitGraph(obj.graph);
            break;
          case 'success':
            currentJob = {};
            stop();
            if (console) {
              console.log("Solver finished in " + stopWatch.getElapsed() + " msec");
            }
            callback.success(obj.status);
            break;
        }
      };

      stopWatch.start();
      currentJob = {worker: worker, callback: callback};
      worker.postMessage({action: 'solve', code: code});
    },
    terminateWorker: function() {
      currentJob.onmessage = function() {};
      console.log("Terminating job");
      currentJob.worker.terminate();
      currentJob.callback.error("Optimization cancelled by user.");
    }
  };
});

