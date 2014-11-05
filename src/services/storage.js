app.service('storageUtil', function () {
  function splitUrl (url) {
    var index = url.indexOf("://");
    if (index < 0) {
      return {scheme: "", location: url};
    } else {
      return {scheme: url.substring(0, index), location: url.substring(index + 3)};
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
    return {help: help.join("\n"), model: model.join("\n")};
  }

  return {
    splitUrl: splitUrl,
    splitModel: splitModel
  }
});

// TODO: Write unit tests
app.service('storageService',
    function ($rootScope, $http, $location, messageService, googleDriveService, storageUtil) {
  var onModelLoaded = [];

  $rootScope.$on('$locationChangeSuccess', function (next, current) {
    var url = $location.search().model;
    if (url === undefined || url === "") {
      url = "model://default.mod";
    }
    readModel(url);
  });


  function readModel(url) {
    var msgId = -1;

    function modelLoaded(data) {
      $location.search('model', url);
      messageService.dismiss(msgId);
      var model = storageUtil.splitModel(data);
      for (var i = 0; i < onModelLoaded.length; i++) {
        onModelLoaded[i](model.model, model.help);
      }
    }

    function loadError(message) {
      messageService.set(message);
    }

    var splitUrl = storageUtil.splitUrl(url);
    if (splitUrl.scheme === "model") {
      msgId = messageService.set("Loading example model ...");
      loadBuiltinModel(splitUrl.location, modelLoaded, loadError);
    } else if (splitUrl.scheme === "gdrive") {
      msgId = messageService.set("Loading model from Google Drive ...");
      loadGoogleDriveModel(splitUrl.location, modelLoaded, loadError);
    } else if (splitUrl.scheme === "http" || splitUrl.scheme === "https") {
      msgId = messageService.set("Loading model ...");
      loadWebModel(url, modelLoaded, loadError);
    } else {
      loadError("Could not load specified model: the URL was not recognized.");
    }
  }

  function loadBuiltinModel(url, modelLoaded, loadError) {
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

  function loadGoogleDriveModel(fileId, modelLoaded, loadError) {
    googleDriveService.loadFile(fileId, modelLoaded, loadError);
  }

  "use strict";
  return {
    readModel: function (url) {
      readModel(url);
    },
    onModelLoaded: function (callback) {
      onModelLoaded.push(callback);
    }
  }
});

