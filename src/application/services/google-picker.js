// TODO: Write unit tests
app.service('googlePickerService', function ($q, $compile, googleApiService) {
  "use strict";

  function createModelsView() {
    return new google.picker.DocsView()
        .setIncludeFolders(true)
        .setOwnedByMe(true)
        .setMode(google.picker.DocsViewMode.LIST)
        .setSelectFolderEnabled(false);
  }

  function createLocationView() {
    return new google.picker.DocsView(google.picker.ViewId.FOLDERS)
        .setIncludeFolders(true)
        .setOwnedByMe(true)
        .setMode(google.picker.DocsViewMode.LIST)
        .setSelectFolderEnabled(true);
  }

  function openPicker(view, title) {
    var defer = $q.defer();

    function pickerCallback(data) {
      var action = data[google.picker.Response.ACTION];
      if (action == google.picker.Action.CANCEL) {
        defer.reject("Cancelled by user");
      } else if (action == google.picker.Action.PICKED) {
        var document = data[google.picker.Response.DOCUMENTS][0];
        var fileId = document[google.picker.Document.ID];
        defer.resolve(fileId);
      }
    }

    var picker = new google.picker.PickerBuilder()
        .addView(view)
        .setOAuthToken(googleApiService.getOauthToken())
        .setDeveloperKey(googleApiService.getDeveloperKey())
        .setCallback(pickerCallback)
        .setTitle(title)
        .build();

    picker.setVisible(true);
    angular.element(".picker-dialog").css('z-index', 2001);

    return defer.promise;
  }

  return {
    pickModel: function () {
      function pick() {
        var view = createModelsView();
        return openPicker(view, "Select a model file");
      }
      return googleApiService.loadGoogleApis(['auth', 'picker', 'drive']).then(pick);
    },
    pickLocation : function () {
      function pick() {
        var view = createLocationView();
        return openPicker(view, "Select location");
      }
      return googleApiService.loadGoogleApis(['auth', 'picker', 'drive']).then(pick);
    }
  }
});
