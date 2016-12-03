app.service('webStorageBackend', function ($q, $log, $http) {
  "use strict";

  function load(urlString) {
    var defer = $q.defer();
    $log.info("Loading remote model: " + urlString);
    var data = Object();
    data.url = urlString;

    $http
        .post('/load', data)
        .then(function (response) {
          if (response.data.error) {
            defer.reject(response.data.error);
          } else if (response.data) {
            defer.resolve(response.data);
          } else {
            defer.reject("Server did not return any data");
          }
        },
        function (response) {
          if (response.status == 404) {
            defer.reject("Model not found");
          } else {
            defer.reject("Could not load model (HTTP response " + response.status + ")");
          }
        }
    );
    return defer.promise;
  }

  function getModelInfo(urlString, dict) {
    if (dict === undefined) dict = {};
    dict.name = urlString.split('/').pop();
    return $q.when(dict);
  }

  return {
    load: load,
    getModelInfo: getModelInfo
  }
});