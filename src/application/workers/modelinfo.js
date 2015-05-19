/**
 * Async action that loads the given model and returns some information about the model, such as the numbers
 * of variables of different types, and a list of all its variables.
 *
 * @param e
 * @returns {{}}
 */
function actionModelInfo(e) {
  var code = e.data.code;
  var result = GlpkUtil.loadGmpl(code);
  if (!result) {
    throw new Error("Model could not be loaded");
  }

  var lp = result.lp;

  var info = {};
  info.numBinary = glp_get_num_bin(lp);
  info.numInteger = glp_get_num_int(lp) - info.numBinary;
  info.numContinous = glp_get_num_cols(lp) - info.numInteger - info.numBinary;
  info.numVariables = info.numContinous + info.numInteger + info.numBinary;

  info.variables = [];
  for (var c = 1; c <= glp_get_num_cols(lp); c++) {
    var kind = glp_get_col_kind(lp, c);
    info.variables.push({
      column: c,
      name: glp_get_col_name(lp, c),
      kind: GlpkUtil.GLP_COL_KIND[kind]
    });
  }

  return info;
}
