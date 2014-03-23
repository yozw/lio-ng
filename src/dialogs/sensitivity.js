app.factory('sensitivityDialog', function ($modal, $log) {
  "use strict";

  return {
    open: function () {

      var modalInstance = $modal.open({
        templateUrl: '/src/dialogs/sensitivity.html',
        controller: "SensitivityDialogCtrl"
      });

      modalInstance.result.then(
          function () {
          },
          function () {
            $log.info('Modal dismissed at: ' + new Date());
          });
    }};
});

app.controller("SensitivityDialogCtrl", function ($scope, $modalInstance) {
  "use strict";

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
  $scope.parameters.minimum = 0;
  $scope.parameters.maximum = 10;
  $scope.parameters.method = ADAPTIVE;
  $scope.parameters.variable = variables[0];

  $scope.variables = variables;

  $scope.methods = [ADAPTIVE, EVEN_SPACED];

  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.close();
  };
});
