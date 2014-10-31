/**
 * Solver service
 */
// TODO: Write unit tests
app.service('solverService', function () {
  "use strict";
  var worker;

  return {
    solve: function (code, callback) {
      var stopWatch = new Stopwatch();

      worker = new Worker("/src/workers/solver.js");
      worker.onmessage = function (e) {
        var obj = e.data;
        switch (obj.action) {
          case 'log':
            callback.log(obj.message);
            break;
          case 'error':
            callback.error(obj.message);
            break;
          case 'emit-table':
            callback.emitTable(obj.table);
            break;
          case 'emit-graph':
            callback.emitGraph(obj.graph);
            break;
          case 'success':
            stop();
            if (console) {
              console.log("Solver finished in " + stopWatch.getElapsed() + " msec");
            }
            callback.success(obj.status);
            break;
        }
      };

      stopWatch.start();
      worker.postMessage({action: 'solve', code: code});
    }
  };
});

