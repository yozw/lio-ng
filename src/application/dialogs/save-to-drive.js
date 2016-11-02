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
      <input class="form-control" type="text" ng-model="target.title" autofocus>\
      </td>\
      </tr>\
      <tr>\
      <td style="width: 12em;">Location:</td>\
      <td>\
      <b>{{parent.title}}<button style="float: right;" class="btn" ng-click="changeLocation()">Change ...</button>\
      </td>\
      </tr>\
      </table>\
      </div>\
      <div class="modal-footer">\
      <button class="btn btn-primary" ng-disabled="disabled" ng-click="save()">Save</button>\
      <button class="btn btn-primary" ng-disabled="disabled" ng-click="cancel()">Cancel</button>\
      </div>';

  return {
    open: function (model) {
      var modalInstance = $modal.open({
        template: TEMPLATE,
        controller: "SaveToDriveDialogCtrl",
        backdrop: 'static',
        resolve: {
          model: function() { return model; }
        }
      });

      modalInstance.result.then(
          function () {
          },
          function () {
            $log.info('Modal dismissed at: ' + new Date());
          });
    }};
});

app.controller("SaveToDriveDialogCtrl", function (
    $scope, $modalInstance,
    googlePickerService, googleDriveService, messageService, storageService,
    model) {
  "use strict";

  $scope.target = Object();
  $scope.disabled = false;
  $scope.target.title = "model.mod";
  $scope.parent = Object();
  $scope.parent.isRoot = true;
  $scope.parent.title = "My Drive";

  $scope.save = function () {
    $scope.disabled = true;
    storageService.saveModelToGoogleDrive($scope.target.title, model, $scope.parent)
        .then(function () {
          $modalInstance.close();
          messageService.set("Model saved as '" + $scope.target.title
              + "' on Google Drive.");
        })
        .finally(function() {
          $scope.disabled = false;
        })
        .catch(messageService.set);
  };

  $scope.changeLocation = function() {
    $scope.disabled = true;
    googlePickerService.pickLocation()
        .then(googleDriveService.getFileInfo)
        .then(function (file) {
          $scope.parent = file;
        })
        .catch(console.log)
        .finally(function () {
          $scope.disabled = false;
        });
  };

  $scope.cancel = function () {
    $modalInstance.close();
  };
});
