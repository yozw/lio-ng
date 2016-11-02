// TODO: Write unit tests
app.service('googleDriveService', function ($q, $log, $compile, googleApiService) {
  "use strict";

  function getFileInfo(fileId) {
    var defer = $q.defer();
    var request = gapi.client.drive.files.get({fileId: fileId});
    request.then(function(file) {
      defer.resolve(file);
    }, function(reason) {
      defer.reject(reason);
    });
    return defer.promise;
  }

  function downloadFile(file) {
    var url = file.downloadUrl;
    var defer = $q.defer();
    $log.info("Loading file from url " + url);
    var access_token = gapi.auth.getToken().access_token;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
      if (xmlHttp.readyState === 4) {
        defer.resolve(xmlHttp.responseText);
      }
    };
    xmlHttp.open("GET", url, true);
    xmlHttp.setRequestHeader('Authorization', 'Bearer ' + access_token);
    xmlHttp.send(null);
    return defer.promise;
  }

  function loadFile(fileId) {
    return getFileInfo(fileId).then(downloadFile);
  }

  function insertFile(title, contents, parent) {
    const boundary = '-------314159265358979323846';
    const delimiter = "\r\n--" + boundary + "\r\n";
    const close_delim = "\r\n--" + boundary + "--";

    var metadata = {
      title: title,
      mimeType: 'text/plain'
    };

    if ((parent !== undefined) && (!parent.isRoot)) {
      metadata.parents = [parent];
    }
    console.log(metadata);

    var base64Data = btoa(contents);
    var requestBody =
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: ' + metadata.mimeType + '\r\n' +
        'Content-Transfer-Encoding: base64\r\n' +
        '\r\n' +
        base64Data +
        close_delim;

    var request = gapi.client.request({
      path: '/upload/drive/v2/files',
      method: 'POST',
      params: {
        uploadType: 'multipart'
      },
      headers: {
        'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
      },
      body: requestBody
    });
    var defer = $q.defer();
    request.then(function(response) {
      var fileId = response.result.id;
      defer.resolve(fileId);
    }, function(reason) {
      defer.reject(reason);
    });
    return defer.promise;
  }

  function wrapApiCalls() {
    var fn = arguments[0];
    var args = Array.prototype.splice.call(arguments, 1);
    return googleApiService.loadGoogleApis(['auth', 'drive']).then(
        function () { return fn.apply(null, args) });
  }

  return {
    loadFile: function (fileId) {
      return wrapApiCalls(loadFile, fileId);
    },
    insertFile: function (title, contents, parent) {
      return wrapApiCalls(insertFile, title, contents, parent);
    },
    getFileInfo: function (fileId) {
      return wrapApiCalls(getFileInfo, fileId);
    }
  }
});
