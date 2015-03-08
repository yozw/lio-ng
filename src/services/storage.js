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
    var lines = data.split("\n");
    var help = [];
    var model = [];
    var helpPassed = false;
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      if (!helpPassed && line.substring(0, 2) === "##") {
        help.push(line.substring(2));
      } else if (model.length > 0 || line.trim().length !== 0) {
        model.push(line);
        helpPassed = true;
      }
    }
    return {help: help.join("\n"), code: model.join("\n")};
  }

  function combineModel (model) {
    var output = [];
    var i;
    if (model.help.trim().length > 0) {
      var helpLines = model.help.split("\n");
      for (i = 0; i < helpLines.length; i++) {
        output.push("##" + helpLines[i]);
      }
      output.push("");
    }

    var codeLines = model.code.split("\n");
    var seenNonEmptyLine = false;
    for (i = 0; i < codeLines.length; i++) {
      var line = codeLines[i];
      if (seenNonEmptyLine || line.trim().length > 0) {
        output.push(line);
        seenNonEmptyLine = true;
      }
    }
    return output.join("\n");
  }

  return {
    splitUrl: splitUrl,
    splitModel: splitModel,
    combineModel: combineModel
  }
});

// TODO: Write unit tests
app.service('storageService',
    function ($rootScope, $http, $location, messageService, googleDriveService, storageUtil) {
  "use strict";
  var cache = {};
  var onModelLoaded = [];
  var onModelSaved = [];

  $rootScope.$on('$locationChangeSuccess', function (next, current) {
    console.log("LocationChangeSuccess event");
    var url = $location.search().model;
    if (url === undefined || url === "") {
      url = "builtin:default.mod";
    }
    readModel(url);
  });

  function saveModelWithKey(model, key) {
    var data = Object();
    data.code = storageUtil.combineModel(model);
    cache['ms:' + key] = model.code;

    $http
        .post('/storage/write/' + key, data)
        .then(function(response) {
          if (response.data.error) {
            messageService.set("Could not save model: " + response.data.error);
          } else if (response.data) {
            console.log("Save model with key " + key + " to model storage");
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
    console.log("Loading built-in model: " + url);
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
    console.log("Loading remote model: " + url);
    var data = Object();
    data.url = url;

    $http
        .post('/load', data)
        .then(function(response) {
          console.log(response);
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
    console.log("Loading model with key " + key + " from model storage");
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
    console.log("Loading model from Google Drive: " + fileId);
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

