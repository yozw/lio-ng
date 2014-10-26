// TODO: Write unit tests
app.service('driveService', function ($compile, messageService, googleApiService) {
  "use strict";

  function readGoogleDriveFile(url, callback) {
    var access_token = gapi.auth.getToken().access_token;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
      if (xmlHttp.readyState == 4) {
        callback(xmlHttp.responseText);
      }
    };
    xmlHttp.open("GET", url, true);
    xmlHttp.setRequestHeader('Authorization', 'Bearer ' + access_token);
    xmlHttp.send(null);
  }

  function loadModelUsingDriveDialog(modelLoadedCallback) {
    function pickerCallback(data) {
      if (data[google.picker.Response.ACTION] != google.picker.Action.PICKED) {
        return false;
      }
      var doc = data[google.picker.Response.DOCUMENTS][0];
      var id = doc[google.picker.Document.ID];
      var request = gapi.client.drive.files.get({fileId: id});
      messageService.set("Loading model file ...");
      request.execute(function (file) {
        console.log("Loading file from url " + file.downloadUrl);
        readGoogleDriveFile(file.downloadUrl, function (contents) {
          messageService.clear();
          modelLoadedCallback(contents);
        });
      });
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
    loadWithPicker: function (modelLoadedCallback) {
      googleApiService.loadGoogleApisAndCall(['auth', 'picker', 'drive'],
          function () {
            loadModelUsingDriveDialog(modelLoadedCallback);
          }
      );
    }
  }
});
