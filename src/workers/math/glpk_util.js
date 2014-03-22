"use strict";

var GlpkUtil = Object();

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
}

/**
 * Returns a row of the technology matrix of a GLPK lp model.
 * @param lp
 * @param i
 * @returns {*}
 */
// TODO: Write unit test
GlpkUtil.getRow = function (lp, i) {
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
  var workspace = glp_mpl_alloc_wksp();
  var lp = glp_create_prob();

  glp_mpl_read_model_from_string(workspace, 'model', code);
  glp_mpl_generate(workspace, null, null, null);
  glp_mpl_build_prob(workspace, lp);
  glp_scale_prob(lp, GLP_SF_AUTO);

  var options = {presolve: GLP_ON};

  var smcp = new SMCP(options);
  glp_simplex(lp, smcp);

  return lp;
};

/**
 * Constructs a primal solution table for the specified lp object.
 * @param lp
 * @returns {Table}
 */
// TODO: Write unit test
GlpkUtil.getPrimalSolutionTable = function (lp) {
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
    row = GlpkUtil.getRow(lp, j)
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

