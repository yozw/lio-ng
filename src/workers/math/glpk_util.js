"use strict";

var GlpkUtil = Object();

GlpkUtil.MODEL_NAME = "editor.mod";
GlpkUtil.ERROR_MSG_RE = new RegExp(GlpkUtil.MODEL_NAME.replace(".", "\\.") + ":([0-9]+):(.*)");

GlpkUtil._logOutputFunction = function(message) {};
GlpkUtil._logInfoFunction = function(message) {};
GlpkUtil._logErrorFunction = function(message, data) {
  GlpkUtil._logInfoFunction(message);
};

GlpkUtil.setOutputLogFunction = function(logOutputFn) {
  GlpkUtil._logOutputFunction = logOutputFn;
};

GlpkUtil.setInfoLogFunction = function(logInfoFn) {
  GlpkUtil._logInfoFunction = logInfoFn;
};

GlpkUtil.setErrorLogFunction = function(logErrorFn) {
  GlpkUtil._logErrorFunction = logErrorFn;
};

GlpkUtil.installLogFunction = function() {
  glp_set_print_func(GlpkUtil.info);
};

GlpkUtil.output = function(message) {
  GlpkUtil._logOutputFunction(message);
};

GlpkUtil.info = function(message) {
  GlpkUtil._logInfoFunction(message);
};

GlpkUtil.error = function(error) {
  var message;

  if (error.hasOwnProperty('message')) {
    message = error.message;
  } else {
    message = error;
  }

  if (error.hasOwnProperty('line')) {
    var match = GlpkUtil.ERROR_MSG_RE.exec(error.message);
    if (match !== undefined && match.length >= 3) {
      message = "Error in line " + match[1] + ": " + match[2].trim();
    }
  }
  GlpkUtil._logErrorFunction(message, error);
};

GlpkUtil.parseVariableName = function (name) {

};

/**
 * Returns the objective vector of a GLPK lp model.
 * @param lp
 * @returns {Array}
 */
// TODO: Write unit test
GlpkUtil.getObjectiveVector = function (lp) {
  "use strict";
  var vector = [];
  for (var j = 1; j <= glp_get_num_cols(lp); j++) {
    vector.push(glp_get_obj_coef(lp, j));
  }
  return vector;
};

/**
 * Returns a row of the technology matrix of a GLPK lp model.
 * @param lp
 * @param i
 * @returns {*}
 */
// TODO: Write unit test
GlpkUtil.getRow = function (lp, i) {
  "use strict";
  var m = glp_get_num_cols(lp);
  var row = MathUtil.zeroes(m);
  var ind = [];
  var val = [];
  var length = glp_get_mat_row(lp, i, ind, val);
  for (var k = 1; k <= length; k++) {
    row[ind[k] - 1] = val[k];
  }
  return row;
};

/**
 * Solves a GNU MathProg model and returns a Glpk lp object.
 * @param code
 * @returns {Object} lp-model
 */
GlpkUtil.solveGmpl = function (code) {
  "use strict";
  var workspace = glp_mpl_alloc_wksp();
  var lp = glp_create_prob();

  GlpkUtil.installLogFunction();

  try {
    glp_mpl_read_model_from_string(workspace, GlpkUtil.MODEL_NAME, code);
    glp_mpl_generate(workspace, GlpkUtil.MODEL_NAME, GlpkUtil.output, null);
    glp_mpl_build_prob(workspace, lp);
    glp_scale_prob(lp, GLP_SF_AUTO);

    var status;
    if (glp_get_num_int(lp) == 0) {
      GlpkUtil.info("Solving the model using the simplex optimizer");
      var smcp = new SMCP({presolve: GLP_ON});
      status = glp_simplex(lp, smcp);
    } else {
      GlpkUtil.info("The model has integer variables: solving the model using the mixed-integer optimizer");
      var iocp = new IOCP({presolve: GLP_ON});
      status = glp_intopt(lp, iocp);
    }
    var objValue = glp_get_obj_val(lp);
    mpl_postsolve(workspace);
    return {lp: lp, status: status, objectiveValue: objValue};
  } catch (error) {
    GlpkUtil.error(error);
    return null;
  }
};

/**
 * Constructs a primal solution table for the specified lp object.
 * @param lp
 * @returns {Table}
 */
// TODO: Write unit test
GlpkUtil.getPrimalSolutionTable = function (lp) {
  "use strict";
  var table = new Table();

  var varNameColumn = table.addColumn("Variable");
  var valueColumn = table.addColumn("Value");

  for (var i = 1; i <= glp_get_num_cols(lp); i++) {
    var row = table.addRow();
    row.setValue(varNameColumn, glp_get_col_name(lp, i));
    row.setValue(valueColumn, glp_get_col_prim(lp, i));
  }

  return table;
};

/**
 * Gets all constraints for the specified Glpk lp object
 * @param lp
 * @returns {{matrix: Array, rhs: Array}}
 */
GlpkUtil.getConstraints = function (lp) {
  "use strict";
  var lb, ub, row;

  var matrix = [];
  var rhs = [];
  var n = glp_get_num_rows(lp);
  var m = glp_get_num_cols(lp);

  // Get variable bounds
  for (var i = 1; i <= m; i++) {
    lb = glp_get_col_lb(lp, i);
    ub = glp_get_col_ub(lp, i);
    if (MathUtil.isFinite(lb)) {
      row = MathUtil.zeroes(m);
      row[i - 1] = -1;
      matrix.push(row);
      rhs.push(-lb);
    }
    if (ub != Number.MAX_VALUE) {
      row = MathUtil.zeroes(m);
      row[i - 1] = 1;
      matrix.push(row);
      rhs.push(ub);
    }
  }

  // Get technology constraints
  for (var j = 1; j <= n; j++) {
    row = GlpkUtil.getRow(lp, j);
    lb = glp_get_row_lb(lp, j);
    ub = glp_get_row_ub(lp, j);
    if (lb != -Number.MAX_VALUE) {
      matrix.push(MathUtil.multiplyVector(row, -1));
      rhs.push(-lb);
    }
    if (ub != Number.MAX_VALUE) {
      matrix.push(row);
      rhs.push(ub);
    }
  }
  return {matrix: matrix, rhs: rhs};
};

GlpkUtil.getModelStatus = function(lp) {
  return glp_get_status(lp);
};