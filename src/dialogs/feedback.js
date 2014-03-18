app.factory('feedbackDialog', function ($modal, $log) {
  "use strict";

  return {
    open: function () {

      var modalInstance = $modal.open({
        templateUrl: 'dialogs/feedback.html',
        controller: "FeedbackDialogCtrl"
      });

      modalInstance.result.then(
          function () {
          },
          function () {
            $log.info('Modal dismissed at: ' + new Date());
          });
    }};
});

app.controller("FeedbackDialogCtrl", function ($scope, $modalInstance) {
  "use strict";

  $scope.feedback = Object();
  $scope.feedback.name = "";
  $scope.feedback.email = "";
  $scope.feedback.text = "";

  $scope.send = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.close();
  };
});
