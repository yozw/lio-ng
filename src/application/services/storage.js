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
  var currentModelUrl;
  var status = {
    lastSaveTime: null
  };

  $rootScope.$on('$locationChangeSuccess', function (next, current) {
    var urlString = getModelUrlFromLocation();
    if (urlString !== currentModelUrl) {
      readModel(urlString);
    }
  });

  // Returns the current location as specified by the browser url.
  function getModelUrlFromLocation() {
    var url = $location.search().model;
    if (!url || url === "") {
      url = "builtin:default.mod";
    }
    return url;
  }

  function getBackendForProtocol(protocol) {
    var backend = backends[protocol];
    if (backend === undefined) {
      throw new Error("Could not load specified model: the URL was not recognized.");
    }
    return backend;
  }

  function getModelInfo(urlString) {
    var url = new StringUtil.URL(urlString);
    var backend = getBackendForProtocol(url.protocol);
    return backend.getModelInfo(urlString);
  }

  function clearSaveTime() {
    status.lastSaveTime = null;
    if (!$rootScope.$$phase) {
      $rootScope.$apply();
    }
  }

  function updateSaveTime() {
    status.lastSaveTime = new Date().getTime();
    if (!$rootScope.$$phase) {
      $rootScope.$apply();
    }
  }

  function readModel(urlString) {
    var msgId;

    function modelLoaded(data) {
      cache[urlString] = data;
      currentModelUrl = urlString;
      clearSaveTime();
      $location.search('model', urlString);
      messageService.dismiss(msgId);
      var model = serializationService.deserializeModel(data);
      for (var i = 0; i < onModelLoaded.length; i++) {
        onModelLoaded[i](model);
      }
    }

    function loadError(message) {
      messageService.set(message);
    }

    if (cache.hasOwnProperty(urlString)) {
      modelLoaded(cache[urlString]);
      return;
    }

    var parsedUrl = new StringUtil.URL(urlString);
    var backend = getBackendForProtocol(parsedUrl.protocol);
    msgId = messageService.set("Loading model ...");
    backend.load(urlString).then(modelLoaded).catch(loadError);
  }

  function save(model, saveFn) {
    var serializedModel = serializationService.serializeModel(model);

    return saveFn(serializedModel)
        .then(function (urlString) {
          cache[urlString] = serializedModel;
          currentModelUrl = urlString;
          updateSaveTime();
          $location.search('model', urlString);
          for (var i = 0; i < onModelSaved.length; i++) {
            onModelSaved[i](model);
          }
          return $q.when(urlString);
        });
  }

  /**
   * Returns a function that saves the given model to model storage.
   * @returns {Function}
   */
  function getModelStorageSaver() {
    return function (serializedModel) {
      return modelStorageBackend.save(serializedModel, new StringUtil.URL(currentModelUrl));
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
    var url = new StringUtil.URL(currentModelUrl);
    if (url.protocol === 'gdrive') {
      return getGoogleDriveUpdater(url.path);
    } else {
      return getModelStorageSaver();
    }
  }

  return {
    readModel: function (urlString) {
      readModel(urlString);
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
    getCurrentModelUrl: function() { return currentModelUrl; },
    getModelInfo: getModelInfo,
    status: status
  }
});
