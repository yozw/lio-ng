"use strict";

importScripts('/lib/glpk/glpk.js');
importScripts('/src/common/table.js');
importScripts('/src/common/graph.js');
importScripts('/src/common/math_util.js');
importScripts('/src/common/priority-queue.js');
importScripts('/src/common/util.js');
importScripts('/src/workers/math/adaptive_function_estimation.js');
importScripts('/src/workers/math/feasible_region_graph.js');
importScripts('/src/workers/math/glpk_util.js');
importScripts('/src/workers/math/convex_hull.js');
importScripts('/src/workers/solve.js');
importScripts('/src/workers/sensitivity.js');

/**
 * Sends an information message back to the main thread.
 */
function postInfo(value) {
  "use strict";
  var message = {};
  message.action = 'log';
  message.message = value;
  self.postMessage(message);
}

/**
 * Send an output message back to the main thread.
 */
function postOutput(value) {
  "use strict";
  var message = {};
  message.action = 'output';
  message.message = value;
  self.postMessage(message);
}

/**
 * Sends a "success" message back to the main thread.
 */
function postSuccess(status) {
  self.postMessage({action: 'success', status: status, result: {}, objective: {}});
}

/**
 * Sends an error message back to the main thread.
 */
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

/**
 * Determine which action (subroutine) the worker should execute.
 */
function getAction(e) {
  var actions = {
    solve: actionSolve,
    sensitivity: actionSensitivity
  };

  var action = e.data.action;
  if (typeof action === 'string' || action instanceof String) {
    return actions[action];
  } else {
    return undefined;
  }
}

/*
 * Callback for messages from the main thread.
 */
function onMessage(e) {
  GlpkUtil.setInfoLogFunction(postInfo);
  GlpkUtil.setOutputLogFunction(postOutput);
  GlpkUtil.setErrorLogFunction(function(error) {
    throw error;
  });

  var actionFn = getAction(e);
  if (actionFn === undefined) {
    console.warn('Unknown action: ', JSON.stringify(e.data.action));
  }

  try {
    var status = actionFn(e);
    postSuccess(status);
  } catch (err) {
    postError(err);
  }
}

// Install message callback
self.addEventListener('message', onMessage, false);
