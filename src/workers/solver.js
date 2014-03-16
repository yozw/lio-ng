"use strict";

importScripts('../../lib/glpk/glpk.js');
importScripts('../common/table.js');
importScripts('math/adaptive_function_estimation.js');

function solveGmplModel(code) {
  var workspace = glp_mpl_alloc_wksp();
  var lp = glp_create_prob();

  glp_mpl_read_model_from_string(workspace, 'model', code);
  glp_mpl_generate(workspace, null, null, null);
  glp_mpl_build_prob(workspace, lp);
  glp_scale_prob(lp, GLP_SF_AUTO);

  var options = {presolve: GLP_ON};

  var smcp = new SMCP(options);
  glp_simplex(lp, smcp);

  var table = new Table();

  var varNameColumn = table.addColumn("Variable");
  var valueColumn = table.addColumn("Value");

  for (var i = 1; i <= glp_get_num_cols(lp); i++) {
    var row = table.addRow();
    row.setValue(varNameColumn, glp_get_col_name(lp, i));
    row.setValue(valueColumn, glp_get_col_prim(lp, i));
  }

  self.postMessage({action: 'emit-table', table: table.serialize()});
  self.postMessage({action: 'done', result: {}, objective: {}});

  return lp;
}

function actionSolve(e) {
  var code = e.data.code;
  solveGmplModel(code);
}

function getAction(e) {
  var action = e.data.action;
  if (typeof action == 'string' || action instanceof String) {
    return actions[action];
  } else {
    return undefined;
  }
}

var actions = {};
actions['solve'] = actionSolve;

self.addEventListener('message', function (e) {
  "use strict";

  function log(value) {
    self.postMessage({action: 'log', message: value});
  }

  glp_set_print_func(log);

  var actionFn = getAction(e);

  if (actionFn == undefined) {
    console.warn('Unknown action: ', JSON.stringify(e));
  }

  try {
    actionFn(e);
  } catch (err) {
    log(err.message);
  }
}, false);

/*

 var i;

 if (obj.mip) {
 glp_intopt(lp);
 objective = glp_mip_obj_val(lp);
 for (i = 1; i <= glp_get_num_cols(lp); i++) {
 result[glp_get_col_name(lp, i)] = glp_mip_col_val(lp, i);
 }
 } else {
 objective = glp_get_obj_val(lp);
 for (i = 1; i <= glp_get_num_cols(lp); i++) {
 result[glp_get_col_name(lp, i)] = glp_get_col_prim(lp, i);
 }
 }

 lp = null;

 */