app.service('builtinStorageBackend',
    function ($q, $log, $http) {

      function load(location) {
        var defer = $q.defer();
        $log.info("Loading built-in model: " + location);
        $http.get("/models/" + location)
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

      function getModelInfo(location, dict) {
        if (dict === undefined) dict = {};
        dict.name = location.split('/').pop();
        return $q.when(dict);
      }

      return {
        load: load,
        getModelInfo: getModelInfo
      }
    });