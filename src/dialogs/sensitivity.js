app.factory('sensitivityDialog', function ($modal, $log) {
  "use strict";

  return {
    open: function () {

      var modalInstance = $modal.open({
        templateUrl: 'dialogs/sensitivity.html',
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

  var ADAPTIVE = {name: 'Adaptive', value: 'adaptive'};
  var EVEN_SPACED = {name: 'Evenly spaced', value: 'spaced'};

  $scope.parameters = Object();
  $scope.parameters.minimum = 0;
  $scope.parameters.maximum = 10;
  $scope.parameters.method = ADAPTIVE;

  $scope.methods = [ADAPTIVE, EVEN_SPACED];

  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.close();
  };
});
