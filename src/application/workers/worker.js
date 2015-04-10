"use strict";

importScripts('/lib/glpk/glpk.js');
importScripts('/application/common/table.js');
importScripts('/application/common/graph.js');
importScripts('/application/common/math_util.js');
importScripts('/application/common/priority-queue.js');
importScripts('/application/common/string_util.js');
importScripts('/application/common/util.js');
importScripts('/application/workers/math/adaptive_function_estimation.js');
importScripts('/application/workers/math/feasible_region_graph.js');
importScripts('/application/workers/math/glpk_util.js');
importScripts('/application/workers/math/convex_hull.js');
importScripts('/application/workers/modelinfo.js');
importScripts('/application/workers/solve.js');
importScripts('/application/workers/sensitivity.js');

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
  message.target = 'output';
  message.action = 'output';
  message.message = value;
  self.postMessage(message);
}

/**
 * Sends a "success" message back to the main thread.
 */
function postSuccess(returnValue) {
  self.postMessage({action: 'success', returnValue: returnValue, result: {}, objective: {}});
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
function postTable(target, table) {
  self.postMessage({action: 'emit-table', target: target, table: table.serialize()});
}

/**
 * Sends a graph back to the main thread.
 */
function postGraph(target, graph) {
  self.postMessage({action: 'emit-graph', target: target, graph: graph.serialize()});
}

/**
 * Determine which action (subroutine) the worker should execute.
 */
function getAction(e) {
  var actions = {
    solve: actionSolve,
    sensitivity: actionSensitivity,
    modelInfo: actionModelInfo
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
    var returnValue = actionFn(e);
    postSuccess(returnValue);
  } catch (err) {
    postError(err);
  }
}

// Install message callback
self.addEventListener('message', onMessage, false);
