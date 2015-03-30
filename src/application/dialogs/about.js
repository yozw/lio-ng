app.factory('aboutDialog', function ($modal) {
  "use strict";

  var TEMPLATE = '';

  return {
    open: function () {

      var modalController = function ($scope, $modalInstance) {
        $scope.ok = function () {
          $modalInstance.close();
        };
      };

      var modalInstance = $modal.open({
        templateUrl: '/application/dialogs/about.html',
        controller: modalController
      });

      modalInstance.result.then(
          function () {
          },
          function () {
          });
    }};
});
