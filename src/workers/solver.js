"use strict";

importScripts('/lib/glpk/glpk.js');
importScripts('/src/common/table.js');
importScripts('/src/common/graph.js');
importScripts('/src/common/math_util.js');
importScripts('/src/workers/math/adaptive_function_estimation.js');
importScripts('/src/workers/math/feasible_region_graph.js');
importScripts('/src/workers/math/glpk_util.js');
importScripts('/src/workers/math/convex_hull.js');

function logInfo(value) {
  "use strict";
  var message = {};
  message.action = 'log';
  message.message = value;
  self.postMessage(message);
}

function logError(value, data) {
  "use strict";
  var message = {};

  if (data !== undefined) {
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        message[key] = data[key];
      }
    }
  }

  message['action'] = 'error';
  message['message'] = value;
  self.postMessage(message);
}

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
  if (lp === null) {
    return;
  }
  postTable(GlpkUtil.getPrimalSolutionTable(lp));

  if (glp_get_num_cols(lp) === 2) {
    postGraph(FeasibleRegionGraph.create(lp));
  }

  self.postMessage({action: 'done', result: {}, objective: {}});
}

function getAction(e) {
  var action = e.data.action;
  if (typeof action === 'string' || action instanceof String) {
    return actions[action];
  } else {
    return undefined;
  }
}

var actions = {};
actions['solve'] = actionSolve;

self.addEventListener('message', function (e) {
  "use strict";

  GlpkUtil.setInfoLogFunction(logInfo);
  GlpkUtil.setErrorLogFunction(logError);

  var actionFn = getAction(e);
  if (actionFn === undefined) {
    console.warn('Unknown action: ', JSON.stringify(e));
  }

  try {
    actionFn(e);
  } catch (err) {
    logError(err.message);
  }
}, false);

