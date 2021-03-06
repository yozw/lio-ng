// TODO: Write unit tests
app.service('modelStorageBackend', function ($q, $log, $http) {
  "use strict";

  function saveModelWithKey(code, key) {
    var defer = $q.defer();
    var data = Object();
    data.code = code;

    $http.post('/storage/write/' + key, data)
        .then(function (response) {
          if (response.data.error) {
            defer.reject(response.data.error);
          } else if (response.data) {
            $log.info("Saved model with key " + key + " to model storage");
            defer.resolve("ms:" + key);
          } else {
            defer.reject("Server did not return any data");
          }
        },
        function (response) {
          defer.reject(response);
        }
    );

    return defer.promise;
  }

  function load(urlString) {
    var url = new StringUtil.URL(urlString);
    var key = url.path;
    var defer = $q.defer();
    $log.info("Loading model with key " + key + " from model storage");
    $http.get('/storage/read/' + key)
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
          defer.reject(response);
        }
    );
    return defer.promise;
  }

  function getNewStorageKey() {
    var defer = $q.defer();

    // retrieve a new storage key
    $http.get('/storage/key?' + Math.random())
        .then(function (response) {
          if (response.data.error) {
            defer.reject(response.data.error);
          } else if (response.data) {
            var key = response.data;
            defer.resolve(key);
          } else {
            defer.reject("Server did not return any data");
          }
        },
        function (response) {
          defer.reject(response);
        }
    );
    return defer.promise;
  }

  function save(model, currentParsedUrl) {
    if (currentParsedUrl.protocol === "ms") {
      return saveModelWithKey(model, currentParsedUrl.path);
    } else {
      return getNewStorageKey().then(function (key) {
        return saveModelWithKey(model, key);
      })
    }
  }

  function getModelInfo(urlString, dict) {
    if (dict === undefined) dict = {};
    dict.name = 'untitled.mod';
    return $q.when(dict);
  }

  return {
    load: load,
    save: save,
    getModelInfo: getModelInfo
  }
});
