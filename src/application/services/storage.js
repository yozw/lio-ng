// TODO: Write unit tests
app.service('storageService',
    function ($q, $log, $rootScope, $http, $location, messageService,
              googleDriveService, serializationService) {
  "use strict";
  var cache = {};
  var onModelLoaded = [];
  var onModelSaved = [];

  $rootScope.$on('$locationChangeSuccess', function (next, current) {
    var url = $location.search().model;
    if (!url || url === "") {
      url = "builtin:default.mod";
    }
    readModel(url);
  });

  function getSchemeAndLocation(url) {
    var index = url.indexOf(":");
    if (index < 0) {
      return {scheme: "", location: url};
    } else {
      return {scheme: url.substring(0, index), location: url.substring(index + 1)};
    }
  }

  function saveModelWithKey(model, key) {
    var data = Object();
    data.code = serializationService.serializeModel(model);
    cache['ms:' + key] = data.code;

    $http
        .post('/storage/write/' + key, data)
        .then(function(response) {
          if (response.data.error) {
            messageService.set("Could not save model: " + response.data.error);
          } else if (response.data) {
            $log.info("Save model with key " + key + " to model storage");
            for (var i = 0; i < onModelSaved.length; i++) {
              onModelSaved[i](model);
            }
          } else {
            messageService.set("Server did not return any data");
          }
        },
        function(response) {
          messageService.set("Could not save model: " + response);
        }
    );
  }

  function saveModelToModelStorage(model) {
    var url = $location.search().model;
    var splitUrl = getSchemeAndLocation(url);
    if (splitUrl.scheme === "ms") {
      saveModelWithKey(model, splitUrl.location);
    } else {
      // retrieve a new storage key
      $http
          .get('/storage/key?' + Math.random())
          .then(function(response) {
            if (response.data.error) {
              messageService.set(response.data.error);
            } else if (response.data) {
              var key = response.data;
              $location.search('model', 'ms:' + key);
              saveModelWithKey(model, key);
            } else {
              messageService.set("Server did not return any data");
            }
          },
          function(response) {
            messageService.set(response);
          }
      );
    }
  }

  function readModel(url) {
    var msgId = -1;

    function modelLoaded(data) {
      cache[url] = data;
      $location.search('model', url);
      messageService.dismiss(msgId);
      var model = serializationService.deserializeModel(data);
      for (var i = 0; i < onModelLoaded.length; i++) {
        onModelLoaded[i](model);
      }
    }

    function loadError(message) {
      messageService.set(message);
    }

    if (cache.hasOwnProperty(url)) {
      modelLoaded(cache[url]);
      return;
    }

    var splitUrl = getSchemeAndLocation(url);
    var promise;
    if (splitUrl.scheme === "builtin") {
      msgId = messageService.set("Loading example model ...");
      promise = loadBuiltinModel(splitUrl.location);
    } else if (splitUrl.scheme === "gdrive") {
      msgId = messageService.set("Loading model from Google Drive ...");
      promise = loadGoogleDriveModel(splitUrl.location);
    } else if (splitUrl.scheme === "http" || splitUrl.scheme === "https") {
      msgId = messageService.set("Loading model ...");
      promise = loadWebModel(url);
    } else if (splitUrl.scheme === "ms") {
      msgId = messageService.set("Loading model ...");
      promise = loadModelStorageModel(splitUrl.location);
    } else {
      loadError("Could not load specified model: the URL was not recognized.");
    }

    promise.then(modelLoaded).catch(loadError);
  }

  function loadBuiltinModel(url) {
    var defer = $q.defer();
    $log.info("Loading built-in model: " + url);
    $http.get("/models/" + url)
        .success(function (data, status) {
          if (data && status === 200) {
            defer.resolve(data);
          }
        })
        .error(function () {
          defer.reject("Could not load model");
        });
    return defer.promise;
  }

  function loadWebModel(url) {
    var defer = $q.defer();
    $log.info("Loading remote model: " + url);
    var data = Object();
    data.url = url;

    $http
        .post('/load', data)
        .then(function(response) {
          if (response.data.error) {
            defer.reject(response.data.error);
          } else if (response.data) {
            defer.resolve(response.data);
          } else {
            defer.reject("Server did not return any data");
          }
        },
        function(response) {
          defer.reject(response);
        }
    );
    return defer.promise;
  }

  function loadModelStorageModel(key) {
    var defer = $q.defer();
    $log.info("Loading model with key " + key + " from model storage");
    $http
        .get('/storage/read/' + key)
        .then(function(response) {
          if (response.data.error) {
            defer.reject(response.data.error);
          } else if (response.data) {
            defer.resolve(response.data);
          } else {
            defer.reject("Server did not return any data");
          }
        },
        function(response) {
          defer.reject(response);
        }
    );
    return defer.promise;
  }

  function loadGoogleDriveModel(fileId) {
    $log.info("Loading model from Google Drive: " + fileId);
    return googleDriveService.loadFile(fileId);
  }

  function saveModelToGoogleDrive(title, model, parent) {
    var code = serializationService.serializeModel(model);
    return googleDriveService.insertFile(title, code, parent)
        .then(function (fileId) {
          $location.search('model', 'gdrive:' + fileId);
        })
  }

  return {
    readModel: function (url) {
      readModel(url);
    },
    saveModelToModelStorage: function (model) {
      saveModelToModelStorage(model);
    },
    saveModelToGoogleDrive: function (title, model, parent) {
      return saveModelToGoogleDrive(title, model, parent);
    },
    onModelLoaded: function (callback) {
      onModelLoaded.push(callback);
    },
    onModelSaved: function (callback) {
      onModelSaved.push(callback);
    },
    getSchemeAndLocation: getSchemeAndLocation
  }
});
