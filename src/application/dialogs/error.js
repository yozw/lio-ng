app.factory('errorDialog', function ($modal) {
  "use strict";

  var TEMPLATE = '<div class="modal-header">\
    <h3><p>{{title}}</p></h3>\
    </div>\
    <div class="modal-body">\
    <p>{{errorMessage}}</p>\
    </div>\
    <div class="modal-footer">\
    <button class="btn btn-primary" ng-click="ok()">OK</button>\
    </div>';

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
        template: TEMPLATE,
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
