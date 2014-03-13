app.service('aboutDialogService', function ($modal, $log) {
  "use strict";

  return {
    open: function () {

      var modalInstance = $modal.open({
        templateUrl: 'views/about.html',
        controller: "AboutDialogInstanceCtrl"
      });

      modalInstance.result.then(
          function () {
          },
          function () {
            $log.info('Modal dismissed at: ' + new Date());
          });
    }};
});

app.controller("AboutDialogInstanceCtrl", function ($scope, $modalInstance) {
  "use strict";

  $scope.ok = function () {
    $modalInstance.close();
  };

});
