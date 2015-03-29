app.service('storageUtil', function () {
  "use strict";

  function splitUrl (url) {
    var index = url.indexOf(":");
    if (index < 0) {
      return {scheme: "", location: url};
    } else {
      return {scheme: url.substring(0, index), location: url.substring(index + 1)};
    }
  }

  function splitModel (data) {
    // This regex matches a javadoc-style comment of the form "/** <comment> */"
    // and any whitespace surrounding it.
    var regex = /^\s*((?:\/\*\*(?:[^*]|(?:\*+[^*\/]))*\*+\/)|(?:\/\/.*))\s*/;

    var match = data.match(regex);
    if (match == null) {
      return {doc: "", code: data.trim() + "\n"};
    } else {
      // determine the contents of the /** <contents> */
      var doc = match[1];  // the full comment, without trailing spaces
      var start = 1;
      var end = doc.length - 2;

      // note that these loops are guaranteed to end because of the
      // leading and trailing slashes
      while (doc[start] == '*') {
        start++;
      }
      while (doc[end] == '*') {
        end--;
      }

      if (start < end) {
        doc = doc.substring(start, end + 1);
      } else {
        doc = "";
      }

      var code = data.substring(match[0].length).trim() + "\n";

      return {doc: doc, code: code}
    }
  }

  function combineModel (model) {
    if (model.doc.trim().length == 0) {
      return model.code.trim() + "\n";
    } else {
      return "/**" + model.doc + "*/\n\n" + model.code.trim() + "\n";
    }
  }

  return {
    splitUrl: splitUrl,
    splitModel: splitModel,
    combineModel: combineModel
  }
});

// TODO: Write unit tests
app.service('storageService',
    function ($log, $rootScope, $http, $location, messageService, googleDriveService, storageUtil) {
  "use strict";
  var cache = {};
  var onModelLoaded = [];
  var onModelSaved = [];

  $rootScope.$on('$locationChangeSuccess', function (next, current) {
    var url = $location.search().model;
    if (url === undefined || url === "") {
      url = "builtin:default.mod";
    }
    readModel(url);
  });

  function saveModelWithKey(model, key) {
    var data = Object();
    data.code = storageUtil.combineModel(model);
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
    var splitUrl = storageUtil.splitUrl(url);
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
      var model = storageUtil.splitModel(data);
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

    var splitUrl = storageUtil.splitUrl(url);
    if (splitUrl.scheme === "builtin") {
      msgId = messageService.set("Loading example model ...");
      loadBuiltinModel(splitUrl.location, modelLoaded, loadError);
    } else if (splitUrl.scheme === "gdrive") {
      msgId = messageService.set("Loading model from Google Drive ...");
      loadGoogleDriveModel(splitUrl.location, modelLoaded, loadError);
    } else if (splitUrl.scheme === "http" || splitUrl.scheme === "https") {
      msgId = messageService.set("Loading model ...");
      loadWebModel(url, modelLoaded, loadError);
    } else if (splitUrl.scheme === "ms") {
      msgId = messageService.set("Loading model ...");
      loadModelStorageModel(splitUrl.location, modelLoaded, loadError);
    } else {
      loadError("Could not load specified model: the URL was not recognized.");
    }
  }

  function loadBuiltinModel(url, modelLoaded, loadError) {
    $log.info("Loading built-in model: " + url);
    $http.get("/models/" + url)
        .success(function (data, status) {
          if (data && status === 200) {
            modelLoaded(data);
          }
        })
        .error(function () {
          loadError("Could not load model");
        });
  }

  function loadWebModel(url, modelLoaded, loadError) {
    $log.info("Loading remote model: " + url);
    var data = Object();
    data.url = url;

    $http
        .post('/load', data)
        .then(function(response) {
          if (response.data.error) {
            loadError(response.data.error);
          } else if (response.data) {
            modelLoaded(response.data);
          } else {
            loadError("Server did not return any data");
          }
        },
        function(response) {
          loadError(response);
        }
    );
  }

  function loadModelStorageModel(key, modelLoaded, loadError) {
    $log.info("Loading model with key " + key + " from model storage");
    $http
        .get('/storage/read/' + key)
        .then(function(response) {
          if (response.data.error) {
            loadError(response.data.error);
          } else if (response.data) {
            modelLoaded(response.data);
          } else {
            loadError("Server did not return any data");
          }
        },
        function(response) {
          loadError(response);
        }
    );
  }

  function loadGoogleDriveModel(fileId, modelLoaded, loadError) {
    $log.info("Loading model from Google Drive: " + fileId);
    googleDriveService.loadFile(fileId, modelLoaded, loadError);
  }

  return {
    readModel: function (url) {
      readModel(url);
    },
    saveModelToModelStorage: function (contents) {
      saveModelToModelStorage(contents);
    },
    onModelLoaded: function (callback) {
      onModelLoaded.push(callback);
    },
    onModelSaved: function (callback) {
      onModelSaved.push(callback);
    }
  }
});

