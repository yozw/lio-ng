app.service('googleApiService', function ($q, $log, messageService, retryService) {
  "use strict";

  var clientId = '114623879330-hq1gs8ficrvt0n3ipp5s8q7u4svertt3.apps.googleusercontent.com';
  var scope = ['https://www.googleapis.com/auth/drive'];
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

  // Returns a promise that, once resolved, window.gapi and window.gapi.client are ready.
  function loadBaseGapi() {
    function isGapiLoaded() {
      return window.gapi.load && window.gapi.client.load;
    }

    var defer = $q.defer();
    retryService.retry()
        .timeout(100)
        .maxAttempts(100)
        .successCheck(isGapiLoaded)
        .onSuccess(defer.resolve)
        .onFail(defer.reject)
        .run();
    return defer.promise;
  }

  // Returns a promise that, once resolved, the given APIs are loaded.
  function loadGoogleApis(apis) {
    function loadApi(api) {
      var defer = $q.defer();
      if (!apiLoaded[api]) {
        console.log("Loading Google " + api + " API.");
        apiLoaders[api](function() {
          $log.info("Google " + api + " API loaded.");
          apiLoaded[api] = true;
          defer.resolve();
        });
      } else {
        defer.resolve();
      }
      return defer.promise;
    }

    var promises = [];
    for (var i = 0; i < apis.length; i++) {
      promises.push(loadApi(apis[i]));
    }
    return $q.all(promises);
  }

  return {
    loadGoogleApis: function(apis) {
      if (angular.isString(apis)) {
        apis = [apis];
      }
      return loadBaseGapi().then(function() { return loadGoogleApis(apis); });
    },
    getOauthToken: function() {
      if (!oauthToken) {
        throw new Error("Requested OAuth token; authorization has not finished yet.");
      }
      return oauthToken;
    },
    getDeveloperKey: function() {
      return developerKey;
    }
  }
});
