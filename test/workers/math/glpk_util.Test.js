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

  it('should correctly parse variable names', function () {
  });

  it('should correctly solve a GMPL model', function () {
    var lp = GlpkUtil.solveGmpl(DOVETAIL);

  });

});

