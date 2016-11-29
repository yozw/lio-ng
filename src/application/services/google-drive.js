// TODO: Write unit tests
app.service('googleDriveService', function ($q, $log, $compile, googleApiService) {
  "use strict";

  function getFileInfo(fileId) {
    var defer = $q.defer();
    var request = gapi.client.drive.files.get({fileId: fileId});
    request.then(function(response) {
      defer.resolve(response.result);
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

  function uploadFile(contents, metadata, fileId) {
    const boundary = '-------314159265358979323846';
    const delimiter = "\r\n--" + boundary + "\r\n";
    const close_delim = "\r\n--" + boundary + "--";

    metadata.mimeType = metadata.mimeType || 'text/plain';

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
      path: '/upload/drive/v2/files' + (fileId ? ('/' + fileId) : ''),
      method: fileId ? 'PUT' : 'POST',
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
    }, function(response) {
      defer.reject(response.body);
    });
    return defer.promise;
  }

  function insertFile(contents, title, parent) {
    var metadata = {
      title: title
    };
    if (parent && !parent.isRoot) {
      metadata.parents = [parent];
    }
    return uploadFile(contents, metadata, null);
  }

  function updateFile(contents, fileId) {
    return uploadFile(contents, {}, fileId);
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
    insertFile: function (contents, title, parent) {
      return wrapApiCalls(insertFile, contents, title, parent);
    },
    updateFile: function (contents, fileId) {
      return wrapApiCalls(updateFile, contents, fileId);
    },
    getFileInfo: function (fileId) {
      return wrapApiCalls(getFileInfo, fileId);
    }
  }
});
