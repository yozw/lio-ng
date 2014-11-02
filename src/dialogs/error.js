app.factory('errorDialog', function ($modal) {
  "use strict";

  return {
    open: function (errorMessage, title) {
      if (angular.isUndefined(title)) {
        title = "Error";
      }

      var modalController = function($scope, $modalInstance) {
        $scope.errorMessage = errorMessage;
        $scope.title = title;

        $scope.ok = function () {
          $modalInstance.close();
        };
      };

      var modalInstance = $modal.open({
        templateUrl: '/src/dialogs/error.html',
        controller: modalController
      });

      modalInstance.result.then(
          function () {
          },
          function () {
          });
    }};
});
