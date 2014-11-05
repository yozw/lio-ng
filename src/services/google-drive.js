// TODO: Write unit tests
app.service('googleDriveService', function ($compile, googleApiService) {
  "use strict";

  function downloadDriveUrl(url, callback, errorCallback) {
    console.log("Loading file from url " + url);
    var access_token = gapi.auth.getToken().access_token;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
      if (xmlHttp.readyState === 4) {
        callback(xmlHttp.responseText);
      }
    };
    xmlHttp.open("GET", url, true);
    xmlHttp.setRequestHeader('Authorization', 'Bearer ' + access_token);
    xmlHttp.send(null);
  }

  function loadFileFromDrive(fileId, callback, errorCallback) {
    var request = gapi.client.drive.files.get({fileId: fileId});
    request.execute(function (file) {
      downloadDriveUrl(file.downloadUrl, callback, errorCallback);
    });
  }

  return {
    loadFile: function (fileId, callback, errorCallback) {
      googleApiService.loadGoogleApisAndCall(['auth', 'drive'],
          function () {
            loadFileFromDrive(fileId, callback, errorCallback);
          }
      );
    }
  }
});
