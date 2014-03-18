"use strict";

var GlpkUtil = Object();

GlpkUtil.parseVariableName = function (name) {

};

/**
 * Returns the objective vector of a GLPK lp model.
 * @param lp
 * @returns {Array}
 */
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
