function actionSensitivity(e) {

  var PLACEHOLDER = "{{SENSITIVITY_PLACEHOLDER}}";

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
      postInfo("Solving model for value " + x.toString());
      var result = GlpkUtil.solveGmpl(model(x));
    }
  }

  var f = evalFn(e.data.code);

  for (var i = 0; i < 100; i++) {
    f(i);
  }

  return "";
}
