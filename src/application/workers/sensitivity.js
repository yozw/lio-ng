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
   * Returns the target value name for the lp.
   *
   * @param lp
   * @param column
   * @returns {*}
   */
  this.getColumnValueName = function(lp, column) {
    if (column === 0) {
      return "objective value";
    } else if ((column >= 1) && (column <= glp_get_num_cols(lp))) {
      return glp_get_col_name(lp, column);
    } else {
      throw new Error("Invalid column index: " + column);
    }
  };

  /**
   * Returns the target value (e.g., objective value or variable value) as a function of the value of the perturbed
   * parameter. This function solves the model.
   * @param code
   * @param column (0 = objective value, 1..n = variable)
   * @returns {Function}
   */
  this.evaluationFn = function (code, column) {
    var model = self.getModelFunction(code);
    var postInfoCounter = 0;

    function postColumns() {
      var str = "";
      for (var i = 0; i < arguments.length; i++) {
        if (i > 0) {
          str += " ";
        }
        var value = arguments[i];
        if (typeof value === 'number') {
          str += StringUtil.formatNumberFixedWidth(value, 15);
        } else {
          str += StringUtil.lpad(arguments[i], 15);
        }
      }
      postInfo(str);
    }

    return function (x) {
      var result = GlpkUtil.solveGmpl(model(x));
      var name = self.getColumnValueName(result.lp, column);
      var value;

      if (postInfoCounter == 0) {
        postColumns("Sensitivity", "Objective");
        if (column !== 0) {
          postColumns("parameter", "value", name);
          postInfo(StringUtil.repeat("-", 16 + 16 + 15));
        } else {
          postColumns("parameter", "value");
          postInfo(StringUtil.repeat("-", 16 + 15));
        }
      }
      postInfoCounter++;

      if ((column === 0) || (MathUtil.isInfinite(result.objectiveValue))) {
        // If the target variable (i.e., the one that is plotted on the vertical axis)
        // is the optimal objective value, OR the model is unbounded or infeasible,
        // then return the objective value.
        value = result.objectiveValue;
        postColumns(x, result.objectiveValue);
      } else {
        // Otherwise, return the optimal value of the target column.
        value = GlpkUtil.getColumnValue(result.lp, column);
        postColumns(x, result.objectiveValue, value);
      }

      self.columnName = name;
      self.isMaximizing = GlpkUtil.isMaximizing(result.lp);
      return value;
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
    if (!methodFunc) {
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
    var curPart = {};
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
   * @param column {Number}
   * @param options {*}
   * @returns {Array}
   */
  this.run = function (code, minX, maxX, column, options) {
    var func = self.evaluationFn(code, column);
    return selectedAlgorithm(func, minX, maxX, options);
  };

  selectedAlgorithm = self.runAnalysisAdaptive;
};


/**
 * Async action that performs sensitivity analysis.
 * @param e
 * @returns {string}
 */
function actionSensitivity(e) {

  function getInfinityLabel(objValue, isMaximizing) {
    if ((isMaximizing && objValue <= -Number.MAX_VALUE)
        || (!isMaximizing && objValue >= Number.MAX_VALUE)) {
      return "infeasible";
    } else if ((isMaximizing && objValue >= Number.MAX_VALUE)
        || (!isMaximizing && objValue <= -Number.MAX_VALUE)) {
      return "unbounded";
    } else {
      return "";
    }
  }

  checkDefined(e.data);
  checkDefined(e.data.minValue);
  checkDefined(e.data.maxValue);
  checkDefined(e.data.method);
  checkDefined(e.data.column);

  // Turn off GLPK logging (as this results in a lot of log lines)
  GlpkUtil.setInfoLogFunction(function () {});

  // Run sensitivity analysis
  var analysis = new SensitivityAnalysis();
  var minX = e.data.minValue;
  var maxX = e.data.maxValue;
  analysis.setAlgorithm(e.data.method);
  var rawData = analysis.run(e.data.code, minX, maxX, e.data.column, e.data);

  // Draw graph
  var dataBounds = MathUtil.getBounds(rawData);
  var viewBounds = MathUtil.expandBounds(dataBounds, 0.01, 1.0);

  var graph = new Graph();
  graph.setTitle("Perturbation function");
  graph.setXlabel("value");
  graph.setYlabel(analysis.columnName);
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

    var beforeLabel = getInfinityLabel(dataBefore[0][1], analysis.isMaximizing);
    if (beforeLabel.length > 0) {
      graph.addSectionLabel(x, beforeLabel, {location: 'w', xpadding: 0, rotate: 270});
    }

    var afterLabel = getInfinityLabel(dataAfter[0][1], analysis.isMaximizing);
    if (afterLabel.length > 0) {
      graph.addSectionLabel(x, afterLabel, {location: 'e', xpadding: 0, rotate: 90});
    }
  }

  postGraph('output', graph);

  return "";
}
