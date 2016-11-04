// TODO: Write unit tests
app.service('storageService',
    function ($q, $log, $rootScope, $http, $location, messageService,
              googleDriveService, serializationService) {
  "use strict";
  var cache = {};
  var onModelLoaded = [];
  var onModelSaved = [];

  $rootScope.$on('$locationChangeSuccess', function (next, current) {
    readModel(getCurrentModelUrl());
  });

  function parseModelUrl(modelUrl) {
    var index = modelUrl.indexOf(":");
    if (index < 0) {
      return {scheme: "", location: modelUrl};
    } else {
      return {scheme: modelUrl.substring(0, index),
              location: modelUrl.substring(index + 1)};
    }
  }

  // Returns the current location as specified by the browser url.
  function getCurrentModelUrl() {
    var url = $location.search().model;
    if (!url || url === "") {
      url = "builtin:default.mod";
    }
    return url;
  }

  function augmentWithParentInfo(info) {
    if (!info || !info.parents || !info.parents[0]) {
      return $q.when(info);
    }

    if (info.parents[0].isRoot) {
      info.parents[0].title = 'My Drive';
      return $q.when(info);
    }

    return googleDriveService.getFileInfo(info.parents[0].id)
        .then(function(parentInfo) {
          info.parents[0].title = parentInfo.title;
          return info;
        })
  }

  function getModelInfo(modelUrl) {
    var parsedUrl = parseModelUrl(modelUrl);
    var defer = $q.defer();
    if (parsedUrl.scheme === "builtin"
        || parsedUrl.scheme === "http"
        || parsedUrl.scheme === "https") {
      parsedUrl.name = parsedUrl.location.split('/').pop();
      defer.resolve(parsedUrl);
    } else if (parsedUrl.scheme === "gdrive") {
      parsedUrl.fileId = parsedUrl.location;
      googleDriveService.getFileInfo(parsedUrl.location)
          .then(augmentWithParentInfo)
          .then(function(info) {
            parsedUrl.name = info.title;
            parsedUrl.info = info;
            defer.resolve(parsedUrl);
          })
    } else if (parsedUrl.scheme === "ms") {
      defer.resolve(parsedUrl);
    } else {
      defer.reject("Could not load specified model: the URL was not recognized.");
    }
    return defer.promise;
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
    var parsedUrl = parseModelUrl(getCurrentModelUrl());
    if (parsedUrl.scheme === "ms") {
      saveModelWithKey(model, parsedUrl.location);
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

    var parsedUrl = parseModelUrl(url);
    var promise;
    if (parsedUrl.scheme === "builtin") {
      msgId = messageService.set("Loading example model ...");
      promise = loadBuiltinModel(parsedUrl.location);
    } else if (parsedUrl.scheme === "gdrive") {
      msgId = messageService.set("Loading model from Google Drive ...");
      promise = loadGoogleDriveModel(parsedUrl.location);
    } else if (parsedUrl.scheme === "http" || parsedUrl.scheme === "https") {
      msgId = messageService.set("Loading model ...");
      promise = loadWebModel(url);
    } else if (parsedUrl.scheme === "ms") {
      msgId = messageService.set("Loading model ...");
      promise = loadModelStorageModel(parsedUrl.location);
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
    parseModelUrl: parseModelUrl,
    getCurrentModelUrl: getCurrentModelUrl,
    getModelInfo: getModelInfo
  }
});
