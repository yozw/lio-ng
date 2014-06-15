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

  it('correctly logs info', function() {
    var msg = "";
    GlpkUtil.setInfoLogFunction(function(message) {
      msg = message;
    });
    GlpkUtil.info("HELLO");
    expect(msg).toEqual("HELLO");
  });

  it('correctly logs errors', function() {
    var msg = "";
    GlpkUtil.setErrorLogFunction(function(message, data) {
      msg = message;
    });
    GlpkUtil.error("HELLO");
    expect(msg).toEqual("HELLO");
  });

  it('correctly logs GLPK parsing errors', function() {
    var msg = "";
    var msgData = {};
    GlpkUtil.setErrorLogFunction(function(message, data) {
      msg = message;
      msgData = data;
    });

    try {
      var workspace = glp_mpl_alloc_wksp();
      glp_mpl_read_model_from_string(workspace, GlpkUtil.MODEL_NAME, "var x1;\nvar x[2];");
    } catch (error) {
      GlpkUtil.error(error);
    }

    expect(msg).toEqual("Error in line 2: syntax error in variable statement");
  });


  it('parses variable names', function () {
  });

  it('solves a GMPL model', function () {
    var lp = GlpkUtil.solveGmpl(DOVETAIL);
    // TODO: Expand unit test
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

