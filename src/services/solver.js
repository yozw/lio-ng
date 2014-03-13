/**
 * Solver service
 */
app.service('solverService', function (messageService, model) {
  "use strict"
  var worker;

  return {
    solve: function (code, callback) {
      var stopWatch = new Stopwatch();

      messageService.set("Solving model");
      console.log("Solving model");

      worker = new Worker("workers/solver.js");
      worker.onmessage = function (e) {
        var obj = e.data;
        switch (obj.action) {
          case 'log':
            callback.log(obj.message);
            break;
          case 'done':
            stop();
            messageService.set("Done");
            console.log("Solver finished in " + stopWatch.getElapsed() + " msec");
            callback.log("Done: " + JSON.stringify(obj.result));
            break;
        }
      };

      stopWatch.start();
      worker.postMessage({action: 'solve', code: code, mip: false});
    }
  };
});


