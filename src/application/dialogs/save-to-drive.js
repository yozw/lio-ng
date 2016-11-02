app.factory('saveToDriveDialog', function ($modal, $log) {
  "use strict";

  var TEMPLATE = '<div class="modal-header">\
      <h3>Save to Google Drive</h3>\
      </div>\
      <div class="modal-body">\
      <table class="input-table">\
      <tr>\
      <td style="width: 12em;">File name:</td>\
      <td>\
      <input class="form-control" type="text" ng-model="filename" autofocus>\
      </td>\
      </tr>\
      <tr>\
      <td style="width: 12em;">Location:</td>\
      <td>\
      <b>{{folder.title}}<button style="float: right;" class="btn" ng-click="changeLocation()">Change ...</button>\
      </td>\
      </tr>\
      </table>\
      </div>\
      <div class="modal-footer">\
      <button class="btn btn-primary" ng-disabled="disabled" ng-click="save()">Save</button>\
      <button class="btn btn-primary" ng-disabled="disabled" ng-click="cancel()">Cancel</button>\
      </div>';

  return {
    open: function () {

      var modalInstance = $modal.open({
        template: TEMPLATE,
        controller: "SaveToDriveDialogCtrl",
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

app.controller("SaveToDriveDialogCtrl", function ($scope, $modalInstance, googlePickerService, googleDriveService) {
  "use strict";

  $scope.target = Object();
  $scope.disabled = false;
  $scope.filename = "model.mod";
  $scope.folder = Object();
  $scope.folder.title = "My Drive";

  $scope.save = function () {
    $modalInstance.close();
  };

  $scope.changeLocation = function() {
    $scope.disabled = true;
    googlePickerService.pickLocation()
        .then(googleDriveService.getFileInfo)
        .then(function (file) {
          $scope.target.folder = file;
        }).finally(function () {
          $scope.disabled = false;
        });
  };

  $scope.cancel = function () {
    $modalInstance.close();
  };
});
