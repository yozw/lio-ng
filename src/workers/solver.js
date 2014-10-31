"use strict";

importScripts('/lib/glpk/glpk.js');
importScripts('/src/common/table.js');
importScripts('/src/common/graph.js');
importScripts('/src/common/math_util.js');
importScripts('/src/workers/math/adaptive_function_estimation.js');
importScripts('/src/workers/math/feasible_region_graph.js');
importScripts('/src/workers/math/glpk_util.js');
importScripts('/src/workers/math/convex_hull.js');

function postInfo(value) {
  "use strict";
  var message = {};
  message.action = 'log';
  message.message = value;
  self.postMessage(message);
}

function postSuccess(status) {
  self.postMessage({action: 'success', status: status, result: {}, objective: {}});
}

function postError(value, data) {
  "use strict";
  var message = {};

  console.error(value);

  if (data !== undefined) {
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        message[key] = data[key];
      }
    }
  }

  message['action'] = 'error';
  if (value === undefined) {
    message['message'] = "Undefined error";
  } else if (value.hasOwnProperty("message")) {
    message['message'] = value.message;
  } else {
    message['message'] = value;
  }
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
  var status = GlpkUtil.getModelStatus(lp);
  switch (status) {
    case GLP_OPT:
      postTable(GlpkUtil.getPrimalSolutionTable(lp));
      if (glp_get_num_cols(lp) === 2) {
        postGraph(FeasibleRegionGraph.create(lp));
      }
      return "An optimal solution was found.";
    case GLP_NOFEAS:
    case GLP_UNDEF:
    case GLP_UNBND:
      return "The model is infeasible or unbounded.";
    case GLP_FEAS:
      throw new Error("GLPK solver returned GLP_FEAS");
    case GLP_INFEAS:
      throw new Error("GLPK solver returned GLP_INFEAS");
    default:
      throw new Error("GLPK solver returned undefined status (" + status + ")");
  }
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

  GlpkUtil.setInfoLogFunction(postInfo);
  GlpkUtil.setErrorLogFunction(function(error) {
    throw error;
  });

  var actionFn = getAction(e);
  if (actionFn === undefined) {
    console.warn('Unknown action: ', JSON.stringify(e));
  }

  try {
    var status = actionFn(e);
    postSuccess(status);
  } catch (err) {
    postError(err);
  }
}, false);

