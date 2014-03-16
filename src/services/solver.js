/**
 * Solver service
 */
app.service('solverService', function (model) {
  "use strict";
  var worker;

  return {
    solve: function (code, callback) {
      var stopWatch = new Stopwatch();

      console.log("Solving model");

      worker = new Worker("workers/solver.js");
      worker.onmessage = function (e) {
        var obj = e.data;
        switch (obj.action) {
          case 'log':
            callback.log(obj.message);
            break;
          case 'emit-table':
            callback.emitTable(obj.table);
            break;
          case 'done':
            stop();
            console.log("Solver finished in " + stopWatch.getElapsed() + " msec");
            callback.finished("Finished");
            break;
        }
      };

      stopWatch.start();
      worker.postMessage({action: 'solve', code: code});
    }
  };
});

