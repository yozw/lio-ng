/**
 * Sensitivity analysis class.
 * @constructor
 */
var SensitivityAnalysis = function () {
  "use strict";

  var PLACEHOLDER = "{{SENSITIVITY_PLACEHOLDER}}";
  var self = this;
  var selectedAlgorithm;

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
   * @param parameters {Array}
   * @returns {Array}
   */
  this.runAnalysisAdaptive = function (func, minX, maxX, parameters) {
    var afe = new AdaptiveFunctionEstimation();
    return afe.estimate(func, minX, maxX);
  };

  /**
   * Performs sensitivity analysis using the uniform spacing algorithm.
   * @param func {Function}
   * @param minX {Number}
   * @param maxX {Number}
   * @param parameters {Array}
   * @returns {Array}
   */
  this.runAnalysisUniform = function (func, minX, maxX, parameters) {
    var stepCount = 101;
    var data = [];
    for (var i = 0; i < stepCount; i++) {
      var x = minX + (maxX - minX) * (i / (stepCount - 1));
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
   * Runs the sensitivity analysis using the selected algorithm.
   * @param code {String}
   * @param minX {Number}
   * @param maxX {Number}
   * @param parameters {Array}
   * @returns {Array}
   */
  this.run = function (code, minX, maxX, parameters) {
    var func = self.evaluationFn(code);
    return selectedAlgorithm(func, minX, maxX, parameters);
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
  var data = analysis.run(e.data.code, minX, maxX, e.data);

  // Draw graph
  var dataBounds = MathUtil.getBounds(data);
  var viewBounds = MathUtil.expandBounds(dataBounds, 0.5, 1.0);

  var graph = new Graph();
  graph.setTitle("Perturbation function");
  graph.setXlabel("x");
  graph.setYlabel("objective value");
  graph.addLinePlot(data);
  graph.setXRange(minX, maxX);
  graph.setYRange(viewBounds.minY, viewBounds.maxY);
  postGraph('output', graph);

  return "";
}
