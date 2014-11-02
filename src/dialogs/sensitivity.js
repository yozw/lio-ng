app.factory('sensitivityDialog', function ($modal, errorDialog) {
  "use strict";

  var ERROR_MESSAGE = "To perform a sensitivity analysis, select a number in the model code, and then choose Run > "
      + "Sensitivity Analysis";

  function getSelection(code, range) {
    var selection = {};
    if (angular.isUndefined(range) || range.start.row !== range.end.row) {
      return null;
    }

    var lines = code.split("\n");
    var row = range.start.row;
    var line = lines[row];
    var expanded = MathUtil.expandToNumber(line, range.start.column, range.end.column);
    if (angular.isUndefined(expanded.text)) {
      return null;
    }

    var start = expanded.start;
    var end = expanded.end;

    selection.text = line.substring(start, end);
    selection.value = parseFloat(selection.text);

    if (isNaN(selection.value)) {
      return null;
    }

    selection.line = line;
    selection.row = row;
    selection.lineBefore = lines[row].substring(0, start);
    selection.lineAfter = lines[row].substring(end);

    lines[row] = selection.lineBefore + "{{SENSITIVITY_PLACEHOLDER}}" + selection.lineAfter;
    selection.codeWithPlaceholder = lines.join("\n");

    console.log(selection);

    return selection;
  }

  var modalController = function (selection) {
    return function ($scope, $modalInstance) {

      var ADAPTIVE = {
        name: 'Adaptive',
        value: 'adaptive',
        description: 'The adaptive algorithm automatically chooses parameter values, focusing on the most interesting '
        + '(i.e., non-linear) parts of the sensitivity function. This usually leads to better results.'};
      var EVEN_SPACED = {
        name: 'Evenly spaced',
        value: 'spaced',
        description: 'The even spacing algorithm chooses parameter values that are evenly spaced in the chosen parameter '
        + 'range, and solves the model for these parameter values.'};

      var variables = [];
      variables.push({name: 'Optimal objective value'});

      $scope.parameters = Object();
      $scope.parameters.minimum = Math.min(0, 2 * selection.value);
      $scope.parameters.maximum = Math.max(0, 2 * selection.value);
      $scope.parameters.method = ADAPTIVE;
      $scope.parameters.variable = variables[0];

      $scope.selection = selection;

      $scope.variables = variables;

      $scope.methods = [ADAPTIVE, EVEN_SPACED];

      $scope.ok = function () {
        $modalInstance.close();
      };

      $scope.cancel = function () {
        $modalInstance.close();
      };
    }
  };

  return {
    open: function (code, range) {
      var selection = getSelection(code, range);
      if (angular.isDefined(selection)) {
        errorDialog.open(ERROR_MESSAGE, "Sensitivity analysis");
        return;
      }
      console.log(selection);
      var modalInstance = $modal.open({
        templateUrl: '/src/dialogs/sensitivity.html',
        controller: modalController(selection)
      });

      modalInstance.result.then(
          function () {
          },
          function () {
          });
    }};
});
