/**
 * Sensitivity analysis class.
 * @constructor
 */
var SensitivityAnalysis = function () {
  "use strict";

  var PLACEHOLDER = "{{SENSITIVITY_PLACEHOLDER}}";
  var self = this;
  var selectedAlgorithm;

  this.PARTITION_FINITE = 1;
  this.PARTITION_POS_INFINITE = 2;
  this.PARTITION_NEG_INFINITE = 3;
  this.PARTITION_NAN = 4;

  /**
   * Returns the model code as a function of the value of the perturbed parameter.
   * @param code
   * @returns {Function}
   */
  this.getModelFunction = function (code) {
    var i = code.indexOf(PLACEHOLDER);
    if (i <= 0) {
      throw Error("Sensitivity analysis placeholder not found");
    }
    var modelBefore = code.substring(0, i);
    var modelAfter = code.substring(i + PLACEHOLDER.length);

    return function (x) {
      return modelBefore + x.toString() + modelAfter;
    }
  };

  /**
   * Returns the target value (e.g., objective value or variable value) as a function of the value of the perturbed
   * parameter. This function solves the model.
   * @param code
   * @returns {Function}
   */
  this.evaluationFn = function (code) {
    var model = self.getModelFunction(code);

    return function (x) {
      var result = GlpkUtil.solveGmpl(model(x));
      postInfo("value = " + x.toString() + ", objective = " + result.objectiveValue);
      return result.objectiveValue;
    }
  };

  /**
   * Performs sensitivity analysis using the adaptive algorithm.
   * @param func {Function}
   * @param minX {Number}
   * @param maxX {Number}
   * @param options {Array}
   * @returns {Array}
   */
  this.runAnalysisAdaptive = function (func, minX, maxX, options) {
    var afe = new AdaptiveFunctionEstimation();
    return afe.estimate(func, minX, maxX);
  };

  /**
   * Performs sensitivity analysis using the uniform spacing algorithm.
   * @param func {Function}
   * @param minX {Number}
   * @param maxX {Number}
   * @param options {Array}
   * @returns {Array}
   */
  this.runAnalysisUniform = function (func, minX, maxX, options) {
    var defaultOptions = {
      stepCount: 101
    };
    options = extend(defaultOptions, options);

    var data = [];
    for (var i = 0; i < options.stepCount; i++) {
      var x = minX + (maxX - minX) * (i / (options.stepCount - 1));
      var value = func(x);
      data.push([x, value]);
    }

    return data;
  };

  /**
   * Chooses the algorithm to be used for the analysis.
   * @param method {String}
   */
  this.setAlgorithm = function (method) {
    var methods = {
      adaptive: self.runAnalysisAdaptive,
      uniform: self.runAnalysisUniform
    };

    var methodFunc = methods[method];
    if (methodFunc === undefined) {
      throw new Error("Unknown sensitivity analysis method: " + method);
    }
    selectedAlgorithm = methodFunc;
  };

  /**
   * Takes an array of (x, y) pairs describing a piecewise linear function, and
   * partitions the data set into subarrays of finite, +infinite, and -infinite
   * segments.
   *
   * @param data
   */
  this.partitionData = function(data) {
    var parts = [];
    var curPart;
    for (var i = 0; i < data.length; i++) {
      var type;
      var point = data[i];
      if (MathUtil.isFinite(point[1])) {
        type = self.PARTITION_FINITE;
      } else if (point[1] < 0) {
        type = self.PARTITION_NEG_INFINITE;
      } else if (point[1] > 0) {
        type = self.PARTITION_POS_INFINITE;
      } else {
        type = self.PARTITION_NAN;
      }
      if (i === 0 || type !== curPart.type) {
        curPart = {type: type, data: []};
        parts.push(curPart);
      }
      curPart.data.push(point);
    }
    return parts;
  };

  /**
   * Runs the sensitivity analysis using the selected algorithm.
   * @param code {String}
   * @param minX {Number}
   * @param maxX {Number}
   * @param options {Array}
   * @returns {Array}
   */
  this.run = function (code, minX, maxX, options) {
    var func = self.evaluationFn(code);

    return selectedAlgorithm(func, minX, maxX, options);
  };

  selectedAlgorithm = self.runAnalysisAdaptive;
};

function actionSensitivity(e) {

  // Turn off GLPK logging (as this results in a lot of log lines)
  GlpkUtil.setInfoLogFunction(function () {});

  // Run sensitivity analysis
  var analysis = new SensitivityAnalysis();
  var minX = e.data.minValue;
  var maxX = e.data.maxValue;
  analysis.setAlgorithm(e.data.method);
  var rawData = analysis.run(e.data.code, minX, maxX, e.data);

  // Draw graph
  var dataBounds = MathUtil.getBounds(rawData);
  var viewBounds = MathUtil.expandBounds(dataBounds, 0.0, 1.0);

  var graph = new Graph();
  graph.setTitle("Perturbation function");
  graph.setXlabel("x");
  graph.setYlabel("objective value");
  graph.setXRange(minX, maxX);
  graph.setYRange(viewBounds.minY, viewBounds.maxY);

  // Partition data into feasible, infeasible, unbounded parts
  var parts = analysis.partitionData(rawData);
  for (var i = 0; i < parts.length; i++) {
    var part = parts[i];
    if (part.type == analysis.PARTITION_FINITE) {
      graph.addLinePlot(part.data);
    }
  }

  // Draw lines between parts
  for (var j = 1; j < parts.length; j++) {
    var dataBefore = parts[j - 1].data;
    var dataAfter = parts[j].data;
    var x = (dataAfter[0][0] + dataBefore[dataBefore.length - 1][0]) / 2;
    graph.addLine([1, 0], x);
  }

  postGraph('output', graph);

  return "";
}
