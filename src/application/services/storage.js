// TODO: Write unit tests
app.service('storageService',
    function ($q, $log, $rootScope, $location, messageService, serializationService,
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

        saveFn(serializedModel)
            .then(function (modelUrl) {
              cache[modelUrl] = serializedModel;
              $location.search('model', modelUrl);
              for (var i = 0; i < onModelSaved.length; i++) {
                onModelSaved[i](model);
              }
            })
            .catch(function (message) {
              messageService.set("Could not save model: " + message);
            })
      }

      function getModelStorageSaver() {
        return function (serializedModel) {
          return modelStorageBackend.save(serializedModel, parseModelUrl(getCurrentModelUrl()));
        }
      }

      function getGoogleDriveSaver(title, parent) {
        return function (serializedModel) {
          return gdriveStorageBackend.save(serializedModel, title, parent);
        }
      }

      return {
        readModel: function (url) {
          readModel(url);
        },
        saveModelToModelStorage: function (model) {
          save(model, getModelStorageSaver());
        },
        saveModelToGoogleDrive: function (title, model, parent) {
          save(model, getGoogleDriveSaver(title, parent));
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
