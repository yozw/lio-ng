// TODO: Write unit tests
app.service('googlePickerService', function ($compile, googleApiService) {
  "use strict";

  function openPicker(callback) {
    function pickerCallback(data) {
      if (data[google.picker.Response.ACTION] != google.picker.Action.PICKED) {
        return false;
      }
      var document = data[google.picker.Response.DOCUMENTS][0];
      var fileId = document[google.picker.Document.ID];
      callback(fileId);
    }

    var docsView = new google.picker.DocsView()
        .setIncludeFolders(true)
        .setOwnedByMe(true)
        .setMode(google.picker.DocsViewMode.LIST)
        .setSelectFolderEnabled(true);

    var picker = new google.picker.PickerBuilder()
        .addView(docsView)
        .setOAuthToken(googleApiService.getOauthToken())
        .setDeveloperKey(googleApiService.getDeveloperKey())
        .setCallback(pickerCallback)
        .setTitle("Select a model file")
        .build();

    picker.setVisible(true);
  }

  return {
    pickDriveModel: function (callback) {
      googleApiService.loadGoogleApisAndCall(['auth', 'picker', 'drive'],
          function () {
            openPicker(callback);
          }
      );
    }
  }
});
