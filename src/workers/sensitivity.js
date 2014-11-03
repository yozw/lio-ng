function actionSensitivity(e) {

  var PLACEHOLDER = "{{SENSITIVITY_PLACEHOLDER}}";

  GlpkUtil.setInfoLogFunction(function() {});

  function getModelFunction(code) {
    var i = code.indexOf(PLACEHOLDER);
    if (i <= 0) {
      throw Error("Sensitivity analysis placeholder not found");
    }
    var modelBefore = code.substring(0, i);
    var modelAfter = code.substring(i + PLACEHOLDER.length);

    return function (x) {
      return modelBefore + x.toString() + modelAfter;
    }
  }

  function evalFn(code) {
    var model = getModelFunction(code);

    return function (x) {
      var result = GlpkUtil.solveGmpl(model(x));
      postInfo("value = " + x.toString() + ", objective = " + result.objectiveValue);
      return result.objectiveValue;
    }
  }

  var f = evalFn(e.data.code);

  var minX = e.data.minValue;
  var maxX = e.data.maxValue;

  var stepCount = 101;
  var data = [];
  for (var i = 0; i < stepCount; i++) {
    var x = minX + (maxX - minX) * (i / (stepCount-1));
    var value = f(x);
    data.push([x, value]);
  }

  var vertexBounds = MathUtil.getBounds(data);
  var viewBounds = MathUtil.expandBounds(vertexBounds, 0.5, 1.0);

  var graph = new Graph();
  graph.setTitle("Perturbation function");
  graph.setXlabel("x");
  graph.setYlabel("objective value");
  graph.addLinePlot(data);
  graph.setXRange(minX, maxX);
  graph.setYRange(viewBounds.minY, viewBounds.maxY);
  postGraph(graph);

  return "";
}
