// TODO: Write unit tests
app.service('storageService', function ($q, $log, $rootScope, $location, messageService, serializationService,
                                        builtinStorageBackend, gdriveStorageBackend, modelStorageBackend,
                                        webStorageBackend) {
  "use strict";
  var backends = {
    builtin: builtinStorageBackend,
    gdrive: gdriveStorageBackend,
    ms: modelStorageBackend,
    http: webStorageBackend,
    https: webStorageBackend
  };

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
      return {
        scheme: modelUrl.substring(0, index),
        location: modelUrl.substring(index + 1)
      };
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

  function getBackendForScheme(scheme) {
    var backend = backends[scheme];
    if (backend === undefined) {
      throw new Error("Could not load specified model: the URL was not recognized.");
    }
    return backend;
  }

  function getModelInfo(modelUrl) {
    var parsedUrl = parseModelUrl(modelUrl);
    var backend = getBackendForScheme(parsedUrl.scheme);
    return backend.getModelInfo(parsedUrl.location, parsedUrl);
  }

  function readModel(modelUrl) {
    var msgId = -1;

    function modelLoaded(data) {
      cache[modelUrl] = data;
      $location.search('model', modelUrl);
      messageService.dismiss(msgId);
      var model = serializationService.deserializeModel(data);
      for (var i = 0; i < onModelLoaded.length; i++) {
        onModelLoaded[i](model);
      }
    }

    function loadError(message) {
      messageService.set(message);
    }

    if (cache.hasOwnProperty(modelUrl)) {
      modelLoaded(cache[modelUrl]);
      return;
    }

    var parsedUrl = parseModelUrl(modelUrl);
    var backend = getBackendForScheme(parsedUrl.scheme);
    msgId = messageService.set("Loading model ...");
    backend.load(parsedUrl.location).then(modelLoaded).catch(loadError);
  }

  function save(model, saveFn) {
    var serializedModel = serializationService.serializeModel(model);

    return saveFn(serializedModel)
        .then(function (modelUrl) {
          cache[modelUrl] = serializedModel;
          $location.search('model', modelUrl);
          for (var i = 0; i < onModelSaved.length; i++) {
            onModelSaved[i](model);
          }
          return $q.when(modelUrl);
        });
  }

  /**
   * Returns a function that saves the given model to model storage.
   * @returns {Function}
   */
  function getModelStorageSaver() {
    return function (serializedModel) {
      return modelStorageBackend.save(serializedModel, parseModelUrl(getCurrentModelUrl()));
    }
  }

  /**
   * Returns a function that saves the given model to Google Drive.
   * @param {string} title Name of the model.
   * @param {string} parent Parent directory.
   * @returns {Function}
   */
  function getGoogleDriveSaver(title, parent) {
    return function (serializedModel) {
      return gdriveStorageBackend.save(serializedModel, title, parent);
    }
  }

  /**
   * Returns a function that updates the given model on Google Drive.
   * @param {string} fileId id of model.
   * @returns {Function}
   */
  function getGoogleDriveUpdater(fileId) {
    return function (serializedModel) {
      return gdriveStorageBackend.update(serializedModel, fileId);
    }
  }

  /**
   * Returns a function that saves the given model to Google Drive if the current model is
   * already on Google Drive and that saves to model storage otherwise.
   */
  function getDefaultSaver() {
    const url = parseModelUrl(getCurrentModelUrl());
    if (url.scheme === 'gdrive') {
      return getGoogleDriveUpdater(url.location);
    } else {
      return getModelStorageSaver();
    }
  }

  return {
    readModel: function (url) {
      readModel(url);
    },
    save: function (model) {
      return save(model, getDefaultSaver());
    },
    saveModelToModelStorage: function (model) {
      return save(model, getModelStorageSaver());
    },
    saveModelToGoogleDrive: function (title, model, parent) {
      return save(model, getGoogleDriveSaver(title, parent));
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
