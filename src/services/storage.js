app.service('storageService', function ($http, messageService) {
  return {
    readModel: function (url, callback) {
      var msgId = messageService.set("Loading model");

      $http.get(url)
          .success(function (data, status, headers, config) {
            if (data && status === 200) {
              messageService.dismiss(msgId);
              callback(data);
            }
          });
    }
  }
});

