app.service('storageService', function ($http, messageService) {
  "use strict";
  return {
    readModel: function (url, callback) {
      var msgId = messageService.set("Loading model");

      $http.get(url)
          .success(function (data, status) {
            if (data && status === 200) {
              messageService.dismiss(msgId);
              callback(data);
            }
          })
          .error(function() {
            messageService.set("Could not load model");
          });
    }
  }
});

