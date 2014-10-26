// TODO: Write unit tests
app.service('driveService', function ($compile, messageService, storageService, retryService) {
  "use strict";

  var developerKey = 'AIzaSyDci_n2EbZgchidWxuzkZPF9RIAzUgvw9k';
  var clientId = '114623879330-hq1gs8ficrvt0n3ipp5s8q7u4svertt3.apps.googleusercontent.com';
  var scope = ['https://www.googleapis.com/auth/drive.readonly'];

  var authApiLoaded = false;
  var pickerApiLoaded = false;
  var driveApiLoaded = false;
  var oauthToken;

  function loadAuthApi() {
    if (authApiLoaded) {
      return;
    }
    window.gapi.load('auth', {'callback': function() {
      authApiLoaded = true;
      console.log("Google Auth API loaded");
    }});
  }

  function loadPickerApi() {
    if (pickerApiLoaded) {
      return;
    }
    window.gapi.load('picker', {'callback': function() {
      pickerApiLoaded = true;
      console.log("Google Picker API loaded");
    }});
  }

  function loadDriveApi() {
    if (driveApiLoaded) {
      return;
    }
    window.gapi.client.load('drive', 'v2', function() {
      driveApiLoaded = true;
      console.log("Google Drive API loaded");
    });
  }

  function waitForApiLoaded(callback) {
    function apiLoaded() {
      return authApiLoaded && pickerApiLoaded && driveApiLoaded;
    }
    if (!apiLoaded()) {
      console.log("Loading Google Auth, Picker and Drive APIs");
      loadAuthApi();
      loadPickerApi();
      loadDriveApi();
    }
    retryService.retry()
        .timeout(100)
        .successCheck(apiLoaded)
        .onSuccess(callback)
        .run();
  }

  function waitForAuthenticated(callback) {
    function onAuthResult(authResult) {
      if (authResult && !authResult.error) {
        oauthToken = authResult.access_token;
        callback();
      } else {
        messageService.set("Google Drive authentication failed");
      }
    }

    if (oauthToken) {
      callback();
    } else {
      console.log("Starting Google Authentication");
      window.gapi.auth.authorize({
        'client_id': clientId,
        'scope': scope,
        'immediate': false
      }, onAuthResult);
    }
  }

  function readGoogleDriveFile(url, callback) {
    var access_token = gapi.auth.getToken().access_token;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
      if (xmlHttp.readyState == 4) {
        callback(xmlHttp.responseText);
      }
    };
    xmlHttp.open("GET", url, true);
    xmlHttp.setRequestHeader('Authorization', 'Bearer ' + access_token);
    xmlHttp.send(null);
  }


  function openPickerWindow(modelLoadedCallback) {
    function pickerCallback(data) {
      if (data[google.picker.Response.ACTION] != google.picker.Action.PICKED) {
        return false;
      }
      var doc = data[google.picker.Response.DOCUMENTS][0];
      var id = doc[google.picker.Document.ID];
      var request = gapi.client.drive.files.get({fileId: id});
      messageService.set("Loading model file ...");
      request.execute(function(file) {
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
        .setOAuthToken(oauthToken)
        .setDeveloperKey(developerKey)
        .setCallback(pickerCallback)
        .setTitle("Select a model file")
        .build();
    picker.setVisible(true);
  }

  return {
    loadWithPicker: function (modelLoadedCallback) {
      waitForApiLoaded(function() {
        waitForAuthenticated(function() {
          openPickerWindow(modelLoadedCallback);
        });
      });
    }
  }
});
