app.service('webStorageBackend',
    function ($q, $log, $http) {

      function load(location) {
        var defer = $q.defer();
        $log.info("Loading remote model: " + location);
        var data = Object();
        data.url = location;

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