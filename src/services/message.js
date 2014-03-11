/**
 * Butter bar code
 */
app.service('messageService', function ($rootScope, statusMessage) {
  "use strict"
  var idCounter = 0;
  console.log(statusMessage.message);

  function setMessage(message) {
    idCounter++;
    statusMessage.message = message;
    if (!$rootScope.$$phase) {
      $rootScope.$apply();
    }
    return idCounter;
  }

  return {
    get: function () {
      return statusMessage.message;
    },
    set: function (message) {
      return setMessage(message);
    },
    clear: function () {
      setMessage("");
    },
    dismiss: function (msgid) {
      if (idCounter == msgid) {
        setMessage("");
      }
    }
  };
})

app.factory('statusMessage', function () {
  return {message: ""};
});


