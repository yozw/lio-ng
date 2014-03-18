"use strict";

importScripts('../../lib/glpk/glpk.js');
importScripts('../common/table.js');
importScripts('math/adaptive_function_estimation.js');
importScripts('math/feasible_region_graph.js');
importScripts('math/math_util.js');
importScripts('math/glpk_util.js');

/**
 * Sends a table back to the main thread.
 */
function postTable(table) {
  self.postMessage({action: 'emit-table', table: table.serialize()});
}

/**
 * Sends a graph back to the main thread.
 */
function postGraph(graph) {
  self.postMessage({action: 'emit-graph', graph: graph.serialize()});
}

function actionSolve(e) {
  var code = e.data.code;
  var lp = GlpkUtil.solveGmpl(code);
  postTable(GlpkUtil.getPrimalSolutionTable(lp));

  if (glp_get_num_cols(lp) == 2) {
    postGraph(getFeasibleRegionGraph(lp));
  }

  self.postMessage({action: 'done', result: {}, objective: {}});
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

