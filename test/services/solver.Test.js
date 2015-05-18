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

var BOUNDED_MODEL_WITH_PRINT = "var x1 >= 0;\n"
    + "var x2 >= 0;\n"
    + "maximize z: 3*x1 + 2*x2;\n"
    + "subject to c11: x1 + x2 <= 9;\n"
    + "subject to c12: 3*x1 + x2 <= 18;\n"
    + "subject to c13: x1 <=  7;\n"
    + "subject to c14: x2 <=  6;\n"
    + "solve;\n"
    + "printf 'z=%0.2f\\n', z;\n"
    + "printf 'x1=%0.2f\\n', x1;\n"
    + "printf 'x2=%0.2f\\n', x2;\n"
    + "end;";

var TRIVIAL_MODEL = "var x >= 1; printf 'hello\\n'; minimize z: x; solve; printf 'x=%d\\n', x; end;\n";

var BOUNDED_IP = "var x1 >= 0, integer;\n"
    + "var x2 >= 0, integer;\n"
    + "maximize z: 3*x1 + 2*x2;\n"
    + "subject to c11: x1 + x2 <= 9;\n"
    + "subject to c12: 3*x1 + x2 <= 18;\n"
    + "subject to c13: x1 <=  7;\n"
    + "subject to c14: x2 <=  6;\n"
    + "end;";

var UNBOUNDED_IP = "var x1 >= 0, integer;\n"
    + "var x2 >= 0, integer;\n"
    + "maximize z: 3*x1 + 2*x2;\n"
    + "subject to c11: x1 + x2 >= 9;\n"
    + "subject to c12: 3*x1 + x2 >= 18;\n"
    + "subject to c13: x1 >=  7;\n"
    + "subject to c14: x2 >=  6;\n"
    + "end;";

// This model is infeasible, and this fact is established in the preprocessing phase
var INFEASIBLE_IP = "var x1 >= 0, integer;\n"
    + "var x2 >= 0, integer;\n"
    + "maximize z: 3*x1 + 2*x2;\n"
    + "subject to c11: x1 + x2 <= 9;\n"
    + "subject to c12: x1 + x2 >= 10;\n"
    + "end;";

// This model is infeasible, but this fact is not established in the preprocessing phase
var INFEASIBLE_IP_2 = "param N; var x{1..N, 1..N} binary;\n"
    + "var vl{1..N} binary; var vr{1..N} binary;\n"
    + "subject to tower{i in 1..N}: sum{k in 1..N} x[i, k] = 1;\n"
    + "subject to heights{k in 1..N}: sum{i in 1..N} x[i, k] = 1;\n"
    + "subject to vl1{i in 1..N, k in 1..N}:\n"
    + "vl[i] >= x[i, k] - sum{a in 1..(i-1), b in k..N} x[a, b];\n"
    + "subject to vl2{i in 1..N, k in 1..N}:\n"
    + "vl[i] <= 2 - x[i, k] - sum{a in 1..(i-1), b in k..N} x[a, b] / 25;\n"
    + "subject to vr1{i in 1..N, k in 1..N}:\n"
    + "vr[i] >= x[i, k] - sum{a in (i+1)..N, b in k..N} x[a, b];\n"
    + "subject to vr2{i in 1..N, k in 1..N}:\n"
    + "vr[i] <= 2 - x[i, k] - sum{a in (i+1)..N, b in k..N} x[a, b] / 25;\n"
    + "subject to left: sum{i in 1..N} vl[i] = N;\n"
    + "subject to right: sum{i in 1..N} vr[i] = N;\n"
    + "data; param N := 2; end;";

var BOUNDED_IP_WITH_PRINT = "var x1 >= 0, integer;\n"
    + "var x2 >= 0, integer;\n"
    + "maximize z: 3*x1 + 2*x2;\n"
    + "subject to c11: x1 + x2 <= 9;\n"
    + "subject to c12: 3*x1 + x2 <= 18;\n"
    + "subject to c13: x1 <=  7;\n"
    + "subject to c14: x2 <=  6;\n"
    + "solve;\n"
    + "printf 'z=%0.2f\\n', z;\n"
    + "printf 'x1=%0.2f\\n', x1;\n"
    + "printf 'x2=%0.2f\\n', x2;\n"
    + "end;";

var TRIVIAL_IP = "var x >= 2, integer; printf 'hello\\n'; minimize z: x; solve; printf 'x=%0.2f\\n', x; end;\n";

var INVALID_BOUNDS = "var x >= 1.5, integer; printf 'hello\\n'; minimize z: x; solve; printf 'x=%0.2f\\n', x; end;\n";

