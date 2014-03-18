"use strict";

var GlpkUtil = Object();

GlpkUtil.parseVariableName = function(name) {

};

/**
 * Returns the objective vector of a GLPK lp model.
 * @param lp
 * @returns {Array}
 */
GlpkUtil.getObjectiveVector = function(lp) {
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
GlpkUtil.getRow = function(lp, i) {
  var m = glp_get_num_cols(lp);
  var row = MathUtil.zeroes(m);
  var ind = [];
  var val = [];
  var length = glp_get_mat_row(lp, i, ind, val);
  for (var k = 1; k <= length; k++) {
    row[ind[k] - 1] = val[k];
  }
  return row;
}

