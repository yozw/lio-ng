'use strict';

var DOVETAIL = "var x1 >= 0;\n"
    + "var x2 >= 0;\n"
    + "maximize z: 3*x1 + 2*x2;\n"
    + "subject to c11: x1 + x2 <= 9;\n"
    + "subject to c12: 3*x1 + x2 <= 18;\n"
    + "subject to c13: x1 <=  7;\n"
    + "subject to c14: x2 <=  6;\n"
    + "end;";

var DOVETAIL_MIP = "var x1 >= 0 integer;\n"
    + "var x2 >= 0 integer;\n"
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
    var lp = GlpkUtil.solveGmpl(DOVETAIL).lp;
    // TODO: Expand unit test
  });

  it('finds the constraints of the LO model', function () {
    var lp = GlpkUtil.loadGmpl(DOVETAIL).lp;
    var constraints = GlpkUtil.getConstraints(lp);
    var expectedMatrix = [[-1, 0], [0, -1], [1, 1], [3, 1], [1, 0], [0, 1]];
    var expectedRhs = [0, 0, 9, 18, 7, 6];
    expect(constraints.matrix).toEqual(expectedMatrix);
    expect(constraints.rhs).toEqual(expectedRhs);
  });

  it('isMip returns true if and only if the model has integer variables', function () {
    var lp = GlpkUtil.loadGmpl(DOVETAIL).lp;
    expect(GlpkUtil.isMip(lp)).toEqual(false);

    lp = GlpkUtil.loadGmpl(DOVETAIL_MIP).lp;
    expect(GlpkUtil.isMip(lp)).toEqual(true);
  });

  it('getObjectiveVector returns the objective vector', function () {
    var lp = GlpkUtil.loadGmpl(DOVETAIL).lp;
    expect(GlpkUtil.getObjectiveVector(lp)).toEqual([3, 2]);

    lp = GlpkUtil.loadGmpl(DOVETAIL.replace("maximize", "minimize")).lp;
    expect(GlpkUtil.getObjectiveVector(lp)).toEqual([3, 2]);

    lp = GlpkUtil.loadGmpl(DOVETAIL_MIP).lp;
    expect(GlpkUtil.getObjectiveVector(lp)).toEqual([3, 2]);

    lp = GlpkUtil.loadGmpl(DOVETAIL_MIP.replace("maximize", "minimize")).lp;
    expect(GlpkUtil.getObjectiveVector(lp)).toEqual([3, 2]);
  });

  it('getMaximizingObjectiveVector returns the objective vector', function () {
    var lp = GlpkUtil.loadGmpl(DOVETAIL).lp;
    expect(GlpkUtil.getMaximizingObjectiveVector(lp)).toEqual([3, 2]);

    lp = GlpkUtil.loadGmpl(DOVETAIL.replace("maximize", "minimize")).lp;
    expect(GlpkUtil.getMaximizingObjectiveVector(lp)).toEqual([-3, -2]);

    lp = GlpkUtil.loadGmpl(DOVETAIL_MIP).lp;
    expect(GlpkUtil.getMaximizingObjectiveVector(lp)).toEqual([3, 2]);

    lp = GlpkUtil.loadGmpl(DOVETAIL_MIP.replace("maximize", "minimize")).lp;
    expect(GlpkUtil.getMaximizingObjectiveVector(lp)).toEqual([-3, -2]);
  });

  it('getPrimalSolutionTable generates a valid table', function () {
    var lp = GlpkUtil.solveGmpl(DOVETAIL).lp;
    var table = GlpkUtil.getPrimalSolutionTable(lp);
    var nameColumn = table.getColumnByName("Variable");
    var valueColumn = table.getColumnByName("Value");
    var statusColumn = table.getColumnByName("Status");

    expect(table.getColumns().length).toEqual(7);
    expect(table.getRows().length).toEqual(2);
    expect(table.getRow(0).getValue(nameColumn)).toEqual("x1");
    expect(table.getRow(0).getValue(valueColumn)).toEqual(4.5);
    expect(table.getRow(0).getValue(statusColumn)).toEqual("Basic");
    expect(table.getRow(1).getValue(nameColumn)).toEqual("x2");
    expect(table.getRow(1).getValue(valueColumn)).toEqual(4.5);
    expect(table.getRow(1).getValue(statusColumn)).toEqual("Basic");
    expect(table.options.showHeader).toEqual(true);
  });

  it('getPrimalSolutionTable generates a valid table for MIP', function () {
    var lp = GlpkUtil.solveGmpl(DOVETAIL_MIP).lp;
    var table = GlpkUtil.getPrimalSolutionTable(lp);
    var nameColumn = table.getColumnByName("Variable");
    var valueColumn = table.getColumnByName("Value");

    expect(table.getColumns().length).toEqual(4);
    expect(table.getRows().length).toEqual(2);
    expect(table.getRow(0).getValue(nameColumn)).toEqual("x1");
    expect(table.getRow(0).getValue(valueColumn)).toEqual(4);
    expect(table.getRow(1).getValue(nameColumn)).toEqual("x2");
    expect(table.getRow(1).getValue(valueColumn)).toEqual(5);
    expect(table.options.showHeader).toEqual(true);
  });

  it('getConstraintsTable generates a valid table', function () {
    var lp = GlpkUtil.solveGmpl(DOVETAIL).lp;
    var table = GlpkUtil.getConstraintsTable(lp);
    var nameColumn = table.getColumnByName("Name");

    expect(table.getColumns().length).toEqual(7);
    expect(table.getRows().length).toEqual(4);
    expect(table.getRow(0).getValue(nameColumn)).toEqual("c11");
    expect(table.getRow(1).getValue(nameColumn)).toEqual("c12");
    expect(table.getRow(2).getValue(nameColumn)).toEqual("c13");
    expect(table.getRow(3).getValue(nameColumn)).toEqual("c14");
    expect(table.options.showHeader).toEqual(true);
  });

  it('getConstraintsTable generates a valid table for MIP', function () {
    var lp = GlpkUtil.solveGmpl(DOVETAIL_MIP).lp;
    var table = GlpkUtil.getConstraintsTable(lp);
    var nameColumn = table.getColumnByName("Name");

    expect(table.getColumns().length).toEqual(4);
    expect(table.getRows().length).toEqual(4);
    expect(table.getRow(0).getValue(nameColumn)).toEqual("c11");
    expect(table.getRow(1).getValue(nameColumn)).toEqual("c12");
    expect(table.getRow(2).getValue(nameColumn)).toEqual("c13");
    expect(table.getRow(3).getValue(nameColumn)).toEqual("c14");
    expect(table.options.showHeader).toEqual(true);
  });
});

