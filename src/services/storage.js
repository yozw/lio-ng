// TODO: Write unit tests
app.service('storageService', function ($rootScope, $http, $location, messageService, googleDriveService) {
  var onModelLoaded = function(code, help) {};

  $rootScope.$on('$locationChangeSuccess', function(next, current) {
    var url = $location.search().model;
    if (url === undefined || url === "") {
      url = "model://default.mod";
    }
    readModel(url);
  });

  function getScheme(url) {
    var index = url.indexOf("://");
    if (index < 0) {
      return "";
    } else {
      return url.substring(0, index);
    }
  }

  function splitModel(data) {
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

  function readModel(url) {
    var msgId = messageService.set("Loading model");

    function modelLoaded(data) {
      $location.search('model', url);
      messageService.dismiss(msgId);
      var model = splitModel(data);
      onModelLoaded(model.model, model.help);
    }

    function loadError(message) {
      messageService.set(message);
    }

    var scheme = getScheme(url);
    var name = url.substring(scheme.length + 3);
    if (scheme == "model") {
      loadBuiltinModel(name, modelLoaded, loadError);
    } else if (scheme == "gdrive") {
      loadGoogleDriveModel(name, modelLoaded, loadError);
    } else {
      loadError("Unrecognized URL");
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

  function loadGoogleDriveModel(fileId, modelLoaded, loadError) {
    googleDriveService.loadFile(fileId, modelLoaded, loadError);
  }

  "use strict";
  return {
    readModel: function (url) {
      readModel(url);
    },
    onModelLoaded: function (callback) {
      onModelLoaded = callback;
    }
  }
});

