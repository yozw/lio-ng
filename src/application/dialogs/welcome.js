app.factory('welcomeDialog', function ($modal, quickStartDialog) {
  "use strict";

  return {
    open: function (parentScope) {
      var modalController = function ($scope, $modalInstance) {
        $scope.close = function () {
          $modalInstance.close();
        };

        $scope.quickstart = function() {
          $modalInstance.close();
          quickStartDialog.open(parentScope);
        };
      };

      var modalInstance = $modal.open({
        templateUrl: '/application/dialogs/welcome.html',
        controller: modalController,
        backdrop: 'static'
      });

      modalInstance.result.then(
          function () {
          },
          function () {
          });
    }};
});
