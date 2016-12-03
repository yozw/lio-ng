app.service('builtinStorageBackend', function ($q, $log, $http) {
  "use strict";

  function load(urlString) {
    var defer = $q.defer();
    var url = new StringUtil.URL(urlString);
    $log.info("Loading built-in model: " + url.path);
    $http.get("/models/" + url.path)
        .success(function (data, status) {
          if (data && status === 200) {
            defer.resolve(data);
          }
        })
        .error(function (response, status) {
          if (status == 404) {
            defer.reject("Model not found");
          } else {
            defer.reject("Could not load model (HTTP response " + status + ")");
          }
        });
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