var ERROR_MODEL = "param N; var x{1..N} binary; subject to total: sum{i in 1..N} x[i] = 1;";

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
          expect(output).toEqual([]);
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
          expect(successMessages).toEqual(["The model is unbounded"]);
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
          expect(successMessages).toEqual(["The model is infeasible"]);
        })
      });

  it('solves an integer optimization model with an optimal solution',
      function () {
        runs(function() {
          solverService.solve(BOUNDED_IP, callback);
        });

        waitsFor(function() {
          return finished;
        }, 2000);

        runs(function() {
          expect(finished).toEqual(true);
          expect(errors).toEqual([]);
          expect(successMessages).toEqual(["An optimal solution was found."]);
          expect(output).toEqual([]);
        })
      });

  it('solves an integer optimization model with an unbounded solution',
      function () {
        runs(function() {
          solverService.solve(UNBOUNDED_IP, callback);
        });

        waitsFor(function() {
          return finished;
        }, 2000);

        runs(function() {
          expect(finished).toEqual(true);
          expect(errors).toEqual([]);
          expect(successMessages).toEqual(["The model is unbounded"]);
        })
      });

  it('correctly handles an infeasible integer optimization model (preprocessor)',
      function () {
        runs(function() {
          solverService.solve(INFEASIBLE_IP, callback);
        });

        waitsFor(function() {
          return finished;
        }, 2000);

        runs(function() {
          expect(finished).toEqual(true);
          expect(errors).toEqual([]);
          expect(successMessages).toEqual(["The model is infeasible"]);
        })
      });

  it('correctly handles an infeasible integer optimization model (non-preprocessor)',
      function () {
        runs(function() {
          solverService.solve(INFEASIBLE_IP_2, callback);
        });

        waitsFor(function() {
          return finished;
        }, 2000);

        runs(function() {
          expect(finished).toEqual(true);
          expect(errors).toEqual([]);
          expect(successMessages).toEqual(["The model is infeasible"]);
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

  it('logs printf statements of a nontrivial linear optimization model',
      function () {
        runs(function() {
          solverService.solve(BOUNDED_MODEL_WITH_PRINT, callback);
        });

        waitsFor(function() {
          return finished;
        }, 2000);

        runs(function() {
          expect(finished).toEqual(true);
          expect(errors).toEqual([]);
          expect(output).toEqual(["z=22.50", "x1=4.50", "x2=4.50"]);
        })
      });

  it('logs printf statements of a trivial linear optimization model',
      function () {
        runs(function() {
          solverService.solve(TRIVIAL_MODEL, callback);
        });

        waitsFor(function() {
          return finished;
        }, 2000);

        runs(function() {
          expect(finished).toEqual(true);
          expect(errors).toEqual([]);
          expect(output).toEqual(["hello", "x=1"]);
        })
      });

  it('logs printf statements of a nontrivial integer optimization model',
      function () {
        runs(function() {
          solverService.solve(BOUNDED_IP_WITH_PRINT, callback);
        });

        waitsFor(function() {
          return finished;
        }, 2000);

        runs(function() {
          expect(finished).toEqual(true);
          expect(errors).toEqual([]);
          expect(output).toEqual(["z=22.00", "x1=4.00", "x2=5.00"]);
        })
      });

  it('logs printf statements of a trivial integer optimization model',
      function () {
        runs(function() {
          solverService.solve(TRIVIAL_IP, callback);
        });

        waitsFor(function() {
          return finished;
        }, 2000);

        runs(function() {
          expect(finished).toEqual(true);
          expect(errors).toEqual([]);
          expect(output).toEqual(["hello", "x=2.00"]);
        })
      });

  it('reports an error on invalid bounds',
      function () {
        runs(function() {
          solverService.solve(INVALID_BOUNDS, callback);
        });

        waitsFor(function() {
          return finished;
        }, 2000);

        runs(function() {
          expect(finished).toEqual(true);
          expect(errors).toEqual(["The model contains one or more variables with invalid bounds."]);
          expect(output).toEqual(["hello"]);
        })
      });

  it('correctly handles a model with a parameter with no value',
      function () {
        runs(function() {
          solverService.solve(ERROR_MODEL, callback);
        });

        waitsFor(function() {
          return finished;
        }, 2000);

        runs(function() {
          expect(finished).toEqual(true);
          expect(errors).toEqual(["Error in line 1: no value for N"]);
          expect(successMessages).toEqual([]);
        })
      });
});

