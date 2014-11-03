app.factory('sensitivityDialog', function ($modal, errorDialog, solverService) {
  "use strict";

  var TEMPLATE =
     '<div class="modal-header">\
      <h3>Sensitivity analysis (beta)</h3>\
      </div>\
      <div class="modal-body">\
        <div class="bs-callout bs-callout-info">\
          Please specify parameters for a sensitivity analysis with respect to the constant\
          <b>{{selection.text}}</b> in the line:\
          <pre class="no-border">{{selection.lineBefore}}<span class="sensitivity-subject">{{selection.text}}</span>{{selection.lineAfter}}</pre>\
        </div>\
        <table class="input-table">\
          <tr>\
            <td style="width: 12em;">\
              Parameter value range\
            </td>\
            <td style="display: flex; align-items: center;">\
              <input class="form-control input-range" type="number" ng-model="parameters.minimum">\
             <span class="input-range-to">to</span>\
              <input class="form-control input-range" type="number" ng-model="parameters.maximum">\
            </td>\
          </tr>\
          <tr>\
            <td>\
              Variable of interest\
            </td>\
            <td>\
              <select class="form-control" ng-model="parameters.variable" \
              ng-options="variable.name for variable in variables"></select>\
            </td>\
          </tr>\
          <tr>\
            <td>Method</td>\
            <td>\
              <select class="form-control" ng-model="parameters.method"\
              ng-options="method.name for method in methods"></select>\
              <div class="bs-callout bs-callout-warning">\
                {{parameters.method.description}}\
              </div>\
            </td>\
          </tr>\
        </table>\
      </div>\
        <div class="modal-footer">\
        <button class="btn btn-primary" ng-click="ok()">OK</button>\
        <button class="btn" ng-click="cancel()">Cancel</button>\
      </div>';

  var ERROR_MESSAGE = "To perform a sensitivity analysis, select a number in the model code, and then choose Run > "
      + "Sensitivity Analysis";

  function getSelection(code, range) {
    var selection = {};
    if (angular.isUndefined(range) || range.start.row !== range.end.row) {
      console.log("getSelection: Invalid range specified.");
      return undefined;
    }

    var lines = code.split("\n");
    var row = range.start.row;
    var line = lines[row];
    var expanded = MathUtil.expandToNumber(line, range.start.column, range.end.column);
    if (angular.isUndefined(expanded.text)) {
      console.log("Selection '" + line.substring(range.start.column, range.end.column) + "' could not be expanded.");
      return undefined;
    }

    var start = expanded.start;
    var end = expanded.end;

    selection.text = line.substring(start, end);
    selection.value = parseFloat(selection.text);

    if (isNaN(selection.value)) {
      return undefined;
    }

    selection.line = line;
    selection.row = row;
    selection.lineBefore = lines[row].substring(0, start);
    selection.lineAfter = lines[row].substring(end);

    lines[row] = selection.lineBefore + "{{SENSITIVITY_PLACEHOLDER}}" + selection.lineAfter;
    selection.codeWithPlaceholder = lines.join("\n");

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
        solverService.performSensitivityAnalysis(
            selection.codeWithPlaceholder,
            $scope.parameters.minimum,
            $scope.parameters.maximum);
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
      if (angular.isUndefined(selection)) {
        errorDialog.open(ERROR_MESSAGE, "Sensitivity analysis");
        return;
      }
      $modal.open({
        template: TEMPLATE,
        controller: modalController(selection)
      });
    }};
});
