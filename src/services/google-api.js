// TODO: Write unit tests
app.service('googleApiService', function ($compile, messageService, retryService) {
  "use strict";

  var clientId = '114623879330-hq1gs8ficrvt0n3ipp5s8q7u4svertt3.apps.googleusercontent.com';
  var scope = ['https://www.googleapis.com/auth/drive.readonly'];
  var developerKey = 'AIzaSyDci_n2EbZgchidWxuzkZPF9RIAzUgvw9k';

  var oauthToken;
  var apiLoaders = {};
  var apiLoaded = {};

  // Google Auth API
  apiLoaders['auth'] = function(callback) {
    if (oauthToken) {
      callback();
    }

    function onAuthResult(authResult) {
      if (authResult && !authResult.error) {
        oauthToken = authResult.access_token;
        callback();
      } else {
        messageService.set("Google Drive authentication failed");
      }
    }

    window.gapi.load('auth', {'callback': function() {
      window.gapi.auth.authorize({
        'client_id': clientId,
        'scope': scope,
        'immediate': false
      }, onAuthResult);
    }});
  };

  // Google Picker API
  apiLoaders['picker'] = function(callback) {
    window.gapi.load('picker', {'callback': callback});
  };

  // Google Drive API
  apiLoaders['drive'] = function(callback) {
    window.gapi.client.load('drive', 'v2', callback);
  };

  function waitForApiLoaded(apis, callback) {
    function loadApi(api) {
      if (!apiLoaded[api]) {
        apiLoaders[api](function() {
          console.log("Google " + api + " API loaded.");
          apiLoaded[api] = true;
        });
      }
    }

    function areApisLoaded() {
      for (var i = 0; i < apis.length; i++) {
        if (!apiLoaded[apis[i]]) {
          return false;
        }
      }
      return true;
    }

    for (var i = 0; i < apis.length; i++) {
      loadApi(apis[i]);
    }

    retryService.retry()
        .timeout(100)
        .maxAttempts(100)
        .successCheck(areApisLoaded)
        .onSuccess(callback)
        .run();
  }
  return {
    loadGoogleApisAndCall: function(apis, callback) {
      if (angular.isString(apis)) {
        apis = [apis];
      }
      waitForApiLoaded(apis, callback)
    },
    getOauthToken: function() {
      return oauthToken;
    },
    getDeveloperKey: function() {
      return developerKey;
    }
  }
});
