'use strict';

var MODEL1 = "var x1 >= 0;\n"
    + "var x2 >= 0;\n"
    + "maximize z: 3*x1 + 2*x2;\n"
    + "subject to c11: x1 + x2 <= 9;\n"
    + "subject to c12: 3*x1 + x2 <= 18;\n"
    + "subject to c13: x1 <=  7;\n"
    + "subject to c14: x2 <=  6;\n"
    + "end;";

describe("solverService", function () {

  var solverService;
  var finished;
  var callback = Object();
  callback.log = function() {};
  callback.finished = function() {finished = true;};
  callback.emitTable = function() {};
  callback.emitGraph = function() {};

  beforeEach(function () {
    var $injector = angular.injector(['ng', 'lio-ng']);
    solverService = $injector.get('solverService');
    finished = false;
  });

  it('solves a model',
      function () {
        runs(function() {
          solverService.solve(MODEL1, callback);
        });

        waitsFor(function() {
          return finished;
        }, 2000);

        runs(function() {
          expect(finished).toEqual(true);
        })
      });
});

