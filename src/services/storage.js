// TODO: Write unit tests
app.service('storageService', function ($http, messageService) {
  "use strict";
  return {
    splitModel: function (data) {
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
    },
    readModel: function (url, callback) {
      var msgId = messageService.set("Loading model");
      var self = this;

      $http.get(url)
          .success(function (data, status) {
            if (data && status === 200) {
              messageService.dismiss(msgId);
              var splitModel = self.splitModel(data);
              callback(splitModel.model, splitModel.help);
            }
          })
          .error(function () {
            messageService.set("Could not load model");
          });
    }
  }
});

