// TODO: Write unit tests
app.service('googleDriveService', function ($compile, googleApiService) {
  "use strict";

  function downloadDriveUrl(url, callback) {
    console.log("Loading file from url " + url);
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

  function loadFileFromDrive(document, callback) {
    var id = document[google.picker.Document.ID];
    var request = gapi.client.drive.files.get({fileId: id});
    request.execute(function (file) {
      downloadDriveUrl(file.downloadUrl, callback);
    });
  }

  return {
    loadFile: function (document, callback) {
      googleApiService.loadGoogleApisAndCall(['auth', 'drive'],
          function () {
            loadFileFromDrive(document, callback);
          }
      );
    }
  }
});
