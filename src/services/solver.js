/**
 * Solver service
 */
app.service('solverService', function (messageService, model) {
  var worker;

  return {
    solve: function (model, logCallback) {
      messageService.set("Solving model");
      console.log("Solving model");
      console.log(model.code);

      worker = new Worker("workers/solver.js");
      worker.onmessage = function (e) {
        var obj = e.data;
        switch (obj.action) {
          case 'log':
            logCallback(obj.message);
            break;
          case 'done':
            stop();
            messageService.set("Done");
            logCallback("Done: " + JSON.stringify(obj.result));
            break;
        }
      };

      worker.postMessage({action: 'load', data: model.code, mip: false});
    }
  };
});


