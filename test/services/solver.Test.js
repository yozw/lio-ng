'use strict';

var BOUNDED_MODEL = "var x1 >= 0;\n"
    + "var x2 >= 0;\n"
    + "maximize z: 3*x1 + 2*x2;\n"
    + "subject to c11: x1 + x2 <= 9;\n"
    + "subject to c12: 3*x1 + x2 <= 18;\n"
    + "subject to c13: x1 <=  7;\n"
    + "subject to c14: x2 <=  6;\n"
    + "end;";

var UNBOUNDED_MODEL = "var x1 >= 0;\n"
    + "var x2 >= 0;\n"
    + "maximize z: 3*x1 + 2*x2;\n"
    + "subject to c11: x1 + x2 >= 9;\n"
    + "subject to c12: 3*x1 + x2 >= 18;\n"
    + "subject to c13: x1 >=  7;\n"
    + "subject to c14: x2 >=  6;\n"
    + "end;";

var INFEASIBLE_MODEL = "var x1 >= 0;\n"
    + "var x2 >= 0;\n"
    + "maximize z: 3*x1 + 2*x2;\n"
    + "subject to c11: x1 + x2 <= 9;\n"
    + "subject to c12: x1 + x2 >= 10;\n"
    + "end;";

var PRINTF_MODEL = "var x >= 1; printf 'hello\\n'; minimize z: x; solve; printf 'x=%d\\n', x; end;\n";

describe("solverService", function () {

  var solverService;
  var finished;
  var started;
  var tables;
  var graphs;
  var errors;
  var output;
  var logMessages;
  var successMessages;
  var callback = Object();
  callback.start = function() { started = true; };
  callback.output = function(message) { output.push(message); };
  callback.log = function(message) { logMessages.push(message); };
  callback.success = function(message) { finished = true; successMessages.push(message)};
  callback.emitTable = function(table) { tables.push(table); };
  callback.emitGraph = function(graph) { graphs.push(graph); };
  callback.error = function(error) { finished = true; errors.push(error); };

  beforeEach(function () {
    var $injector = angular.injector(['ng', 'lio-ng']);
    solverService = $injector.get('solverService');
    finished = false;
    started = false;
    tables = [];
    graphs = [];
    errors = [];
    output = [];
    logMessages = [];
    successMessages = [];
  });

  it('solves a linear optimization model with an optimal solution',
      function () {
        runs(function() {
          solverService.solve(BOUNDED_MODEL, callback);
        });

        waitsFor(function() {
          return finished;
        }, 2000);

        runs(function() {
          expect(finished).toEqual(true);
          expect(errors).toEqual([]);
          expect(successMessages).toEqual(["An optimal solution was found."]);
        })
      });

  it('solves a linear optimization model with an unbounded solution',
      function () {
        runs(function() {
          solverService.solve(UNBOUNDED_MODEL, callback);
        });

        waitsFor(function() {
          return finished;
        }, 2000);

        runs(function() {
          expect(finished).toEqual(true);
          expect(errors).toEqual([]);
          expect(successMessages).toEqual(["The model is unbounded."]);
        })
      });

  it('correctly handles an infeasible linear optimization model',
      function () {
        runs(function() {
          solverService.solve(INFEASIBLE_MODEL, callback);
        });

        waitsFor(function() {
          return finished;
        }, 2000);

        runs(function() {
          expect(finished).toEqual(true);
          expect(errors).toEqual([]);
          expect(successMessages).toEqual(["The model is infeasible."]);
        })
      });

  it('correctly handles a model with syntax errors',
      function () {
        runs(function() {
          solverService.solve("maximize", callback);
        });

        waitsFor(function() {
          return finished;
        }, 2000);

        runs(function() {
          expect(finished).toEqual(true);
          expect(errors).toEqual(["Error in line 1: symbolic name missing where expected"]);
          expect(successMessages).toEqual([]);
        })
      });

  it('correctly handles an empty model',
      function () {
        runs(function() {
          solverService.solve("", callback);
        });

        waitsFor(function() {
          return finished;
        }, 2000);

        runs(function() {
          expect(finished).toEqual(true);
          expect(errors).toEqual(["Error in line 0: empty model section not allowed"]);
          expect(successMessages).toEqual([]);
        })
      });

  it('logs printf statements',
      function () {
        runs(function() {
          solverService.solve(PRINTF_MODEL, callback);
        });

        waitsFor(function() {
          return finished;
        }, 2000);

        runs(function() {
          expect(finished).toEqual(true);
          expect(output).toEqual(["hello", "x=0"]);
        })
      });
});

