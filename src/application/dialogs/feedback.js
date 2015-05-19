app.factory('feedbackDialog', function ($modal, $log) {
  "use strict";

  var TEMPLATE = '<div class="modal-header">\
      <h3>Feedback</h3>\
      </div>\
      <div class="modal-body">\
      <div class="bs-callout bs-callout-info">\
      We\'re always happy to receive feedback. Feel free to leave any questions, comments, or suggestions.\
      </div>\
      <table class="input-table">\
      <tr>\
      <td style="width: 12em;">Your name:</td>\
      <td>\
      <input class="form-control" type="text" ng-model="feedback.name">\
      </td>\
      </tr>\
      <tr>\
      <td style="width: 12em;">Email:</td>\
      <td>\
      <input class="form-control" type="text" ng-model="feedback.email">\
      </td>\
      </tr>\
      <tr>\
      <td style="width: 12em;">Comment:</td>\
      <td>\
      <textarea class="form-control" ng-model="feedback.text"></textarea>\
      </td>\
      </tr>\
      </table>\
      \
      </div>\
      <div class="modal-footer">\
      <button class="btn btn-primary" ng-click="send()">Send</button>\
      <button class="btn btn-primary" ng-click="cancel()">Cancel</button>\
      </div>';

  return {
    open: function () {

      var modalInstance = $modal.open({
        template: TEMPLATE,
        controller: "FeedbackDialogCtrl",
        backdrop: 'static'
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
