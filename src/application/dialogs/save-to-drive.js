app.factory('saveToDriveDialog', function ($modal, $log) {
  "use strict";

  var TEMPLATE = '<div class="modal-header">\
      <h3>Save to Google Drive</h3>\
      </div>\
      <div class="modal-body">\
      <table class="input-table">\
      <tr>\
      <td style="width: 12em;">Name:</td>\
      <td>\
      <input class="form-control" type="text" ng-disabled="disabled" ng-model="target.title" autofocus>\
      </td>\
      </tr>\
      <tr>\
      <td style="width: 12em;">Location:</td>\
      <td>\
      <b>{{parent.title}}<button style="float: right;" class="btn" ng-disabled="disabled" ng-click="changeLocation()">Change ...</button>\
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
  $scope.disabled = true;
  $scope.target.title = "";
  $scope.parent = Object();
  $scope.parent.isRoot = true;
  $scope.parent.title = "";

  storageService.getModelInfo(storageService.getCurrentModelUrl())
      .then(function(info) {
        if (info.name !== undefined) {
          $scope.target.title = info.name;
        } else {
          $scope.target.title = "model.mod";
        }
        if (info.info && info.info.parents && info.info.parents[0]) {
          $scope.parent = info.info.parents[0];
        } else {
          $scope.parent.isRoot = true;
          $scope.parent.title = "My Drive";
        }
      })
      .catch(console.log)
      .finally(function() {
        $scope.disabled = false;
      });

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
