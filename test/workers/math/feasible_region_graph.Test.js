'use strict';

var DOVETAIL = "var x1 >= 0;\n"
    + "var x2 >= 0;\n"
    + "maximize z: 3*x1 + 2*x2;\n"
    + "subject to c11: x1 + x2 <= 9;\n"
    + "subject to c12: 3*x1 + x2 <= 18;\n"
    + "subject to c13: x1 <=  7;\n"
    + "subject to c14: x2 <=  6;\n"
    + "end;";

var DOVETAIL_UNBOUNDED = "var x1;\n"
    + "var x2;\n"
    + "maximize z: 3*x1 + 2*x2;\n"
    + "subject to c11: x1 + x2 <= 9;\n"
    + "subject to c12: 3*x1 + x2 <= 18;\n"
    + "subject to c13: x1 <=  7;\n"
    + "subject to c14: x2 <=  6;\n"
    + "end;";

var LINE_SEGMENT  = "var x1;\nvar x2;\n"
    + "maximize z: x1 - x2;\n"
    + "subject to c1: x1 <= 1;\n"
    + "subject to c2: x1 >= 1;\n"
    + "end;";

var ONE_POINT = "var x1 >= 0;"
    + "var x2;\n"
    + "maximize z: x1 - x2;\n"
    + "subject to c1:   x1 <= 1;\n"
    + "subject to c2:   x1 >= 1;\n"
    + "subject to c3:   x2 <= 1;\n"
    + "subject to c4:   x2 >= 1;\n"
    + "end;";

var VERTICAL_LINE = "var x1;\n"
    + "var x2;\n"
    + "maximize z: x1 - x2;\n"
    + "subject to c1:   x1 <= 1;\n"
    + "subject to c2:   x1 >= 1;\n"
    + "end;";

var HORIZONTAL_LINE = "var x1;\n"
    + "var x2;\n"
    + "maximize z: x1 - x2;\n"
    + "subject to c1:   x2 <= 1;\n"
    + "subject to c2:   x2 >= 1;\n"
    + "end;";

describe("FeasibleRegionGraph", function () {

  it('creates a feasible region graph', function () {
    var lp = GlpkUtil.solveGmpl(DOVETAIL).lp;
    var graph = FeasibleRegionGraph.create(lp);
  });

  it('creates an unbounded feasible region graph', function () {
    var lp = GlpkUtil.solveGmpl(DOVETAIL_UNBOUNDED).lp;
    var graph = FeasibleRegionGraph.create(lp);
  });

  it('creates an line segment feasible region graph', function () {
    var lp = GlpkUtil.solveGmpl(LINE_SEGMENT).lp;
    var graph = FeasibleRegionGraph.create(lp);
  });

  it('creates a single point feasible region graph', function () {
    var lp = GlpkUtil.solveGmpl(ONE_POINT).lp;
    var graph = FeasibleRegionGraph.create(lp);
  });

  it('creates a feasible region graph that is a vertical line', function () {
    var lp = GlpkUtil.solveGmpl(VERTICAL_LINE).lp;
    var graph = FeasibleRegionGraph.create(lp);
  });

  it('creates a feasible region graph that is a horizontal line', function () {
    var lp = GlpkUtil.solveGmpl(HORIZONTAL_LINE);
    var graph = FeasibleRegionGraph.create(lp);
    console.log(graph);
  });
});

