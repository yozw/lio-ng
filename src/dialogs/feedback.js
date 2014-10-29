app.factory('feedbackDialog', function ($modal, $log) {
  "use strict";

  return {
    open: function () {

      var modalInstance = $modal.open({
        templateUrl: '/src/dialogs/feedback.html',
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

app.controller("FeedbackDialogCtrl", function ($scope, $modalInstance, $http) {
  "use strict";

  $scope.feedback = Object();
  $scope.feedback.name = "";
  $scope.feedback.email = "";
  $scope.feedback.text = "";
  $scope.feedback.csrf_token = CSRF_TOKEN;

  $scope.send = function () {
    $http
        .post('/feedback', $scope.feedback)
        .then(function(response) {
          if (response.data.error) {
            alert(response.data.error);
          } else {
            $modalInstance.close();
          }
        },
        function(response) {
          alert(response.data.error);
        }
    );
  };

  $scope.cancel = function () {
    $modalInstance.close();
  };
});
