app.factory('quickStartDialog', function ($modal) {
  "use strict";

  return {
    open: function (parentScope) {
      var modalController = function ($scope, $modalInstance) {
        $scope.activePage = 1;
        $scope.numPages = 10;
        $scope.parentScope = parentScope;

        // TODO: Think of a better way to implement this
        function onPageChange() {
          switch ($scope.activePage) {
            case 2:
              parentScope.activateTab(0);
              return;
            case 3:
              parentScope.activateTab(1);
              return;
            case 4:
              parentScope.activateTab(2);
              return;
            case 5:
              parentScope.solveModel();
              parentScope.activateTab(3);
              return;
            case 6:
              parentScope.activateTab(4);
              return;
            case 7:
              parentScope.activateTab(5);
              return;
            case 8:
              parentScope.activateTab(6);
              return;
            case 9:
              parentScope.activateTab(7);
              return;
            case 10:
              parentScope.activateTab(0);
              return;
          }
        }

        $scope.close = function () {
          $modalInstance.close();
        };

        $scope.next = function() {
          $scope.activePage++;
          onPageChange();
        };

        $scope.previous = function() {
          $scope.activePage--;
          onPageChange();
        };
      };

      var modalInstance = $modal.open({
        templateUrl: '/application/dialogs/quickstart.html',
        controller: modalController,
        backdrop: 'static',
        windowClass: 'quickstart-modal'
      });

      modalInstance.result.then(
          function () {
          },
          function () {
          });
    }};
});
