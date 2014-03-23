app.factory('aboutDialog', function ($modal, $log) {
  "use strict";

  return {
    open: function () {

      var modalInstance = $modal.open({
        templateUrl: '/src/dialogs/about.html',
        controller: "AboutDialogCtrl"
      });

      modalInstance.result.then(
          function () {
          },
          function () {
            $log.info('Modal dismissed at: ' + new Date());
          });
    }};
});

app.controller("AboutDialogCtrl", function ($scope, $modalInstance) {
  "use strict";

  $scope.ok = function () {
    $modalInstance.close();
  };

});
