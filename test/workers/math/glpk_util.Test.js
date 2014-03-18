'use strict';

var DOVETAIL = "var x1 >= 0;\n"
    + "var x2 >= 0;\n"
    + "maximize z: 3*x1 + 2*x2;\n"
    + "subject to c11: x1 + x2 <= 9;\n"
    + "subject to c12: 3*x1 + x2 <= 18;\n"
    + "subject to c13: x1 <=  7;\n"
    + "subject to c14: x2 <=  6;\n"
    + "end;";

describe("GlpkUtil", function () {

  it('parses variable names', function () {
  });

  it('solves a GMPL model', function () {
    var lp = GlpkUtil.solveGmpl(DOVETAIL);

  });

  it('finds the constraints of the LO model', function () {
    var lp = GlpkUtil.solveGmpl(DOVETAIL);
    var constraints = GlpkUtil.getConstraints(lp);
    var expectedMatrix = [[-1, 0], [0, -1], [1, 1], [3, 1], [1, 0], [0, 1]];
    var expectedRhs = [0, 0, 9, 18, 7, 6];
    expect(constraints.matrix).toEqual(expectedMatrix);
    expect(constraints.rhs).toEqual(expectedRhs);
  });

});

